from pathlib import Path
import sqlite3

from flask import Flask, jsonify, request, send_from_directory

from .database import initialize
from .inventory import InventoryError, InventoryRepository

FRONTEND = Path(__file__).resolve().parents[1]


def create_app(config=None):
    app = Flask(__name__, static_folder=None)
    app.config.from_mapping(
        DATABASE=Path(app.instance_path) / "estoque.sqlite3",
        MAX_CONTENT_LENGTH=64 * 1024,
    )
    if config:
        app.config.update(config)
    initialize(app.config["DATABASE"])
    repository = InventoryRepository(app.config["DATABASE"])

    @app.get("/")
    def index():
        return send_from_directory(FRONTEND, "index.html")

    @app.get("/css/<path:filename>")
    def stylesheet(filename):
        return send_from_directory(FRONTEND / "css", filename)

    @app.get("/js/<path:filename>")
    def script(filename):
        return send_from_directory(FRONTEND / "js", filename)

    @app.after_request
    def avoid_cached_stock(response):
        if request.path.startswith("/api/"):
            response.headers["Cache-Control"] = "no-store"
        return response

    def read_payload():
        data = request.get_json(silent=True)
        if not isinstance(data, dict):
            raise InventoryError("Envie os dados como um objeto JSON.")
        return data

    @app.get("/api/inventory")
    def inventory():
        return jsonify(repository.snapshot())

    @app.post("/api/products")
    def register_product():
        return jsonify(repository.register_product(read_payload())), 201

    @app.post("/api/movements")
    def register_movement():
        return jsonify(repository.register_movement(read_payload())), 201

    @app.errorhandler(InventoryError)
    def inventory_error(error):
        return jsonify(message=str(error)), error.status

    @app.errorhandler(413)
    def payload_too_large(_error):
        return jsonify(message="Os dados enviados excedem o tamanho permitido."), 413

    @app.errorhandler(sqlite3.Error)
    def database_error(error):
        app.logger.error("Falha no acesso ao SQLite", exc_info=error)
        return jsonify(message="Não foi possível acessar o estoque. Tente novamente."), 503

    return app
