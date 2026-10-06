import { FOOD_COLORS, GAME_CONFIG } from "./config.js";

// ===== Gerenciador de fases, itens e obstaculos =====
export function createLevelSystem(tileCount) {
    const state = {
        foods: [],
        bomb: null,
        portals: [],
        portalExpiresAt: 0,
        nextPortalSpawnTime: 0,
        previousPortalPositions: [],
        shrinkPotion: null,
        walls: [],
        nextBombSpawnTime: 0,
        nextPotionSpawnTime: 0,
        nextWallMoveTime: 0,
        phase: 1
    };

    // ===== Inicializacao e atualizacao dos itens =====
    function reset(snake, nextDx, nextDy) {
        state.foods = [];
        state.bomb = null;
        state.portals = [];
        state.portalExpiresAt = 0;
        state.nextPortalSpawnTime = 0;
        state.previousPortalPositions = [];
        state.shrinkPotion = null;
        state.walls = [];
        state.nextBombSpawnTime = 0;
        state.nextPotionSpawnTime = 0;
        state.nextWallMoveTime = 0;
        state.phase = 1;
        fillFoodSlots(snake, nextDx, nextDy);
    }

    function update(score, snake, nextDx, nextDy) {
        updateFoods(snake, nextDx, nextDy);
        updatePortals(score, snake, nextDx, nextDy);
        updateBomb(score, snake, nextDx, nextDy);
        updatePotion(score, snake, nextDx, nextDy);
        updateMovingWalls(score, snake, nextDx, nextDy);
    }

    function updateProgression(score, snake, nextDx, nextDy) {
        const nextPhase = score >= GAME_CONFIG.survivalStartScore
            ? 6
            : Math.floor(score / 100) + 1;
        if (nextPhase === state.phase) return;

        const currentTime = Date.now();
        state.phase = nextPhase;

        if (score >= 200 && state.portals.length === 0 && state.nextPortalSpawnTime === 0) {
            state.nextPortalSpawnTime = currentTime;
        }
        if (score >= 300 && state.nextPotionSpawnTime === 0) {
            state.nextPotionSpawnTime = currentTime;
        }
        if (score >= 400 && state.walls.length === 0) {
            state.nextWallMoveTime = currentTime;
        }
    }

    // ===== Geracao de comidas e objetos especiais =====
    function fillFoodSlots(snake, nextDx, nextDy, excludedPositions = []) {
        while (state.foods.length < GAME_CONFIG.foodLimit) {
            const position = getEmptyCell(snake, nextDx, nextDy, excludedPositions);
            if (!position) return;

            const color = FOOD_COLORS[Math.floor(Math.random() * FOOD_COLORS.length)];
            state.foods.push({
                ...position,
                color,
                expiresAt: Date.now() + GAME_CONFIG.foodLifetime
            });
        }
    }

    function updateFoods(snake, nextDx, nextDy) {
        const currentTime = Date.now();
        const expiredFoods = state.foods.filter(food => currentTime >= food.expiresAt);
        if (expiredFoods.length === 0) return;

        state.foods = state.foods.filter(food => currentTime < food.expiresAt);
        fillFoodSlots(snake, nextDx, nextDy, expiredFoods);
    }

    function collectAt(head, snake, nextDx, nextDy) {
        const foodIndex = state.foods.findIndex(food => food.x === head.x && food.y === head.y);
        if (foodIndex !== -1) {
            const [eatenFood] = state.foods.splice(foodIndex, 1);
            fillFoodSlots(snake, nextDx, nextDy, [eatenFood]);
            return "food";
        }

        if (state.shrinkPotion && head.x === state.shrinkPotion.x && head.y === state.shrinkPotion.y) {
            state.shrinkPotion = null;
            state.nextPotionSpawnTime = Date.now() + GAME_CONFIG.potionInterval;
            return "potion";
        }

        return null;
    }

    function updateBomb(score, snake, nextDx, nextDy) {
        if (score < 100) return;

        const currentTime = Date.now();
        if (state.bomb && currentTime >= state.bomb.expiresAt) {
            state.bomb = null;
            state.nextBombSpawnTime = currentTime + GAME_CONFIG.bombInterval;
        }

        if (!state.bomb && currentTime >= state.nextBombSpawnTime) {
            const position = getEmptyCell(snake, nextDx, nextDy);
            if (position) {
                state.bomb = { ...position, expiresAt: currentTime + GAME_CONFIG.bombLifetime };
            }
        }
    }

    function updatePotion(score, snake, nextDx, nextDy) {
        if (score < 300) return;

        const currentTime = Date.now();
        if (state.shrinkPotion && currentTime >= state.shrinkPotion.expiresAt) {
            state.shrinkPotion = null;
            state.nextPotionSpawnTime = currentTime + GAME_CONFIG.potionInterval;
        }

        if (!state.shrinkPotion && currentTime >= state.nextPotionSpawnTime) {
            const position = getEmptyCell(snake, nextDx, nextDy);
            if (position) {
                state.shrinkPotion = { ...position, expiresAt: currentTime + GAME_CONFIG.potionLifetime };
                state.nextPotionSpawnTime = currentTime + GAME_CONFIG.potionInterval;
            } else {
                state.nextPotionSpawnTime = currentTime + 1000;
            }
        }
    }

    // ===== Portais e paredes moveis =====
    function updatePortals(score, snake, nextDx, nextDy) {
        if (score < 200) return;

        const currentTime = Date.now();
        if (state.portals.length > 0 && currentTime >= state.portalExpiresAt) {
            state.previousPortalPositions = state.portals.map(portal => ({ ...portal }));
            state.portals = [];
            state.portalExpiresAt = 0;
            state.nextPortalSpawnTime = currentTime + GAME_CONFIG.portalInterval;
        }

        if (state.portals.length > 0 || currentTime < state.nextPortalSpawnTime) return;
        createPortals(snake, nextDx, nextDy);
    }

    function createPortals(snake, nextDx, nextDy) {
        const previousPositions = state.previousPortalPositions;
        const firstPortal = getEmptyCell(snake, nextDx, nextDy, previousPositions);
        if (!firstPortal) {
            state.nextPortalSpawnTime = Date.now() + 1000;
            return;
        }

        state.portals = [firstPortal];
        const secondPortal = getEmptyCell(snake, nextDx, nextDy, previousPositions);
        if (!secondPortal) {
            state.portals = [];
            state.nextPortalSpawnTime = Date.now() + 1000;
            return;
        }

        state.portals.push(secondPortal);
        state.portalExpiresAt = Date.now() + GAME_CONFIG.portalLifetime;
        state.nextPortalSpawnTime = 0;
        state.previousPortalPositions = [];
    }

    function teleport(head) {
        const portalIndex = state.portals.findIndex(portal => portal.x === head.x && portal.y === head.y);
        if (portalIndex === -1 || state.portals.length !== 2) return;

        const exitPortal = state.portals[1 - portalIndex];
        head.x = exitPortal.x;
        head.y = exitPortal.y;
    }

    function updateMovingWalls(score, snake, nextDx, nextDy) {
        if (score < 400 || Date.now() < state.nextWallMoveTime) return;

        const currentTime = Date.now();
        const previousWalls = state.walls;
        state.walls = [];

        for (let index = 0; index < GAME_CONFIG.movingWallCount; index++) {
            const position = getEmptyCell(snake, nextDx, nextDy, previousWalls, isCenterCell);
            if (!position) break;
            state.walls.push(position);
        }

        state.nextWallMoveTime = currentTime + GAME_CONFIG.movingWallInterval;
    }

    function isCenterCell(cell) {
        return cell.x >= tileCount / 3 && cell.x < tileCount * 2 / 3 &&
            cell.y >= tileCount / 3 && cell.y < tileCount * 2 / 3;
    }

    // ===== Casas livres, colisoes e temporizadores =====
    function getEmptyCell(snake, nextDx, nextDy, excludedPositions = [], isAllowed = () => true) {
        const nextHead = {
            x: (snake[0].x + nextDx + tileCount) % tileCount,
            y: (snake[0].y + nextDy + tileCount) % tileCount
        };
        const occupiedCells = new Set(
            [...snake, ...state.foods, ...state.portals, ...state.walls,
                ...(state.bomb ? [state.bomb] : []),
                ...(state.shrinkPotion ? [state.shrinkPotion] : []),
                nextHead, ...excludedPositions]
                .map(part => `${part.x},${part.y}`)
        );
        const availableCells = [];

        for (let y = 0; y < tileCount; y++) {
            for (let x = 0; x < tileCount; x++) {
                const cell = { x, y };
                if (!occupiedCells.has(`${x},${y}`) && isAllowed(cell)) {
                    availableCells.push(cell);
                }
            }
        }

        if (availableCells.length === 0) return null;
        return availableCells[Math.floor(Math.random() * availableCells.length)];
    }

    function hasBombAt(head) {
        return state.bomb !== null && head.x === state.bomb.x && head.y === state.bomb.y;
    }

    function hasWallAt(head) {
        return state.walls.some(wall => head.x === wall.x && head.y === wall.y);
    }

    function isBoardFull(snake) {
        const occupiedCells = new Set(
            [...snake, ...state.foods, ...state.portals, ...state.walls,
                ...(state.bomb ? [state.bomb] : []),
                ...(state.shrinkPotion ? [state.shrinkPotion] : [])]
                .map(part => `${part.x},${part.y}`)
        );

        return occupiedCells.size >= tileCount * tileCount;
    }

    function shiftTimers(duration) {
        state.foods.forEach(food => food.expiresAt += duration);
        if (state.bomb) state.bomb.expiresAt += duration;
        if (state.portalExpiresAt > 0) state.portalExpiresAt += duration;
        if (state.shrinkPotion) state.shrinkPotion.expiresAt += duration;
        if (state.nextBombSpawnTime > 0) state.nextBombSpawnTime += duration;
        if (state.nextPortalSpawnTime > 0) state.nextPortalSpawnTime += duration;
        if (state.nextPotionSpawnTime > 0) state.nextPotionSpawnTime += duration;
        if (state.nextWallMoveTime > 0) state.nextWallMoveTime += duration;
    }

    function refreshFoodTimers() {
        const newExpiry = Date.now() + GAME_CONFIG.foodLifetime;
        state.foods.forEach(food => food.expiresAt = newExpiry);
    }

    function getRenderState() {
        return { ...state };
    }

    return {
        reset,
        update,
        updateProgression,
        collectAt,
        teleport,
        hasBombAt,
        hasWallAt,
        isBoardFull,
        shiftTimers,
        refreshFoodTimers,
        getRenderState
    };
}