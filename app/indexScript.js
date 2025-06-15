import { animateClouds } from '/app/clouds.js';

document.addEventListener("DOMContentLoaded", animateClouds);

async function fetchData() {
    const response = await fetch('http://localhost:8081/api/data');
    const data = await response.json();
    console.log(data.message); // Exibe "Dados do backend!"
}

window.onload = fetchData