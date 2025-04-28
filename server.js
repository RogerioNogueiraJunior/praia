const express = require('express');
const path = require('path');
const http = require('http')
const WebSocket = require('ws')


const app = express();
const server = http.createServer(app);
const port = 8081;
const wss = new WebSocket.Server({server});


// Caminho para a pasta "app"
const publicpath = path.join(__dirname, 'app');
console.log('Caminho para a pasta app:', publicpath);


// Servir arquivos estáticos (CSS, JS, imagens, etc.)
app.use('/app', express.static(publicpath));
// imagens
const imagePath = path.join(__dirname, 'public', 'imagens');
app.use('/imagens', express.static(imagePath));

//Rota para a pagina do jogo
app.get('/game', (req, res) => {
    res.sendFile(path.join(publicpath, 'game/praia-game/index.html'));
    //websocket
    wss.on('connection', (ws) => {
        console.log('novo cliente conectado')

        ws.on('message', (message) => {
            console.log(`recebido ${message}`)
        })

        ws.send(`eco ${message}`)
    })

});
// Rota para a página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(publicpath, 'index.html'));
});


// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
