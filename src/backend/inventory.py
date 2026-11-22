from datetime import datetime, timezone

from .database import connect

MAX_QUANTITY = 9_007_199_254_740_991


class InventoryError(Exception):
    def __init__(self, message, status=400):
        super().__init__(message)
        self.status = status


def read_text(data, key, label, limit, *, required=True):
    value = data.get(key, "")
    if not isinstance(value, str):
        raise InventoryError(f"Informe o campo {label} como texto.")
    value = value.strip()
    if required and not value:
        raise InventoryError(f"Preencha o campo {label}.")
    if len(value) > limit:
        raise InventoryError(f"O campo {label} deve ter até {limit} caracteres.")
    return value


def read_quantity(data, minimum):
    quantity = data.get("quantity")
    if type(quantity) is not int or not minimum <= quantity <= MAX_QUANTITY:
        raise InventoryError(f"Informe uma quantidade inteira entre {minimum} e {MAX_QUANTITY}.")
    return quantity


def read_minimum(data):
    """Estoque mínimo opcional: ausente, nulo ou vazio significa limite não configurado."""
    minimum = data.get("minimum")
    if minimum is None or minimum == "":
        return None
    if type(minimum) is not int or not 0 <= minimum <= MAX_QUANTITY:
        raise InventoryError(f"Informe um estoque mínimo inteiro entre 0 e {MAX_QUANTITY}.")
    return minimum


class InventoryRepository:
    def __init__(self, database):
        self.database = database

    def snapshot(self):
        with connect(self.database) as db, db:
            db.execute("BEGIN")
            products = db.execute("SELECT code, name, category, quantity, minimum FROM products ORDER BY rowid")
            movements = db.execute("""
                SELECT m.id, m.product_code AS productCode, p.name AS productName,
                       m.type, m.quantity, m.created_at AS createdAt
                  FROM movements AS m JOIN products AS p ON p.code = m.product_code
                 ORDER BY m.id DESC
            """)
            return {
                "products": [dict(row) for row in products],
                "movements": [dict(row) for row in movements],
            }

    def register_product(self, data):
        code = read_text(data, "code", "Código", 60).upper()
        name = read_text(data, "name", "Nome", 160)
        category = read_text(data, "category", "Categoria", 120, required=False)
        quantity = read_quantity(data, 0)
        minimum = read_minimum(data)
        if len(code) > 60:
            raise InventoryError("O código deve ter até 60 caracteres.")
        with connect(self.database) as db, db:
            db.execute("BEGIN IMMEDIATE")
            result = db.execute(
                "INSERT INTO products(code, name, category, quantity, minimum) VALUES (?, ?, ?, ?, ?)"
                " ON CONFLICT(code) DO NOTHING",
                (code, name, category, quantity, minimum),
            )
            if result.rowcount == 0:
                raise InventoryError("Já existe um produto cadastrado com esse código.", 409)
        return {"code": code, "name": name, "category": category, "quantity": quantity, "minimum": minimum}

    def set_minimum(self, code, data):
        code = read_text({"code": code}, "code", "Código do produto", 60).upper()
        minimum = read_minimum(data)
        with connect(self.database) as db, db:
            db.execute("BEGIN IMMEDIATE")
            result = db.execute("UPDATE products SET minimum = ? WHERE code = ?", (minimum, code))
            if result.rowcount == 0:
                raise InventoryError("Produto não encontrado.", 404)
            product = db.execute(
                "SELECT code, name, category, quantity, minimum FROM products WHERE code = ?", (code,)
            ).fetchone()
        return dict(product)

    def register_movement(self, data):
        code = read_text(data, "productCode", "Código do produto", 60).upper()
        movement_type = data.get("type")
        if movement_type not in ("Entrada", "Saída"):
            raise InventoryError("Selecione Entrada ou Saída.")
        quantity = read_quantity(data, 1)
        with connect(self.database) as db, db:
            db.execute("BEGIN IMMEDIATE")
            product = db.execute("SELECT name, quantity FROM products WHERE code = ?", (code,)).fetchone()
            if product is None:
                raise InventoryError("Produto não encontrado.", 404)
            delta = quantity if movement_type == "Entrada" else -quantity
            balance = product["quantity"] + delta
            if balance < 0:
                raise InventoryError("Saldo insuficiente para registrar a saída.", 409)
            if balance > MAX_QUANTITY:
                raise InventoryError("A entrada excede o saldo máximo permitido.", 409)

            created_at = datetime.now(timezone.utc).isoformat(timespec="seconds")
            db.execute("UPDATE products SET quantity = ? WHERE code = ?", (balance, code))
            cursor = db.execute(
                "INSERT INTO movements(product_code, type, quantity, created_at) VALUES (?, ?, ?, ?)",
                (code, movement_type, quantity, created_at),
            )
        return {
            "id": cursor.lastrowid, "productCode": code, "productName": product["name"],
            "type": movement_type, "quantity": quantity, "createdAt": created_at,
        }
