# Padrões de projeto — Repository

## Problema

Na Sprint 4, o saldo e o histórico eram gravados separadamente. Uma falha poderia deixar o saldo atualizado sem a movimentação correspondente.

## Alternativas e decisão

Gravar separadamente exigiria desfazer alterações em caso de falha. Adiar a mudança para o SQLite deixaria o problema aberto. A Sprint 5 manteve o **Repository** e adotou uma gravação conjunta para saldo e histórico.

## Participantes e aplicação

| Participante | Arquivo | Responsabilidade |
|---|---|---|
| Interface | [app.js](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/blob/sprint-05/src/js/app.js) | Cria o repositório e o fornece ao serviço. |
| Serviço de estoque | [inventory.js](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/blob/sprint-05/src/js/inventory.js) | Valida e confirma a operação após a gravação. |
| Repositório local | [storage.js](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/blob/sprint-05/src/js/storage.js) | Lê e grava o estoque em uma chave do navegador. |

## Benefícios e limites

A solução evitou gravações parciais e manteve a leitura dos dados antigos. Cada operação ainda gravava todo o estoque no navegador. As transações passaram ao SQLite na Sprint 6.

## Evidência

Na versão `sprint-05`, execute `node --test tests/inventory.test.cjs`. Os [testes](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/blob/sprint-05/tests/inventory.test.cjs) cobrem leitura dos dados antigos, recarga e falha de gravação. A implementação está na [issue #31](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/issues/31).

## Situação atual

Na Sprint 6, o Repository passou para o servidor como [`InventoryRepository`](../../src/backend/inventory.py). A interface não acessa o banco: chama a API, e a API delega ao repositório. Cada operação de gravação abre uma transação `BEGIN IMMEDIATE`, que impede duas saídas simultâneas de deixar o saldo negativo (CT-05). Na Sprint 8, o repositório ganhou `set_minimum` sem alterações na API de leitura. Os testes estão em [`test_inventory.py`](../../tests/test_inventory.py).
