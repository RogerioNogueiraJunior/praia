        const socket = io('http://localhost:3000/chat');
        let myId = null; // Use let, não const!

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
                socket.emit('chat message', { salaId, msg: input.value }); // Envie salaId junto
                input.value = '';
            }
        });

        socket.on('connect', () => {
            myId = socket.id;
        });

        socket.on('chat message', ({ id, msg }) => {
            addMessage(id, msg);
        });

        socket.on('previousMessages', (msgs) => {
            // Aguarda o connect para garantir que myId está definido
            if (!myId) {
                socket.once('connect', () => {
                    renderPreviousMessages(msgs);
                });
            } else {
                renderPreviousMessages(msgs);
            }
        });

        function renderPreviousMessages(msgs) {
            msgs.forEach(({ id, msg }) => addMessage(id, msg));
            window.scrollTo(0, document.body.scrollHeight);
        }

        function addMessage(id, msg) {
            const item = document.createElement('li');
            if (id === myId) {
                item.textContent = `[${id}] ${msg}`;
                item.style.textAlign = 'right';
                item.style.background = '#d0f5c8';
            } else {
                item.textContent = `${msg} [${id}]`;
                item.style.textAlign = 'left';
                item.style.background = '#efefef';
            }
            messages.appendChild(item);
            window.scrollTo(0, document.body.scrollHeight);
        }