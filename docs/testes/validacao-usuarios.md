# Validação com usuários — Sprint 8

**Situação:** concluída em 21/11/2026. Três sessões presenciais, moderadas por Juliano Goulart. Os resultados abaixo foram observados nas sessões.

## Objetivo

Verificar se pessoas que cuidam de estoque conseguem usar o sistema sem ajuda e se os resultados atendem às histórias US-01 a US-07 e US-13.

## Participantes

Pelo menos três pessoas que não participaram do desenvolvimento. Se possível, inclua alguém que trabalhe ou já tenha trabalhado com almoxarifado, estoque ou loja. Registre só o perfil, nunca o nome.

| ID | Perfil (função, experiência com estoque) | Data | Dispositivo e navegador | Moderador |
|---|---|---|---|---|
| P1 | Corretor (experiência básica) | 21/11/2026 | PC com Windows 11, Chrome | Juliano Goulart |
| P2 | Arquiteta e urbanista (trabalha em loja, experiente com esse tipo de sistema) | 21/11/2026 | PC com Windows 11, Chrome | Juliano Goulart |
| P3 | Técnica de enfermagem (aplica vacinas e lida com sistemas de estoque todos os dias) | 21/11/2026 | PC com Windows 11, Chrome | Juliano Goulart |

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
| T1 | S | S | S | |
| T2 | S | S | S | |
| T3 | S | S | S | |
| T4 | S | S | S | |
| T5 | S | S | S | |
| T6 | S | S | S | |
| T7 | A | S | S | P1 não entendeu que "Definir mínimo" servia para indicar quando o produto deve ser reposto. |
| T8 | S | S | S | |

## Perguntas finais

1. De 1 (muito difícil) a 5 (muito fácil), qual foi a dificuldade de usar o sistema?
2. Algo deixou você em dúvida ou foi diferente do que esperava?
3. O que faltou para usar o sistema no dia a dia?

| Participante | Nota | Respostas |
|---|---|---|
| P1 | 5 | Pergunta 3: uma interface mais bonita e chamativa. |
| P2 | 5 | Pergunta 2: nada; achou o sistema organizado. Provavelmente por já estar acostumada com sistemas parecidos. |
| P3 | 5 | Pergunta 3: nada; parece bastante com o sistema que usa no dia a dia, mas com aparência menos atraente. |

## Resultado e ações

**Critério de aceite:** cada tarefa concluída sozinho (S) por pelo menos 2 dos 3 participantes.

**Resultado:** critério atendido. Os três participantes concluíram sozinhos as tarefas T1 a T6 e T8. A T7 foi concluída sozinha por 2 dos 3 participantes, e P1 precisou de ajuda. Todos deram nota 5 para a facilidade de uso.

| Problema observado | Participantes | Gravidade (alta, média, baixa) | Ação (issue ou ajuste) | Situação |
|---|---|---|---|---|
| O nome "Definir mínimo" não deixou claro que o valor indica quando repor o produto. | P1 | Média | Avaliar um nome mais claro para a ação, como "Definir ponto de reposição", ou um texto de ajuda no diálogo. | Pendente |
| A aparência da interface foi considerada pouco atraente. | P1, P3 | Baixa | Revisar o visual da interface. | Pendente |
