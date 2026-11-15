# Decisões de projeto — Sprint 4

Na Sprint 3, `app.js` concentrava interface, regras de estoque e gravação no navegador. A Sprint 4 separou essas responsabilidades e incluiu o registro de saídas.

| Decisão | Alternativas e motivo | Efeito |
|---|---|---|
| Separar interface, regras e armazenamento | O grupo podia manter tudo em um arquivo ou adotar um framework. Três módulos simples atendiam ao tamanho da aplicação. | `app.js` recebe as ações da tela. `inventory.js` aplica as regras de estoque. `storage.js` salva os dados. |
| Isolar o armazenamento | Acessar o navegador diretamente em cada operação dificultava a troca de armazenamento. A migração imediata para SQLite ampliaria o escopo da sprint. | `LocalStorageRepository` concentra leitura e gravação. Nessa versão, os dados ainda ficam no navegador. |
| Compartilhar o fluxo de entrada e saída | Dois fluxos independentes repetiriam a busca do produto, a validação da quantidade e a gravação do histórico. | `registerMovement` reúne as etapas comuns. A saída acrescenta a conferência do saldo. |

Na [Sprint 3](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/blob/sprint-03/src/js/app.js), o formulário executava a regra de entrada e salvava os dados. Na [Sprint 4](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/tree/sprint-04/src/js), o formulário passou a chamar o serviço. Essa divisão evita que mudanças na tela exijam mexer no armazenamento.
