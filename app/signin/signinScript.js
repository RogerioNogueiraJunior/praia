import { animateClouds } from '../clouds.js';

document.addEventListener("DOMContentLoaded", animateClouds);

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('btnConfirm').addEventListener('click', async function () {
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;
        const confirm = document.getElementById('senha_confirm').value;
        const alert = document.getElementById('alert');

        if (!email || !senha || !confirm) {
            alert.innerHTML = 'Preencha todos os campos';
            return;
        }

        if (senha !== confirm) {
            alert.innerHTML = 'Senhas não são iguais';
            return;
        }

        try {
            const res = await fetch('/api/inserir', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha })
            });

            const data = await res.json();

            if (data.success) {
                alert.innerHTML = 'Cadastro realizado com sucesso! Redirecionando...';
                setTimeout(() => {
                    window.location.href = '/login';
                }, 1500);
            } else {
                alert.innerHTML = `Erro: ${data.error || 'Erro desconhecido'}`;
            }
        } catch (err) {
            alert.innerHTML = `Erro na requisição: ${err.message}`;
        }
    });
});