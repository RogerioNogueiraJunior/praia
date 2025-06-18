import { io } from 'socket.io-client';

        const token = localStorage.getItem('token');
        const socket = io('http://localhost:3000/chat', {
          auth: { token },
          transports: ['websocket'],
        });
        
        let nome = localStorage.getItem('user'); // Use let, não const!

        const form = document.getElementById('form');
        const input = document.getElementById('input');
        const messages = document.getElementById('messages');

        const urlParams = new URLSearchParams(window.location.search);
        const salaId = urlParams.get('salaId');
        socket.emit('joinRoom', { salaId });
        if (!salaId) {
            window.top.location.href = 'http://localhost:8081/';
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (input.value) {
                socket.emit('chat message', { salaId, msg: input.value, nome}); // Envie salaId junto
                input.value = '';
            }
        });

        socket.on('connect', () => {
            token = localStorage.getItem('token');
        });

        socket.on('chat message', ({ nome, msg }) => {
            addMessage(nome, msg);
        });

        socket.on('previousMessages', (msgs) => {
            // Aguarda o connect para garantir que myId está definido
            if (!nome) {
                socket.once('connect', () => {
                    renderPreviousMessages(msgs);
                });
            } else {
                renderPreviousMessages(msgs);
            }
        });

        function renderPreviousMessages(msgs) {
            msgs.forEach(({ nome, msg }) => addMessage(nome, msg));
            window.scrollTo(0, document.body.scrollHeight);
        }

        function addMessage(nome, msg) {
            const item = document.createElement('li');
            if (nome === localStorage.getItem('user')) { 
                item.textContent = `[${nome}] ${msg}`;
                item.style.textAlign = 'right';
                item.style.background = '#d0f5c8';
            } else {
                item.textContent = `${msg} [${nome}]`;
                item.style.textAlign = 'left';
                item.style.background = '#efefef';
            }
            messages.appendChild(item);
            window.scrollTo(0, document.body.scrollHeight);
        }