# Sprint 4 — Separação do código e saídas de estoque

**Prazo:** 13/10/2026. **Conclusão:** 10/11/2026. [Versão da sprint](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/tree/sprint-04).

A sprint separou as regras de estoque, o armazenamento e a interface. Também implementou a saída de produtos com validação de saldo e ampliou o histórico para mostrar entradas e saídas.

## Entregas

| Issue | Resultado | Evidência |
|---|---|---|
| [#29](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/issues/29) | Separação do código (RNF-08) | [`f07549c`](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/commit/f07549c) e [decisões de projeto](../projeto/decisoes-de-projeto.md) |
| [#4](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/issues/4) e [#5](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/issues/5) | Saída e histórico completo (RF-04 e RF-05) | [`f9650b6`](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/commit/f9650b6) |

O trabalho foi acompanhado no [GitHub Project](https://github.com/users/WillianCustodio-lab/projects/1). As verificações de código confirmaram que, a partir de 10 unidades, uma entrada de 5 e uma saída de 3 deixam 12 unidades. A saída de 13 foi rejeitada sem alterar o saldo ou o histórico. A tela foi verificada no navegador na Sprint 5.
