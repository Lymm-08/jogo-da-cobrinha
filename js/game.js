import { GAME_CONFIG } from "./config.js";
import { setLanguage, translate } from "./i18n.js";
import { createLevelSystem } from "./level-system.js";
import { createRenderer } from "./renderer.js";

// ===== Elementos da pagina e estado da partida =====
const canvas = document.getElementById("gameCanvas");
const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("high-score");
const gameOverText = document.getElementById("game-over-text");
const menuScreen = document.getElementById("menu-screen");
const languageScreen = document.getElementById("language-screen");
const howToScreen = document.getElementById("how-to-screen");
const gameScreen = document.getElementById("game-screen");
const playButton = document.getElementById("play-button");
const howToButton = document.getElementById("how-to-button");
const languageButton = document.getElementById("language-button");
const languageBackButton = document.getElementById("language-back-button");
const backButton = document.getElementById("back-button");
const gameBackButton = document.getElementById("game-back-button");
const tileCount = canvas.width / GAME_CONFIG.gridSize;
const level = createLevelSystem(tileCount);
const render = createRenderer(canvas, GAME_CONFIG);

const state = {
    snake: [createInitialSnakePart()],
    dx: 1,
    dy: 0,
    nextDx: 1,
    nextDy: 0,
    score: 0,
    highScore: Number(localStorage.getItem("snakeHighScore") || 0),
    gameInterval: null,
    gameStarted: false,
    isMoving: false,
    isGameOver: false,
    isPaused: false,
    pauseStartedAt: null
};

highScoreElement.textContent = state.highScore;

// ===== Inicio, velocidade e loop principal =====
function createInitialSnakePart() {
    return { ...GAME_CONFIG.initialPosition };
}

function startGame() {
    clearInterval(state.gameInterval);
    state.isGameOver = false;
    state.isPaused = false;
    state.gameStarted = true;
    state.isMoving = false;
    state.pauseStartedAt = null;
    state.score = 0;
    state.dx = 1;
    state.dy = 0;
    state.nextDx = 1;
    state.nextDy = 0;
    state.snake = [createInitialSnakePart()];
    scoreElement.textContent = state.score;
    gameOverText.textContent = translate("startDirection");
    gameOverText.style.display = "block";
    level.reset(state.snake, state.nextDx, state.nextDy);
    draw();
    startGameLoop();
}

function getGameSpeed() {
    const baseSpeed = Math.max(
        GAME_CONFIG.minimumSpeed,
        GAME_CONFIG.initialSpeed - (state.snake.length - 1) * 4
    );
    const survivalSteps = state.score >= GAME_CONFIG.survivalStartScore
        ? Math.floor((state.score - GAME_CONFIG.survivalStartScore) / GAME_CONFIG.survivalPointsPerStep)
        : 0;

    return Math.max(
        GAME_CONFIG.survivalMinimumSpeed,
        baseSpeed * Math.pow(GAME_CONFIG.survivalSpeedMultiplier, survivalSteps)
    );
}

function startGameLoop() {
    clearInterval(state.gameInterval);
    state.gameInterval = setInterval(updateGame, getGameSpeed());
}

function updateGame() {
    if (!state.gameStarted || !state.isMoving || state.isPaused) return;
    if (level.isBoardFull(state.snake)) {
        winGame();
        return;
    }

    level.update(state.score, state.snake, state.nextDx, state.nextDy);
    state.dx = state.nextDx;
    state.dy = state.nextDy;
    moveSnake();
    level.update(state.score, state.snake, state.nextDx, state.nextDy);

    if (checkCollision()) {
        endGame();
        return;
    }
    if (level.hasBombAt(state.snake[0])) {
        endGame("bombCollision");
        return;
    }
    if (level.isBoardFull(state.snake)) {
        winGame();
        return;
    }

    draw();
}

// ===== Movimento, coleta e pontuacao =====
function moveSnake() {
    const head = {
        x: (state.snake[0].x + state.dx + tileCount) % tileCount,
        y: (state.snake[0].y + state.dy + tileCount) % tileCount
    };
    level.teleport(head);
    state.snake.unshift(head);

    const collectedItem = level.collectAt(head, state.snake, state.nextDx, state.nextDy);
    if (collectedItem === "food") {
        state.score += 10;
        scoreElement.textContent = state.score;
        updateHighScore();
        level.updateProgression(state.score, state.snake, state.nextDx, state.nextDy);
        startGameLoop();
    } else if (collectedItem === "potion") {
        for (let segment = 0; segment < 6 && state.snake.length > 1; segment++) {
            state.snake.pop();
        }
        startGameLoop();
    } else {
        state.snake.pop();
    }
}

function updateHighScore() {
    if (state.score <= state.highScore) return;

    state.highScore = state.score;
    highScoreElement.textContent = state.highScore;
    localStorage.setItem("snakeHighScore", state.highScore);
}

function checkCollision() {
    const head = state.snake[0];

    for (let index = 1; index < state.snake.length; index++) {
        if (head.x === state.snake[index].x && head.y === state.snake[index].y) {
            return true;
        }
    }

    return level.hasWallAt(head);
}

function draw() {
    render({ ...level.getRenderState(), ...state });
}

// ===== Fim da partida e controles =====
function endGame(messageKey = "gameOverRestart") {
    clearInterval(state.gameInterval);
    state.isGameOver = true;
    state.gameStarted = false;
    state.isMoving = false;
    gameOverText.textContent = translate(messageKey);
    gameOverText.style.display = "block";
}

function winGame() {
    endGame("win");
}

function setDirection(directionX, directionY) {
    if (!state.gameStarted || state.isGameOver) return;
    if (state.nextDx !== state.dx || state.nextDy !== state.dy) return;
    if (state.isMoving && directionX === -state.dx && directionY === -state.dy) return;

    if (state.pauseStartedAt !== null) {
        level.shiftTimers(Date.now() - state.pauseStartedAt);
        state.pauseStartedAt = null;
    } else if (!state.isMoving) {
        level.refreshFoodTimers();
    }

    state.nextDx = directionX;
    state.nextDy = directionY;
    state.isMoving = true;
    state.isPaused = false;
    gameOverText.style.display = "none";
}

window.addEventListener("keydown", event => {
    if (gameScreen.hidden) return;

    if (event.key === " " || event.key.startsWith("Arrow")) {
        event.preventDefault();
    }

    if (event.key === " ") {
        if (state.isGameOver || !state.gameStarted) {
            startGame();
            return;
        }

        if (!state.isPaused) {
            state.pauseStartedAt = Date.now();
        }
        state.isPaused = true;
        state.nextDx = state.dx;
        state.nextDy = state.dy;
        gameOverText.textContent = translate("paused");
        gameOverText.style.display = "block";
        return;
    }

    switch (event.key) {
        case "ArrowUp":
            setDirection(0, -1);
            break;
        case "ArrowDown":
            setDirection(0, 1);
            break;
        case "ArrowLeft":
            setDirection(-1, 0);
            break;
        case "ArrowRight":
            setDirection(1, 0);
            break;
    }
});

// ===== Navegacao entre menu, instrucoes e partida =====
playButton.addEventListener("click", () => {
    menuScreen.hidden = true;
    languageScreen.hidden = true;
    howToScreen.hidden = true;
    gameScreen.hidden = false;
    startGame();
});

howToButton.addEventListener("click", () => {
    menuScreen.hidden = true;
    languageScreen.hidden = true;
    howToScreen.hidden = false;
});

languageButton.addEventListener("click", () => {
    menuScreen.hidden = true;
    languageScreen.hidden = false;
});

languageBackButton.addEventListener("click", () => {
    languageScreen.hidden = true;
    menuScreen.hidden = false;
    languageButton.focus();
});

document.querySelectorAll("[data-language]").forEach(button => {
    button.addEventListener("click", () => {
        setLanguage(button.dataset.language);
        languageBackButton.focus();
    });
});

backButton.addEventListener("click", () => {
    howToScreen.hidden = true;
    menuScreen.hidden = false;
    playButton.focus();
});

gameBackButton.addEventListener("click", () => {
    clearInterval(state.gameInterval);
    state.gameStarted = false;
    state.isMoving = false;
    state.isPaused = false;
    state.pauseStartedAt = null;
    gameScreen.hidden = true;
    menuScreen.hidden = false;
    playButton.focus();
});

// ===== Preparacao da tela inicial =====
level.reset(state.snake, state.nextDx, state.nextDy);
gameScreen.hidden = true;
draw();