const socket = io();
const objects = document.getElementById('objects');
let myId = null;
const positions = {}; // Guarda posições por usuário

socket.on('current users', (userList) => {
    userList.forEach(([userId, pos]) => {
        createUserBox(userId, pos);
    });
});

socket.on('object creation', ({ userId, x, y }) => {
    createUserBox(userId, { x, y });
});

socket.on('connect', () => {
    myId = socket.id;

    const initialX = window.innerWidth / 2 - 50;
    const initialY = window.innerHeight / 2 - 50;

    positions[myId] = { x: initialX, y: initialY };

    // Enviamos a posição inicial para o servidor
    socket.emit('initial position', { x: initialX, y: initialY });
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

function createUserBox(userId, pos = { x: 0, y: 0 }) {
    if (document.getElementById(userId)) return;
    const box = document.createElement('div');
    box.classList.add('person');
    box.id = userId;
    box.textContent = userId === myId ? "You" : userId;
    box.style.left = pos.x + 'px';
    box.style.top = pos.y + 'px';
    positions[userId] = { x: pos.x, y: pos.y };
    objects.appendChild(box);
}       

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