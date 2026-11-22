# Sprint 8 — Estoque mínimo, validação e entrega final

**Início:** 21/11/2026. **Situação:** em andamento. A tag `sprint-08` será criada depois da validação com usuários.

A sprint completa os indicadores da Visão geral com o estoque baixo, valida o sistema com usuários e consolida a entrega final.

## Entregas

| Issue | Resultado | Evidência | Situação |
|---|---|---|---|
| [#14](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/issues/14) | Estoque mínimo opcional por produto, no cadastro e em "Definir mínimo" (RF-07) | CT-11 e CT-12 em [resultados](../testes/resultados-sprint-08.md) | Concluído |
| [#15](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/issues/15) | Selo "Estoque baixo" na lista de produtos (RF-08) | CT-11 | Concluído |
| [#20](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/issues/20) | Indicador "Produtos com estoque baixo" na Visão geral (RF-08) | CT-11 | Concluído |
| A criar | Validação com usuários | [Roteiro e registro](../testes/validacao-usuarios.md) | A fazer |
| A criar | Integração contínua (GitHub Actions) | [ci.yml](../../.github/workflows/ci.yml) e [arquitetura](../arquitetura/arquitetura.md#execução-e-implantação) | Configurado. Falta confirmar a primeira execução no GitHub. |
| [#12](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/issues/12) | Registro do uso de IA e da revisão do grupo | [Uso de IA](../uso-de-ia.md) | Aguarda revisão do grupo |

## Decisões

- **Mínimo opcional.** Sem mínimo, o produto não entra no indicador de estoque baixo. A Visão geral mostra "—" enquanto nenhum produto tem limite. Assim, a #20 cumpre o critério "quando esse limite estiver configurado".
- **Igual ou abaixo do mínimo.** Segue a US-07 (#15). Um produto sem saldo e com mínimo configurado mostra o selo "Sem estoque" na lista, mas também entra na contagem de estoque baixo.
- **Só integração contínua, sem hospedagem.** Hospedar não é exigido, e um plano gratuito não guarda o SQLite entre reinícios. A avaliação usa a execução local, e a CI comprova que as suítes passam a cada push.
- **Migração automática.** Bancos criados até a Sprint 7 recebem a coluna `minimum` ao iniciar a aplicação, sem perder dados (CT-12).

## Para encerrar a sprint

1. Conferir na aba **Actions** do GitHub que a primeira execução da CI passou.
2. Fazer as sessões do [roteiro de validação](../testes/validacao-usuarios.md) e registrar os resultados.
3. Corrigir ou registrar como issue os problemas encontrados.
4. Revisar o [registro de uso de IA](../uso-de-ia.md) e fechar a #12.
5. Fechar as issues #14, #15 e #20 com os links dos commits.
6. Substituir "A criar" pelos números das issues e acrescentar os commits nesta página.
7. Criar e publicar a tag: `git tag -a sprint-08 -m "Sprint 8"` e `git push origin sprint-08`.

[GitHub Project](https://github.com/users/WillianCustodio-lab/projects/1)
