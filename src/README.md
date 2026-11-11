# Aplicação web

A interface utiliza HTML, CSS e JavaScript puro. Nesta etapa, os dados permanecem no `localStorage` do navegador.

## Funcionalidades disponíveis

- visão geral com saldos e movimentações recentes;
- cadastro em modal e pesquisa de produtos por nome ou código;
- validação de código duplicado e quantidades;
- formulário unificado de entradas e saídas com saldo disponível;
- rejeição de saída superior ao saldo;
- histórico de movimentações;
- persistência local dos dados.

## Organização do JavaScript

- `inventory.js`: produtos, movimentações, validações e regras de saldo;
- `storage.js`: Repository do `localStorage`, com saldo e histórico gravados juntos;
- `app.js`: formulários e atualização da interface.

## Como executar

1. Abra `src/index.html` em um navegador atual.
2. Em **Produtos**, cadastre um produto e consulte seu saldo.
3. Em **Movimentações**, selecione o tipo, o produto e a quantidade.
4. Confira o histórico e os indicadores da **Visão geral**.

A futura integração com Flask e SQLite substituirá a persistência local sem exigir que as regras da interface sejam recriadas.
