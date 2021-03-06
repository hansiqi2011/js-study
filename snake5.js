const size = 8;
let goldenCounter = 0;
let appleColors = ["blue", "yellow", "red"];
let speed = 0.25;
let appleCollision = false;
let score = 0;
let nextHeadDirection = "";
let apple;
let testSound;
let snake = [
    {
        x: Math.floor((Math.random() * 400) / size),
        y: Math.floor((Math.random() * 400) / size),
        direction: "left",
    },
];
for (let o = 0; o < 5; o++) {
    addSnakePiece();
}
let isGolden = false;
let appleColor = appleColors[Math.floor(Math.random() * appleColors.length)];
let applePosation = {
    x: Math.floor((Math.random() * 400) / size),
    y: Math.floor((Math.random() * 400) / size),
};
let wallCollision = false;
let selfCollision = false;
let collision = wallCollision || selfCollision;

function oddOrEven(num) {
    if (num / 2 === Math.floor(num / 2)) {
        return true;
    } else {
        return false;
    }
}

function around(aroundnum, num, range) {
    if (
        (aroundnum > num && aroundnum - range < num) ||
        (aroundnum < num && aroundnum - range > num)
    ) {
        return true;
    } else {
        return false;
    }
}

function unitTest(_id_) {
    if (_id_ === "set up") {
        let sxe = oddOrEven(snake[0].x * size);
        let sye = oddOrEven(snake[0].y * size);
        let axe = oddOrEven(applePosation.x * size);
        let aye = oddOrEven(applePosation.y * size);
        if (!sxe || !sye || !axe || !aye) {
            console.error("Please check the set up program");
        }
    }
}

function gameOver() {
    noStroke();
    fill("white");
    textSize(50);
    text("GAME OVER", 50, 200);
    noFill();
}

function setup() {
    createCanvas(400, 400);
}

function replay() {
    isGolden = false;
    snake = [
        {
            x: Math.floor((Math.random() * 400) / size),
            y: Math.floor((Math.random() * 400) / size),
            direction: "left",
        },
    ];
    for (let o = 0; o < 5; o++) {
        addSnakePiece();
    }
    collision = false;
    applePosation.x = Math.floor((Math.random() * 400) / size);
    applePosation.y = Math.floor((Math.random() * 400) / size);
    appleColor = appleColors[Math.floor(Math.random() * appleColors.length)];
    appleCollision = false;
    score = 0;
}

function drawWalls() {
    stroke("grey");
    strokeWeight(10);
    rect(0, 0, 400, 400);
}

function drawScore() {
    noStroke();
    fill("white");
    textSize(15);
    text("score:" + score, 20, 20);
}

function drawSnakePiece(x, y, size) {
    rect(x * size - size / 2, y * size - size / 2, size, size);
}

function drawSnake(color, size) {
    strokeWeight(0);
    snake.forEach((piece) => {
        if (piece === snake[0]) {
            fill("white");
        } else if (isGolden) {
            fill("yellow");
        } else {
            fill(color);
        }
        drawSnakePiece(piece.x, piece.y, size);
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

function equal(self1, self2) {
    return self1.x == self2.x && self1.y == self2.y;
}

function addSnakePiece() {
    if (snake[snake.length - 1].direction === "left") {
        snake.push({
            x: snake[snake.length - 1].x + 1,
            y: snake[snake.length - 1].y,
            direction: "left",
        });
    } else if (snake[snake.length - 1].direction === "right") {
        snake.push({
            x: snake[snake.length - 1].x - 1,
            y: snake[snake.length - 1].y,
            direction: "right",
        });
    } else if (snake[snake.length - 1].direction === "up") {
        snake.push({
            x: snake[snake.length - 1].x,
            y: snake[snake.length - 1].y + 1,
            direction: "up",
        });
    }
    if (snake[snake.length - 1].direction === "down") {
        snake.push({
            x: snake[snake.length - 1].x,
            y: snake[snake.length - 1].y - 1,
            direction: "down",
        });
    }
}

function eatApple() {
    appleCollision = equal(snake[0], applePosation);
    if (appleCollision) {
        if (appleColor === "yellow") {
            isGolden = true;
        } else {
            isGolden = false;
        }
        score += 1;
        applePosation.x = Math.floor((Math.random() * 400) / size);
        applePosation.y = Math.floor((Math.random() * 400) / size);
        appleColor =
            appleColors[Math.floor(Math.random() * appleColors.length)];
        appleCollision = false;
        addSnakePiece();
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
    }
    collision = wallCollision || selfCollision;
}

function drawApple(x, y, size) {
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
        //SPACE is replay
        if (collision) {
            replay();
        }
    }
    return false;
}

function touchStarted() {
    if (touches.length != 0 && !collision) {
        if (touches[0].x <= 100) {
            nextHeadDirection = "left";
        } else if (touches[0].y <= 100) {
            nextHeadDirection = "up";
        } else if (touches[0].x >= 300) {
            nextHeadDirection = "right";
        } else if (touches[0].y >= 300) {
            nextHeadDirection = "down";
        }
        if (collision) {
            replay();
        }
    }
}

function draw() {
    checkCollision();
    if (collision) {
        gameOver();
        return;
    }
    if (isGolden) {
        goldenCounter += 1;
    }
    if (goldenCounter >= 6000) {
        isGolden = false;
    }
    eatApple();
    background("black");
    drawWalls();
    drawScore();
    drawSnake("blue", size);
    drawApple(applePosation.x, applePosation.y, size);
    if (hasMovedOneStep(speed) && !collision) {
        updateSnakeDirection();
    }
    updateSnakePosition(speed);
}
