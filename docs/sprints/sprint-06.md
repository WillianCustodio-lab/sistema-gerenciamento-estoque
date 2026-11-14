# Sprint 6 — Arquitetura e integração da aplicação

- **Prazo previsto:** 09/11/2026, conforme o [modelo do professor](https://github.com/johnatan-si/tp-eng-software/blob/main/docs/sprints/sprint-06.md).
- **Recuperação:** 13/11/2026.
- **Acompanhamento:** grupo.
- **Versão da entrega:** [sprint-06](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/tree/sprint-06).

## Objetivo e incremento

Integrar a interface à API Flask e persistir o estoque em SQLite. O cadastro, a pesquisa e os indicadores foram preservados. Entradas e saídas atualizam o saldo e o histórico juntos. A [arquitetura](../arquitetura/arquitetura.md) mapeia diretórios, comunicação, requisitos e execução.

## Sprint Backlog

| Issue | Entrega | Responsável | Situação |
|---|---|---|---|
| #22 | API Flask e integração da interface | Grupo | Concluído |
| #23 | Esquema e povoamento opcional de produtos | Grupo | Concluído no escopo de estoque |
| #24 | Transação de movimentação e validação de saldo | Grupo | Concluído no escopo de estoque |
| #33 | Arquitetura e consolidação das evidências da entrega | Grupo | Concluído |

Usuários e autoria individual de operações continuam vinculados à evolução de acesso (RF-06). O [GitHub Project](https://github.com/users/WillianCustodio-lab/projects/1) é o quadro de acompanhamento. Não foram informadas reuniões, revisões do grupo ou atribuições individuais. Houve apoio de IA na implementação e na verificação técnica.

## Rastreabilidade e progressão

| Commit | Incremento | Vínculo |
|---|---|---|
| `0db7e4d` | Dependência Flask e esquema inicial do banco | #23 |
| `e918f33` | Repository SQLite, validação e transação de movimentos | RF-01, RF-03, RF-04, RNF-05, #24 |
| `42d0376` | API HTTP e entrega da interface pelo Flask | RF-01 a RF-05, #22 |
| `cc515dd` | Interface conectada à API | RF-01 a RF-05, RNF-06, #22 |
| `f1eace5` | Povoamento explícito para demonstração | #23 |

O commit de documentação reúne a arquitetura, o guia de execução, os requisitos e este registro na tag da entrega.

## Evidências e revisão

- [Oito testes Python](../../tests) passaram. Cobrem cadastro, duplicidade, entradas e saídas, rejeição de saldo insuficiente, recarga após reiniciar a aplicação, falha de gravação com reversão, retiradas simultâneas e povoamento seguro.
- **Chrome em 1280 e 375 px:** cadastro, pesquisa, indicadores, movimentos, histórico, recarga, rolagem da tabela, consulta em outro contexto de navegador e recuperação após falha simulada de conexão foram verificados com o Flask em execução.
- Para repetir a demonstração, siga o [guia de execução](../../src/README.md). Cadastre um produto com 10 unidades, registre entrada de 5, saída de 3 e tente retirar 13. O saldo deve ficar em 12 e apenas os dois movimentos válidos devem aparecer no histórico. Reinicie o Flask e confirme os dados.

## Retrospectiva e próxima sprint

A integração manteve os fluxos da interface e permitiu verificar a persistência em mais de um navegador. A execução verificada é local. Na Sprint 7, a ação prevista é ampliar a cobertura dos requisitos e consolidar a execução dos testes de regressão.
