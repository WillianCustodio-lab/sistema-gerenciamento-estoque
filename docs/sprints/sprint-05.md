# Sprint 5 — Interface e padrão Repository

**Prazo:** 26/10/2026. **Conclusão:** 11/11/2026. [Versão da sprint](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/tree/sprint-05).

A interface foi organizada em Visão geral, Produtos e Movimentações. Foram incluídos pesquisa por nome ou código, cadastro em janela e formulário único para entradas e saídas. O padrão Repository passou a salvar saldo e histórico juntos.

## Entregas

| Issue | Resultado | Evidência |
|---|---|---|
| [#30](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/issues/30) e [#16](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/issues/16) | Interface e pesquisa (RF-01 a RF-05) | [`4f7a37f`](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/commit/4f7a37f) |
| [#31](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/issues/31) | Persistência conjunta (RNF-05 e RNF-06) | [`d514cfa`](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/commit/d514cfa) e [registro do padrão](../padroes/padroes-de-projeto.md) |
| [#32](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/issues/32) | Consolidação da sprint | [`12cc2f0`](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/commit/12cc2f0) |

O trabalho foi acompanhado no [GitHub Project](https://github.com/users/WillianCustodio-lab/projects/1). O fluxo foi verificado no Chrome em 1280 e 375 px. Três testes também passaram, incluindo leitura de dados antigos e falha simulada de gravação. O indicador de saldo zero foi entregue. O limite configurável de estoque baixo ficou na [#20](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/issues/20).
