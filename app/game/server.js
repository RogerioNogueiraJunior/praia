import express from "express";
import cors from 'cors'
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import path from "path"; 
import { Server } from "socket.io";

const app = express();
// habilitar cors
app.use(cors({
  origin: 'http://localhost:8081',
  credentials: true
}));
app.use(express.json());

// Suas rotas aqui
import userRoutes from './routes/user.js';
app.use('/register', userRoutes); // exemplo

const httpServer = createServer(app);
const io = new Server(httpServer);


const __dirname = dirname(fileURLToPath(import.meta.url));
const publicpath = path.join(__dirname);

app.use(express.json());
app.use('/game', express.static(publicpath));

app.get('/room', (req, res) => {
    res.sendFile(join(publicpath, 'roomCreation.html')); // Corrigido
});

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

const users = new Map();

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Envia a lista de usuários e posições ao novo usuário
    socket.emit('current users', Array.from(users.entries())); // [[id, {x,y}], ...]

    // Notifica todos sobre o novo usuário
    socket.on('initial position', (pos) => {
        users.set(socket.id, pos);
        io.emit('object creation', { userId: socket.id, x: pos.x, y: pos.y });
    });

    socket.on('move', (pos) => {
        users.set(socket.id, pos); // atualiza posição
        io.emit('position update', { userId: socket.id, ...pos });
    });

    socket.on('disconnect', () => {
        users.delete(socket.id);
        io.emit('remove user', socket.id);
    });
});



httpServer.listen(3000, () => {
    console.log('Server is listening on port 3000');
});

