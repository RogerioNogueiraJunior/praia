// document.getElementById('btnConfirm').addEventListener('click', async () => {
//   const nome = document.getElementById('name').value;
//   const senha = document.getElementById('senha').value;

//   try {
//     const res = await fetch('/inserir', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ nome, senha }),
//     });
//     const data = await res.json();

//     if (data.success) {
//       alert('Dados inseridos com sucesso! ID: ' + data.user.id);
//     } else {
//       alert('Erro: ' + data.error);
//     }
//   } catch (err) {
//     alert('Erro na requisição: ' + err.message);
//   }
// });