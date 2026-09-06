# Visão Geral do Produto

Este documento complementa a apresentação do projeto, detalhando o problema e os objetivos que orientam a solução.

## Problema e contexto

O problema apresentado no README envolve a diferença entre as informações registradas e a quantidade física dos produtos. Quando uma entrada ou saída não é registrada, a consulta de estoque pode deixar de representar a disponibilidade real.

**Exemplos ilustrativos:**

- Um controle indica 20 unidades, mas 5 foram retiradas sem registro. A consulta apresenta uma disponibilidade superior à quantidade física.
- Um recebimento não é registrado. A quantidade apresentada fica abaixo da disponível, podendo motivar uma compra desnecessária.

Esses exemplos hipotéticos mostram por que o acompanhamento das movimentações é relevante para a confiabilidade das informações.

## Público e necessidades

O público identificado no README precisa responder a três perguntas em sua rotina:

- Qual é a quantidade disponível de um produto?
- Quais entradas e saídas foram registradas?
- Quais movimentações explicam as alterações de quantidade?

## Visão do produto

**Proposta de valor:** facilitar a conferência do estoque ao reunir a disponibilidade dos produtos e as movimentações registradas em um mesmo ambiente.

**Objetivo geral:** apoiar uma gestão de estoque organizada e confiável, com informações centralizadas para registro e consulta.

**Objetivos específicos:**

- Facilitar a identificação da disponibilidade dos produtos.
- Apoiar a conferência das alterações de quantidade por meio das movimentações registradas.
- Reduzir a dispersão das informações utilizadas no controle de estoque.

## Escopo inicial

O escopo corresponde às funcionalidades previstas no README. Elas abrangem a identificação dos produtos, o acompanhamento de suas quantidades e a consulta das movimentações de entrada e saída.

## Restrições e premissas

- **Formato da solução:** aplicação web, conforme a exigência da disciplina.
- **Desenvolvimento:** entregas incrementais, com organização do trabalho por Scrum simplificado e registros no GitHub.
- **Confiabilidade dos registros:** a correspondência entre as informações apresentadas e o estoque físico depende do registro correto das entradas e saídas.

## Diferenciais da solução

A consulta das movimentações complementa a visualização do saldo: além de identificar a quantidade disponível, o responsável pode consultar os registros que explicam suas alterações. Essa relação aproxima a solução da rotina de conferência de estoque.

## Histórico de mudanças

| Etapa | Alteração | Motivo |
| :--- | :--- | :--- |
| Sprint 1 | Elaboração da visão geral do produto. | Detalhar a proposta inicial. |
| Sprint 1 | Simplificação do conteúdo e remoção de repetições e links. | Manter o documento complementar à apresentação do projeto. |
