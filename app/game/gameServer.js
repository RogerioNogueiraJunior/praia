import express from "express";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import path from "path"; 
import { Server } from "socket.io";
import jwt from 'jsonwebtoken';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const SECRET = 'sua_chave_secreta'; 

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicpath = path.join(__dirname);

app.use(express.json());
app.use('/game', express.static(publicpath));
app.use('/', express.static(publicpath));
app.use('/app', express.static(path.join(__dirname, '..')));

app.get('/room', (req, res) => {
    res.sendFile(join(publicpath, 'roomCreation.html')); // Corrigido
});

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

const users = new Map();

io.on("connection", (socket) => {
    const token = socket.handshake.query.token;
    let nome = 'Anônimo';

    // Autenticação JWT
    try {
        const decoded = jwt.verify(token, SECRET);
        nome = decoded.nome || 'Anônimo';
    } catch (err) {
        socket.disconnect(true);
        return;
    }

    users.set(socket.id, { nome, pos: { x: 0, y: 0 } });

    socket.on('register name', (novoNome) => {
        if (users.has(socket.id)) {
            users.get(socket.id).nome = novoNome;

            // ENVIE A LISTA DE USUÁRIOS ATUAIS PARA O NOVO USUÁRIO
            const userList = [];
            for (const [userId, userData] of users.entries()) {
                userList.push([userId, userData.nome, userData.pos]);
            }
            socket.emit('current users', userList);
        }
    });

    socket.on('initial position', (pos) => {
        if (users.has(socket.id)) {
            users.get(socket.id).pos = pos;
        } else {
            users.set(socket.id, { nome, pos });
        }
        io.emit('object creation', { userId: socket.id, nome: users.get(socket.id).nome, x: pos.x, y: pos.y });
    });

    socket.on('move', (pos) => {
        if (users.has(socket.id)) {
            users.get(socket.id).pos = pos;
            io.emit('position update', { userId: socket.id, nome: users.get(socket.id).nome, ...pos });
        }
    });

    socket.on('disconnect', () => {
        users.delete(socket.id);
        io.emit('remove user', socket.id);
    });
});

httpServer.listen(3000, () => {
    console.log('Server is listening on port 3000');
});
