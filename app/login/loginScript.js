import { animateClouds } from '../clouds.js';

document.addEventListener("DOMContentLoaded", animateClouds);

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('btnEnter').addEventListener('click', async () => {
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;
        const alert = document.getElementById('alert');

        if (!email || !senha) {
            alert.innerText = 'Preencha todos os campos';
            return;
        }

        try {
        const res = await fetch('http://localhost:8081/api/entrar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha }),
        });

        const data = await res.json();
        if (data.success) {
            // ARMAZENE O TOKEN E O USUÁRIO
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            // Redirecione para o jogo ou dashboard
            window.location.href = 'http://localhost:5173/app/game/roomSelect.html';
        } else {
            alert.innerText = data.error;
        }
        } catch (err) {
            alert.innerText = `Erro na requisição: ${err.message}`;
        }
    });
});