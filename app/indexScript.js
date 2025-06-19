import { animateClouds } from '/app/clouds.js';

document.addEventListener("DOMContentLoaded", animateClouds);

// Entrar no jogo
document.getElementById('enterButton').addEventListener('click', async e => {
    const nome = JSON.parse(localStorage.getItem('user')).nome;
    const userId = JSON.parse(localStorage.getItem('user')).id;
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Token não encontrado no localStorage!');
        return;
    }

    fetch(`http://localhost:8081/api/transportar-token?token=${encodeURIComponent(token)}&user=${encodeURIComponent(nome)}&userId=${encodeURIComponent(userId)}`)
        .then(res => res.json())
        .then(data => {
        if (data.token,  data.user) {
            window.location.href = `http://localhost:5173/roomSelect.html?token=${encodeURIComponent(data.token)}&user=${encodeURIComponent(nome)}&userId=${encodeURIComponent(userId)}`;
        } else {
            console.log('Erro ao enviar token: ' + (data.error || 'Resposta inesperada'));
        }
        })
        .catch(err => {
        console.log('Erro na requisição: ' + err.message);
        });
});

async function fetchData() {
    const response = await fetch('http://localhost:8081/api/data');
    const data = await response.json();
    console.log(data.message); // Exibe "Dados do backend!"
}

window.onload = fetchData