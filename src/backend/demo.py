from .database import connect

DEMO_PRODUCTS = [
    ("DEMO-01", "Caixa organizadora", "Armazenagem", 12),
    ("DEMO-02", "Fita de embalagem", "Expedição", 8),
    ("DEMO-03", "Etiqueta adesiva", "Expedição", 0),
]


def seed_demo(database):
    with connect(database) as db, db:
        db.execute("BEGIN IMMEDIATE")
        if db.execute("SELECT 1 FROM products LIMIT 1").fetchone():
            return 0
        db.executemany(
            "INSERT INTO products(code, name, category, quantity) VALUES (?, ?, ?, ?)",
            DEMO_PRODUCTS,
        )
        return len(DEMO_PRODUCTS)
