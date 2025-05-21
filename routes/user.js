
// import express from 'express';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import pool from '../db.js';
// const router = express.Router();


// const JWT_SECRET = 'chave_secreta';

// router.post('/register', async (req, res) => {
//   const { nome, email, senha, cargo_idcargo } = req.body;

//   if (!cargo_idcargo) {
//     return res.status(400).json({ error: 'O campo cargo_idcargo é obrigatório' });
//   }

//   try {
//     const hash = await bcrypt.hash(senha, 10);
//     await pool.query(
//       'INSERT INTO usuario (nome, email, senha, cargo_idcargo) VALUES ($1, $2, $3, $4)',
//       [nome, email, hash, cargo_idcargo]
//     );
//     res.status(201).json({ message: 'Usuário registrado com sucesso' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Erro ao registrar usuário' });
//   }
// });


// router.post('/login', async (req, res) => {
//   const { email, senha } = req.body;
//   try {
//     const result = await pool.query('SELECT * FROM usuario WHERE email = $1', [email]);
//     if (result.rows.length === 0) return res.status(401).json({ error: 'Credenciais inválidas' });

//     const user = result.rows[0];
//     const match = await bcrypt.compare(senha, user.senha);
//     if (!match) return res.status(401).json({ error: 'Credenciais inválidas' });

//     const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
//     res.json({ token });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Erro ao fazer login' });
//   }
// });

// export default router;

router.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  try {
    const result = await pool.query('SELECT * FROM usuario WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Credenciais inválidas' });

    const user = result.rows[0];
    const match = await bcrypt.compare(senha, user.senha);
    if (!match) return res.status(401).json({ error: 'Credenciais inválidas' });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

export default router;
// export default router;

