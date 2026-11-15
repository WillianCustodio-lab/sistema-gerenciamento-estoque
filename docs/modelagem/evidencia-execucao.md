# Verificação do registro de entrada — Sprint 3

**Data:** 29/09/2026.

Para repetir o teste na versão `sprint-03`, abra `src/index.html`, cadastre o item `PROD-001` com 10 unidades e registre uma entrada de 5. Em seguida, tente registrar uma entrada com quantidade zero e recarregue a página.

| Verificação | Resultado observado |
|---|---|
| Entrada de 5 unidades | Saldo de 15 e uma entrada no histórico. |
| Entrada com quantidade zero | Operação rejeitada. Saldo e histórico preservados. |
| Página recarregada | Saldo de 15 e entrada de 5 disponíveis. |
