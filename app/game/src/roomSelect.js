function parseJwt(token) {
  try {
    const base64Payload = token.split('.')[1];
    const payload = atob(base64Payload);
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token') || localStorage.getItem('token');

  if (!token) {
    window.location.href = 'http://localhost:8081';
    return;
  }

  const payload = parseJwt(token);
  if (!payload || !payload.id) {
    alert('Token inválido ou expirado');
    window.location.href = 'http://localhost:8081';
    return;
  }

  localStorage.setItem('token', token);
  localStorage.setItem('user', payload.nome || 'Desconhecido');
  localStorage.setItem('userId', payload.id.toString());
});


document.getElementById('joinRoomForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const salaId = document.getElementById('salaIdInput').value.trim();

    if (!salaId) {
        alert('Digite o ID da sala para entrar.');
        return;
    }

    try {
        const response = await fetch('http://localhost:8081/api/room/entrar_sala', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idSala: parseInt(salaId) })
        });

        const data = await response.json();

        if (data.success) {
            window.location.href = `http://localhost:5173/?salaId=${salaId}`;
        } else {
            alert('Sala não encontrada. Verifique o ID digitado.');
        }
    } catch (error) {
        console.error('Erro ao verificar sala:', error);
        alert('Erro ao tentar entrar na sala.');
    }
});

document.getElementById('createRoom').addEventListener('submit', async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem('userId');
    if (!userId) {
        alert('Usuário não logado');
        return;
    }

    try {
        const resCreate = await fetch('http://localhost:8081/api/room/criar_sala', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId }),
        });

        const dataCreate = await resCreate.json();

        if (dataCreate.success) {
            const salaId = dataCreate.sala.id;

            // Opcional: Verificar se sala existe antes de redirecionar
            const resEnter = await fetch('http://localhost:8081/api/room/entrar_sala', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idSala: salaId }),
            });

            const dataEnter = await resEnter.json();

            if (dataEnter.success) {
                window.location.href = `http://localhost:5173/?salaId=${salaId}`;
            } else {
                alert('Sala criada, mas não encontrada na verificação.');
            }
        } else {
            alert(dataCreate.error || 'Erro ao criar sala');
        }
    } catch (err) {
        alert(`Erro na requisição: ${err.message}`);
    }
});

const limit = 10;
let currentPage = 1;

async function carregarSalas(page = 1) {
    try {
        const res = await fetch(`http://localhost:8081/api/room/rooms?page=${page}&limit=${limit}`);
        const data = await res.json();

        if (data.success) {
            mostrarSalas(data.salas);
            atualizarPaginacao(data.page, data.totalPages);
        } else {
            alert('Erro ao carregar salas');
        }
    } catch (error) {
        alert('Erro na requisição: ' + error.message);
    }
}

function mostrarSalas(salas) {
    const lista = document.getElementById('listaSalas');
    lista.innerHTML = '';
    const userId = parseInt(localStorage.getItem('userId'));

    salas.forEach(sala => {
        const item = document.createElement('li');
        item.textContent = `Sala ${sala.id} - Criada por: ${sala.creator ? sala.creator.nome : 'Desconhecido'} - Em: ${new Date(sala.createdAt).toLocaleString()}`;

        if (sala.creator && parseInt(sala.creator.id) === userId) {
            const btnDelete = document.createElement('button');
            btnDelete.textContent = 'Apagar';
            btnDelete.style.marginLeft = '10px';
            btnDelete.addEventListener('click', () => deletarSala(sala.id));
            item.appendChild(btnDelete);
        }

        lista.appendChild(item);
    });
}

function atualizarPaginacao(page, totalPages) {
    currentPage = page;
    document.getElementById('paginaAtual').textContent = `Página ${page} de ${totalPages}`;

    document.getElementById('btnPrev').disabled = page <= 1;
    document.getElementById('btnNext').disabled = page >= totalPages;
}

document.getElementById('btnPrev').addEventListener('click', () => {
    if (currentPage > 1) carregarSalas(currentPage - 1);
});

document.getElementById('btnNext').addEventListener('click', () => {
    carregarSalas(currentPage + 1);
});

async function deletarSala(salaId) {
    const userId = localStorage.getItem('userId');

    if (!confirm(`Tem certeza que deseja apagar a sala ${salaId}?`)) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:8081/api/room/room/${salaId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId }),
        });

        const data = await response.json();

        if (data.success) {
            alert('Sala apagada com sucesso!');
            carregarSalas(currentPage);
        } else {
            alert(data.error || 'Erro ao apagar sala.');
        }
    } catch (error) {
        console.error('Erro ao apagar sala:', error);
        alert('Erro na requisição ao tentar apagar sala.');
    }
}


// Carrega primeira página ao iniciar
carregarSalas();
