// ===== Configuracoes gerais do jogo =====
export const GAME_CONFIG = {
    gridSize: 20,
    initialPosition: { x: 10, y: 10 },
    initialSpeed: 240,
    minimumSpeed: 120,
    foodLimit: 3,
    foodLifetime: 10000,
    bombLifetime: 8000,
    bombInterval: 1500,
    portalLifetime: 15000,
    portalInterval: 1500,
    potionLifetime: 5500,
    potionInterval: 20000,
    movingWallInterval: 15000,
    movingWallCount: 4,
    survivalStartScore: 500,
    survivalPointsPerStep: 50,
    survivalSpeedMultiplier: 0.9,
    survivalMinimumSpeed: 45
};

// ===== Aparencia das comidas =====
export const FOOD_COLORS = ["#ff7f9c", "#ffd166", "#f8f1a6"];