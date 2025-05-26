import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'praia',
  password: 'password',
  port: 5432,
});

const criarTabela = async () => {
  const createDomainQuery = `
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'nome_usuario'
      ) THEN
        CREATE DOMAIN nome_usuario AS VARCHAR(100) DEFAULT 'praieiro';
      END IF;
    END
    $$;
  `;

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      nome nome_usuario,
      email VARCHAR(30) UNIQUE NOT NULL,
      senha VARCHAR(100) NOT NULL,
      criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(createDomainQuery);
    await pool.query(createTableQuery);
    console.log('Domain e tabela users criados (ou já existentes)');
  } catch (err) {
    console.error('Erro ao criar domínio ou tabela:', err);
  }
};

criarTabela();

