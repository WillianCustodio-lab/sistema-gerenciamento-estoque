# Padrões de projeto — Repository

## Problema

Na Sprint 4, o serviço já recebia um repositório. Porém, ao registrar uma movimentação, o adaptador gravava o saldo e o histórico em chaves separadas. Se a segunda gravação falhasse, o saldo poderia ser persistido sem o registro correspondente. O serviço também alterava o estado em memória antes de confirmar a gravação.

## Alternativas e decisão

- Manter duas gravações e compensar falhas exigiria restaurar dados já escritos com outra gravação que também poderia falhar.
- Manter o contrato existente e adiar a mudança para o SQLite preservaria a possibilidade de divergência nesta versão.
- Evoluir o **Repository** para carregar e salvar um único estado de estoque permite usar uma chamada a `localStorage.setItem` por alteração e confirmar o estado em memória após o sucesso.

Foi adotada a terceira alternativa. O serviço continua responsável pelas regras de saldo, e o repositório cuida da representação persistida.

## Participantes e aplicação

| Participante | Arquivo | Responsabilidade |
|---|---|---|
| Composição | [app.js](../../src/js/app.js) | Cria o repositório local e o fornece ao serviço. |
| Cliente do Repository | [inventory.js](../../src/js/inventory.js) | Valida a operação, prepara o novo estado e o confirma após a gravação. |
| Repository concreto | [storage.js](../../src/js/storage.js) | Implementa `load()` e `save({ products, movements })` sobre uma chave local. |

Em uma movimentação, a interface chama o serviço, o serviço prepara o saldo e o registro, e o Repository persiste ambos juntos. Se a gravação for rejeitada, o serviço mantém o estado anterior.

O primeiro carregamento sem o novo registro lê as duas chaves da Sprint 4. A primeira gravação bem-sucedida cria o registro consolidado e as próximas leituras passam a usá-lo.

## Benefícios e limites

A mudança preserva os dados existentes e elimina a gravação parcial causada por duas chamadas sequenciais. Em troca, o conjunto inteiro é serializado a cada alteração. O armazenamento continua restrito ao navegador e sujeito a sobrescrita entre abas concorrentes. Na Sprint 6, a API e uma transação SQLite devem assumir a consistência das movimentações compartilhadas.

## Evidência

Os [testes do Repository](../../tests/inventory.test.cjs) verificam dados herdados, gravação única, recarga e preservação do estado após falha simulada. Execute `node --test tests/inventory.test.cjs` a partir da raiz. Implementação registrada na [issue #31](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/issues/31) e no [commit da persistência](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/commit/d514cfa1a8de78dce970d49731447672e4f856cb).
