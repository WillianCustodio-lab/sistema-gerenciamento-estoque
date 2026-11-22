# Aplicação web

O Flask serve a interface HTML, CSS e JavaScript e a API na mesma origem. O SQLite armazena produtos, saldos e movimentações.

## Como executar

A partir da raiz, com Python 3.11 ou mais recente e SQLite 3.37 ou mais recente:

```powershell
python -m venv .venv
.\.venv\Scripts\python -m pip install -r requirements.txt
.\.venv\Scripts\python -m flask --app src.backend.app run
```

Abra `http://127.0.0.1:5000`. Em **Produtos**, cadastre um item. Em **Movimentações**, selecione o tipo, o produto e a quantidade. Confira o saldo em **Produtos** e a operação no **Histórico de movimentações**. Use **Definir mínimo** em um produto para acompanhar o estoque baixo na **Visão geral**.

O Flask cria o banco vazio em `instance/estoque.sqlite3`. Os dados da Sprint 5 ficam no navegador usado para aquela versão.

## Demonstração e testes

Com o servidor parado, use `seed-demo` para inserir três produtos de exemplo em uma base vazia. Um deles já aparece com estoque baixo. O comando preserva os produtos já cadastrados.

```powershell
.\.venv\Scripts\python -m flask --app src.backend.app seed-demo
.\.venv\Scripts\python -m unittest discover -s tests -v
```

## Integração contínua

O GitHub Actions executa as duas suítes a cada push e pull request. A configuração está em [`ci.yml`](../.github/workflows/ci.yml).

Consulte a [arquitetura](../docs/arquitetura/arquitetura.md) para ver os componentes e o contrato da API. O [plano de testes](../docs/testes/plano-de-testes.md) inclui os comandos da suíte no Chrome.
