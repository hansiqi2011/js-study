let appleColors = ["blue", "yellow", "green"];
const speed = 0.25;
let nextHeadDirection = "";
var snake = [
    { x: 20, y: 10, direction: "left" },
    { x: 21, y: 10, direction: "left" },
    { x: 21, y: 11, direction: "up" },
    { x: 21, y: 12, direction: "up" },
    { x: 21, y: 13, direction: "up" },
    { x: 22, y: 13, direction: "left" },
];

var appleColor = appleColors[Math.random() * appleColors.length];
var applePosation = [100, 100];
var wallCollision = false;
var selfCollision = false;
function setup() {
    createCanvas(400, 400);
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
    return posation1 === posation2;
}

function checkCollision() {
    wallCollision =
        snake[0].x <= 1 ||
        snake[0].x >= 49 ||
        snake[0].y <= 1 ||
        snake[0].y >= 49;
    snake.forEach((piece) => {
        if (equal([snake[0].x, snake[0].y], [piece.x, piece.y])) {
            selfCollision = true;
        }
    });
}

function drawApple() {}

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
    }
    return false;
}

function draw() {
    checkCollision();
    if (wallCollision || selfCollision) return;
    background("black");
    updateSnakePosition(speed);
    if (hasMovedOneStep(speed)) {
        updateSnakeDirection();
    }
    drawSnake("blue");
    drawApple();
    drawWalls();
}
