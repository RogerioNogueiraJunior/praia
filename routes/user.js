const express = require('express');
const router = express.Router();
const pool = require('../db'); // sua conexão postgres

router.post('/register', async (req, res) => {
    const { nome, email, nascimento, cargo_idcargo } = req.body;

    if (!nome || !email || !nascimento || !cargo_idcargo) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    try {
        // Verifica se o e-mail já existe
        const checkEmail = await pool.query('SELECT * FROM usuario WHERE email = $1', [email]);
        if (checkEmail.rows.length > 0) {
            return res.status(409).json({ message: 'Email já está cadastrado.' });
        }

        // Inserir novo usuário
        await pool.query(
            'INSERT INTO usuario (cargo_idcargo, nome, email, nascimento) VALUES ($1, $2, $3, $4)',
            [cargo_idcargo, nome, email, nascimento]
        );

        res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
});

module.exports = router;
