class BattleScene extends Phaser.Scene {
    constructor() {
        super('BattleScene');
    }

    create() {
        // Fade in na entrada da batalha
        this.cameras.main.fadeIn(500, 255, 255, 255); // Fade in branco para linkar com o flash

        // Fundo verde base
        this.cameras.main.setBackgroundColor('#2d8a39'); 

        // Fundo gramado (usando o tile cortado)
        this.add.tileSprite(0, 0, 1920, 1080, 'tile_grass_transparent').setOrigin(0, 0);

        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();

        this.playerMonsterData = PlayerState.team[0];
        let randomWildId = Phaser.Math.Between(2, 8);
        this.wildMonsterData = { ...MonstersData[randomWildId] };

        // Títulos
        this.add.text(50, 50, 'BATALHA!', { fill: '#ffffff', fontSize: '64px', fontFamily: 'monospace' }).setShadow(3, 3, '#000', 2, true, true);

        // --- SPRITES DOS MONSTROS (Gerados via Pixel Art) ---
        // Sprite Inimigo (Canto superior direito)
        this.wildSprite = this.add.sprite(1500, 350, 'monster_' + this.wildMonsterData.id);
        // Desativar antialiasing para manter o pixel art puro ao esticar
        this.wildSprite.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
        this.wildSprite.setDisplaySize(384, 384);
        
        // Sprite Jogador (Canto inferior esquerdo)
        this.playerSprite = this.add.sprite(400, 750, 'monster_' + this.playerMonsterData.id);
        this.playerSprite.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
        this.playerSprite.setDisplaySize(384, 384);

        // --- CAIXAS DE UI (Para não sobrepor imagens) ---
        // UI do Inimigo (Canto superior esquerdo)
        this.add.graphics().fillStyle(0x000000, 0.7).fillRoundedRect(100, 150, 500, 120, 16);
        this.wildNameText = this.add.text(120, 160, this.wildMonsterData.name + " Lvl 5", { fill: '#ffffff', fontSize: '32px', fontFamily: 'monospace' });
        this.wildHpGraphics = this.add.graphics();
        this.drawHpBar(this.wildHpGraphics, 120, 220, this.wildMonsterData.hp, this.wildMonsterData.maxHp);

        // UI do Jogador (Canto inferior direito)
        this.add.graphics().fillStyle(0x000000, 0.7).fillRoundedRect(1300, 600, 500, 120, 16);
        this.playerNameText = this.add.text(1320, 610, this.playerMonsterData.name + " Lvl 5", { fill: '#ffffff', fontSize: '32px', fontFamily: 'monospace' });
        this.playerHpGraphics = this.add.graphics();
        this.drawHpBar(this.playerHpGraphics, 1320, 670, this.playerMonsterData.hp, this.playerMonsterData.maxHp);

        // Caixa de Diálogo (Bottom)
        this.add.graphics().fillStyle(0x000000, 0.8).fillRoundedRect(50, 850, 1100, 200, 16);
        this.dialogueText = this.add.text(80, 880, `Um selvagem ${this.wildMonsterData.name} apareceu!`, { 
            fill: '#ffffff', 
            fontSize: '48px',
            fontFamily: 'monospace',
            wordWrap: { width: 1000 } 
        });

        // Menu de Ações (Bottom Right)
        this.add.graphics().fillStyle(0x000000, 0.8).fillRoundedRect(1200, 850, 650, 200, 16);
        this.options = ['ATACAR', 'CAPTURAR', 'FUGIR'];
        this.currentOptionIndex = 0;
        
        this.optionTexts = [];
        for (let i = 0; i < this.options.length; i++) {
            let color = i === 0 ? '#ffff00' : '#ffffff';
            let text = this.add.text(1250, 870 + (i * 50), (i === 0 ? '> ' : '  ') + this.options[i], { 
                fill: color, 
                fontSize: '42px',
                fontFamily: 'monospace'
            });
            this.optionTexts.push(text);
        }

        // Input do Teclado
        this.keys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            enter: Phaser.Input.Keyboard.KeyCodes.ENTER
        });

        this.isPlayerTurn = true;
        this.menuActive = true;
        this.inputDelay = false;
    }

    drawHpBar(graphics, x, y, hp, maxHp) {
        graphics.clear();
        let barWidth = 400;
        let barHeight = 24;
        
        // Fundo (Cinza/Vermelho Escuro)
        graphics.fillStyle(0x555555);
        graphics.fillRect(x, y, barWidth, barHeight);
        
        // Barra Verde (proporcional)
        let percent = Math.max(0, hp / maxHp);
        let color = percent > 0.5 ? 0x00ff00 : (percent > 0.2 ? 0xffff00 : 0xff0000); // Muda de cor se estiver baixo
        
        graphics.fillStyle(color);
        graphics.fillRect(x, y, barWidth * percent, barHeight);
    }

    update() {
        if (!this.isPlayerTurn || !this.menuActive || this.inputDelay) return;

        if (this.keys.down.isDown) {
            this.currentOptionIndex = (this.currentOptionIndex + 1) % this.options.length;
            this.updateMenuVisuals();
            this.triggerInputDelay();
        } else if (this.keys.up.isDown) {
            this.currentOptionIndex = (this.currentOptionIndex - 1 + this.options.length) % this.options.length;
            this.updateMenuVisuals();
            this.triggerInputDelay();
        } else if (this.keys.enter.isDown) {
            this.selectOption();
            this.triggerInputDelay();
        }
    }

    triggerInputDelay() {
        this.inputDelay = true;
        this.time.delayedCall(200, () => {
            this.inputDelay = false;
        });
    }

    updateMenuVisuals() {
        for (let i = 0; i < this.options.length; i++) {
            if (i === this.currentOptionIndex) {
                this.optionTexts[i].setText('> ' + this.options[i]);
                this.optionTexts[i].setFill('#ffff00');
            } else {
                this.optionTexts[i].setText('  ' + this.options[i]);
                this.optionTexts[i].setFill('#ffffff');
            }
        }
    }

    selectOption() {
        this.menuActive = false;
        let selected = this.options[this.currentOptionIndex];

        if (selected === 'ATACAR') {
            this.playerAttack();
        } else if (selected === 'CAPTURAR') {
            this.tryCatch();
        } else if (selected === 'FUGIR') {
            this.flee();
        }
    }

    playOscillator(type, freq, duration) {
        if (!this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        const gainNode = this.audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
        osc.connect(gainNode);
        gainNode.connect(this.audioCtx.destination);
        osc.start();
        gainNode.gain.exponentialRampToValueAtTime(0.00001, this.audioCtx.currentTime + duration);
        osc.stop(this.audioCtx.currentTime + duration);
    }

    playHitSound() { this.playOscillator('square', 150, 0.2); }
    playExplosionSound() { this.playOscillator('sawtooth', 50, 0.5); }
    
    playCatchSound() {
        this.playOscillator('square', 440, 0.2);
        setTimeout(() => this.playOscillator('square', 554, 0.2), 200);
        setTimeout(() => this.playOscillator('square', 659, 0.4), 400);
    }

    playerAttack() {
        if (!this.isPlayerTurn) return;
        this.isPlayerTurn = false;

        let damage = Phaser.Math.Between(this.playerMonsterData.attack - 5, this.playerMonsterData.attack + 5);
        this.wildMonsterData.hp = Math.max(0, this.wildMonsterData.hp - damage);
        
        this.updateUI();
        this.playHitSound();
        this.dialogueText.setText(`${this.playerMonsterData.name} atacou! Causou ${damage} de dano.`);
        this.cameras.main.shake(100, 0.01);

        this.time.delayedCall(1500, () => {
            if (this.wildMonsterData.hp <= 0) {
                this.victory();
            } else {
                this.enemyTurn();
            }
        });
    }

    enemyTurn() {
        let damage = Phaser.Math.Between(this.wildMonsterData.attack - 5, this.wildMonsterData.attack + 5);
        this.playerMonsterData.hp = Math.max(0, this.playerMonsterData.hp - damage);
        
        this.updateUI();
        this.playHitSound();
        this.dialogueText.setText(`${this.wildMonsterData.name} atacou! Causou ${damage} de dano.`);
        this.cameras.main.shake(100, 0.01);

        this.time.delayedCall(1500, () => {
            if (this.playerMonsterData.hp <= 0) {
                this.defeat();
            } else {
                this.resetPlayerTurn();
            }
        });
    }

    tryCatch() {
        if (!this.isPlayerTurn) return;
        this.isPlayerTurn = false;

        this.dialogueText.setText(`Você jogou um Dispositivo de Captura!`);
        
        this.time.delayedCall(1500, () => {
            // Lógica de Captura Escalonada (HP Cheio = Muito difícil, HP Baixo = Muito fácil)
            let hpPercent = this.wildMonsterData.hp / this.wildMonsterData.maxHp;
            
            // Exemplo: 5% base + até 75% bônus dependendo de quanto HP perdeu
            let catchChance = 0.05 + (1 - hpPercent) * 0.75; 
            
            if (Math.random() < catchChance) {
                this.catchSuccess();
            } else {
                this.dialogueText.setText("Oh não! O monstro escapou!");
                this.time.delayedCall(1500, () => {
                    this.enemyTurn();
                });
            }
        });
    }

    catchSuccess() {
        this.playCatchSound();
        this.dialogueText.setText(`Sucesso! ${this.wildMonsterData.name} foi capturado!`);
        if (PlayerState.team.length < 6) PlayerState.team.push(this.wildMonsterData);

        this.time.delayedCall(2500, () => this.endBattle());
    }

    flee() {
        this.dialogueText.setText("Você fugiu com sucesso!");
        this.time.delayedCall(1500, () => this.endBattle());
    }

    victory() {
        this.playExplosionSound();
        this.wildSprite.destroy();
        this.dialogueText.setText(`${this.wildMonsterData.name} foi derrotado!`);
        this.time.delayedCall(2000, () => this.endBattle());
    }

    defeat() {
        this.dialogueText.setText(`${this.playerMonsterData.name} desmaiou! Você perdeu.`);
        
        this.time.delayedCall(2000, () => {
            // Tela preta (Fade Out)
            this.cameras.main.fadeOut(1000, 0, 0, 0);
            
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                // Recupera a vida do jogador
                this.playerMonsterData.hp = this.playerMonsterData.maxHp;
                // Volta ao mapa
                this.scene.start('WorldScene');
            });
        });
    }

    resetPlayerTurn() {
        this.isPlayerTurn = true;
        this.menuActive = true;
        this.dialogueText.setText("O que você vai fazer?");
    }

    endBattle() {
        // Para vitórias ou capturas (ou fugir), podemos fazer fade out rápido
        this.cameras.main.fadeOut(300, 255, 255, 255); // fade to white
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            this.scene.start('WorldScene');
        });
    }

    updateUI() {
        // Redesenhar as barras de vida com o HP atual
        this.drawHpBar(this.wildHpGraphics, 120, 220, this.wildMonsterData.hp, this.wildMonsterData.maxHp);
        this.drawHpBar(this.playerHpGraphics, 1320, 670, this.playerMonsterData.hp, this.playerMonsterData.maxHp);
    }
}
