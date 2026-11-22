import sqlite3
from contextlib import contextmanager
from pathlib import Path

SCHEMA = Path(__file__).with_name("schema.sql")

# Colunas adicionadas depois da Sprint 6. Bancos criados antes recebem a coluna sem perder dados.
MIGRATIONS = {
    "minimum": "ALTER TABLE products ADD COLUMN minimum INTEGER "
               "CHECK (minimum IS NULL OR minimum BETWEEN 0 AND 9007199254740991)",
}


@contextmanager
def connect(database):
    connection = sqlite3.connect(database, isolation_level=None)
    try:
        connection.row_factory = sqlite3.Row
        connection.execute("PRAGMA foreign_keys = ON")
        yield connection
    finally:
        connection.close()


def initialize(database):
    path = Path(database)
    path.parent.mkdir(parents=True, exist_ok=True)
    with connect(path) as connection:
        connection.executescript(SCHEMA.read_text(encoding="utf-8"))
        columns = {row["name"] for row in connection.execute("PRAGMA table_info(products)")}
        for column, statement in MIGRATIONS.items():
            if column not in columns:
                connection.execute(statement)
