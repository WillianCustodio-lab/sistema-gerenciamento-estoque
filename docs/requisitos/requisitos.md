# Requisitos da aplicação

## Levantamento

O grupo pesquisou problemas comuns de gestão de estoque e usou os resultados para discutir o escopo do sistema.

## Atores

| Perfil | Papel previsto |
|---|---|
| Supervisor de estoque | Cadastrar produtos, consultar saldos e registrar movimentações. |
| Auxiliar de almoxarifado | Consultar produtos e registrar entradas e saídas. |
| Administrador | Gerenciar usuários e perfis de acesso em uma versão futura. |

Os perfis representam funções da operação. A versão atual funciona sem login ou permissões individuais.

## Requisitos funcionais

| ID | Resultado esperado | Issue | Situação |
|---|---|---|---|
| RF-01 | Cadastrar produtos com código único. | #1 | Disponível |
| RF-02 | Consultar produtos e seus saldos. | #2 | Disponível |
| RF-03 | Registrar manualmente a entrada de um produto. | #3 | Disponível |
| RF-04 | Registrar manualmente a saída de um produto. | #4 | Disponível |
| RF-05 | Consultar entradas e saídas no histórico. | #5 | Disponível |
| RF-06 | Gerenciar usuários e atribuir perfis de acesso. | — | Evolução futura |
| RF-07 | Definir, alterar ou remover o estoque mínimo de um produto. | #14 | Disponível |
| RF-08 | Destacar produtos com estoque baixo e informar quantos estão nessa situação. | #15, #20 | Disponível |

## Requisitos não funcionais

| ID | Critério | Verificação |
|---|---|---|
| RNF-01 | Responder em até 5 segundos em uma base com até 1.000 produtos. | Medir as operações com a base preparada. |
| RNF-02 | Informar o resultado da operação e indicar dados inválidos. | Testar formulários com dados válidos e inválidos. |
| RNF-03 | Guardar senhas sem usar texto simples. | Inspecionar o armazenamento quando houver autenticação. |
| RNF-04 | Restringir operações conforme o perfil do usuário. | Verificar permissões quando houver autenticação. |
| RNF-05 | Preservar saldo e histórico quando a operação for rejeitada. | Comparar os dados antes e depois da rejeição. |
| RNF-06 | Manter os registros após reiniciar a aplicação. | Reiniciar e consultar novamente. |
| RNF-07 | Identificar campos e botões com rótulos de texto. | Inspecionar os controles da interface. |
| RNF-08 | Separar interface, regras de estoque e persistência. | Conferir a organização do código. |

Os [testes](../testes/plano-de-testes.md) detalham a verificação dos requisitos cobertos. O [relatório](../testes/resultados-sprint-07.md) registra a medição local da API.

## Regras de negócio

| ID | Regra | Requisito |
|---|---|---|
| RN-01 | Cada produto tem um código único. | RF-01 |
| RN-02 | A quantidade de uma movimentação é um inteiro maior que zero. | RF-03 e RF-04 |
| RN-03 | Entradas aumentam o saldo e saídas reduzem o saldo. | RF-03 e RF-04 |
| RN-04 | A saída é rejeitada se a quantidade superar o saldo. | RF-04 |
| RN-05 | Movimentações concluídas permanecem no histórico. Ajustes ficam para uma evolução futura. | RF-05 |
| RN-06 | Cada usuário poderá realizar apenas as ações permitidas para seu perfil. | RF-06 |
| RN-07 | O estoque mínimo é opcional e, quando informado, é um inteiro maior ou igual a zero. | RF-07 |
| RN-08 | Um produto está com estoque baixo quando tem mínimo configurado e o saldo é igual ou menor que ele. Produtos sem mínimo não entram no indicador. | RF-08 |

## Histórias de usuário e critérios de aceitação

| História | Necessidade | Critérios | Requisitos |
|---|---|---|---|
| US-01 · #1 | O supervisor precisa incluir produtos no estoque. | Um cadastro válido aparece na consulta. Códigos repetidos são rejeitados. | RF-01, RNF-02, RNF-06 |
| US-02 · #2 | Supervisor e auxiliar precisam conferir a disponibilidade. | A lista mostra os produtos e seus saldos. Se estiver vazia, a tela informa que não há produtos. | RF-02, RNF-01, RNF-06 |
| US-03 · #3 | Supervisor e auxiliar precisam registrar recebimentos. | Uma entrada de 5 sobre um saldo de 10 resulta em 15. Quantidade inválida não altera o saldo. | RF-03, RNF-05 |
| US-04 · #4 | Supervisor e auxiliar precisam registrar retiradas. | Uma saída de 3 sobre um saldo de 10 resulta em 7. Uma saída acima do saldo é rejeitada. | RF-04, RNF-05 |
| US-05 · #5 | Supervisor e auxiliar precisam conferir as mudanças no estoque. | O histórico mostra entradas e saídas com produto, tipo e quantidade. | RF-05 |
| US-06 · #14 | O supervisor precisa definir um limite de reposição por produto. | O mínimo aceita apenas inteiros ≥ 0, pode ser removido e permanece após reiniciar. | RF-07, RNF-02, RNF-06 |
| US-07 · #15 | Supervisor e auxiliar precisam identificar itens a repor. | Produtos com saldo igual ou abaixo do mínimo aparecem como "Estoque baixo". Produtos acima do mínimo não recebem o alerta. | RF-08 |
| US-13 · #20 | O supervisor precisa de uma visão resumida do estoque. | A Visão geral mostra total de produtos, unidades, itens sem saldo e itens com estoque baixo quando há limite configurado. | RF-02, RF-08 |

## Fora do escopo atual

Importação automática de movimentações, visualização 3D da localização dos produtos e controle de acesso por perfil.

## Evolução dos requisitos

| Sprint | Alteração | Issues |
|---|---|---|
| 2 | Definição inicial de requisitos e cadastro de produtos. | #25 |
| 3 | Registro de entradas e histórico inicial. | #3 |
| 4 | Saídas com validação de saldo e histórico completo. | #4, #5, #29 |
| 5 | Pesquisa, interface e gravação conjunta de saldo e histórico. | #16, #30, #31 |
| 6 | API Flask e persistência em SQLite. | #22, #23, #24, #33 |
| 7 | Cobertura dos fluxos e correção no total de unidades. | #34, #35 |
| 8 | Estoque mínimo, alerta e indicador de estoque baixo. | #14, #15, #20 |
