let appleColors = ["blue", "yellow", "red"];
const speed = 0.25;
var appleCollision = false;
var score = 0;
let nextHeadDirection = "";
var apple;
var snake = [
    { x: 20, y: 10, direction: "left" },
    { x: 21, y: 10, direction: "left" },
    { x: 21, y: 11, direction: "up" },
    { x: 21, y: 12, direction: "up" },
    { x: 21, y: 13, direction: "up" },
    { x: 20, y: 13, direction: "right" },
];
var appleColor = appleColors[Math.floor(Math.random() * appleColors.length)];
var applePosation = { x: 25, y: 25 };
var wallCollision = false;
var selfCollision = false;
var collision = wallCollision || selfCollision;

function gameOver() {}

function setup() {
    createCanvas(400, 400);
}

function replay() {
    snake = [
        { x: 20, y: 10, direction: "left" },
        { x: 21, y: 10, direction: "left" },
        { x: 21, y: 11, direction: "up" },
        { x: 21, y: 12, direction: "up" },
        { x: 21, y: 13, direction: "up" },
        { x: 20, y: 13, direction: "right" },
    ];
    collision = false;
}

function drawWalls() {
    stroke("grey");
    strokeWeight(10);
    rect(0, 0, 400, 400);
}

function drawSnakePiece(x, y, color, size = 8) {
    fill(color);
    rect(x * size - size / 2, y * size - size / 2, size, size);
    noFill();
}

function drawSnake(color, size = 8) {
    strokeWeight(0);
    fill(color);
    snake.forEach((piece) => {
        drawSnakePiece(piece.x, piece.y, color, size);
    });
    noFill();
}

function updateSnakePosition(speed) {
    snake.forEach((piece) => {
        if (piece.direction === "left") {
            piece.x -= speed;
        }
        if (piece.direction === "right") {
            piece.x += speed;
        }
        if (piece.direction === "up") {
            piece.y -= speed;
        }
        if (piece.direction === "down") {
            piece.y += speed;
        }
    });
}

function updateSnakeDirection() {
    for (let a = snake.length - 1; a > 0; a--) {
        snake[a].direction = snake[a - 1].direction;
    }
    if (nextHeadDirection !== "" && !isUTurn()) {
        snake[0].direction = nextHeadDirection;
    }
}

function isUTurn() {
    return (
        (snake[0].direction === "down" && nextHeadDirection === "up") ||
        (snake[0].direction === "up" && nextHeadDirection === "down") ||
        (snake[0].direction === "left" && nextHeadDirection === "right") ||
        (snake[0].direction === "right" && nextHeadDirection === "left")
    );
}

function equal(posation1, posation2) {
    return posation1.x == posation2.x && posation1.y == posation2.y;
}

function eatApple() {
    appleCollision = equal({ x: snake[0].x, y: snake[0].y }, appleCollision);
    if (appleCollision) {
        score += 1;
        applePosation.x = Math.floor((Math.random() * 400) / 8);
        applePosation.y = Math.floor((Math.random() * 400) / 8);
        appleColor =
            appleColors[Math.floor(Math.random() * appleColors.length)];
        appleCollision = false;
    }
}

function checkCollision() {
    wallCollision =
        snake[0].x <= 1 ||
        snake[0].x >= 49 ||
        snake[0].y <= 1 ||
        snake[0].y >= 49;
    for (let s = snake.length - 1; s >= 1; s--) {
        selfCollision = equal(snake[0], snake[s]);
        if (selfCollision) {
            break;
        }
    }
    collision = wallCollision || selfCollision;
}

function drawApple(x, y, size = 8) {
    fill(appleColor);
    apple = rect(x * size - size / 2, y * size - size / 2, size, size);
    noFill();
}

var counter = 0;
function hasMovedOneStep(speed) {
    counter += 1;
    if (counter >= 1 / speed) {
        counter = 0;
        return true;
    } else return false;
}

function keyPressed() {
    if (keyCode === 65) {
        // A is left
        nextHeadDirection = "left";
    } else if (keyCode === 87) {
        // W is up
        nextHeadDirection = "up";
    } else if (keyCode === 83) {
        // S is down
        nextHeadDirection = "down";
    } else if (keyCode === 68) {
        // D is right
        nextHeadDirection = "right";
    } else if (keyCode === 32) {
        replay();
    }
    return false;
}

function draw() {
    checkCollision();
    if (collision) return;
    background("black");
    updateSnakePosition(speed);
    if (hasMovedOneStep(speed)) {
        updateSnakeDirection();
    }
    drawSnake("blue");
    drawApple(applePosation.x, applePosation.y);
    drawWalls();
    eatApple();
}
