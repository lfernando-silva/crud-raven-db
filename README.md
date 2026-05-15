# CRUD Com RavenDB

Trabalho Final da disciplina de bancos de dados não relacional.

## Requisitos
- NodeJS versão 22x ou superior
- Docker versão 20x ou outra compatível com docker compose
- Navegador google chrome atualizado (recomendado)

## Instruções para execução

1. Executar serviço de banco de dados:

`docker compose up -d ravendb`

2. Executar serviço de backend

`cd ./backend && npm start`

Aplicação irá executar em http://localhost:5000

3. Executar serviço de frontend
`cd ./frontend && npm start`

Aplicação irá executar em http://localhost:6000

### Carga inicial de dados

1. Após executar o serviço de banco de dados no docker compose, abra a aplicação nativa do ravenDB disponível em http://localhost:8085

* Note que é necessária a obtenção de uma licensa em https://ravendb.net/download

2. No menu lateral esquerdo, escolha a opção "Tasks > Import Data". 

3. Na tela e na aba "From file (.ravendump), escolha o arquivo ravendump deste repositório (/data/dump-YYYY-MM-DD.ravendump) e clique em "Import Data". 

4. Se a importação for bem-sucedida, na lista de databases deverá existir o banco "loja" com três coleções: "clientes", "produtos" e "pedidos".