# Sprint 3 — Modelagem e registro de entradas

**Data de entrega:** 28/09/2026. [Versão da sprint](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/tree/sprint-03).

A sprint produziu o modelo de domínio e o diagrama de atividades. Na aplicação, uma entrada válida atualizava o saldo, aparecia no histórico e permanecia disponível após recarregar a página.

## Entregas

| Issue | Resultado | Evidência |
|---|---|---|
| [#26](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/issues/26) e [#27](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/issues/27) | Modelos relacionados aos requisitos e ao código | [Modelagem](../modelagem/modelagem.md) |
| [#3](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/issues/3) e [#5](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/issues/5) | Entrada e consulta inicial do histórico (RF-03 e RF-05) | [`9954757`](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/commit/9954757) e [verificação no navegador](../modelagem/evidencia-execucao.md) |
| [#28](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/issues/28) | Consolidação e tag da sprint | [`83ca351`](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/commit/83ca351) |

O trabalho foi acompanhado no [GitHub Project](https://github.com/users/WillianCustodio-lab/projects/1). O fluxo foi verificado com saldo inicial 10 e entrada de 5. O saldo chegou a 15, e uma quantidade inválida foi rejeitada sem alterar os dados. As saídas foram tratadas na Sprint 4.
