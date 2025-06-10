import express from 'express';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import path from 'path';

import userRoutes from './routes/UserRoutes.js';


const app = express();
const httpServer = createServer(app);
const __dirname = dirname(fileURLToPath(import.meta.url));
const port = 8081;

const publicpath = path.join(__dirname, 'app');
const imagePath = path.join(__dirname, 'public', 'imagens');

app.use(express.json());
app.use('/app', express.static(publicpath));
app.use('/', express.static(publicpath));
app.use('/controllers', express.static(path.join(__dirname, 'controllers')));
app.use('/../controllers', express.static(path.join(__dirname, 'controllers')));
app.use('/imagens', express.static(imagePath));

// Páginas públicas
app.get('/login', (req, res) => res.sendFile(join(publicpath, '/login/login.html')));
app.get('/signin', (req, res) => res.sendFile(join(publicpath, '/signin/signin.html')));
app.get('/', (req, res) => res.sendFile(join(publicpath, 'index.html')));
app.get('/about', (req, res) => res.sendFile(join(publicpath, '/about/about.html')));

// Rotas da API separadas
app.use('/api', userRoutes); // <-- aqui está o "encaminhamento"

httpServer.listen(port, () => {
  console.log('Server is listening on port', port);
});
