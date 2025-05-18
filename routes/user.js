import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    const { nome, email, nascimento, cargo_idcargo, senha } = req.body;

    // Verifica se todos os campos estão presentes
    if (!nome || !email || !nascimento || !cargo_idcargo || !senha) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    try {
        // Verifica se o e-mail já existe
        const checkEmail = await pool.query('SELECT * FROM usuario WHERE email = $1', [email]);
        if (checkEmail.rows.length > 0) {
            return res.status(409).json({ message: 'Email já está cadastrado.' });
        }

        // Inserir novo usuário com senha
        await pool.query(
            'INSERT INTO usuario (cargo_idcargo, nome, email, nascimento, senha) VALUES ($1, $2, $3, $4, $5)',
            [cargo_idcargo, nome, email, nascimento, senha]
        );

        res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
});

router.post('/login', async (req, res) => {
    console.log('dados recebidos no login', req.body)
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios.', receiveData: req.body });
    }

    try {
        const result = await pool.query('SELECT * FROM usuario WHERE email = $1 AND senha = $2', [email, senha]);

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        // Login bem-sucedido
        res.status(200).json({ message: 'Login bem-sucedido!', usuario: result.rows[0] });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
});

export default router;
