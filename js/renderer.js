// ===== Desenho do tabuleiro e dos elementos =====
export function createRenderer(canvas, config) {
    const context = canvas.getContext("2d");

    function draw({
        snake,
        dx,
        dy,
        foods,
        bomb,
        portals,
        portalExpiresAt,
        shrinkPotion,
        walls
    }) {
        context.fillStyle = "#1e3028";
        context.fillRect(0, 0, canvas.width, canvas.height);
        drawGrid(context, canvas, config.gridSize);

        foods.forEach(food => drawFood(context, food, config));
        portals.forEach((portal, index) => drawPortal(context, portal, index, config, portalExpiresAt));

        if (shrinkPotion) {
            drawPotion(context, shrinkPotion, config);
        }
        if (bomb) {
            drawBomb(context, bomb, config);
        }

        walls.forEach(wall => drawWall(context, wall, config.gridSize));
        snake.forEach((part, index) => drawSnakePart(context, part, index, dx, dy, config.gridSize));
    }

    return draw;
}

// ===== Comidas e itens temporarios =====
function drawFood(context, food, config) {
    const centerX = food.x * config.gridSize + config.gridSize / 2;
    const centerY = food.y * config.gridSize + config.gridSize / 2;
    const remainingTime = Math.max(0, (food.expiresAt - Date.now()) / config.foodLifetime);

    context.strokeStyle = "#35354a";
    context.lineWidth = 1.5;
    context.beginPath();
    context.arc(centerX, centerY, 9, 0, Math.PI * 2);
    context.stroke();

    if (remainingTime > 0) {
        context.strokeStyle = food.color;
        context.beginPath();
        context.arc(centerX, centerY, 9, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * remainingTime);
        context.stroke();
    }

    context.fillStyle = food.color;
    context.beginPath();
    context.arc(centerX, centerY + 1, 6, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = "#fff1e8";
    context.beginPath();
    context.arc(centerX - 2, centerY - 1, 1.5, 0, Math.PI * 2);
    context.fill();

    context.strokeStyle = "#a66a42";
    context.lineWidth = 1.5;
    context.beginPath();
    context.moveTo(centerX, centerY - 5);
    context.lineTo(centerX + 1, centerY - 8);
    context.stroke();

    context.fillStyle = "#a6e3a1";
    context.beginPath();
    context.arc(centerX + 3, centerY - 7, 2, 0, Math.PI * 2);
    context.fill();
}

function drawBomb(context, bomb, config) {
    const centerX = bomb.x * config.gridSize + config.gridSize / 2;
    const centerY = bomb.y * config.gridSize + config.gridSize / 2;
    const remainingTime = Math.max(0, (bomb.expiresAt - Date.now()) / config.bombLifetime);

    context.strokeStyle = "#ffb86c";
    context.lineWidth = 2;
    context.beginPath();
    context.arc(centerX, centerY, 9, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * remainingTime);
    context.stroke();

    context.fillStyle = "#34313d";
    context.beginPath();
    context.arc(centerX, centerY + 1, 6, 0, Math.PI * 2);
    context.fill();

    context.strokeStyle = "#ff8f5b";
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(centerX + 2, centerY - 4);
    context.lineTo(centerX + 5, centerY - 8);
    context.stroke();

    context.fillStyle = "#ffe082";
    context.beginPath();
    context.arc(centerX + 6, centerY - 9, 1.5, 0, Math.PI * 2);
    context.fill();
}

function drawPotion(context, potion, config) {
    const centerX = potion.x * config.gridSize + config.gridSize / 2;
    const centerY = potion.y * config.gridSize + config.gridSize / 2;
    const remainingTime = Math.max(0, (potion.expiresAt - Date.now()) / config.potionLifetime);

    context.strokeStyle = "#cba6f7";
    context.lineWidth = 1.5;
    context.beginPath();
    context.arc(centerX, centerY, 9, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * remainingTime);
    context.stroke();

    context.fillStyle = "#f5c2e7";
    context.beginPath();
    context.moveTo(centerX - 3, centerY - 7);
    context.lineTo(centerX + 3, centerY - 7);
    context.lineTo(centerX + 3, centerY - 2);
    context.lineTo(centerX + 6, centerY + 5);
    context.lineTo(centerX - 6, centerY + 5);
    context.lineTo(centerX - 3, centerY - 2);
    context.closePath();
    context.fill();

    context.fillStyle = "#89dceb";
    context.fillRect(centerX - 2, centerY + 1, 4, 2);
}

// ===== Portais e paredes =====
function drawPortal(context, portal, index, config, expiresAt) {
    const centerX = portal.x * config.gridSize + config.gridSize / 2;
    const centerY = portal.y * config.gridSize + config.gridSize / 2;
    const color = index % 2 === 0 ? "#89dceb" : "#cba6f7";
    const remainingTime = Math.max(0, (expiresAt - Date.now()) / config.portalLifetime);

    context.strokeStyle = "#f5c2e7";
    context.lineWidth = 1.5;
    context.beginPath();
    context.arc(centerX, centerY, 10, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * remainingTime);
    context.stroke();
    context.fillStyle = "#20243a";
    context.beginPath();
    context.arc(centerX, centerY, 8, 0, Math.PI * 2);
    context.fill();
    context.strokeStyle = color;
    context.lineWidth = 3;
    context.beginPath();
    context.arc(centerX, centerY, 7, 0, Math.PI * 2);
    context.stroke();
    context.strokeStyle = "#f5c2e7";
    context.lineWidth = 1;
    context.beginPath();
    context.arc(centerX, centerY, 3, 0, Math.PI * 2);
    context.stroke();
}

function drawWall(context, wall, gridSize) {
    const inset = 2;
    const positionX = wall.x * gridSize + inset;
    const positionY = wall.y * gridSize + inset;
    const size = gridSize - inset * 2;

    context.fillStyle = "#e07a5f";
    context.fillRect(positionX, positionY, size, size);
    context.strokeStyle = "#ffd6a5";
    context.lineWidth = 1;
    context.strokeRect(positionX, positionY, size, size);
}

// ===== Cobra e rosto =====
function drawSnakePart(context, part, index, dx, dy, gridSize) {
    const inset = 1.5;
    const positionX = part.x * gridSize + inset;
    const positionY = part.y * gridSize + inset;
    const size = gridSize - inset * 2;
    const radius = index === 0 ? 7 : 6;

    context.fillStyle = index === 0 ? "#d8ef76" : index % 2 === 0 ? "#78c8a8" : "#58a98b";
    context.beginPath();
    context.moveTo(positionX + radius, positionY);
    context.arcTo(positionX + size, positionY, positionX + size, positionY + size, radius);
    context.arcTo(positionX + size, positionY + size, positionX, positionY + size, radius);
    context.arcTo(positionX, positionY + size, positionX, positionY, radius);
    context.arcTo(positionX, positionY, positionX + size, positionY, radius);
    context.fill();

    if (index === 0) {
        drawSnakeEyes(context, positionX, positionY, size, dx, dy);
        drawSnakeTongue(context, positionX, positionY, size, dx, dy);
    }
}

function drawSnakeEyes(context, positionX, positionY, size, dx, dy) {
    const centerX = positionX + size / 2;
    const centerY = positionY + size / 2;
    let eyes;

    if (dx !== 0) {
        const eyeX = centerX + dx * 4;
        eyes = [{ x: eyeX, y: centerY - 3 }, { x: eyeX, y: centerY + 3 }];
    } else {
        const eyeY = centerY + dy * 4;
        eyes = [{ x: centerX - 3, y: eyeY }, { x: centerX + 3, y: eyeY }];
    }

    eyes.forEach(eye => {
        context.fillStyle = "#f8fff0";
        context.beginPath();
        context.arc(eye.x, eye.y, 2, 0, Math.PI * 2);
        context.fill();
        context.fillStyle = "#15221d";
        context.beginPath();
        context.arc(eye.x + dx, eye.y + dy, 1, 0, Math.PI * 2);
        context.fill();
    });
}

function drawSnakeTongue(context, positionX, positionY, size, dx, dy) {
    const centerX = positionX + size / 2;
    const centerY = positionY + size / 2;
    const perpendicularX = -dy;
    const perpendicularY = dx;
    const tipX = centerX + dx * 9;
    const tipY = centerY + dy * 9;

    context.strokeStyle = "#ff5d73";
    context.lineWidth = 1.5;
    context.beginPath();
    context.moveTo(centerX + dx * 5, centerY + dy * 5);
    context.lineTo(tipX, tipY);
    context.moveTo(tipX, tipY);
    context.lineTo(tipX + dx * 2 + perpendicularX * 1.5, tipY + dy * 2 + perpendicularY * 1.5);
    context.moveTo(tipX, tipY);
    context.lineTo(tipX + dx * 2 - perpendicularX * 1.5, tipY + dy * 2 - perpendicularY * 1.5);
    context.stroke();
}

// ===== Grade do tabuleiro =====
function drawGrid(context, canvas, gridSize) {
    context.strokeStyle = "#314a3d";
    context.lineWidth = 1;
    context.beginPath();

    for (let position = 0; position <= canvas.width; position += gridSize) {
        context.moveTo(position, 0);
        context.lineTo(position, canvas.height);
        context.moveTo(0, position);
        context.lineTo(canvas.width, position);
    }

    context.stroke();
}