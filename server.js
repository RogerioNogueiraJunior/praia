const express = require('express');
const path = require('path');
const http = require('http')
const WebSocket = require('ws')


const app = express();
const server = http.createServer(app);
const port = 8080;
const wss = new WebSocket.Server({server});


// Caminho para a pasta "app"
const publicpath = path.join(__dirname, 'app');
console.log('Caminho para a pasta app:', publicpath);


// Servir arquivos estáticos (CSS, JS, imagens, etc.)
app.use('/app', express.static(publicpath));
// imagens
const imagePath = path.join(__dirname, 'public', 'imagens');
app.use('/imagens', express.static(imagePath));

app.get('/login', (req, res)=>{
    res.sendFile(path.join(publicpath, 'login.html'));
})

app.get('/signin', (req, res)=>{
    res.sendFile(path.join(publicpath, 'signin.html'));
})

// Rota para a página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(publicpath, 'index.html'));
});


// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
