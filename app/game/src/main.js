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
        this.add.rectangle(0, 0, this.sys.canvas.width, this.sys.canvas.height, 0x00ccf0).setOrigin(0);  
        // Defina os limites do mundo para o tamanho da tela
        this.physics.world.setBounds(0, 0, this.sys.game.config.width, this.sys.game.config.height);
        this.players = {}; // Mapa de jogadores
        this.playerLabels = {}; // Novo: mapa de textos
        
        // Animações para cada direção
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('dude', { start: 4, end: 4}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('dude', { start: 4, end: 4}),
            frameRate: 10,
            repeat: -1
        });

        // Substitui as setas por WASD
        this.keys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        // Conexão com socket.io
        this.socket = io('http://localhost:3000/game');
        // Cria todos os jogadores já conectados
        this.socket.on('currentPlayers', (players) => {
            Object.values(players).forEach(player => {
                if (!this.players[player.id]) {
                    this.players[player.id] = this.physics.add.sprite(player.x, player.y, 'dude');
                    this.players[player.id].setCollideWorldBounds(true); // <-- Adicione aqui!
                    this.playerLabels[player.id] = this.add.text(player.x, player.y - 40, player.id, {
                        font: '16px Arial',
                        fill: '#000',
                        backgroundColor: '#fff',
                        padding: { x: 4, y: 2 }
                    }).setOrigin(0.5);
                }
            });
        });
        // Cria novo jogador
        this.socket.on('spawnPlayer', ({ id, x, y }) => {
            if (!this.players[id]) {
                this.players[id] = this.physics.add.sprite(x, y, 'dude');
                this.players[id].setCollideWorldBounds(true); // <-- Adicione aqui!
                this.playerLabels[id] = this.add.text(x, y - 40, id, {
                    font: '16px Arial',
                    fill: '#000',
                    backgroundColor: '#fff',
                    padding: { x: 4, y: 2 }
                }).setOrigin(0.5);
            }
        });
        // Remove jogador desconectado
        this.socket.on('removePlayer', ({ id }) => {
            if (this.players[id]) {
                this.players[id].destroy();
                this.playerLabels[id].destroy(); // Remover o texto
                delete this.players[id];
                delete this.playerLabels[id]; // Remover do mapa
            }
        });
        // Atualiza posição e animação de outros jogadores
        this.socket.on('playerMoved', ({ id, x, y, anim }) => {
            if (this.players[id]) {
                this.players[id].setPosition(x, y);
                if (anim) {
                    if (anim === 'idle') {
                        this.players[id].anims.stop();
                    } else {
                        this.players[id].anims.play(anim, true);
                    }
                }
            }
        });
        // Guarda o próprio id para controlar
        this.socket.on('connect', () => {
            this.myId = this.socket.id;
        });
    }

    update() {
        if (!this.players[this.myId]) return;
        const player = this.players[this.myId];
        const speed = 200;
        let moved = false;
        let anim = 'idle';
        player.setVelocity(0);
        if (this.keys.left.isDown) {
            player.setVelocityX(-speed);
            player.anims.play('left', true);
            moved = true;
            anim = 'left';
        } else if (this.keys.right.isDown) {
            player.setVelocityX(speed);
            player.anims.play('right', true);
            moved = true;
            anim = 'right';
        } else if (this.keys.up.isDown) {
            player.setVelocityY(-speed);
            player.anims.play('up', true);
            moved = true;
            anim = 'up';
        } else if (this.keys.down.isDown) {
            player.setVelocityY(speed);
            player.anims.play('down', true);
            moved = true;
            anim = 'down';
        } else {
            player.anims.stop();
            anim = 'idle';
        }
        // Envia posição e animação ao servidor se moveu
        if (moved || anim === 'idle') {
            this.socket.emit('playerMovement', { x: player.x, y: player.y, anim });
        }

        // Atualiza a posição dos textos dos jogadores
        Object.keys(this.players).forEach(id => {
            if (this.playerLabels[id]) {
                this.playerLabels[id].setPosition(
                    this.players[id].x,
                    this.players[id].y - 40
                );
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const config = {
        type: Phaser.CANVAS,
        width: window.innerWidth,
        height: window.innerHeight,
        canvas: canvas,
        physics: { default: 'arcade' },
        scene: [GameScene]
    }
    new Phaser.Game(config);
});