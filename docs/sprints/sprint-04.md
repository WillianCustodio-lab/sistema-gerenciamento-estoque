# Sprint 4 — Princípios de projeto e decisões locais

- **Entrega prevista no regulamento:** 13/10/2026
- **Recuperação concluída em:** 10/11/2026
- **Tag:** `sprint-04`

## Objetivo e resultado

**Objetivo:** separar regras, persistência e interface, registrando as decisões técnicas e evoluindo o fluxo de movimentações.

**Resultado:** o código foi dividido em três módulos, a saída de produtos foi implementada com validação de saldo e o histórico passou a apresentar entradas e saídas.

## Artefato central

- [x] Responsabilidades locais identificadas.
- [x] Três decisões com alternativas e consequências registradas.
- [x] Código afetado relacionado às decisões.
- [x] Comparação entre a estrutura anterior e a atual.
- [x] Backlog atualizado.

| Artefato | Referência | Resultado |
|---|---|---|
| Decisões de projeto | `docs/projeto/decisoes-de-projeto.md` | Justificativas e consequências da refatoração. |
| Aplicação | `src/` | Separação de responsabilidades e registro de saídas. |
| Backlog | `docs/backlog-produto.md` | Sprint corrente, estados e prioridades do MVP. |

## Incremento e execução

O incremento atende `RF-04` e completa o fluxo inicial de `RF-05`. Para verificar:

1. Abra `src/index.html` em um navegador atual.
2. Cadastre um produto com quantidade inicial 10.
3. Registre uma entrada de 5 e confirme o saldo 15.
4. Registre uma saída de 3 e confirme o saldo 12.
5. Tente retirar 13 unidades e confirme a rejeição sem alteração do saldo.
6. Verifique as duas movimentações no histórico.

| Requisito/Issue | Código | Evidência |
|---|---|---|
| `RF-01 / #1` | `inventory.js`, `app.js` | Cadastro e código duplicado continuam validados. |
| `RF-03 / #3` | `InventoryService.registerEntry` | Entrada 5 sobre saldo 10 resulta em 15. |
| `RF-04 / #4` | `InventoryService.registerExit` | Saída 3 resulta em 12; saída 13 é rejeitada. |
| `RF-05 / #5` | `app.js` | Histórico recebe os tipos Entrada e Saída. |
| `RNF-08 / #29` | `src/js/` | Domínio, persistência e interface separados. |

## Sprint Backlog

| Issue | Item | Responsável registrado | Critério de conclusão | Situação |
|---|---|---|---|---|
| `#29` | Refatorar responsabilidades e registrar decisões. | Grupo | Módulos separados e decisões documentadas. | Concluído |
| `#4` | Registrar saídas de produtos. | Grupo | Saída válida reduz saldo; saldo insuficiente é rejeitado. | Concluído |
| `#5` | Consultar movimentações. | Grupo | Entradas e saídas aparecem no histórico. | Concluído |

A distribuição individual não foi informada nesta recuperação; por isso, o documento não atribui atividades específicas a integrantes.

## Verificações realizadas

- Sintaxe verificada nos três arquivos JavaScript.
- Fluxo de regras executado com produto de saldo 10: entrada 5, saída 3 e saldo final 12.
- Tentativa de saída 13 rejeitada, sem alteração do saldo ou do histórico.
- Ordem do histórico verificada como Saída seguida de Entrada.
- Estrutura do HTML conferida com os campos usados por `app.js`.

O ambiente de automação não permitiu abrir a prévia local no navegador. A validação visual manual pelo grupo permanece recomendada antes da apresentação. O uso de Node ocorreu somente como ferramenta local de verificação de JavaScript; ele não é dependência da aplicação.

## Rastreabilidade

| Elemento | Referência |
|---|---|
| Refatoração | Commit `f07549c` e Issue `#29` |
| Saídas e histórico | Commit `f9650b6`, Issues `#4` e `#5` |
| Documentação | `docs/projeto/decisoes-de-projeto.md` e este arquivo |
| Entrega | Tag `sprint-04` |

## Revisão e pendências

**Atendido:** separação de responsabilidades, entrada, saída, histórico e validação de saldo.

**Dificuldade:** a cópia local disponível não possuía o diretório `.git`; a publicação será feita sobre a versão confirmada no GitHub, preservando o histórico remoto.

**Pendências:** validação visual manual pelo grupo e substituição futura do armazenamento local por Flask e SQLite.

## Colaboração e apoio de IA

Nenhuma reunião da Sprint 4 foi informada ou registrada nesta recuperação. As decisões partiram dos requisitos e do código já publicados. Houve apoio de IA na análise, refatoração, verificação e redação; a aprovação dos commits e a revisão acadêmica final são humanas.

## Próxima sprint

Na Sprint 5, o grupo deve aplicar um padrão somente se ele resolver um problema concreto da estrutura atual. A opção mais provável é formalizar o repositório de persistência, preparando a troca entre `localStorage` e a futura API, sem aumentar o escopo funcional.
