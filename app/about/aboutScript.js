import { animateClouds } from '../clouds.js';

// Entrar no jogo
document.getElementById('enterButton').addEventListener('click', async e => {
    const nome = JSON.parse(localStorage.getItem('user')).nome;
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Token não encontrado no localStorage!');
        return;
    }

    fetch(`http://localhost:8081/api/transportar-token?token=${encodeURIComponent(token)}&user=${encodeURIComponent(nome)}`)
        .then(res => res.json())
        .then(data => {
        if (data.token,  data.user) {
            window.location.href = `http://localhost:5173/roomSelect.html?token=${encodeURIComponent(data.token)}&user=${encodeURIComponent(nome)}`;
        } else {
            console.log('Erro ao enviar token: ' + (data.error || 'Resposta inesperada'));
        }
        })
        .catch(err => {
        console.log('Erro na requisição: ' + err.message);
        });
});

document.addEventListener("DOMContentLoaded", animateClouds);