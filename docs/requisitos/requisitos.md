# Requisitos da aplicação

> **Artefato central da Sprint 2.** Este documento descreve o comportamento e as condições que o Sistema de Gerenciamento de Estoque deverá atender.

## 1. Método de levantamento

Os requisitos foram identificados a partir de uma pesquisa sobre as principais dores operacionais da gestão de estoque. Os resultados serviram de base para uma discussão entre os integrantes do grupo, que analisaram o problema e definiram as necessidades do sistema.

## 2. Atores e perfis

| Ator/perfil | Objetivo no sistema | Permissões ou limitações principais |
|---|---|---|
| Administrador | Controlar o acesso dos usuários. | Gerencia usuários e atribui perfis de acesso. |
| Supervisor de estoque | Organizar os produtos e acompanhar o estoque. | Cadastra produtos, consulta o estoque, registra movimentações e realiza ajustes. |
| Auxiliar de almoxarifado | Executar as operações rotineiras do estoque. | Consulta produtos e registra entradas e saídas, sem alterar cadastros ou movimentações concluídas. |

## 3. Requisitos funcionais

| ID | Nome | Descrição verificável | Prioridade | História/Issue | Situação final |
|---|---|---|---|---|---|
| `RF-01` | Cadastrar produtos | O sistema deve permitir que o supervisor cadastre um produto com informações válidas. | Alta | `US-01 / #1` | Implementado inicialmente |
| `RF-02` | Consultar produtos | O sistema deve permitir que o supervisor e o auxiliar consultem os produtos cadastrados e suas quantidades. | Alta | `US-02 / #2` | Implementado inicialmente |
| `RF-03` | Registrar entradas | O sistema deve permitir que o supervisor e o auxiliar registrem a entrada manual de produtos. | Alta | `US-03 / #3` | Planejado |
| `RF-04` | Registrar saídas | O sistema deve permitir que o supervisor e o auxiliar registrem a saída manual de produtos. | Alta | `US-04 / #4` | Planejado |
| `RF-05` | Consultar movimentações | O sistema deve permitir que o supervisor e o auxiliar consultem as entradas e saídas registradas. | Alta | `US-05 / #5` | Planejado |
| `RF-06` | Controlar usuários | O sistema deve permitir que o administrador gerencie usuários e atribua perfis de acesso. | Alta | Não vinculada | Planejado |

## 4. Requisitos não funcionais

| ID | Categoria | Descrição verificável | Como será avaliado | Issue |
|---|---|---|---|---|
| `RNF-01` | Desempenho | As operações devem responder em até 5 segundos em uma base com até 1.000 produtos. | Medição do tempo de resposta durante os testes. | Não vinculada |
| `RNF-02` | Usabilidade | Os formulários devem indicar dados inválidos e informar o resultado das operações. | Testes com preenchimentos válidos e inválidos. | Não vinculada |
| `RNF-03` | Segurança | As senhas não devem ser armazenadas em texto simples. | Inspeção do armazenamento das credenciais. | Não vinculada |
| `RNF-04` | Controle de acesso | O sistema deve impedir ações não permitidas para o perfil do usuário. | Testes de acesso com os três perfis. | Não vinculada |
| `RNF-05` | Integridade | Uma operação rejeitada não deve alterar o saldo nem o histórico. | Comparação dos dados antes e depois de uma operação inválida. | Não vinculada |
| `RNF-06` | Persistência | Os dados confirmados devem permanecer disponíveis após a aplicação ser reiniciada. | Reinicialização da aplicação e nova consulta dos dados. | Não vinculada |
| `RNF-07` | Acessibilidade | Campos e botões devem possuir identificação textual e rótulos associados. | Inspeção dos componentes da interface. | Não vinculada |
| `RNF-08` | Manutenibilidade | O código deve separar interface, regras da aplicação e persistência. | Revisão da organização do código. | Não vinculada |

## 5. Regras de negócio

| ID | Regra | Origem/justificativa | Requisitos afetados |
|---|---|---|---|
| `RN-01` | Cada produto deve possuir um código único. | Evitar cadastros duplicados. | `RF-01` |
| `RN-02` | Uma movimentação deve possuir quantidade inteira maior que zero. | Evitar alterações inválidas no estoque. | `RF-03`, `RF-04` |
| `RN-03` | Uma entrada aumenta o saldo e uma saída reduz o saldo do produto. | Manter a quantidade disponível atualizada. | `RF-03`, `RF-04` |
| `RN-04` | Uma saída superior ao saldo disponível deve ser rejeitada. | Impedir saldo negativo. | `RF-04` |
| `RN-05` | Movimentações concluídas devem permanecer no histórico; correções devem gerar um ajuste. | Preservar o registro das alterações do estoque. | `RF-05` |
| `RN-06` | Cada usuário deve executar somente as ações permitidas para seu perfil. | Separar as responsabilidades dos atores. | `RF-06` |

## 6. Histórias de usuário e critérios de aceitação

### US-01 — Cadastrar produtos

Como **supervisor de estoque**, quero **cadastrar produtos**, para **incluí-los no controle do estoque**.

**Requisitos relacionados:** `RF-01`, `RNF-02`, `RNF-06`

**Critérios de aceitação:**

1. **Dado que** as informações são válidas, **quando** o supervisor confirmar o cadastro, **então** o produto deverá ser registrado e apresentado na consulta.
2. **Dado que** o código informado já está em uso, **quando** o supervisor tentar cadastrar o produto, **então** o sistema deverá rejeitar a operação.

**Issue:** `#1`

### US-02 — Consultar produtos

Como **supervisor ou auxiliar**, quero **consultar produtos e quantidades**, para **verificar a disponibilidade no estoque**.

**Requisitos relacionados:** `RF-02`, `RNF-01`, `RNF-06`

**Critérios de aceitação:**

1. **Dado que** existem produtos cadastrados, **quando** o usuário abrir a consulta, **então** os produtos e suas quantidades deverão ser apresentados.
2. **Dado que** não existem produtos cadastrados, **quando** o usuário abrir a consulta, **então** o sistema deverá informar que não há produtos.

**Issue:** `#2`

### US-03 — Registrar entradas

Como **supervisor ou auxiliar**, quero **registrar entradas**, para **atualizar o estoque após o recebimento de produtos**.

**Requisitos relacionados:** `RF-03`, `RNF-05`

**Critérios de aceitação:**

1. **Dado que** um produto possui saldo 10, **quando** o usuário registrar uma entrada de 5, **então** o saldo deverá ser atualizado para 15.
2. **Dado que** a quantidade é inválida, **quando** o usuário tentar registrar a entrada, **então** a operação deverá ser rejeitada sem alterar o saldo.

**Issue:** `#3`

### US-04 — Registrar saídas

Como **supervisor ou auxiliar**, quero **registrar saídas**, para **atualizar o estoque após a retirada de produtos**.

**Requisitos relacionados:** `RF-04`, `RNF-05`

**Critérios de aceitação:**

1. **Dado que** um produto possui saldo 10, **quando** o usuário registrar uma saída de 3, **então** o saldo deverá ser atualizado para 7.
2. **Dado que** a quantidade solicitada supera o saldo, **quando** o usuário tentar registrar a saída, **então** a operação deverá ser rejeitada.

**Issue:** `#4`

### US-05 — Consultar movimentações

Como **supervisor ou auxiliar**, quero **consultar as movimentações**, para **conferir as alterações realizadas no estoque**.

**Requisitos relacionados:** `RF-05`

**Critérios de aceitação:**

1. **Dado que** existem entradas e saídas registradas, **quando** o usuário abrir a consulta, **então** as movimentações deverão ser apresentadas.
2. **Dado que** uma movimentação foi registrada, **quando** ela for consultada, **então** deverá ser possível identificar o produto, o tipo e a quantidade.

**Issue:** `#5`

## 7. Fora do escopo

| Item | Motivo | Possível trabalho futuro |
|---|---|---|
| Importação automática de movimentações | As entradas e saídas serão registradas manualmente na aplicação. | Integração com outros sistemas. |
| Representação tridimensional do estoque | Não faz parte das funcionalidades iniciais definidas para o produto. | Visualização da localização dos produtos em 3D. |

## 8. Histórico de alterações

| Sprint | Requisito alterado | Alteração | Motivo | Issue/commit |
|---|---|---|---|---|
| Sprint 2 | `RF-01` a `RF-06` | Primeira definição dos requisitos da aplicação. | Transformar a visão inicial em comportamento verificável. | `#25` |
