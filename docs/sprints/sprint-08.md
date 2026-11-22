# Sprint 8 — Estoque mínimo, validação e entrega final

**Início:** 21/11/2026. **Encerramento:** 22/11/2026. **Situação:** concluída. A tag `sprint-08` marca a versão entregue.

A sprint completa os indicadores da Visão geral com o estoque baixo, valida o sistema com usuários e consolida a entrega final.

## Entregas

| Issue | Resultado | Evidência | Situação |
|---|---|---|---|
| [#14](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/issues/14) | Estoque mínimo opcional por produto, no cadastro e em "Definir mínimo" (RF-07) | CT-11 e CT-12 em [resultados](../testes/resultados-sprint-08.md) | Concluído |
| [#15](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/issues/15) | Selo "Estoque baixo" na lista de produtos (RF-08) | CT-11 | Concluído |
| [#20](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/issues/20) | Indicador "Produtos com estoque baixo" na Visão geral (RF-08) | CT-11 | Concluído |
| [#37](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/issues/37) | Validação com usuários | [Roteiro e registro](../testes/validacao-usuarios.md) | Concluído. Critério de aceite atendido, com 3 participantes. |
| [#38](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/issues/38) | Integração contínua (GitHub Actions) | [ci.yml](../../.github/workflows/ci.yml) e [arquitetura](../arquitetura/arquitetura.md#execução-e-implantação) | Concluído. A CI passou no pull request da sprint. |
| [#12](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/issues/12) | Registro do uso de IA e da revisão do grupo | [Uso de IA](../uso-de-ia.md) | Concluído. Revisado por Willian Custódio e Juliano Goulart. |

## Commits

| Commit | Conteúdo |
|---|---|
| [`3f7e625`](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/commit/3f7e625) | Estoque mínimo e indicador de estoque baixo (#14, #15, #20) |
| [`c5ea468`](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/commit/c5ea468) | Testes CT-11 e CT-12 na API, no SQLite e no Chrome |
| [`3f43876`](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/commit/3f43876) | Integração contínua no GitHub Actions (#38) |
| [`519752d`](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/commit/519752d) | Requisitos, testes e projeto atualizados |
| [`90986e7`](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/commit/90986e7) | Backlog, roteiro de validação e registro da sprint |
| [`f324749`](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/commit/f324749) | Primeira execução da CI registrada |
| [`171da4b`](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/commit/171da4b) | Resultados da validação com usuários (#37) |
| [`e355730`](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/commit/e355730) | Revisão do uso de IA (#12) |

## Decisões

- **Mínimo opcional.** Sem mínimo, o produto não entra no indicador de estoque baixo. A Visão geral mostra "—" enquanto nenhum produto tem limite. Assim, a #20 cumpre o critério "quando esse limite estiver configurado".
- **Igual ou abaixo do mínimo.** Segue a US-07 (#15). Um produto sem saldo e com mínimo configurado mostra o selo "Sem estoque" na lista, mas também entra na contagem de estoque baixo.
- **Só integração contínua, sem hospedagem.** Hospedar não é exigido, e um plano gratuito não guarda o SQLite entre reinícios. A avaliação usa a execução local, e a CI comprova que as suítes passam a cada push.
- **Migração automática.** Bancos criados até a Sprint 7 recebem a coluna `minimum` ao iniciar a aplicação, sem perder dados (CT-12).

## Para encerrar a sprint

1. ~~Conferir na aba **Actions** do GitHub que a primeira execução da CI passou.~~ Concluído.
2. ~~Fazer as sessões do [roteiro de validação](../testes/validacao-usuarios.md) e registrar os resultados.~~ Concluído.
3. ~~Registrar como issue os problemas da validação.~~ Concluído: [#39](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/issues/39) (nome "Definir mínimo") e [#40](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/issues/40) (aparência da interface).
4. ~~Revisar o [registro de uso de IA](../uso-de-ia.md).~~ Concluído. Falta fechar a #12.
5. Fechar as issues #14, #15 e #20 com os links dos commits.
6. ~~Substituir "A criar" pelos números das issues e acrescentar os commits nesta página.~~ Concluído.
7. Criar e publicar a tag: `git tag -a sprint-08 -m "Sprint 8"` e `git push origin sprint-08`.

[GitHub Project](https://github.com/users/WillianCustodio-lab/projects/1)
