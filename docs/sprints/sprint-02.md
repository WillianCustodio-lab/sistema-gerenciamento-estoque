# Sprint 2 — Requisitos e escopo validável da solução

- **Data de entrega:** 14/09/2026
- **Pontuação:** 2,5 pontos

## 1. Pergunta que esta sprint deve responder

**O que o sistema deverá fazer e quais condições verificáveis deverá atender?**

## 2. Objetivo e resultado da sprint

**Objetivo planejado:** Definir os requisitos da aplicação, seus atores, regras de negócio, histórias de usuário, critérios de aceitação e itens fora do escopo.

**Resultado efetivamente alcançado:** Os requisitos foram documentados e relacionados às funcionalidades principais. Também foi concluído o fluxo web inicial de cadastro e consulta de produtos.

## 3. Checklist do artefato central — 0,75 ponto

**Entrega esperada:** `docs/requisitos/requisitos.md`, histórias de usuário, critérios de aceitação, escopo excluído e backlog refinado.

- [x] Atores e perfis identificados.
- [x] Requisitos funcionais identificados e priorizados.
- [x] Requisitos não funcionais verificáveis.
- [x] Histórias de usuário vinculadas aos requisitos.
- [x] Critérios de aceitação registrados.

### Links dos artefatos

| Artefato criado/atualizado | Referência | O que mudou |
|---|---|---|
| Requisitos da aplicação | `docs/requisitos/requisitos.md` | Definição dos requisitos, atores, regras, histórias, critérios e escopo. |
| Aplicação web inicial | `src/` | Implementação do cadastro e da consulta de produtos. |

## 4. Incremento da aplicação web — 0,75 ponto

Foi implementado um fluxo inicial relacionado a `RF-01` e `RF-02`. O usuário pode cadastrar um produto, consultar os produtos cadastrados e manter os dados no navegador após atualizar a página.

### Como executar e verificar

1. Acesse a pasta `src`.
2. Abra `index.html` em um navegador.
3. Preencha o formulário e selecione **Cadastrar produto**.
4. Confirme que o produto aparece na lista.

| Requisito/Issue | Código ou protótipo | Evidência de execução |
|---|---|---|
| `RF-01 / #1` | `src/index.html` e `src/js/app.js` | Cadastro válido, bloqueio de código duplicado e exibição do produto. |
| `RF-02 / #2` | `src/index.html` e `src/js/app.js` | Consulta dos produtos e das quantidades cadastradas. |
| `#10` | `src/` e `src/README.md` | Fluxo executado e verificado no navegador. |

## 5. Scrum e gestão do trabalho — 0,50 ponto

### Sprint Backlog

| Issue | Descrição | Responsável | Critério de aceitação/conclusão | Situação |
|---|---|---|---|---|
| `#25` | Estruturar os requisitos da Sprint 2. | Grupo | Documento de requisitos completo e publicado. | Concluída |
| `#10` | Criar a estrutura web inicial. | Grupo | Cadastro, consulta e persistência local funcionando. | Concluída |

### Acompanhamento

- **GitHub Project:** https://github.com/users/WillianCustodio-lab/projects/1

## 6. GitHub, documentação e rastreabilidade — 0,50 ponto

| Tipo de evidência | Referência | O que comprova |
|---|---|---|
| Issue | `#25` | Elaboração e conclusão do documento de requisitos. |
| Issue | `#10` | Implementação e verificação do fluxo inicial. |
| Commit | `7af7102` | Inclusão do documento de requisitos. |
| Commit | `64d2258` | Implementação do cadastro e da consulta de produtos. |
| Código/arquivo | `docs/requisitos/requisitos.md` | Artefato central da Sprint 2. |
| Código/arquivo | `src/` | Incremento executável da aplicação web. |

### Rastreabilidade resumida

| Requisito | Issue | Artefato | Código | Evidência |
|---|---|---|---|---|
| `RF-01` | `#1` | `docs/requisitos/requisitos.md` | `src/index.html`, `src/js/app.js` | `#10`, commit `64d2258` |
| `RF-02` | `#2` | `docs/requisitos/requisitos.md` | `src/index.html`, `src/js/app.js` | `#10`, commit `64d2258` |

## 7. Revisão do incremento

- **O que foi demonstrado:** documento de requisitos e fluxo de cadastro e consulta de produtos.
- **Critérios atendidos:** cadastro válido, rejeição de código duplicado, consulta dos produtos e permanência dos dados após atualizar a página.
- **Itens não concluídos:** os demais fluxos permanecem planejados para sprints posteriores.

## 8. Retrospectiva e próxima sprint

- **Funcionou bem:** relação entre requisitos, Issues e o fluxo implementado.
- **Ação concreta para a próxima sprint:** modelar a estrutura e o comportamento dos fluxos definidos nos requisitos.
