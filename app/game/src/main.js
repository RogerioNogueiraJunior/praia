import './style.css'
import Phaser from 'phaser'
import { io } from 'socket.io-client'

class GameScene extends Phaser.Scene {
  constructor() {
    super("scene-game");
  }

  preload() {
    this.load.spritesheet('dude', 'assets/dude.png', {
      frameWidth: 32,
      frameHeight: 48
    });
  }

  create() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('user');
    const userId = localStorage.getItem('userId');

    if (!token || !username || !userId) {
      window.location.href = 'http://localhost:8081/';
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const salaId = urlParams.get('salaId');
    if (!salaId) {
      window.location.href = 'http://localhost:8081/';
      return;
    }

    this.salaId = salaId;
    this.username = username;
    this.myUserId = userId;

    this.players = {};       // { userId: sprite }
    this.playerLabels = {};  // { userId: label }

    this.isAdmin = false;
    this.adminPanelList = null;
    this.adminUserId = null; // Armazena o userId do admin atual

    this.add.rectangle(0, 0, this.sys.canvas.width, this.sys.canvas.height, 0x00ccf0).setOrigin(0);
    this.physics.world.setBounds(0, 0, this.sys.game.config.width, this.sys.game.config.height);

    this.anims.create({ key: 'left', frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'right', frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'up', frames: this.anims.generateFrameNumbers('dude', { start: 4, end: 4 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'down', frames: this.anims.generateFrameNumbers('dude', { start: 4, end: 4 }), frameRate: 10, repeat: -1 });

    this.keys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });

    this.socket = io('http://localhost:3000/game', {
      auth: { token },
      transports: ['websocket'],
    });

    // Entra na sala
    this.socket.emit('joinRoom', { salaId: salaId, nome: username, userId: userId });

    // Jogadores já existentes
    this.socket.on('currentPlayers', (players) => {
      Object.values(players).forEach(player => {
        this.spawnPlayer(player.x, player.y, player.nome, player.userId);
      });
      this.updateAdminLabels();
      this.updateAdminPlayerList(players);
    });

    // Novo jogador
    this.socket.on('spawnPlayer', ({ x, y, nome, userId }) => {
      this.spawnPlayer(x, y, nome, userId);
      this.updateAdminLabels();
      this.updateAdminPlayerList();
    });

    // Movimentação dos outros
    this.socket.on('playerMoved', ({ nome, x, y, anim, userId }) => {
      const player = this.players[userId];
      if (player) {
        player.setPosition(x, y);
        if (anim) {
          if (anim === 'idle') {
            player.anims.stop();
          } else {
            player.anims.play(anim, true);
          }
        }
        this.updatePlayerLabelPosition(userId);
      }
    });

    // Remover jogador
    this.socket.on('removePlayer', ({ userId }) => {
      if (this.players[userId]) {
        this.players[userId].destroy();
        this.playerLabels[userId].destroy();
        delete this.players[userId];
        delete this.playerLabels[userId];
        this.updateAdminPlayerList();
      }
    });

    // Status admin
    this.socket.on('adminStatus', ({ isAdmin, adminUserId }) => {
      this.isAdmin = isAdmin;
      this.adminUserId = adminUserId || null;
      this.updateAdminLabels();

      if (isAdmin && !this.adminPanelList) {
        this.createAdminUI();
      }
    });

    // Forçar desconexão (kick)
    this.socket.on('forceDisconnect', () => {
      this.socket.emit('playerLeaving', { salaId: this.salaId, userId: this.myUserId });
      alert('Você foi removido da sala pelo administrador.');
      this.socket.disconnect();
      window.location.href = 'http://localhost:8081';
    });
    if (salaId) {
      const salaLabel = document.getElementById('salaIdLabel');
      if (salaLabel) {
        salaLabel.textContent = `Sala: ${salaId}`;
      }
    }
  }

  spawnPlayer(x, y, nome, userId) {
    if (this.players[userId]) return; // Evitar duplicados

    const sprite = this.physics.add.sprite(x, y, 'dude');
    sprite.setCollideWorldBounds(true);
    this.players[userId] = sprite;

    const isAdminPlayer = userId == this.adminUserId;
    this.playerLabels[userId] = this.add.text(x, y - 40, `${nome}#${userId}`, {
      font: '16px Arial',
      fill: isAdminPlayer ? '#000' : '#000',
      backgroundColor: isAdminPlayer ? '#FFD700' : '#fff',
      padding: { x: 4, y: 2 }
    }).setOrigin(0.5);

    this.updatePlayerLabelPosition(userId);
  }

  updatePlayerLabelPosition(userId) {
    if (this.playerLabels[userId] && this.players[userId]) {
      this.playerLabels[userId].setPosition(
        this.players[userId].x,
        this.players[userId].y - 40
      );
    }
  }

  updateAdminLabels() {
    Object.keys(this.playerLabels).forEach(userId => {
      const label = this.playerLabels[userId];
      if (!label) return;
      const isAdminPlayer = userId == this.adminUserId;
      label.setStyle({
        fill: isAdminPlayer ? '#000' : '#000',
        backgroundColor: isAdminPlayer ? '#FFD700' : '#fff'
      });
    });
  }

  createAdminUI() {
    if (this.adminPanelList) return; // já criado

    const adminPanel = document.createElement('div');
    adminPanel.style.position = 'fixed';
    adminPanel.style.top = '60px';
    adminPanel.style.right = '10px';
    adminPanel.style.backgroundColor = 'rgba(0,0,0,0.8)';
    adminPanel.style.padding = '10px';
    adminPanel.style.borderRadius = '8px';
    adminPanel.style.color = 'white';
    adminPanel.style.zIndex = 10000;

    const title = document.createElement('h3');
    title.textContent = 'Admin: Jogadores na sala';
    adminPanel.appendChild(title);

    const list = document.createElement('ul');
    adminPanel.appendChild(list);

    document.body.appendChild(adminPanel);

    this.adminPanelList = list;

    this.updateAdminPlayerList();
  }

  updateAdminPlayerList(players) {
    if (!this.isAdmin || !this.adminPanelList) return;

    // players pode vir vazio, usa players atuais (sprites) para nome e userId
    if (!players) {
      players = {};
      Object.keys(this.players).forEach(uid => {
        players[uid] = {
          nome: this.playerLabels[uid]?.text.split('#')[0],
          userId: uid
        }
      });
    }

    this.adminPanelList.innerHTML = '';

    Object.values(players).forEach(player => {
      if (!player) return;
      if (player.userId == this.myUserId) return; // não pode remover ele mesmo

      const li = document.createElement('li');
      li.textContent = `${player.nome} (${player.userId}) `;

      const btn = document.createElement('button');
      btn.textContent = 'Remover';
      btn.style.marginLeft = '10px';
      btn.onclick = () => {
        this.socket.emit('removePlayerRequest', { targetUserId: player.userId });
      };

      li.appendChild(btn);
      this.adminPanelList.appendChild(li);
    });
  }

  update() {
    const myPlayer = this.players[this.myUserId];
    if (!myPlayer) return;

    const speed = 200;
    let moved = false;
    let anim = 'idle';

    myPlayer.setVelocity(0);

    if (this.keys.left.isDown) {
      myPlayer.setVelocityX(-speed);
      myPlayer.anims.play('left', true);
      moved = true;
      anim = 'left';
    } else if (this.keys.right.isDown) {
      myPlayer.setVelocityX(speed);
      myPlayer.anims.play('right', true);
      moved = true;
      anim = 'right';
    } else if (this.keys.up.isDown) {
      myPlayer.setVelocityY(-speed);
      myPlayer.anims.play('up', true);
      moved = true;
      anim = 'up';
    } else if (this.keys.down.isDown) {
      myPlayer.setVelocityY(speed);
      myPlayer.anims.play('down', true);
      moved = true;
      anim = 'down';
    } else {
      myPlayer.anims.stop();
    }

    if (moved || anim === 'idle') {
      this.socket.emit('playerMovement', {
        x: myPlayer.x,
        y: myPlayer.y,
        anim: anim
      });
    }

    // Atualizar labels de todos os jogadores
    Object.keys(this.players).forEach(userId => {
      this.updatePlayerLabelPosition(userId);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameCanvas');
  const config = {
    type: Phaser.CANVAS,
    width: 1920,
    height: 1080,
    canvas: canvas,
    physics: { default: 'arcade' },
    scene: [GameScene]
  }
  new Phaser.Game(config);
});
