class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // Exibir texto de loading
        let loadingText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'Carregando...', {
            font: '32px monospace',
            fill: '#ffffff'
        }).setOrigin(0.5, 0.5);

        // Carregar apenas os assets base de ambiente e jogador
        this.load.image('tile_grass', 'assets/grass_tile.jpg');
        this.load.image('tile_road', 'assets/road_tile.jpg');
        this.load.image('tile_building', 'assets/building_tile.jpg');
        this.load.image('player', 'assets/protagonist.jpg');
    }

    create() {
        // Cortar bordas brancas dos cenários e do player
        this.removeWhiteAndCrop('player');
        this.removeWhiteAndCrop('tile_grass');
        this.removeWhiteAndCrop('tile_road');
        this.removeWhiteAndCrop('tile_building');

        // Gerar sprites procedurais para a Enfermeira e para os 8 monstros
        this.generateNurseTexture();
        this.generateAllMonsters();

        // Após carregar e processar tudo, transitar para a cena principal
        this.scene.start('WorldScene');
    }

    generateAllMonsters() {
        // 1. Sparky (Elétrico/Amarelo/Rato)
        this.createPixelArt('monster_1', [
            "0000000000000000",
            "0Y000000000000B0",
            "0YY00000000000B0",
            "0BYY0000000000Y0",
            "00YY00000YYYYYY0",
            "00YY0000YYYYYYY0",
            "000YYYYYYYYYYYY0",
            "000YYYYYYYYYYYY0",
            "000YBYYYBYYYYYY0",
            "000YYYYYYYYYRYY0",
            "000YRYYYYYYYYYY0",
            "000YYYYYYYYYYYY0",
            "0000Y000Y000Y000",
            "000BB00BB00BB000",
            "0000000000000000",
            "0000000000000000"
        ], { '0': 'rgba(0,0,0,0)', 'Y': '#ffea00', 'B': '#000000', 'R': '#ff0000' });

        // 2. Burnapillar (Fogo/Vermelho/Lagarta Bípede)
        this.createPixelArt('monster_2', [
            "0000000000000000",
            "000R0000000R0000",
            "0000R00000R00000",
            "0000RR000RR00000",
            "000RRRRRRRRR0000",
            "00RRRRRRRRRRR000",
            "00RBRRRRRRRBR000",
            "00RRRRRRRRRRR000",
            "000RRRRRRRRR0000",
            "000RRORRRORR0000",
            "000RRRRRRRRR0000",
            "000RRORRRORR0000",
            "000RRRRRRRRR0000",
            "000BB00000BB0000",
            "0000000000000000",
            "0000000000000000"
        ], { '0': 'rgba(0,0,0,0)', 'R': '#ff0000', 'O': '#ffa500', 'B': '#000000' });

        // 3. Toadleaf (Grama/Verde/Sapo)
        this.createPixelArt('monster_3', [
            "0000000000000000",
            "0000000000000000",
            "00000DD00DD00000",
            "0000DDDDDDDD0000",
            "000DGGGGGGGGD000",
            "000GBG0000GBG000",
            "00GGGGGGGGGGGG00",
            "00GGGGGGGGGGGG00",
            "0GGGGGGGGGGGGGG0",
            "0GGGGGGGGGGGGGG0",
            "00GGGGGGGGGGGG00",
            "0BB00GGGGGG00BB0",
            "BBB00BB00BB00BBB",
            "0000000000000000",
            "0000000000000000",
            "0000000000000000"
        ], { '0': 'rgba(0,0,0,0)', 'G': '#32cd32', 'D': '#006400', 'B': '#000000' });

        // 4. Shelljet (Água/Azul/Tartaruga)
        this.createPixelArt('monster_4', [
            "0000000000000000",
            "0000000000000000",
            "000000LLLL000000",
            "00000LLLLLL00000",
            "0000LLKLLKLL0000",
            "0000LLLLLLLL0000",
            "00LLSSSSSSSSLL00",
            "00LSSSSSSSSSSL00",
            "0LSSSSSSSSSSSSL0",
            "0LSSSSSSSSSSSSL0",
            "00LSSSSSSSSSSL00",
            "000LLLLLLLLLL000",
            "0000L000000L0000",
            "0000K000000K0000",
            "0000000000000000",
            "0000000000000000"
        ], { '0': 'rgba(0,0,0,0)', 'B': '#0000ff', 'L': '#87cefa', 'S': '#8b4513', 'K': '#000000' });

        // 5. Mudclaw (Terra/Marrom/Toupeira)
        this.createPixelArt('monster_5', [
            "0000000000000000",
            "0000000000000000",
            "000000MMMM000000",
            "00000MMMMMM00000",
            "000MMMMMMMMMM000",
            "000MKMMMMMMKM000",
            "000MMMMMMMMMM000",
            "000MMMMDMMMMM000",
            "0S0MMMMDMMMMM0S0",
            "SS0MMMMMMMMMM0SS",
            "0S0MMMMMMMMMM0S0",
            "0000MM0000MM0000",
            "0000KK0000KK0000",
            "0000000000000000",
            "0000000000000000",
            "0000000000000000"
        ], { '0': 'rgba(0,0,0,0)', 'M': '#cd853f', 'D': '#8b4513', 'K': '#000000', 'S': '#d3d3d3' });

        // 6. Stonemaw (Pedra/Cinza/Kaiju)
        this.createPixelArt('monster_6', [
            "0000000000000000",
            "0D0000D0000D0000",
            "0GG000GG000GG000",
            "00GG000GG00GG000",
            "000GGGGGGGG00000",
            "00GGGGGGGGGG0000",
            "00GRGGGGGGGR0000",
            "00GGGGGGGGGG0000",
            "000GDDDDDGGG0000",
            "000GGGGGGGGG0000",
            "00GGGGGGGGGGG000",
            "0GG000000000GG00",
            "0KK000000000KK00",
            "0000000000000000",
            "0000000000000000",
            "0000000000000000"
        ], { '0': 'rgba(0,0,0,0)', 'G': '#a9a9a9', 'D': '#696969', 'K': '#000000', 'R': '#ff0000' });

        // 7. Mystigoat (Psíquico/Preto/Cabra)
        this.createPixelArt('monster_7', [
            "0000000000000000",
            "0000W0000W000000",
            "000WW0000WW00000",
            "0000WW00WW000000",
            "00000BBBB0000000",
            "0000BBBBBB000000",
            "0000BPBBBP000000",
            "0000BBBBBB000000",
            "000BBBBBBBB00000",
            "00BBBBBBBBBB0000",
            "00BBBBBBBBBB0000",
            "000DB0000BD00000",
            "000WW0000WW00000",
            "0000000000000000",
            "0000000000000000",
            "0000000000000000"
        ], { '0': 'rgba(0,0,0,0)', 'B': '#222222', 'D': '#000000', 'P': '#9370db', 'W': '#f8f8ff' });

        // 8. Brawlboy (Lutador/Roxo/Humanoide)
        this.createPixelArt('monster_8', [
            "0000000000000000",
            "0000000000000000",
            "000000PPPP000000",
            "00000PPPPPP00000",
            "00000PKPPKP00000",
            "00000PPPPPP00000",
            "000000LLLL000000",
            "000R0LLLLLL0R000",
            "00RR0LLLLLL0RR00",
            "000R0LLLLLL0R000",
            "00000LLLLLL00000",
            "00000PP00PP00000",
            "00000PP00PP00000",
            "00000KK00KK00000",
            "0000000000000000",
            "0000000000000000"
        ], { '0': 'rgba(0,0,0,0)', 'P': '#800080', 'R': '#ff4500', 'K': '#000000', 'L': '#dda0dd' });
    }
    generateNurseTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = 16;
        const ctx = canvas.getContext('2d');
        const art = [
            "0000000000000000",
            "0000001111000000",
            "0000011111100000",
            "0000112222110000",
            "0000022222200000",
            "0000003333000000",
            "0000033443300000",
            "0000333443330000",
            "0000333333330000",
            "0000000550000000",
            "0000005555000000",
            "0000055005500000",
            "0000000000000000",
            "0000000000000000",
            "0000000000000000",
            "0000000000000000"
        ];
        const colors = {
            '0': 'rgba(0,0,0,0)',
            '1': '#ff69b4', // cabelo rosa
            '2': '#ffcccb', // pele
            '3': '#ffffff', // roupa branca
            '4': '#ff0000', // cruz vermelha
            '5': '#444444'  // sapatos
        };
        for (let y = 0; y < 16; y++) {
            for (let x = 0; x < 16; x++) {
                const ch = art[y][x];
                if (colors[ch] !== 'rgba(0,0,0,0)') {
                    ctx.fillStyle = colors[ch];
                    ctx.fillRect(x, y, 1, 1);
                }
            }
        }
        this.textures.addImage('nurse_transparent', canvas);
    
    // Cria pixel art genérica a partir de matriz
    createPixelArt(key, art, colors) {
        const canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = 16;
        const ctx = canvas.getContext('2d');
        for (let y = 0; y < 16; y++) {
            for (let x = 0; x < 16; x++) {
                const ch = art[y][x];
                if (colors[ch] !== 'rgba(0,0,0,0)') {
                    ctx.fillStyle = colors[ch];
                    ctx.fillRect(x, y, 1, 1);
                }
            }
        }
        this.textures.addImage(key, canvas);
    }
        removeWhiteAndCrop(textureKey) {
        let src = this.textures.get(textureKey).getSourceImage();
        let canvas = document.createElement('canvas');
        canvas.width = src.width;
        canvas.height = src.height;
        let ctx = canvas.getContext('2d');
        ctx.drawImage(src, 0, 0);
        
        let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let data = imgData.data;
        
        let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0;
        
        // Transformar pixels brancos (ou muito claros) em transparentes e achar as bordas reais
        for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
                let i = (y * canvas.width + x) * 4;
                if (data[i] > 240 && data[i+1] > 240 && data[i+2] > 240) {
                    data[i+3] = 0; // Transparente
                } else {
                    // Pixel com cor, atualizar Bounding Box
                    if (x < minX) minX = x;
                    if (y < minY) minY = y;
                    if (x > maxX) maxX = x;
                    if (y > maxY) maxY = y;
                }
            }
        }
        
        ctx.putImageData(imgData, 0, 0);
        
        let cropWidth = maxX - minX + 1;
        let cropHeight = maxY - minY + 1;
        
        // Se a imagem for totalmente branca, evita erro
        if (cropWidth <= 0 || cropHeight <= 0) {
            this.textures.addImage(textureKey + '_transparent', canvas);
            return;
        }

        // Criar um novo canvas apenas com a área útil (sem as bordas transparentes)
        let cropCanvas = document.createElement('canvas');
        cropCanvas.width = cropWidth;
        cropCanvas.height = cropHeight;
        let cropCtx = cropCanvas.getContext('2d');
        cropCtx.drawImage(canvas, minX, minY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
        
        // Adicionar nova textura croppada e transparente ao Phaser
        this.textures.addImage(textureKey + '_transparent', cropCanvas);
    }
}
