# Praia

Projeto de autenticação de usuários com Node.js, Express, PostgreSQL e Docker.

## Pré-requisitos

- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/) (para rodar o banco de dados PostgreSQL)
- [npm](https://www.npmjs.com/) (geralmente já vem com o Node.js)

## Instalação

1. **Clone o repositório:**
   ```sh
   git clone <url-do-seu-repositorio>
   cd "praia new repository/praia"
   ```

2. **Instale as dependências:**
   ```sh
   npm install
   ```

3. **Configure o banco de dados:**

   - Se você usa Docker, crie um container PostgreSQL:
     ```sh
     docker run --name praia-postgres -e POSTGRES_PASSWORD=suasenha -e POSTGRES_DB=praia -p 5432:5432 -d postgres
     ```
   - Altere as credenciais de conexão em `models/userModel.js` se necessário.

4. **Crie as tabelas no banco:**

   - Dentro da pasta `database` há um arquivo SQL para criar a tabela `users`.
   - Execute o script usando um cliente PostgreSQL ou via terminal:
     ```sh
     psql -U postgres -d praia -f database/create_users_table.sql
     ```
     *(Ajuste o nome do arquivo conforme o que está na sua pasta)*

## Como rodar o projeto

1. **Inicie o servidor:**
   ```sh
   npm run dev
   ```
   Ou, se não houver script no `package.json`:
   ```sh
   node server.js
   ```

2. **Acesse no navegador:**
   ```
   http://localhost:8081/
   ```

## Estrutura de Pastas

```
praia/
├── app/                # Frontend (HTML, CSS, JS)
├── controllers/        # Lógica dos controllers (UserController.js)
├── database/           # Scripts SQL para criação de tabelas
├── models/             # Acesso ao banco de dados (userModel.js)
├── public/             # Imagens e arquivos estáticos
├── routes/             # Rotas da API (UserRoutes.js)
└── server.js           # Arquivo principal do servidor
```

## Rotas principais

- `POST /api/inserir` — Cadastro de usuário
- `POST /api/entrar` — Login de usuário
- `POST /api/name_change` — Alterar nome do usuário

## Observações

- Certifique-se de que o Docker e o container do PostgreSQL estejam rodando antes de iniciar o servidor.
- Os logs do servidor aparecem no terminal onde você rodou o Node.js.
- para criar a tabela acesse o diretorio database e digite node criarTabela.js no terminal

