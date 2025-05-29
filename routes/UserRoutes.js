import express from 'express';
import {
  inserirUsuario,
  loginUsuario,
  mudarNomeUsuario,
  listarUsuarios
} from '../controllers/UserController.js';


const router = express.Router();

router.post('/inserir', inserirUsuario);
router.post('/entrar', loginUsuario);
router.post('/name_change', mudarNomeUsuario);
router.get('/list', listarUsuarios);

export default router;
