let appleColors = ["blue", "yellow", "green"];
const speed = 0.05;
var snake = [
    { x: 8, y: 10, direction: "left" },
    { x: 9, y: 10, direction: "left" },
    { x: 9, y: 11, direction: "up" },
    { x: 9, y: 12, direction: "up" },
];
var appleColor = appleColors[Math.random() * appleColors.length];
var applePosation = [100, 100];
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
}

function equal(posation1, posation2) {
    return posation1 === posation2;
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

function draw() {
    background("black");
    updateSnakePosition(speed);
    if (hasMovedOneStep(speed)) {
        updateSnakeDirection();
    }
    drawSnake("blue");
    drawApple();
    drawWalls();
}
