import express from "express";

import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import path from "path"; // Corrigido
// import userRoutes from './routes/user.js'; // Corrigido

import pkg from "pg";

const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'praia',
  password: 'password',
  port: 5432,
});

const app = express();
const httpServer = createServer(app);
const __dirname = dirname(fileURLToPath(import.meta.url));
const port = 8081;

const publicpath = path.join(__dirname, 'app');
console.log('Caminho para a pasta app:', publicpath);

app.use(express.json());
app.use('/app', express.static(publicpath));
app.use('/', express.static(publicpath));

const imagePath = path.join(__dirname, 'public', 'imagens');
app.use('/imagens', express.static(imagePath));

app.get('/login', (req, res) => {
    res.sendFile(join(publicpath, '/login/login.html'));
});

app.get('/signin', (req, res) => {
    res.sendFile(join(publicpath, '/signin/signin.html'));
});

app.get('/', (req, res) => {
    res.sendFile(join(publicpath, 'index.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(join(publicpath, '/about/about.html')); // Corrigido
});

app.post('/inserir', async (req, res) => {
  const { nome, senha } = req.body;
  try {
    const query = 'INSERT INTO users (nome, email, senha) VALUES ($1, $2, $3) RETURNING *';
    const values = [nome, nome, senha];
    const result = await pool.query(query, values);
    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    console.error('Erro ao inserir:', err);
    res.status(500).json({ success: false, error: 'Erro ao inserir no banco' });
  }
});

httpServer.listen(port, () => {
    console.log('Server is listening on port', port);
})

// Iniciar servidor
app.listen(3000, () => {
  console.log('Servidor backend rodando na porta 3000');
});