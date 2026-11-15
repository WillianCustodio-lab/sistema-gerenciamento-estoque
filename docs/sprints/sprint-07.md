# Sprint 7 — Estratégia de testes e primeira execução verificável

- **Prazo:** 16/11/2026, conforme o [modelo do professor](https://github.com/johnatan-si/tp-eng-software/blob/main/docs/sprints/sprint-07.md).
- **Execução registrada:** 15/11/2026.
- **Conferência:** grupo.
- **Entrega:** [tag sprint-07](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/tree/sprint-07).

## Objetivo e resultado

Verificar os requisitos do MVP sobre a integração com Flask e SQLite. Foram executados 9 testes Python e 2 testes no Chrome. A primeira execução do caso de precisão revelou um defeito no indicador. O caso passou após a correção.

## Artefatos e evidências

- [Plano de testes](../testes/plano-de-testes.md) com escopo, dados, passos, resultados esperados, matriz requisito–teste e critérios de aprovação.
- [Resultados](../testes/resultados-sprint-07.md) com ambiente, latência, defeito e reteste.
- [Testes versionados](../../tests), executáveis com os comandos do plano.

| Incremento | Commit | Rastreabilidade |
|---|---|---|
| Base de 1.000 produtos e medição da API | [`703e9da`](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/commit/703e9da) | CT-06, RNF-01 |
| Fluxo de operação e falha de rede no Chrome | [`1517e7e`](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/commit/1517e7e) | CT-07 a CT-09, RF-01 a RF-05 |
| Correção do total de unidades e regressão | [`7894f72`](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/commit/7894f72) | CT-10, RF-02, #34 |

## Sprint Backlog

| Issue | Entrega | Responsável | Aceite | Situação |
|---|---|---|---|---|
| [#34](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/issues/34) | Corrigir a precisão do total de unidades | Grupo | CT-10 reproduz a falha e passa após a correção | Concluído |
| [#35](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/issues/35) | Consolidar testes e entrega | Grupo | Plano, suítes, resultados e tag disponíveis | Concluído |

O [GitHub Project](https://github.com/users/WillianCustodio-lab/projects/1) acompanha a sprint. Nenhuma reunião, distribuição individual ou rodada de feedback foi informada. Houve uso de IA para implementar a automação, revisar o código e registrar as evidências.

## Revisão e próxima sprint

Os testes preservaram o fluxo básico, incluindo a recuperação após falha de conexão e a consistência de saldo e histórico. O desempenho foi medido apenas para a API local. Na Sprint 8, repetir as suítes na versão candidata e completar a validação com usuários conforme o roteiro da disciplina.
