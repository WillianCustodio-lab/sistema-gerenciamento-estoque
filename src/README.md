# Aplicação web

Este diretório contém os incrementos executáveis do Sistema de Gerenciamento de Estoque.

## Funcionalidade disponível

- cadastro de produto com código, nome, categoria e quantidade inicial;
- validação dos campos obrigatórios e da quantidade;
- bloqueio de códigos duplicados;
- consulta dos produtos cadastrados;
- registro de entradas para produtos cadastrados;
- atualização automática da quantidade após uma entrada;
- consulta do histórico de entradas;
- armazenamento dos dados no navegador com `localStorage`.

## Como executar

1. Acesse a pasta `src`.
2. Abra o arquivo `index.html` em um navegador atual.
3. Preencha o formulário e selecione **Cadastrar produto**.
4. Na seção **Registrar entrada**, selecione o produto e informe a quantidade recebida.
5. Confirme a atualização do saldo e o registro no histórico.

Os produtos ficam armazenados somente no navegador e no dispositivo utilizados. Esta persistência é adequada ao protótipo inicial e poderá ser substituída durante a evolução da aplicação.

