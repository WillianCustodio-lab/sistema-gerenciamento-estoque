from datetime import datetime, timezone

from .database import connect

MAX_QUANTITY = 9_007_199_254_740_991


class InventoryError(Exception):
    def __init__(self, message, status=400):
        super().__init__(message)
        self.status = status


def read_text(data, key, limit, *, required=True):
    value = data.get(key, "")
    if not isinstance(value, str):
        raise InventoryError("Informe um texto válido para " + key + ".")
    value = value.strip()
    if (required and not value) or len(value) > limit:
        raise InventoryError("Confira o campo " + key + ".")
    return value


def read_quantity(data, minimum):
    quantity = data.get("quantity")
    if type(quantity) is not int or not minimum <= quantity <= MAX_QUANTITY:
        raise InventoryError(f"Informe uma quantidade inteira entre {minimum} e {MAX_QUANTITY}.")
    return quantity


class InventoryRepository:
    def __init__(self, database):
        self.database = database

    def snapshot(self):
        with connect(self.database) as db, db:
            db.execute("BEGIN")
            products = db.execute("SELECT code, name, category, quantity FROM products ORDER BY rowid")
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
        code = read_text(data, "code", 60).upper()
        name = read_text(data, "name", 160)
        category = read_text(data, "category", 120, required=False)
        quantity = read_quantity(data, 0)
        if len(code) > 60:
            raise InventoryError("O código deve ter até 60 caracteres.")
        with connect(self.database) as db, db:
            db.execute("BEGIN IMMEDIATE")
            result = db.execute(
                "INSERT INTO products VALUES (?, ?, ?, ?) ON CONFLICT(code) DO NOTHING",
                (code, name, category, quantity),
            )
            if result.rowcount == 0:
                raise InventoryError("Já existe um produto cadastrado com esse código.", 409)
        return {"code": code, "name": name, "category": category, "quantity": quantity}

    def register_movement(self, data):
        code = read_text(data, "productCode", 60).upper()
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
