# Praia Multiplayer Game

Este projeto é um jogo multiplayer de praia com autenticação, salas e chat, desenvolvido em Node.js (backend), Express, PostgreSQL, Docker e Vite + Phaser (frontend).

---

## Estrutura do Projeto

```
praia/
├── app/
│   ├── game/           # Frontend do jogo (Vite + Phaser)
│   ├── login/          # Telas e scripts de login
│   ├── about/          # Página sobre
│   └── ...             # Outros arquivos estáticos
├── public/             # Assets públicos globais (imagens, sprites, sons)
└── ...
praia-backend/
├── controllers/
├── models/
├── routes/
├── auth/
├── database/
└── server.js           # Backend Node.js/Express
```

---

## Pré-requisitos

- Node.js 18+
- npm
- [Docker](https://www.docker.com/) (para rodar o banco de dados PostgreSQL)

---

## Instalação

### 1. Backend

```bash
cd praia-backend
npm install
```

### 2. Frontend

```bash
cd ../praia/app/game
npm install
npm install phaser
```

---

## Banco de Dados

1. **Com Docker**  
   Crie um container PostgreSQL:
   ```sh
   docker run --name praia-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=praia -p 5432:5432 -d postgres
   ```
   Altere as credenciais de conexão em `models/userModel.js` se necessário.

2. **Crie as tabelas no banco:**
   - Execute o script SQL usando um cliente PostgreSQL ou via terminal:
     ```sh
     psql -U postgres -d praia -f database/create_users_table.sql
     ```
     *(Ajuste o nome do arquivo conforme o que está na sua pasta)*
   - **Ou** execute o script Node.js para criar a tabela:
     ```sh
     cd database
     node criarTabela.js
     ```

---

## Como Executar

### 1. Inicie o Backend

```bash
cd praia-backend
npm run dev
```
O backend roda por padrão em `http://localhost:8081`.

### 2. Inicie o Frontend (Vite)

```bash
cd ../praia/app/game
npm run dev
```
O frontend roda por padrão em `http://localhost:5173`.

---

## Configuração de Proxy

O frontend (Vite) está configurado para encaminhar todas as requisições `/api` para o backend.  
Veja o arquivo `vite.config.js`:

```js
export default {
  server: {
    proxy: {
      '/api': 'http://localhost:8081'
    }
  }
}
```

---

## Configuração do Caminho do Front-End 

O backend pode servir arquivos estáticos (HTML, CSS, JS, imagens) de qualquer pasta do seu computador, inclusive de um repositório diferente do backend.

### Como configurar o caminho do front-end

1. **Defina a variável de ambiente `FRONTEND_PATH`** com o caminho absoluto da pasta do seu front-end antes de iniciar o servidor.

#### No Windows (PowerShell)

```powershell
$env:FRONTEND_PATH="/caminho/absoluto/para/pasta/do/front"
npm run dev
```

#### No Windows (Prompt de Comando - cmd.exe)

```cmd
set FRONTEND_PATH=/caminho/absoluto/para/pasta/do/front
npm run dev
```

#### No Linux/macOS

```bash
export FRONTEND_PATH="/caminho/absoluto/para/pasta/do/front"
npm run dev
```


---
