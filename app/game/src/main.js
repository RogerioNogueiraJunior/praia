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
        });

        // Novo jogador
        this.socket.on('spawnPlayer', ({ x, y, nome, userId }) => {
            this.spawnPlayer(x, y, nome, userId);
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
            }
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

        this.playerLabels[userId] = this.add.text(x, y - 40, `${nome}#${userId}`, {
            font: '16px Arial',
            fill: '#000',
            backgroundColor: '#fff',
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
