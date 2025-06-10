import bcrypt from 'bcrypt';

import {
  inserirUsuarioDB,
  buscarUsuarioPorEmail,
  atualizarNomeUsuario
} from '../models/userModel.js';

import jwt from 'jsonwebtoken';

const SECRET = 'sua_chave_secreta';

export async function inserirUsuario(req, res) {
  const { email, senha } = req.body;
  if (!email || !senha) return res.status(400).json({ success: false, error: 'Email e senha obrigatórios' });

  try {
    const hash = await bcrypt.hash(senha, 10);
    const user = await inserirUsuarioDB(email, hash);
    res.json({ success: true, user });
  } catch (err) {
    console.error('Erro ao inserir:', err);
    if (err.code === '23505') return res.status(400).json({ success: false, error: 'Email já cadastrado' });
    res.status(500).json({ success: false, error: 'Erro ao inserir no banco' });
  }
}

export async function loginUsuario(req, res) {
  const { email, senha } = req.body;
  if (!email || !senha) return res.status(400).json({ success: false, error: 'Email e senha obrigatórios' });

  try {
    const user = await buscarUsuarioPorEmail(email);
    if (!user || !(await bcrypt.compare(senha, user.senha))) {
      return res.status(401).json({ success: false, error: 'Email ou senha inválidos' });
    }
    const token = jwt.sign(
      { id: user.id, email: user.email, nome: user.nome }, 
      SECRET, 
      { expiresIn: '1h'});
    res.json({ 
      success: true,
      user: { id: user.id, nome: user.nome, email: user.email  }, 
      token 
      });
  } catch (err) {
    console.error('Erro ao fazer login:', err);
    res.status(500).json({ success: false, error: 'Erro interno no servidor' });
  }
}

export async function mudarNomeUsuario(req, res) {
  const { email, name } = req.body;
  if (!email || !name) return res.status(400).json({ success: false, error: 'Email e nome obrigatórios' });

  try {
    const user = await atualizarNomeUsuario(email, name);
    if (!user) return res.status(404).json({ success: false, error: 'Usuário não encontrado' });
    res.json({ success: true, user });
  } catch (err) {
    console.error('Erro ao mudar nome:', err);
    res.status(500).json({ success: false, error: 'Erro interno no servidor' });
  }
}
