import { animateClouds } from '../clouds.js';

// Entrar no jogo
document.getElementById('enterButton').addEventListener('click', async e => {
    window.location.href = `http://localhost:5173/roomSelect`
});

document.addEventListener("DOMContentLoaded", animateClouds);