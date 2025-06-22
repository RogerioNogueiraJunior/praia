function parseJwt(token) {
    try {
        const base64Payload = token.split('.')[1];
        const payload = atob(base64Payload);
        return JSON.parse(payload);
    } catch {
        return null;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    let token = localStorage.getItem('token');
    let userPayload = token ? parseJwt(token) : null;

    const authButtons = document.getElementById('authButtons');
    const logoutBtn = document.getElementById('logoutBtn');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const enterbt = document.getElementById('enterButton');

    const name = userPayload?.nome;
    const email = userPayload?.email;
    const lastNameChange = localStorage.getItem('lastNameChange');

    if (userPayload) {
        welcomeMessage.textContent = `Bem-vindo, ${name}`;
        authButtons.style.display = 'none';
        enterbt.style.display = 'flex';
        logoutBtn.style.display = 'block';
    } else {
        authButtons.style.display = 'flex';
        enterbt.style.display = 'none';
        logoutBtn.style.display = 'none';
    }

    // Logout
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('lastNameChange');
        location.reload();
    });

    // Troca de nome (limitada a 1 vez por dia)
    welcomeMessage.addEventListener('click', async () => {
        if (!email) return;

        const agora = Date.now();
        if (lastNameChange && (agora - parseInt(lastNameChange)) < 24 * 60 * 60 * 1000) {
            alert('Espere 24h para trocar de nome novamente.');
            return;
        }

        const novoNome = prompt('Digite seu novo nome:');
        if (!novoNome || novoNome.trim() === '') return;

        try {
            const res = await fetch('/api/name_change', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ email, name: novoNome })
            });

            const data = await res.json();

            if (data.success && data.newToken) {
                // Salva o novo token
                localStorage.setItem('token', data.newToken);
                localStorage.setItem('lastNameChange', agora.toString());

                // Atualiza o token usado no código JS
                token = data.newToken;
                userPayload = parseJwt(data.newToken);

                // Atualiza a interface
                welcomeMessage.textContent = `Bem-vindo, ${userPayload.nome}`;
                alert('Nome alterado com sucesso!');
            } else {
                alert('Erro: ' + data.error);
            }
        } catch (err) {
            console.error(`Erro na requisição: ${err.message}`);
        }
    });
});
