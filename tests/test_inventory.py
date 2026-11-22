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

    def test_minimum_is_optional_validated_and_persisted(self):
        self.assertIsNone(self.repository.snapshot()["products"][0]["minimum"])
        created = self.repository.register_product({"code": "FT-01", "name": "Fita", "quantity": 2, "minimum": 5})
        self.assertEqual(created["minimum"], 5)
        for minimum in (-1, True, 1.5, "3"):
            with self.subTest(minimum=minimum), self.assertRaisesRegex(InventoryError, "mínimo"):
                self.repository.set_minimum("cx-01", {"minimum": minimum})
        self.assertEqual(self.repository.set_minimum(" cx-01 ", {"minimum": 0})["minimum"], 0)
        with self.assertRaises(InventoryError) as missing:
            self.repository.set_minimum("XX", {"minimum": 1})
        self.assertEqual(missing.exception.status, 404)
        reopened = InventoryRepository(self.database).snapshot()["products"]
        self.assertEqual([p["minimum"] for p in reopened], [0, 5])
        self.assertIsNone(self.repository.set_minimum("FT-01", {"minimum": None})["minimum"])

    def test_initialize_migrates_database_without_minimum(self):
        legacy = self.database.with_name("legacy.sqlite3")
        with connect(legacy) as db:
            db.executescript("""
                CREATE TABLE products (code TEXT PRIMARY KEY NOT NULL, name TEXT NOT NULL,
                    category TEXT NOT NULL DEFAULT '', quantity INTEGER NOT NULL) STRICT;
                INSERT INTO products VALUES ('OLD-1', 'Antigo', '', 4);
            """)
        initialize(legacy)
        initialize(legacy)
        repository = InventoryRepository(legacy)
        self.assertEqual(repository.snapshot()["products"], [
            {"code": "OLD-1", "name": "Antigo", "category": "", "quantity": 4, "minimum": None},
        ])
        self.assertEqual(repository.set_minimum("OLD-1", {"minimum": 4})["minimum"], 4)

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
