# Sistema de Gerenciamento de Estoque

[![CI](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/actions/workflows/ci.yml/badge.svg)](https://github.com/WillianCustodio-lab/sistema-gerenciamento-estoque/actions/workflows/ci.yml)

Trabalho de Engenharia de Software · Sistemas de Informação · 2026/2

O Controle de Estoque reúne produtos, saldos e movimentações. Quem cuida do almoxarifado pode conferir o que está disponível e identificar as entradas e saídas que mudaram o saldo.

## Funcionalidades

- Cadastro e pesquisa de produtos por nome ou código.
- Visão geral com total de produtos, unidades em estoque, itens sem saldo e itens com estoque baixo.
- Estoque mínimo opcional por produto, com destaque dos itens que precisam de reposição.
- Registro de entradas e saídas. O sistema bloqueia retiradas acima do saldo.
- Histórico com produto, tipo, quantidade e data de cada movimentação.

## Como executar

A interface usa HTML, CSS e JavaScript. O Flask serve as páginas e a API, e o SQLite guarda os dados. Na raiz do repositório, com Python 3.11+ e SQLite 3.37+, execute no PowerShell:

```powershell
python -m venv .venv
.\.venv\Scripts\python -m pip install -r requirements.txt
.\.venv\Scripts\python -m flask --app src.backend.app run
```

Abra `http://127.0.0.1:5000`. O banco começa vazio. O [guia da aplicação](src/README.md) explica como inserir produtos de exemplo e rodar os testes.

## Documentação

- [Visão do produto](docs/visao-geral.md) e [requisitos](docs/requisitos/requisitos.md)
- [Arquitetura](docs/arquitetura/arquitetura.md) e [plano de testes](docs/testes/plano-de-testes.md)
- [Modelagem](docs/modelagem/modelagem.md), [decisões de projeto](docs/projeto/decisoes-de-projeto.md) e [padrões](docs/padroes/padroes-de-projeto.md)
- [Validação com usuários](docs/testes/validacao-usuarios.md) e [uso de IA](docs/uso-de-ia.md)
- [Backlog](docs/backlog-produto.md) e [sprints](docs/sprints)

## Equipe

| Integrante | GitHub |
|---|---|
| Willian Custódio | [@williancustodio-lab](https://github.com/williancustodio-lab) |
| Juliano Goulart | [@jotaGoulart](https://github.com/jotaGoulart) |
| João Pedro Arriel | [@pereirajp06](https://github.com/pereirajp06) |
| João Gabriel Tófoli | [@Tolofi](https://github.com/Tolofi) |

Professor: Johnatan Oliveira.
