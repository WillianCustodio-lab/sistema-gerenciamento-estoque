# Decisões de projeto

## Sprint 4

Na Sprint 3, `app.js` concentrava interface, regras de estoque e gravação no navegador. A Sprint 4 separou essas responsabilidades e incluiu o registro de saídas.

| Decisão | Alternativas e motivo | Efeito |
|---|---|---|
| Separar interface, regras e armazenamento | O grupo podia manter tudo em um arquivo ou adotar um framework. Três módulos simples atendiam ao tamanho da aplicação. | `app.js` recebe as ações da tela. `inventory.js` aplica as regras de estoque. `storage.js` salva os dados. |
| Isolar o armazenamento | Acessar o navegador diretamente em cada operação dificultava a troca de armazenamento. A migração imediata para SQLite ampliaria o escopo da sprint. | `LocalStorageRepository` concentra leitura e gravação. Nessa versão, os dados ainda ficam no navegador. |
| Compartilhar o fluxo de entrada e saída | Dois fluxos independentes repetiriam a busca do produto, a validação da quantidade e a gravação do histórico. | `registerMovement` reúne as etapas comuns. A saída acrescenta a conferência do saldo. |

Na [Sprint 3](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/blob/sprint-03/src/js/app.js), o formulário executava a regra de entrada e salvava os dados. Na [Sprint 4](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/tree/sprint-04/src/js), o formulário passou a chamar o serviço. Essa divisão evita que mudanças na tela exijam mexer no armazenamento.

## Sprint 6

| Decisão | Alternativas e motivo | Efeito |
|---|---|---|
| Flask servindo a interface e a API | Um servidor separado para a interface exigiria configurar CORS e dois processos. Com uma única origem, a aplicação continua simples de executar. | `app.py` entrega os arquivos estáticos e as rotas `/api`. |
| SQLite como banco | Um servidor de banco, como PostgreSQL, exigiria instalação e configuração. O SQLite usa um único arquivo e atende ao volume previsto (RNF-01). | Saldo e histórico são gravados na mesma transação (RNF-05). Hospedar exige disco persistente. |
| Regras no servidor | Manter a validação só no navegador permitiria gravar dados inválidos pela API. | `inventory.py` valida os dados e o SQLite reforça as regras com `CHECK`. |

## Sprint 8

| Decisão | Alternativas e motivo | Efeito |
|---|---|---|
| Estoque mínimo opcional por produto | Um limite único para todo o estoque não serve a produtos com consumos diferentes. Um mínimo obrigatório quebraria os cadastros existentes. | Coluna `minimum` aceita nulo. Produtos sem mínimo não entram no indicador. |
| Migração na inicialização | Pedir que o usuário apague o banco faria perder dados. Uma ferramenta de migração seria excessiva para uma coluna. | `initialize` acrescenta a coluna quando ela não existe. |
| Indicador calculado na interface | Uma rota só para os indicadores repetiria dados que a consulta já retorna. | `app.js` calcula a contagem e o selo a partir de `/api/inventory`. |
