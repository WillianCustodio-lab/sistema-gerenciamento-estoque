# Plano de testes — Sprint 7

## Objetivo e escopo

Verificar os fluxos de cadastro, consulta e movimentação e os riscos de perda de dados, saldo incorreto e regressão na interface. A suíte usa testes de persistência com SQLite, integração HTTP com Flask e testes de ponta a ponta no Chrome. Cada suíte usa banco temporário. Controle de acesso (RF-06 e RNF-03/04) e aceite com usuários ficam fora desta execução.

## Casos e rastreabilidade

| Caso | Requisitos | Pré-condição e dados | Passos | Resultado esperado |
|---|---|---|---|---|
| CT-01 | RF-01, RF-02 | Base vazia, CX1 com 10 unidades | Cadastrar CX1, consultar e tentar repetir o código | Primeiro cadastro aceito, conflito 409 na repetição e apenas um produto listado. |
| CT-02 | RF-03 a RF-05, RNF-06 | CX1 com saldo 10 | Registrar entrada 5, saída 3 e recriar o aplicativo usando o mesmo arquivo | Saldo 12 e histórico com as duas movimentações em ordem da mais recente. |
| CT-03 | RNF-02, RNF-05 | Produto com saldo 1 | Enviar cadastro inválido, saída de 2, tipo inválido e código inexistente | Respostas 400, 409, 400 e 404, respectivamente. Saldo e histórico preservados. |
| CT-04 | RNF-05 | Caixa com saldo 10 e falha simulada no INSERT do histórico | Registrar saída de 3 | A transação é revertida. Saldo 10 e histórico vazio. |
| CT-05 | RNF-05 | Caixa com saldo 10 | Disparar duas saídas simultâneas de 7 | Uma saída aceita, outra rejeitada. Saldo 3 e um evento no histórico. |
| CT-06 | RNF-01 | Base preparada com 999 produtos | Cadastrar o milésimo produto, registrar entrada e saída e consultar o estoque | Cada chamada da API leva até 5 s. A consulta retorna 1.000 produtos, saldo 12 no último e dois movimentos. |
| CT-07 | RF-01, RF-02, RNF-02 | Estoque vazio, Caixa plástica com 10 e Papel com 0 | Navegar, cadastrar, repetir código e pesquisar por nome ou código | Navegação sem recarga, duplicidade informada e somente os resultados correspondentes exibidos. |
| CT-08 | RF-03 a RF-05, RNF-05, RNF-06 | Caixa com 10 e Papel com 0 | Registrar entrada 5, saída 3 e tentativa de saída 13. Recarregar e abrir outro contexto do navegador | Saldo 12, duas operações persistidas e indicadores 2 produtos, 12 unidades e 1 sem estoque. |
| CT-09 | RNF-02, RNF-07 | Dados do CT-08, tela de 375 px | Navegar por rótulos dos controles, rolar a tabela pelo teclado, simular falha de consulta e atualizar o estoque | A tabela rola sem alargar a página. A mensagem aparece após falha e desaparece ao recuperar a consulta. Evidência parcial de acessibilidade. |
| CT-10 | RF-02 | Resposta simulada com saldos 9.007.199.254.740.991 e 2 | Abrir a Visão geral | Total de unidades exato, 9.007.199.254.740.993. |

## Aprovação e execução

O incremento passa quando as verificações automatizadas terminam sem falhas, cada operação medida no CT-06 respeita o limite de 5 s e o defeito #34 passa no reteste. A medição da latência cobre a API local e não mede a rede nem a renderização. Consulte os [resultados registrados](resultados-sprint-07.md).

Prepare o Python pelo [guia da aplicação](../../src/README.md). A partir da raiz no PowerShell, execute:

```powershell
.\.venv\Scripts\python -m unittest discover -s tests -v
```

Para o navegador, instale Node.js (22 ou superior) e Google Chrome. A dependência abaixo é usada somente para testar.

```powershell
npm install --no-save --no-package-lock playwright-core@1.65.0
$env:TEST_PYTHON = (Resolve-Path .\.venv\Scripts\python.exe).Path
node --test tests/test_browser.cjs
```

O teste inicia um Flask local em porta disponível. `TEST_CHROME` permite apontar para um executável do Chrome fora do caminho padrão. Código: [suíte API](../../tests/test_api.py), [suíte SQLite](../../tests/test_inventory.py) e [suíte Chrome](../../tests/test_browser.cjs).
