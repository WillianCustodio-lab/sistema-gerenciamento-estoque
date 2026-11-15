# Arquitetura da aplicação

## Visão geral

A aplicação é um monólito em camadas. O mesmo servidor Flask entrega a interface e recebe as chamadas da API. O SQLite guarda os dados em um arquivo local.

```text
Navegador ← HTTP/JSON → Flask → InventoryRepository → SQLite
```

## Componentes

| Componente | Código | Responsabilidade |
|---|---|---|
| Interface | [index.html](../../src/index.html), [app.js](../../src/js/app.js) e [styles.css](../../src/css/styles.css) | Navegação, formulários e apresentação dos dados retornados pela API. |
| Cliente HTTP | [api.js](../../src/js/api.js) | Envia e recebe JSON e encaminha mensagens da API à interface. |
| API Flask | [app.py](../../src/backend/app.py) | Serve a interface, recebe solicitações e traduz resultados em respostas HTTP. |
| Estoque | [inventory.py](../../src/backend/inventory.py) | Valida produtos e quantidades, consulta o saldo e controla as operações de gravação. |
| Persistência | [database.py](../../src/backend/database.py) e [schema.sql](../../src/backend/schema.sql) | Inicializa o arquivo e aplica restrições de integridade e chaves estrangeiras. |

## Comunicação e integridade

| Operação | Resultado |
|---|---|
| `GET /api/inventory` | Retorna produtos e histórico em uma consulta consistente. |
| `POST /api/products` | Cadastra um produto com código, nome, categoria opcional e quantidade inicial. |
| `POST /api/movements` | Registra entrada ou saída com tipo, código do produto e quantidade. |

**RNF-05 e RNF-06.** Saldo e histórico são gravados na mesma transação. Se a operação falhar, ambos são preservados. O banco mantém os registros após reiniciar a aplicação.

**RNF-08.** A interface consulta a API, e o servidor aplica as regras de estoque.

A consulta carrega todo o histórico. A aplicação ainda não divide os resultados em páginas.

## Execução e implantação

Os testes cobrem a execução local. Para hospedar a aplicação, é necessário um servidor WSGI e armazenamento persistente para o SQLite. [Guia de execução](../../src/README.md)
