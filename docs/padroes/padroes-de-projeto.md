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
| Interface | [app.js](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/blob/sprint-05/src/js/app.js) | Cria o repositório e o fornece ao serviço. |
| Serviço de estoque | [inventory.js](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/blob/sprint-05/src/js/inventory.js) | Valida e confirma a operação após a gravação. |
| Repositório local | [storage.js](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/blob/sprint-05/src/js/storage.js) | Lê e grava o estoque em uma chave do navegador. |

Em uma movimentação, a interface chama o serviço, o serviço prepara o saldo e o registro, e o Repository persiste ambos juntos. Se a gravação for rejeitada, o serviço mantém o estado anterior.

O primeiro carregamento sem o novo registro lê as duas chaves da Sprint 4. A primeira gravação bem-sucedida cria o registro consolidado e as próximas leituras passam a usá-lo.

## Benefícios e limites

A alteração da Sprint 5 evitou gravações parciais e preservou a leitura dos dados existentes. Cada operação gravava todo o estoque, que continuava limitado ao navegador. Na Sprint 6, o controle das transações passou ao SQLite.

## Evidência

Na versão `sprint-05`, execute `node --test tests/inventory.test.cjs`. Os [testes](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/blob/sprint-05/tests/inventory.test.cjs) cobrem leitura dos dados antigos, recarga e falha de gravação. A implementação está na [issue #31](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/issues/31).
