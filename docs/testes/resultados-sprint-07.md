# Resultados dos testes — Sprint 7

**Execução:** 15/11/2026. Windows, Python 3.12.14, Flask 3.1.3, Node.js 24.21.0, Playwright Core 1.65.0 e Chrome 157.0.8103.51.

| Suíte | Resultado final | Evidência |
|---|---|---|
| Python | 9 testes passaram, 0 falhas | `Ran 9 tests in 0.392s` e `OK`. Abrange CT-01 a CT-06 e verificações complementares da interface estática e do povoamento. |
| Chrome | 2 testes passaram, 0 falhas | CT-07 a CT-09 passaram juntos. CT-10 passou em um teste separado. A suíte incluiu larguras de 1280 e 375 px. |

## Latência local com até 1.000 produtos

| Operação | Tempo observado | Limite |
|---|---:|---:|
| Cadastro | 0,006 s | 5 s |
| Entrada | 0,006 s | 5 s |
| Saída | 0,006 s | 5 s |
| Consulta | 0,003 s | 5 s |

Medição de uma execução com o cliente de testes do Flask e banco temporário. Esses valores não são uma estimativa de latência em produção.

## Defeito encontrado e reteste

O CT-10 encontrou um erro de arredondamento. Para dois saldos válidos, o indicador mostrava **9.007.199.254.740.992** em vez de **9.007.199.254.740.993**. O indicador soma as unidades com `BigInt`. O CT-10 e o fluxo principal passaram no reteste. [Issue #34](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/issues/34)

Reprodução e comandos no [plano de testes](plano-de-testes.md). A execução foi técnica e local. A avaliação de usabilidade com participantes fica para a validação final.
