import express from "express";

import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import path from "path"; 

import userRoutes from './routes/user.js'; // Corrigido

const app = express();
const httpServer = createServer(app);
const __dirname = dirname(fileURLToPath(import.meta.url));
const port = 8081;

const publicpath = path.join(__dirname, 'app');
console.log('Caminho para a pasta app:', publicpath);

app.use(express.json());
app.use('/app', express.static(publicpath));

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
    res.sendFile(join(publicpath, 'about.html'));
});

app.use('/users', userRoutes); 

httpServer.listen(port, () => {
    console.log('Server is listening on port', port);
})

// Iniciar servidor
app.listen(3000, () => {
  console.log('Servidor backend rodando na porta 3000');
});