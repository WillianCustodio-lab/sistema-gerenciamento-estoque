# Sprint 6 — Integração com Flask e SQLite

**Prazo:** 09/11/2026. **Conclusão:** 13/11/2026. [Versão da sprint](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/tree/sprint-06).

O Flask passou a servir a interface e a API. O SQLite passou a manter os produtos e o histórico. Cada movimentação grava o saldo e o histórico na mesma transação.

## Entregas

| Issue | Resultado | Evidência |
|---|---|---|
| [#22](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/issues/22) | API e integração da interface (RF-01 a RF-05) | [`42d0376`](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/commit/42d0376), [`cc515dd`](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/commit/cc515dd) |
| [#23](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/issues/23) | Banco e dados opcionais de demonstração (RNF-06) | [`0db7e4d`](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/commit/0db7e4d), [`f1eace5`](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/commit/f1eace5) |
| [#24](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/issues/24) | Consistência das movimentações (RNF-05) | [`e918f33`](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/commit/e918f33) |
| [#33](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/issues/33) | Arquitetura e consolidação da sprint | [`1f87558`](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/commit/1f87558) e [arquitetura](../arquitetura/arquitetura.md) |

Oito testes Python passaram, e o fluxo funcionou no Chrome. Os dados da Sprint 5 continuam no navegador e o SQLite começa vazio. [GitHub Project](https://github.com/users/WillianCustodio-lab/projects/1)
