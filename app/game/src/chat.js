import { io } from 'socket.io-client';

const token = localStorage.getItem('token');
const myUserId = localStorage.getItem('userId')?.toString(); // <-- pegar userId local
const myUserName = localStorage.getItem('user')?.toString(); 

const socket = io('http://localhost:3000/chat', {
  auth: { token },
  transports: ['websocket'],
});

const urlParams = new URLSearchParams(window.location.search);
const salaId = urlParams.get('salaId');
if (!salaId) {
  window.top.location.href = 'http://localhost:8081/';
}

socket.emit('joinRoom', { salaId });

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (input.value) {
    socket.emit('chat message', { 
      salaId, 
      msg: input.value, 
      nome: myUserName,
      userId: myUserId   // enviando userId junto
    });
    input.value = '';
  }
});

socket.on('chat message', ({ nome, userId, msg }) => {
  addMessage(nome, userId, msg);
});

socket.on('previousMessages', (msgs) => {
  msgs.forEach(({ nome, userId, msg }) => addMessage(nome, userId, msg));
  window.scrollTo(0, document.body.scrollHeight);
});

function addMessage(nome, userId, msg) {
  const item = document.createElement('li');
  const displayName = `${nome}#${userId}`;

  if (userId.toString() === myUserId.toString()) {
    item.textContent = `[${displayName}] ${msg}`;
    item.style.textAlign = 'right';
    item.style.background = '#d0f5c8';
  } else {
    item.textContent = `${msg} [${displayName}]`;
    item.style.textAlign = 'left';
    item.style.background = '#efefef';
  }

  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
}

