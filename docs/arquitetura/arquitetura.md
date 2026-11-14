# Arquitetura da aplicação

## Visão geral

A aplicação é um monólito em camadas. Um processo Flask serve a interface e a API na mesma origem. O SQLite funciona no próprio processo e mantém os dados em arquivo. Essa organização simplifica execução e implantação para o escopo do trabalho.

```text
Navegador
  HTML, CSS e app.js
  api.js
    │ HTTP / JSON na mesma origem
    ▼
Flask → InventoryRepository → SQLite
  │            │                 └─ produtos e movimentações
  │            └─ validação e transação
  └─ rotas da API e arquivos da interface
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

O servidor retorna 201 para cadastros e movimentações confirmados. Dados inválidos retornam 400, produto inexistente retorna 404 e conflitos, como duplicidade ou saldo insuficiente, retornam 409.

**RNF-05 e RNF-06.** Ao receber uma movimentação, o SQLite reserva a escrita antes de ler o saldo. O ajuste de saldo e o registro no histórico são confirmados na mesma transação. Uma falha desfaz a operação completa. O arquivo do banco mantém o estado entre recargas e reinicializações.

**RNF-08.** A interface depende do contrato HTTP. As regras e a persistência ficam no servidor. O Repository da Sprint 5 é sucedido pela implementação sobre SQLite. O formato de armazenamento interno deixa de ser uma responsabilidade do navegador.

A consulta carrega o histórico inteiro, adequado à demonstração acadêmica. Paginação e medição de desempenho podem ser avaliadas com uma base maior.

## Execução e implantação

Siga o [guia de execução](../../src/README.md). O Flask cria o arquivo `instance/estoque.sqlite3` na primeira inicialização. Os dados de demonstração podem ser inseridos em uma base vazia com `seed-demo`.

A entrega foi validada localmente, sem publicação da aplicação. Uma implantação compartilhada requer um servidor WSGI e um diretório persistente e gravável para SQLite. Autenticação e controle de acesso continuam em evolução futura.
