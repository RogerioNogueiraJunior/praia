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
```

---

## Banco de Dados

1. **Com Docker**  
   Crie um container PostgreSQL:
   ```sh
   docker run --name praia-postgres -e POSTGRES_PASSWORD=suasenha -e POSTGRES_DB=praia -p 5432:5432 -d postgres
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

## Fluxo de Uso

1. **Acesse** `http://localhost:5173/app/login/login.html` para fazer login ou cadastro.
2. **Após login**, você será redirecionado para a seleção de sala.
3. **Crie ou entre em uma sala** para jogar e usar o chat.

---

## Rotas principais do Backend

- `POST /api/inserir` — Cadastro de usuário
- `POST /api/entrar` — Login de usuário
- `POST /api/name_change` — Alterar nome do usuário

---

## Configuração do Caminho do Front-End (Opcional)

O backend pode servir arquivos estáticos (HTML, CSS, JS, imagens) de qualquer pasta do seu computador, inclusive de um repositório diferente do backend.

### Como configurar o caminho do front-end

1. **Defina a variável de ambiente `FRONTEND_PATH`** com o caminho absoluto da pasta do seu front-end antes de iniciar o servidor.

#### No Windows (PowerShell)

```powershell
$env:FRONTEND_PATH="C:\Users\rogério\Desktop\praia new repository\praia"
npm run dev
```

#### No Windows (Prompt de Comando - cmd.exe)

```cmd
set FRONTEND_PATH=C:\Users\rogério\Desktop\praia new repository\praia
npm run dev
```

#### No Linux/macOS

```bash
export FRONTEND_PATH="/caminho/absoluto/para/pasta/do/front"
npm run dev
```

2. **Estrutura esperada da pasta do front-end**

A pasta definida em `FRONTEND_PATH` deve conter os arquivos e subpastas do seu front-end, por exemplo:

```
praia/
├── app/
│   ├── index.html
│   ├── login/
│   │   └── login.html
│   └── signin/
│       └── signin.html
├── imagens/
│   └── exemplo.jpg
├── css/
│   └── style.css
└── js/
    └── script.js
```

3. **Referencie arquivos estáticos no HTML**

Use caminhos relativos à raiz, por exemplo:

```html
<img src="/imagens/exemplo.jpg" />
<link rel="stylesheet" href="/css/style.css" />
<script src="/js/script.js"></script>
```

4. **Acesse as páginas no navegador**

- `http://localhost:8081/` → `app/index.html`
- `http://localhost:8081/login` → `app/login/login.html`
- `http://localhost:8081/signin` → `app/signin/signin.html`
- `http://localhost:8081/about` → `app/about/about.html`

---

## Boas Práticas e Observações

- **Sempre acesse o frontend pela porta 5173** para garantir que o token do localStorage seja usado corretamente.
- **Assets** (imagens, sprites, sons) devem estar em `/public/assets` e referenciados como `/assets/...` no código.
- **Não use caminhos absolutos com hostname** (ex: `http://localhost:8081/...`) no frontend; use `/api/...` para chamadas de API.
- **Senhas** são armazenadas como hash no banco de dados.
- **Variáveis de ambiente:**  
  - Para servir o frontend pelo backend, defina `FRONTEND_PATH` no `.env` do backend (opcional).
- **Scripts JS** devem estar em arquivos separados, não inline no HTML.
- **Centralize animações e estilos globais** em um único arquivo CSS.
- Certifique-se de que o Docker e o container do PostgreSQL estejam rodando antes de iniciar o servidor.
- Os logs do servidor aparecem no terminal onde você rodou o Node.js.

---

## Testes

- Teste o fluxo completo: login → seleção de sala → entrada no jogo → chat.
- Verifique o console do navegador para erros de carregamento de arquivos (404).
- Teste em diferentes ambientes para garantir que caminhos relativos funcionam.

---

## Contribuição

Pull requests são bem-vindos!  
Abra uma issue para discutir mudanças ou melhorias.

---

## Licença

MIT