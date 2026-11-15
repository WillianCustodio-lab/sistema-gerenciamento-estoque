"""Inicia o Flask com um banco temporário para os testes no navegador."""
from pathlib import Path
import sys
from tempfile import TemporaryDirectory
from threading import Thread

from werkzeug.serving import make_server

from src.backend.app import create_app


def main():
    with TemporaryDirectory() as folder:
        app = create_app({"DATABASE": Path(folder) / "browser.sqlite3"})
        with make_server("127.0.0.1", 0, app) as server:
            thread = Thread(target=server.serve_forever)
            thread.start()
            try:
                print(f"http://127.0.0.1:{server.server_port}", flush=True)
                sys.stdin.read()
            finally:
                server.shutdown()
                thread.join()


if __name__ == "__main__":
    main()
