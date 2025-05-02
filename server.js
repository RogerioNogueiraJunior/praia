const express = require('express');
const path = require('path');
const http = require('http')
const WebSocket = require('ws')


const app = express();
app.use(express.json());
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

app.get('/about', (req, res) => {
    res.sendFile(path.join(publicpath, 'about.html'));
  });


// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});


const userRoutes = require('./routes/user'); // ajuste se o caminho for diferente
app.use('/users', userRoutes); // agora sua rota /register estará disponível em /users/register
