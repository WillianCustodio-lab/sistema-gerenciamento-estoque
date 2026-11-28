# Resultados dos testes — Sprint 8

**Execução local:** 21/11/2026. Windows 11, Python 3.11.9, Node.js 22.11.0, `playwright-core` 1.65.0 e Google Chrome.

- **Python:** 12 testes passaram, sendo 3 novos para o estoque mínimo (CT-11 na API e CT-12).
- **Chrome:** 3 testes passaram, incluindo o novo CT-11.
- **Desempenho (CT-06):** na base com 1.000 produtos, cadastro, entrada, saída e consulta levaram cerca de 0,005 s cada, abaixo do limite de 5 segundos.

## Defeito encontrado e corrigido

Na primeira execução do CT-09, a página ficou com 585 px de largura em uma tela de 375 px. O texto oculto do cabeçalho "Ações", na nova coluna da tabela de produtos, escapava da área com rolagem. A tabela passou a ser a referência de posicionamento (`.table-wrap { position: relative; }`), e o reteste passou.

A [validação com usuários](validacao-usuarios.md) atendeu ao critério de aceite com três participantes.

Os casos e comandos estão no [plano de testes](plano-de-testes.md).

**Revisão visual — 28/11/2026:** 12 testes Python e 4 testes no Chrome passaram após a atualização da interface, incluindo a lista de reposição e a recuperação da consulta.
