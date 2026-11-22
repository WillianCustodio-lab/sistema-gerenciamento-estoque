# Validação com usuários — Sprint 8

**Situação:** roteiro pronto, sessões **a realizar**. Preencha as tabelas de resultado depois de cada sessão. Não registre resultados que não foram observados.

## Objetivo

Verificar se pessoas que cuidam de estoque conseguem usar o sistema sem ajuda e se os resultados atendem às histórias US-01 a US-07 e US-13.

## Participantes

Pelo menos três pessoas que não participaram do desenvolvimento. Se possível, inclua alguém que trabalhe ou já tenha trabalhado com almoxarifado, estoque ou loja. Registre só o perfil, nunca o nome.

| ID | Perfil (função, experiência com estoque) | Data | Dispositivo e navegador | Moderador |
|---|---|---|---|---|
| P1 | | | | |
| P2 | | | | |
| P3 | | | | |

## Preparação

1. Na versão que será entregue, crie um banco novo e insira os dados de demonstração (ver o [guia da aplicação](../../src/README.md)).
2. Inicie o servidor com `flask --app src.backend.app run` e abra `http://127.0.0.1:5000`.
3. Explique ao participante que o sistema está sendo avaliado, não ele, e peça que pense em voz alta.
4. Não indique onde clicar. Ajude só se ele ficar travado por mais de 2 minutos e registre a ajuda.

## Tarefas

| T | Tarefa lida para o participante | Requisitos | Sucesso quando |
|---|---|---|---|
| T1 | "Chegou um produto novo: Grampeador, código GR-01, 15 unidades. Cadastre-o." | RF-01 | O produto aparece na lista com saldo 15. |
| T2 | "Tente cadastrar outro produto com o código GR-01." | RF-01, RNF-02 | O participante percebe o aviso de código repetido. |
| T3 | "Quantas fitas de embalagem existem no estoque?" | RF-02 | Responde 8, usando a lista ou a pesquisa. |
| T4 | "Chegaram 5 caixas organizadoras. Registre a entrada." | RF-03 | O saldo da DEMO-01 passa de 12 para 17. |
| T5 | "Retiraram 20 grampeadores. Registre a saída." | RF-04, RN-04 | Percebe que a saída foi recusada por saldo insuficiente. |
| T6 | "Quais movimentações foram feitas hoje?" | RF-05 | Encontra o histórico e cita a entrada da T4. |
| T7 | "O grampeador deve ser reposto quando chegar a 20 unidades. Configure isso." | RF-07 | O mínimo de GR-01 fica em 20. |
| T8 | "Quais produtos precisam de reposição?" | RF-08 | Cita a fita de embalagem e o grampeador, pelo indicador ou pela lista. |

## Registro por tarefa

Use **S** (concluiu sozinho), **A** (concluiu com ajuda) ou **N** (não concluiu).

| T | P1 | P2 | P3 | Observações (dúvidas, erros, falas) |
|---|---|---|---|---|
| T1 | | | | |
| T2 | | | | |
| T3 | | | | |
| T4 | | | | |
| T5 | | | | |
| T6 | | | | |
| T7 | | | | |
| T8 | | | | |

## Perguntas finais

1. De 1 (muito difícil) a 5 (muito fácil), qual foi a dificuldade de usar o sistema?
2. Algo deixou você em dúvida ou foi diferente do que esperava?
3. O que faltou para usar o sistema no dia a dia?

| Participante | Nota | Respostas |
|---|---|---|
| P1 | | |
| P2 | | |
| P3 | | |

## Resultado e ações

**Critério de aceite:** cada tarefa concluída sozinho (S) por pelo menos 2 dos 3 participantes.

| Problema observado | Participantes | Gravidade (alta, média, baixa) | Ação (issue ou ajuste) | Situação |
|---|---|---|---|---|
| | | | | |
