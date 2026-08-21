class WorldScene extends Phaser.Scene {
    constructor() {
        super('WorldScene');
        this.tileSize = 64;
        this.playerSpeed = 300; // Maior velocidade por conta da resolução maior
    }

    create() {
        // Criar um mapa simples estruturado
        // 0 = Rua, 1 = Prédio, 2 = Grama Alta
        const mapData = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 0, 1],
            [1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 0, 1],
            [1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ];

        this.obstacles = this.physics.add.staticGroup();
        this.grassGroup = this.physics.add.staticGroup();

        for (let y = 0; y < mapData.length; y++) {
            for (let x = 0; x < mapData[y].length; x++) {
                const tileType = mapData[y][x];
                const posX = x * this.tileSize + (this.tileSize / 2);
                const posY = y * this.tileSize + (this.tileSize / 2);

                let tileSprite;
                if (tileType === 0) {
                    tileSprite = this.add.sprite(posX, posY, 'tile_road_transparent');
                } else if (tileType === 1) {
                    tileSprite = this.obstacles.create(posX, posY, 'tile_building_transparent');
                } else if (tileType === 2) {
                    tileSprite = this.grassGroup.create(posX, posY, 'tile_grass_transparent');
                }
                
                // Redimensionar os tiles gerados para caber no grid de 64x64
                if (tileSprite) {
                    tileSprite.setDisplaySize(this.tileSize, this.tileSize);
                    if (tileType === 1 || tileType === 2) {
                        tileSprite.refreshBody(); // Essencial para grupos estáticos no Phaser
                    }
                }
            }
        }

        // Criar Jogador com imagem transparente
        let spawnX = PlayerState.lastX || 2 * this.tileSize;
        let spawnY = PlayerState.lastY || 4 * this.tileSize;
        this.player = this.physics.add.sprite(spawnX, spawnY, 'player_transparent');
        this.player.setDisplaySize(this.tileSize, this.tileSize);
        // A imagem original tem 1024x1024 e foi escalada para 64x64.
        // Ao reduzir o tamanho do corpo físico interno, evitamos que ele "engache" nas quinas.
        this.player.body.setSize(800, 800); 
        this.player.body.setOffset(112, 112); // Centraliza a hitbox no meio da textura de 1024x1024
        this.player.setCollideWorldBounds(true);
        this.physics.world.bounds.width = mapData[0].length * this.tileSize;
        this.physics.world.bounds.height = mapData.length * this.tileSize;

        // Câmera
        this.cameras.main.setBounds(0, 0, mapData[0].length * this.tileSize, mapData.length * this.tileSize);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        
        // Efeito de fade-in ao entrar na tela
        this.cameras.main.fadeIn(500, 0, 0, 0);

        // Criar NPC (Enfermeira) no centro do mapa
        this.nurse = this.physics.add.sprite(15 * this.tileSize, 8 * this.tileSize, 'nurse_transparent');
        // Aumenta o tamanho pois ela foi desenhada em 16x16 pixels originais
        this.nurse.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
        this.nurse.setDisplaySize(this.tileSize, this.tileSize);
        this.nurse.body.setSize(16, 16); 
        this.nurse.setImmovable(true);

        // Exclamação (escondida por padrão)
        this.exclamation = this.add.text(15 * this.tileSize, 7 * this.tileSize, '!', { fill: '#ff0000', fontSize: '64px', fontStyle: 'bold' }).setOrigin(0.5, 0.5);
        this.exclamation.setVisible(false);

        // Colisões
        this.physics.add.collider(this.player, this.obstacles);
        this.physics.add.collider(this.player, this.nurse);
        
        // Input: WASD + ENTER para interagir
        this.keys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            enter: Phaser.Input.Keyboard.KeyCodes.ENTER
        });

        this.isMoving = false;
        this.lastTile = { x: -1, y: -1 };
    }

    update() {
        this.player.body.setVelocity(0);

        // Movimento
        if (this.keys.left.isDown) {
            this.player.body.setVelocityX(-this.playerSpeed);
        } else if (this.keys.right.isDown) {
            this.player.body.setVelocityX(this.playerSpeed);
        }

        if (this.keys.up.isDown) {
            this.player.body.setVelocityY(-this.playerSpeed);
        } else if (this.keys.down.isDown) {
            this.player.body.setVelocityY(this.playerSpeed);
        }

        let currentTileX = Math.floor(this.player.x / this.tileSize);
        let currentTileY = Math.floor(this.player.y / this.tileSize);

        if (this.player.body.velocity.x !== 0 || this.player.body.velocity.y !== 0) {
            if (currentTileX !== this.lastTile.x || currentTileY !== this.lastTile.y) {
                this.lastTile = { x: currentTileX, y: currentTileY };
                this.checkEncounter();
            }
        }

        // Lógica da Enfermeira (NPC)
        let dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.nurse.x, this.nurse.y);
        if (dist < 90) { // Próximo o suficiente
            this.exclamation.setVisible(true);
            if (Phaser.Input.Keyboard.JustDown(this.keys.enter)) {
                // Curar todos os monstros da equipe
                PlayerState.team.forEach(m => m.hp = m.maxHp);
                
                // Feedback visual de cura
                this.exclamation.setText('♥');
                this.exclamation.setFill('#00ff00');
                
                // Voltar ao normal após um tempo
                this.time.delayedCall(1000, () => {
                    this.exclamation.setText('!');
                    this.exclamation.setFill('#ff0000');
                });
            }
        } else {
            this.exclamation.setVisible(false);
            this.exclamation.setText('!');
            this.exclamation.setFill('#ff0000');
        }
    }

    checkEncounter() {
        const touchingGrass = this.physics.overlap(this.player, this.grassGroup);
        if (touchingGrass) {
            // 10% de chance de batalha
            if (Math.random() < 0.10) {
                this.startBattle();
            }
        }
    }

    startBattle() {
        this.player.body.setVelocity(0);
        this.input.keyboard.resetKeys();

        // Salvar posição atual para voltar no mesmo lugar
        PlayerState.lastX = this.player.x;
        PlayerState.lastY = this.player.y;

        this.cameras.main.flash(500, 255, 255, 255);
        this.time.delayedCall(500, () => {
            this.scene.start('BattleScene');
        });
    }
}
