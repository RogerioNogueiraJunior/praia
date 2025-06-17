import { animateClouds } from '/app/clouds.js';

document.addEventListener("DOMContentLoaded", animateClouds);

// Entrar no jogo
document.getElementById('enterButton').addEventListener('click', async e => {
    window.location.href = `http://localhost:5173/roomSelect`
});

async function fetchData() {
    const response = await fetch('http://localhost:8081/api/data');
    const data = await response.json();
    console.log(data.message); // Exibe "Dados do backend!"
}

window.onload = fetchData