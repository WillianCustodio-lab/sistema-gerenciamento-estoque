# Modelagem da aplicação

Os diagramas mostram como produtos e movimentações foram organizados na Sprint 3. As referências de código apontam para a versão daquela sprint.

## Fluxo de entrada

![Fluxo de registro de entrada](imagens/fluxo-registro-entrada.svg)

A entrada válida aumenta o saldo e aparece no histórico. Uma entrada inválida preserva os dados. Regras relacionadas: RN-02 e RN-03.

## Modelo de domínio

![Modelo de domínio](imagens/modelo-dominio.svg)

Um produto tem um saldo e pode ter várias movimentações.

## Relação com requisitos e código

| Requisito | Issue | Onde aparece |
|---|---|---|
| RF-01 e RF-02 | #1 e #2 | Cadastro e consulta de produtos no modelo de domínio. |
| RF-03 e RF-05 | #3 e #5 | Fluxo de entrada e consulta de movimentações. |
| RNF-05 e RNF-06 | #3 | Validação da entrada e persistência após recarregar. |

O [código da Sprint 3](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/blob/sprint-03/src/js/app.js) reúne os formulários e as classes `Product` e `Movement`. [Verificação do fluxo](evidencia-execucao.md)

## Limites da sprint

Nessa versão, o histórico apresentava entradas e os dados ficavam no navegador. As saídas chegaram na Sprint 4. A API e o banco passaram a ser usados na Sprint 6.
