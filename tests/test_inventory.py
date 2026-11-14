from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import sqlite3
from tempfile import TemporaryDirectory
import unittest

from src.backend.database import connect, initialize
from src.backend.inventory import InventoryError, InventoryRepository


class InventoryTest(unittest.TestCase):
    def setUp(self):
        folder = TemporaryDirectory()
        self.addCleanup(folder.cleanup)
        self.database = Path(folder.name) / "test.sqlite3"
        initialize(self.database)
        self.repository = InventoryRepository(self.database)
        self.repository.register_product({"code": "  cx-01 ", "name": "Caixa", "quantity": 10})

    def movement(self, kind, quantity):
        return self.repository.register_movement({"productCode": "CX-01", "type": kind, "quantity": quantity})

    def test_entry_exit_and_reopen(self):
        self.movement("Entrada", 5)
        self.movement("Saída", 3)
        state = InventoryRepository(self.database).snapshot()
        self.assertEqual(state["products"][0]["quantity"], 12)
        self.assertEqual([m["type"] for m in state["movements"]], ["Saída", "Entrada"])

    def test_duplicates_and_invalid_quantities(self):
        with self.assertRaisesRegex(InventoryError, "cadastrado"):
            self.repository.register_product({"code": "cx-01", "name": "Outro", "quantity": 1})
        for quantity in (0, -1, True, 1.5, "2"):
            with self.subTest(quantity=quantity), self.assertRaises(InventoryError):
                self.movement("Saída", quantity)
        with self.assertRaisesRegex(InventoryError, "insuficiente"):
            self.movement("Saída", 11)
        self.assertEqual(self.repository.snapshot()["movements"], [])
        self.assertEqual(self.repository.snapshot()["products"][0]["quantity"], 10)

    def test_rollback_when_history_insert_fails(self):
        with connect(self.database) as db:
            db.execute("""
                CREATE TRIGGER simulate_failure BEFORE INSERT ON movements
                BEGIN SELECT RAISE(ABORT, 'falha de teste'); END
            """)
        with self.assertRaisesRegex(sqlite3.IntegrityError, "falha de teste"):
            self.movement("Saída", 3)
        self.assertEqual(self.repository.snapshot()["products"][0]["quantity"], 10)
        self.assertEqual(self.repository.snapshot()["movements"], [])

    def test_concurrent_exits_cannot_overdraw(self):
        def try_exit(_):
            try:
                self.movement("Saída", 7)
                return True
            except InventoryError as error:
                self.assertEqual(error.status, 409)
                return False

        with ThreadPoolExecutor(max_workers=2) as workers:
            self.assertEqual(sorted(workers.map(try_exit, range(2))), [False, True])
        self.assertEqual(self.repository.snapshot()["products"][0]["quantity"], 3)
        self.assertEqual(len(self.repository.snapshot()["movements"]), 1)
