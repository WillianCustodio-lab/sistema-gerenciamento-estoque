from pathlib import Path
from tempfile import TemporaryDirectory
from time import perf_counter
import unittest

from src.backend.app import create_app
from src.backend.database import connect


class ApiTest(unittest.TestCase):
    def setUp(self):
        folder = TemporaryDirectory()
        self.addCleanup(folder.cleanup)
        self.config = {"TESTING": True, "DATABASE": Path(folder.name) / "test.sqlite3"}
        self.client = create_app(self.config).test_client()

    def test_serves_interface(self):
        for path in ("/", "/css/styles.css", "/js/app.js", "/js/api.js"):
            with self.subTest(path=path), self.client.get(path) as response:
                self.assertEqual(response.status_code, 200)

    def test_persists_product_and_movements_on_restart(self):
        product = self.client.post("/api/products", json={"code": "CX1", "name": "Caixa", "quantity": 10})
        self.assertEqual(product.status_code, 201)
        for kind, quantity in (("Entrada", 5), ("Saída", 3)):
            result = self.client.post("/api/movements", json={"productCode": "CX1", "type": kind, "quantity": quantity})
            self.assertEqual(result.status_code, 201)
        restarted = create_app(self.config).test_client().get("/api/inventory")
        self.assertEqual(restarted.headers["Cache-Control"], "no-store")
        self.assertEqual(restarted.json["products"][0]["quantity"], 12)
        self.assertEqual([item["type"] for item in restarted.json["movements"]], ["Saída", "Entrada"])

    def test_invalid_operations_return_clear_responses(self):
        product = {"code": "CX1", "name": "Caixa", "quantity": 1}
        self.assertEqual(self.client.post("/api/products", json=[]).status_code, 400)
        self.assertEqual(self.client.post("/api/products", json={**product, "quantity": True}).status_code, 400)
        invalid_name = self.client.post("/api/products", json={**product, "name": " "})
        self.assertEqual(invalid_name.status_code, 400)
        self.assertEqual(invalid_name.json["message"], "Preencha o campo Nome.")
        self.client.post("/api/products", json=product)
        self.assertEqual(self.client.post("/api/products", json=product).status_code, 409)
        for code, kind, quantity, status in (("XX", "Saída", 1, 404), ("CX1", "Saída", 2, 409), ("CX1", "Ajuste", 1, 400)):
            response = self.client.post("/api/movements", json={"productCode": code, "type": kind, "quantity": quantity})
            self.assertEqual(response.status_code, status)
            self.assertTrue(response.json["message"])
        stock = self.client.get("/api/inventory").json
        self.assertEqual(stock["movements"], [])
        self.assertEqual(stock["products"][0]["quantity"], 1)

    def test_minimum_stock_can_be_set_and_cleared(self):
        created = self.client.post("/api/products", json={"code": "FT1", "name": "Fita", "quantity": 3, "minimum": 5})
        self.assertEqual(created.status_code, 201)
        self.assertEqual(created.json["minimum"], 5)
        self.client.post("/api/products", json={"code": "CX/2", "name": "Caixa", "quantity": 9})
        updated = self.client.put("/api/products/cx%2F2/minimum", json={"minimum": 10})
        self.assertEqual(updated.status_code, 200)
        self.assertEqual(updated.json, {"code": "CX/2", "name": "Caixa", "category": "", "quantity": 9, "minimum": 10})
        for path, payload, status in (
            ("/api/products/FT1/minimum", {"minimum": -1}, 400),
            ("/api/products/FT1/minimum", [], 400),
            ("/api/products/XX/minimum", {"minimum": 1}, 404),
        ):
            with self.subTest(path=path, payload=payload):
                response = self.client.put(path, json=payload)
                self.assertEqual(response.status_code, status)
                self.assertTrue(response.json["message"])
        self.assertEqual(self.client.put("/api/products/FT1/minimum", json={"minimum": None}).json["minimum"], None)
        products = self.client.get("/api/inventory").json["products"]
        self.assertEqual([p["minimum"] for p in products], [None, 10])

    def test_seed_demo_is_explicit_and_preserves_existing_data(self):
        app = create_app(self.config)
        runner = app.test_cli_runner()
        self.assertEqual(self.client.get("/api/inventory").json["products"], [])
        result = runner.invoke(args=["seed-demo"])
        self.assertEqual(result.exit_code, 0, result.output)
        state = self.client.get("/api/inventory").json
        self.assertEqual(len(state["products"]), 3)
        self.assertEqual(state["movements"], [])
        self.assertEqual(runner.invoke(args=["seed-demo"]).exit_code, 0)
        self.assertEqual(self.client.get("/api/inventory").json, state)

    def test_stock_operations_with_one_thousand_products(self):
        with connect(self.config["DATABASE"]) as db, db:
            db.execute("BEGIN")
            db.executemany(
                "INSERT INTO products(code, name, quantity) VALUES (?, ?, ?)",
                ((f"P{i:04d}", f"Produto {i}", 10) for i in range(1, 1000)),
            )
        cases = (
            ("cadastro", self.client.post, "/api/products",
             {"code": "P1000", "name": "Produto 1000", "quantity": 10}, 201),
            ("entrada", self.client.post, "/api/movements",
             {"productCode": "P1000", "type": "Entrada", "quantity": 5}, 201),
            ("saída", self.client.post, "/api/movements",
             {"productCode": "P1000", "type": "Saída", "quantity": 3}, 201),
            ("consulta", self.client.get, "/api/inventory", None, 200),
        )
        for label, send, path, payload, status in cases:
            with self.subTest(operation=label):
                start = perf_counter()
                response = send(path, **({"json": payload} if payload else {}))
                elapsed = perf_counter() - start
                self.assertEqual(response.status_code, status)
                self.assertLessEqual(elapsed, 5, f"{label}: {elapsed:.3f}s")
                print(f"\nRNF-01 | {label}: {elapsed:.3f}s (limite: 5s)")
        stock = self.client.get("/api/inventory").json
        self.assertEqual(len(stock["products"]), 1000)
        self.assertEqual(stock["products"][-1]["quantity"], 12)
        self.assertEqual(len(stock["movements"]), 2)
