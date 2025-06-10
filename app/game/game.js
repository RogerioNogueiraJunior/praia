import { requireAuth } from "/app/authGuard.js";
import { createUserBox } from "/game/gameUtils.js"; // Use utilitário

let myId = null;
const objects = document.getElementById('objects');
const positions = {};

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Recupera token da URL ou localStorage
let token = getQueryParam('token');
let nome = getQueryParam('nome');
if (token) {
    localStorage.setItem('token', token);
}
if (nome) {
    nome = decodeURIComponent(nome);
    localStorage.setItem('nome', nome);
}
token = localStorage.getItem('token');
nome = localStorage.getItem('nome') || 'Anônimo';

requireAuth('http://localhost:8081/login'); // Protege a página

// Conecta socket enviando o token
const socket = io('http://localhost:3000', {
  query: { token }
});

socket.on('current users', (userList) => {
    userList.forEach(([userId, nome, pos]) => {
        if (userId !== socket.id) { // Não cria sua própria caixa ainda
            createUserBox(userId, nome, pos);
            // Atualiza a posição visualmente
            const el = document.getElementById(userId);
            if (el && pos) {
                el.style.left = pos.x + 'px';
                el.style.top = pos.y + 'px';
            }
            // Atualiza o objeto de posições
            positions[userId] = pos;
        }
    });
});

socket.on('object creation', ({ userId, nome, x, y }) => {
    createUserBox(userId, nome, { x, y });
});


socket.on('connect', () => {
    myId = socket.id;
    const initialX = window.innerWidth / 2 - 50;
    const initialY = window.innerHeight / 2 - 50;
    positions[myId] = { x: initialX, y: initialY };

    createUserBox(myId, nome, { x: initialX, y: initialY });

    socket.emit('register name', nome);
    socket.emit('initial position', { x: initialX, y: initialY }); // <-- ADICIONE ESTA LINHA
});

socket.on('remove user', (userId) => {
    const el = document.getElementById(userId);
    if (el) el.remove();
    delete positions[userId];
});

socket.on('position update', ({ userId, x, y }) => {
    positions[userId] = { x, y };
    const el = document.getElementById(userId);
    if (el) {
        el.style.left = x + 'px';
        el.style.top = y + 'px';
    }
});

// Teclas W A S D
document.addEventListener('keydown', (e) => {
    if (!myId) return;
    const step = 10;
    const pos = positions[myId] || { x: 0, y: 0 };
    switch (e.key.toLowerCase()) {
        case 'w': pos.y -= step; break;
        case 'a': pos.x -= step; break;
        case 's': pos.y += step; break;
        case 'd': pos.x += step; break;
        default: return;
    }
    positions[myId] = pos;
    socket.emit('move', pos);
});

function blue(){
    
}