# Sprint 5 — Padrões de projeto aplicados ao código

- **Prazo previsto:** 26/10/2026, conforme o [modelo do professor](https://github.com/johnatan-si/tp-eng-software/blob/main/docs/sprints/sprint-05.md).
- **Recuperação:** 11/11/2026.
- **Responsável pela conferência:** grupo.
- **Entrega:** [tag sprint-05](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/tree/sprint-05).

## Objetivo e resultado

Organizar os fluxos de estoque em uma interface administrativa e aplicar um padrão a um problema concreto. A aplicação passou a ter Visão geral, Produtos e Movimentações. O Repository existente foi consolidado para gravar saldo e histórico em uma operação.

## Sprint Backlog

| Issue | Entrega | Responsável | Critério atendido |
|---|---|---|---|
| [#30](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/issues/30) | Modernização da interface e dos fluxos | Grupo | Navegação, pesquisa, cadastro em modal, indicadores e movimentação unificada verificados. |
| [#31](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/issues/31) | Repository e verificação da persistência | Grupo | Gravação conjunta, leitura dos dados anteriores e preservação do estado após falha verificadas. |

A pesquisa corresponde à [issue #16](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/issues/16). A [issue #20](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/issues/20) permanece aberta para o indicador de estoque baixo com limite configurável. A entrega inclui o indicador de produtos com saldo zero.

## Implementação e rastreabilidade

| Requisitos | Issue e commit | Código e evidência |
|---|---|---|
| RF-01, RF-02, RNF-02, RNF-07 | #30, #16 · [Interface](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/commit/4f7a37f87461e2a466aaccf435b4ebd04efead67) | [HTML](../../src/index.html), [CSS](../../src/css/styles.css) e [interface](../../src/js/app.js). Cadastro, duplicidade, pesquisa e tabela em tela pequena verificados no Chrome. |
| RF-03, RF-04, RF-05 | #30 · [Interface](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/commit/4f7a37f87461e2a466aaccf435b4ebd04efead67) | Formulário unificado com saldo disponível. Entrada, saída, bloqueio e histórico verificados no Chrome. |
| RNF-05, RNF-06, RNF-08 | #31 · [Persistência](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/commit/d514cfa1a8de78dce970d49731447672e4f856cb) | [Descrição do padrão](../padroes/padroes-de-projeto.md) e [testes automatizados](../../tests/inventory.test.cjs). |

## Execução e verificações

Abra `src/index.html` no navegador. Em **Produtos**, cadastre um item com saldo 10 e outro com saldo zero. Pesquise pelo nome e pelo código. Em **Movimentações**, selecione o primeiro item, registre entrada de 5 e saída de 3, tente retirar 13 e recarregue a página. O saldo permanece 12 e o histórico contém duas operações válidas. A **Visão geral** apresenta 2 produtos, 12 unidades e 1 produto sem estoque.

- **Chrome, 1280 e 375 px:** navegação sem recarga, modal, cadastro válido, bloqueio de código duplicado, pesquisa, saldo, entrada e saída, rejeição de saída, histórico, persistência e rolagem horizontal da tabela verificados com automação. Nenhum erro JavaScript foi registrado nesse percurso.
- **`node --test tests/inventory.test.cjs`:** três testes passaram. Eles cobrem fluxo de estoque, compatibilidade com dados da Sprint 4 e falha de gravação. Node e Playwright foram ferramentas de verificação.

## Acompanhamento, revisão e próxima sprint

As issues e os commits registram a execução. O [GitHub Project](https://github.com/users/WillianCustodio-lab/projects/1) é o quadro de acompanhamento do grupo. O trabalho foi registrado como responsabilidade do grupo. Nenhuma reunião, distribuição individual ou rodada de feedback foi informada. Houve apoio de IA na implementação, nos testes e na documentação.

A revisão técnica mostrou que o fluxo opera no navegador e que o Repository preserva a consistência na falha simulada. A persistência segue local e a execução pressupõe uma aba de trabalho. Na Sprint 6, a ação prevista é integrar a API Flask ao SQLite, com atualização de saldo e histórico na mesma transação.
