# Evidência de execução — Sprint 3

**Data:** 29/09/2026  
**Fluxo verificado:** cadastro de produto e registro de entrada.

## Procedimento

1. Abrir `src/index.html` no navegador.
2. Cadastrar o produto `PROD-001` com quantidade inicial 10.
3. Selecionar o produto na seção de entrada.
4. Registrar uma entrada de 5 unidades.
5. Atualizar a página.

## Resultado esperado

- O saldo do produto passa de 10 para 15.
- O histórico apresenta uma entrada de 5 unidades.
- O produto e a movimentação permanecem disponíveis após atualizar a página.
- Uma quantidade igual ou inferior a zero é rejeitada sem alterar os dados.

## Resultado observado

O fluxo foi executado no navegador em 29/09/2026. O produto `PROD-001` passou de 10 para 15 unidades após uma entrada de 5 unidades, e a movimentação apareceu no histórico. Uma tentativa com quantidade zero foi rejeitada sem alterar o saldo ou criar outra movimentação. Após recarregar a página, o saldo 15 e a entrada registrada permaneceram disponíveis.
