# Aplicação web

O Flask serve a interface HTML, CSS e JavaScript e a API na mesma origem. O SQLite armazena produtos, saldos e movimentações.

## Como executar

A partir da raiz, com Python 3.11 ou mais recente e SQLite 3.37 ou mais recente:

```powershell
python -m venv .venv
.\.venv\Scripts\python -m pip install -r requirements.txt
.\.venv\Scripts\python -m flask --app src.backend.app run
```

Abra `http://127.0.0.1:5000`. Em **Produtos**, cadastre ou pesquise um item. Em **Movimentações**, selecione o tipo, o produto e a quantidade. Confira o saldo no histórico e na **Visão geral**.

O banco é criado em `instance/estoque.sqlite3`, na raiz do projeto. A Sprint 6 inicia com um banco vazio. Para consultar dados da Sprint 5, abra a versão antiga no mesmo navegador e endereço usados originalmente.

## Demonstração e testes

Com o servidor parado, é possível povoar uma base vazia com três produtos de exemplo. A operação preserva bases que já contêm produtos.

```powershell
.\.venv\Scripts\python -m flask --app src.backend.app seed-demo
.\.venv\Scripts\python -m unittest discover -s tests -v
```

Consulte a [arquitetura](../docs/arquitetura/arquitetura.md) para ver os componentes e o contrato da API.
