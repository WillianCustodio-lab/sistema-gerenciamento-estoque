# Sprint 3 — Modelagem e rastreabilidade

- **Data de entrega:** 28/09/2026
- **Pontuação:** 2,5 pontos
- **Tag da entrega:** `sprint-03`

## 1. Pergunta que esta sprint deve responder

**Como a estrutura e o comportamento da aplicação representam os requisitos definidos?**

## 2. Objetivo e resultado da sprint

**Objetivo planejado:** modelar a estrutura e o fluxo de registro de entrada, relacionando requisitos, modelos e código.

**Resultado alcançado:** foram produzidos um modelo estrutural e um modelo comportamental. O fluxo de entrada foi implementado com validação, atualização do saldo, histórico e persistência local.

## 3. Checklist do artefato central — 0,75 ponto

**Entrega esperada:** `docs/modelagem/modelagem.md` e arquivos dos diagramas.

- [x] Modelo comportamental produzido e descrito.
- [x] Modelo estrutural produzido e descrito.
- [x] Elementos dos modelos relacionados aos requisitos.
- [x] Elementos dos modelos relacionados ao código.

### Artefatos

| Artefato | Referência | Resultado |
|---|---|---|
| Documento de modelagem | `docs/modelagem/modelagem.md` | Descrição dos modelos e matriz de rastreabilidade. |
| Diagrama de atividades | `docs/modelagem/imagens/fluxo-registro-entrada.svg` | Fluxo de validação e registro de uma entrada. |
| Modelo de domínio | `docs/modelagem/imagens/modelo-dominio.svg` | Relação entre produto e movimentação. |
| Evidência de execução | `docs/modelagem/evidencia-execucao.md` | Resultado da validação do incremento no navegador. |

## 4. Incremento da aplicação web — 0,75 ponto

Foi implementado o fluxo de `RF-03` e uma consulta parcial de `RF-05`. O usuário seleciona um produto, informa a quantidade recebida e registra a entrada. A aplicação atualiza o saldo, cria a movimentação e mantém os dados após a página ser recarregada.

### Como executar e verificar

1. Acesse a pasta `src` e abra `index.html` no navegador.
2. Cadastre um produto com quantidade inicial 10.
3. Registre uma entrada de 5 unidades.
4. Confirme o saldo 15 e a movimentação no histórico.
5. Recarregue a página e confirme a permanência dos dados.

| Requisito/Issue | Código | Evidência |
|---|---|---|
| `RF-03 / #3` | `src/index.html` e `src/js/app.js` | Entrada válida atualiza o saldo e gera uma movimentação. |
| `RF-05 / #5` | `src/index.html` e `src/js/app.js` | Entradas registradas são apresentadas no histórico. |
| `RNF-05 / #3` | `src/js/app.js` | Quantidade inválida é rejeitada sem alterar os dados. |

## 5. Scrum e gestão do trabalho — 0,50 ponto

### Sprint Backlog

| Issue | Descrição | Responsável | Critério de conclusão | Situação |
|---|---|---|---|---|
| `#26` | Elaborar os modelos da Sprint 3. | Grupo | Modelos estrutural e comportamental documentados. | Concluída |
| `#27` | Relacionar requisitos, modelos e código. | Grupo | Rastreabilidade registrada no documento de modelagem. | Concluída |
| `#3` | Registrar entradas de produtos. | Grupo | Entrada atualiza saldo e aparece no histórico. | Concluída |
| `#28` | Consolidar a entrega da Sprint 3. | Grupo | Documentação, evidência e tag publicadas. | Concluída |

### Acompanhamento

- **GitHub Project:** Projeto 1 — Sistema de Gerenciamento de Estoque.

## 6. GitHub, documentação e rastreabilidade — 0,50 ponto

| Tipo de evidência | Referência | O que comprova |
|---|---|---|
| Issues | `#26`, `#27`, `#28` | Planejamento e documentação da Sprint 3. |
| História | `#3` | Implementação do registro de entradas. |
| Commit | `9954757` | Modelagem e incremento da aplicação. |
| Tag | `sprint-03` | Versão entregue da Sprint 3. |

### Rastreabilidade resumida

| Requisito | Issue | Modelo | Código | Evidência |
|---|---|---|---|---|
| `RF-03` | `#3` | Fluxo de entrada e modelo de domínio | `src/index.html`, `src/js/app.js` | Saldo 10 atualizado para 15 após entrada de 5. |
| `RF-05` | `#5` | Entidade `Movimentação` | `src/index.html`, `src/js/app.js` | Entrada apresentada no histórico. |

## 7. Revisão do incremento

- **Demonstrado:** modelos da aplicação e fluxo de registro de entrada.
- **Critérios atendidos:** atualização do saldo, criação do histórico, bloqueio de quantidade inválida e persistência após recarregar.
- **Próximo fluxo:** registro de saída de produtos.

## 8. Retrospectiva e próxima sprint

- **Funcionou bem:** o modelo comportamental orientou a implementação e a validação do fluxo.
- **Ação para a próxima sprint:** implementar a saída de produtos e ampliar a consulta de movimentações.
