# Aplicação web

A interface utiliza HTML, CSS e JavaScript puro. Nesta etapa, os dados permanecem no `localStorage` do navegador.

## Funcionalidades disponíveis

- cadastro e consulta de produtos;
- validação de código duplicado e quantidades;
- registro de entradas e saídas;
- rejeição de saída superior ao saldo;
- histórico de movimentações;
- persistência local dos dados.

## Organização do JavaScript

- `inventory.js`: produtos, movimentações, validações e regras de saldo;
- `storage.js`: leitura e gravação no `localStorage`;
- `app.js`: formulários e atualização da interface.

## Como executar

1. Abra `src/index.html` em um navegador atual.
2. Cadastre um produto.
3. Registre entradas ou saídas selecionando o produto.
4. Consulte o saldo e o histórico.

A futura integração com Flask e SQLite substituirá a persistência local sem exigir que as regras da interface sejam recriadas.
