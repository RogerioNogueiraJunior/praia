import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'praia',
  password: 'password',
  port: 5432,
});

export async function inserirUsuarioDB(email, senhaHash) {
  const query = 'INSERT INTO users (email, senha) VALUES ($1, $2) RETURNING *';
  const result = await pool.query(query, [email, senhaHash]);
  return result.rows[0];
}

export async function buscarUsuarioPorEmail(email) {
  const query = 'SELECT * FROM users WHERE email = $1';
  const result = await pool.query(query, [email]);
  return result.rows[0];
}

export async function atualizarNomeUsuario(email, nome) {
  const query = 'UPDATE users SET nome = $2 WHERE email = $1 RETURNING id, email, nome';
  const result = await pool.query(query, [email, nome]);
  return result.rows[0];
}
