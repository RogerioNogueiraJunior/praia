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
  port: 5432,
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
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ success: false, error: 'Email e senha são obrigatórios' });
  }

  try {
    const hash = await bcrypt.hash(senha, 10);
    const query = 'INSERT INTO users (email, senha) VALUES ($1, $2) RETURNING *';
    const values = [email, hash];
    const result = await pool.query(query, values);
    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    console.error('Erro ao inserir:', err);
    if (err.code === '23505') { // Código do PostgreSQL para violação de unicidade
      return res.status(400).json({ success: false, error: 'Email já cadastrado' });
    }
    res.status(500).json({ success: false, error: 'Erro ao inserir no banco' });
  }
});


app.post('/entrar', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ success: false, error: 'Email e senha são obrigatórios' });
  }

  try {
    // Busca usuário pelo email
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) {
      // Usuário não encontrado
      return res.status(401).json({ success: false, error: 'Email ou senha inválidos' });
    }

    const user = result.rows[0];

    // Compara senha com hash do banco
    const senhaValida = await bcrypt.compare(senha, user.senha);

    if (!senhaValida) {
      return res.status(401).json({ success: false, error: 'Email ou senha inválidos' });
    }

    // Login bem sucedido
    res.json({ success: true, user: { id: user.id, email: user.email, nome: user.nome } });

  } catch (err) {
    console.error('Erro ao fazer login:', err);
    res.status(500).json({ success: false, error: 'Erro interno no servidor' });
  }
});

app.post('/name_change', async (req, res) => {
  const { email, name } = req.body;

  if (!email || !name) {
    return res.status(400).json({ success: false, error: 'Email e novo nome são obrigatórios' });
  }

  try {
    const query = "UPDATE users SET nome = $2 WHERE email = $1 RETURNING id, email, nome;";
    const result = await pool.query(query, [email, name]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Usuário não encontrado' });
    }

    return res.json({ success: true, user: result.rows[0] });

  } catch (err) {
    console.error('Erro ao mudar nome:', err);
    return res.status(500).json({ success: false, error: 'Erro interno no servidor' });
  }
});


httpServer.listen(port, () => {
    console.log('Server is listening on port', port);
});
