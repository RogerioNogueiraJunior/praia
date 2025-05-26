import express from 'express';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import path from 'path';

import userRoutes from './routes/UserRoutes.js';

import express from "express";

import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import path from "path"; // Corrigido
import bcrypt from 'bcrypt';
// import userRoutes from './routes/user.js'; // Corrigido

import pkg from "pg";

const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'praia',
  password: 'password',
  port: 8080,
});

async function criarTabela(){
    const query = ` CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        nome nome_usuario,
        email VARCHAR(30) UNIQUE NOT NULL,
        senha VARCHAR(100) NOT NULL,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`

  try {
    await pool.query(query);
    console.log('Tabela users criada ou já existente');
  } catch (err) {
    console.error('Erro ao criar tabela:', err);
  }
} 

criarTabela()

const app = express();
const httpServer = createServer(app);
const __dirname = dirname(fileURLToPath(import.meta.url));
const port = 8081;

const publicpath = path.join(__dirname, 'app');
const imagePath = path.join(__dirname, 'public', 'imagens');

app.use(express.json());
app.use('/app', express.static(publicpath));
app.use('/', express.static(publicpath));
app.use('/imagens', express.static(imagePath));

// Páginas públicas
app.get('/login', (req, res) => res.sendFile(join(publicpath, '/login/login.html')));
app.get('/signin', (req, res) => res.sendFile(join(publicpath, '/signin/signin.html')));
app.get('/', (req, res) => res.sendFile(join(publicpath, 'index.html')));
app.get('/about', (req, res) => res.sendFile(join(publicpath, '/about/about.html')));

// Rotas da API separadas
app.use('/api', userRoutes); // <-- aqui está o "encaminhamento"

httpServer.listen(port, () => {
  console.log('Server is listening on port', port);
    console.log('Server is listening on port', port);
})

// Iniciar servidor
app.listen(3000, () => {
  console.log('Servidor backend rodando na porta 3000');
});