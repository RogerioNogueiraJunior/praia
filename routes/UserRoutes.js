import express from 'express';
import {
  inserirUsuario,
  loginUsuario,
  mudarNomeUsuario
} from '../controllers/userController.js';

const router = express.Router();

router.post('/inserir', inserirUsuario);
router.post('/entrar', loginUsuario);
router.post('/name_change', mudarNomeUsuario);

export default router;
