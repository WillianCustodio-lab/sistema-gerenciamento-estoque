# Decisões de projeto — Sprint 4

Este documento registra decisões aplicadas na refatoração do controle de estoque. As referências consideram a versão anterior concentrada em `src/js/app.js` e o código produzido na Sprint 4.

## 1. Separar regras, persistência e interface

**Contexto:** `app.js` mantinha classes de domínio, validações, acesso ao `localStorage` e manipulação do HTML. Alterar a persistência ou uma regra exigia modificar o mesmo arquivo da interface.

**Alternativas consideradas:** manter o arquivo único; adotar um framework; separar somente as responsabilidades necessárias em poucos arquivos.

**Decisão:** distribuir o código em `inventory.js`, `storage.js` e `app.js`.

**Justificativa:** a regra de estoque passa a ser independente da interface, e a persistência pode ser substituída posteriormente pela API Flask sem reescrever o domínio.

**Consequências:** cada arquivo possui um motivo principal para mudar e o acoplamento ocorre por interfaces pequenas. Como limitação, a aplicação ainda é carregada por scripts globais enquanto não existe empacotamento ou servidor Flask.

**Código relacionado:** `src/js/inventory.js`, `src/js/storage.js` e `src/js/app.js`.

## 2. Isolar o armazenamento atrás de um repositório

**Contexto:** chamadas diretas ao `localStorage` estavam misturadas às operações de cadastro e movimentação.

**Alternativas consideradas:** continuar acessando o navegador diretamente; migrar imediatamente para SQLite; criar uma classe simples para o armazenamento atual.

**Decisão:** criar `LocalStorageRepository`, responsável por carregar e salvar produtos e movimentações.

**Justificativa:** a Sprint 4 exige separação de responsabilidades, enquanto Flask e SQLite pertencem à evolução arquitetural. O serviço de estoque conhece apenas as operações do repositório.

**Consequências:** a persistência pode ser trocada com menor impacto. O `localStorage` continua limitado ao navegador e não oferece transações entre múltiplos usuários.

**Código relacionado:** `src/js/storage.js` e inicialização em `src/js/app.js`.

## 3. Centralizar entradas e saídas no serviço de estoque

**Contexto:** a entrada possuía validações dentro do evento do formulário. A saída precisaria repetir busca de produto, validação da quantidade, atualização do saldo e criação do histórico.

**Alternativas consideradas:** criar fluxos independentes e duplicados; usar uma função única sem domínio; centralizar a operação em `InventoryService` com métodos explícitos.

**Decisão:** utilizar `registerEntry` e `registerExit`, ambos delegando a `registerMovement`.

**Justificativa:** as regras comuns ficam coesas, enquanto a validação específica de saída permanece em `Product.registerExit`.

**Consequências:** entradas e saídas geram o mesmo formato de movimentação e são mais fáceis de verificar. Novos tipos de movimentação exigirão uma decisão explícita no serviço.

**Código relacionado:** `src/js/inventory.js` e formulários coordenados por `src/js/app.js`.

## Comparação antes e depois

| Antes da Sprint 4 | Depois da Sprint 4 |
|---|---|
| `app.js` concentrava domínio, validação, armazenamento e interface. | `inventory.js` concentra regras; `storage.js` persiste; `app.js` coordena a interface. |
| A entrada alterava diretamente produto e histórico no evento do formulário. | O evento solicita a operação ao `InventoryService`. |
| Não havia saída de estoque. | A saída valida quantidade e saldo, atualiza o produto e registra a movimentação. |
| O histórico assumia apenas entradas. | O histórico apresenta entradas e saídas com identificação visual. |

A mudança melhora a coesão porque cada módulo reúne funções relacionadas. O acoplamento diminui porque a interface não conhece as chaves do armazenamento nem altera o saldo diretamente.
