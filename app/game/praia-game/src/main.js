import './style.css'
const socket = new WebSocket('ws://localhost:3000');

socket.onopen = () => {
  console.log('Conectado ao servidor WebSocket');
  socket.send('Olá servidor!');
};

socket.onmessage = (event) => {
  console.log(`Mensagem recebida do servidor: ${event.data}`);
};

socket.onclose = () => {
  console.log('Conexão WebSocket fechada');
};

