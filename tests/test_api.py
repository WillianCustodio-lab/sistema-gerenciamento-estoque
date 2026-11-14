from pathlib import Path
from tempfile import TemporaryDirectory
import unittest

from src.backend.app import create_app


class ApiTest(unittest.TestCase):
    def setUp(self):
        folder = TemporaryDirectory()
        self.addCleanup(folder.cleanup)
        self.config = {"TESTING": True, "DATABASE": Path(folder.name) / "test.sqlite3"}
        self.client = create_app(self.config).test_client()

    def test_serves_interface(self):
        for path in ("/", "/css/styles.css", "/js/app.js"):
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
        self.assertEqual(self.client.post("/api/products", json={**product, "name": " "}).status_code, 400)
        self.client.post("/api/products", json=product)
        self.assertEqual(self.client.post("/api/products", json=product).status_code, 409)
        for code, kind, quantity, status in (("XX", "Saída", 1, 404), ("CX1", "Saída", 2, 409), ("CX1", "Ajuste", 1, 400)):
            response = self.client.post("/api/movements", json={"productCode": code, "type": kind, "quantity": quantity})
            self.assertEqual(response.status_code, status)
            self.assertTrue(response.json["message"])
        stock = self.client.get("/api/inventory").json
        self.assertEqual(stock["movements"], [])
        self.assertEqual(stock["products"][0]["quantity"], 1)

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
