# Plano de testes — Sprint 7

## Objetivo e escopo

Os testes cobrem cadastro, consulta e movimentações no SQLite, na API e no Chrome. As suítes usam um banco temporário. Controle de acesso e validação com usuários ficam fora desta etapa.

## Casos e rastreabilidade

| Caso | Requisitos | Pré-condição e dados | Passos | Resultado esperado |
|---|---|---|---|---|
| CT-01 | RF-01, RF-02 | Estoque vazio | Cadastrar, consultar e repetir um código | Um cadastro aceito e o código repetido rejeitado. |
| CT-02 | RF-03 a RF-05, RNF-06 | Produto com saldo 10 | Registrar entrada de 5, saída de 3 e reiniciar | Saldo 12 e duas movimentações no histórico. |
| CT-03 | RNF-02, RNF-05 | Produto cadastrado | Enviar dados inválidos e tentar retirar acima do saldo | Operações rejeitadas. Saldo e histórico preservados. |
| CT-04 | RNF-05 | Falha simulada na gravação do histórico | Registrar uma saída | Saldo e histórico preservados. |
| CT-05 | RNF-05 | Produto com saldo 10 | Registrar duas saídas simultâneas de 7 | Só uma saída é aceita. O saldo fica em 3. |
| CT-06 | RNF-01 | Base com 999 produtos | Cadastrar o milésimo produto, movimentar e consultar | Cada operação da API leva até 5 segundos. |
| CT-07 | RF-01, RF-02, RNF-02 | Estoque vazio | Navegar, cadastrar, repetir código e pesquisar | A duplicidade é informada e a busca mostra os produtos correspondentes. |
| CT-08 | RF-03 a RF-05, RNF-05, RNF-06 | Produtos com e sem saldo | Registrar entrada e saída válidas, tentar uma saída acima do saldo e recarregar | Saldo, histórico e indicadores refletem apenas as operações válidas. |
| CT-09 | RNF-02, RNF-07 | Tela estreita e falha simulada na consulta | Rolar a tabela pelo teclado e atualizar o estoque | A tabela permite rolagem e o aviso some quando a consulta volta a funcionar. |
| CT-10 | RF-02 | Produtos com saldos muito altos | Abrir a Visão geral | O total de unidades mantém a precisão. |

## Aprovação e execução

O aceite exige que os testes passem e que a API local cumpra o limite do CT-06. [Resultados da Sprint 7](resultados-sprint-07.md)

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

Os dados e passos completos estão nos testes da [API](../../tests/test_api.py), do [SQLite](../../tests/test_inventory.py) e do [Chrome](../../tests/test_browser.cjs).
