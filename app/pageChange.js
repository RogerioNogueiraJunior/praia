document.addEventListener('DOMContentLoaded', () => {


    // Login/Logout dinamicamente
    const authButtons = document.getElementById('authButtons');
    const logoutBtn = document.getElementById('logoutBtn');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const enterbt = document.getElementById('enterButton');
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    const email = user ? user.email : null;
    const name = user ? user.nome : null;

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
        const novoNome = prompt('Digite seu novo nome:');
        if (!name) return;

        try {
            const res = await fetch('/api/name_change', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({email, name: novoNome })
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