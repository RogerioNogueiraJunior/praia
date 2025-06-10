document.addEventListener('DOMContentLoaded', () => {
    // Entrar no jogo
    document.getElementById('enterButton').addEventListener('click', e => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        const nome = user ? encodeURIComponent(user.nome) : '';
        if (token) {
            window.location.href = `http://localhost:3000/?token=${token}&nome=${nome}`;
        }
    });

    // Login/Logout dinamicamente
    const authButtons = document.getElementById('authButtons');
    const logoutBtn = document.getElementById('logoutBtn');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const enterbt = document.getElementById('enterButton');
    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
        // Usuário logado
        welcomeMessage.textContent = `Bem-vindo, ${user.nome}`;
        authButtons.style.display = 'none';
        enterbt.style.display = 'flex';
        logoutBtn.style.display = 'block';
    } else {
        // Usuário deslogado
        authButtons.style.display = 'flex';
        enterbt.style.display = 'none';
        logoutBtn.style.display = 'none';
    }

    // Logout
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('user');
        location.reload();
    });

    // troca de nome de usuário
    welcomeMessage.addEventListener('click', async () => {
        const user = JSON.parse(localStorage.getItem('user'));

        const name = prompt('Digite seu novo nome:');
        if (!name) return;

        try {
            const res = await fetch('/name_change', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email, name })
            });

            const data = await res.json();

            if (data.success) {
                localStorage.setItem('user', JSON.stringify(data.user));
                welcomeMessage.textContent = `Bem-vindo, ${data.user.nome}`;
            } else {
                alert('Erro: ' + data.error);
            }
        } catch (err) {
            console.log(`Erro na requisição: ${err.message}`);
        }
    });
});