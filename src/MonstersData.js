const MonstersData = {
    1: { id: 1, name: "Sparky", element: "Elétrico", color: 0xFFFF00, type: "Starter", hp: 100, maxHp: 100, attack: 20 },
    2: { id: 2, name: "Burnapillar", element: "Fogo", color: 0xFF0000, type: "Wild", hp: 100, maxHp: 100, attack: 20 },
    3: { id: 3, name: "Toadleaf", element: "Grama", color: 0x00FF00, type: "Wild", hp: 100, maxHp: 100, attack: 15 },
    4: { id: 4, name: "Shelljet", element: "Água", color: 0x0000FF, type: "Wild", hp: 120, maxHp: 120, attack: 15 },
    5: { id: 5, name: "Mudclaw", element: "Terra", color: 0x8B4513, type: "Wild", hp: 110, maxHp: 110, attack: 18 },
    6: { id: 6, name: "Stonemaw", element: "Pedra", color: 0x808080, type: "Wild", hp: 130, maxHp: 130, attack: 12 },
    7: { id: 7, name: "Mystigoat", element: "Psíquico", color: 0x000000, type: "Wild", hp: 90, maxHp: 90, attack: 25 },
    8: { id: 8, name: "Brawlboy", element: "Lutador", color: 0x800080, type: "Wild", hp: 100, maxHp: 100, attack: 22 }
};

// Variável global simples para armazenar a equipe do jogador
const PlayerState = {
    team: [
        { ...MonstersData[1] } // O jogador começa com o monstro 1
    ]
};
