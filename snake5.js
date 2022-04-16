//settings
/**
 * the size of the game bord.
 */
const size = 8;
/**
 * the choosed colors of the apple.
 */
const appleColors = ["green", "yellow", "red"];
/**
 * the game speed.
 */
const speed = 0.25;
/**
 * if apple is eaten by the snake.
 */
let appleCollision = false;
/**
 * score the player get
 */
let score = 0;
/**
 * the next head direction when the snake turns.
 */
let nextHeadDirection = "";
/**
 * the apple's setting.
 */
let apple;
/**
 * the snake pieces' posasion and direction.
 */
let snake = [
    {
        x: Math.floor((Math.random() * 400) / size),
        y: Math.floor((Math.random() * 400) / size),
        direction: "left",
    },
];
//setting the init length of the snake
for (let o = 0; o < 5; o++) {
    addSnakePiece();
}
/**
 * if the snake ate a golden apple.
 */
let isGolden = false;
/**
 * the time settings of the golden effect.
 */
let goldenTimeout;
/**
 * the color of the apple.
 */
let appleColor = appleColors[Math.floor(Math.random() * appleColors.length)];
/**
 * the posasion of the apple.
 */
let applePosation = {
    x: Math.floor((Math.random() * 350 + 25) / size),
    y: Math.floor((Math.random() * 350 + 25) / size),
};
/**
 * if the snake touched the wall.
 */
let wallCollision = false;
/**
 * if the snake bit itself.
 */
let selfCollision = false;
/**
 * if the snake touched the wall or bit itself.
 */
let collision = wallCollision || selfCollision;
/**
 * recieve a number, and check if it is an even.
 * @param {*} num a number to check.
 * @returns a boolean: if the number is an even.
 */
function oddOrEven(num) {
    return num / 2 === Math.floor(num / 2);
}
/**
 * the test programming.
 * @param {*} _id_ the event to test.
 */
function unitTest(_id_) {
    if (_id_ === "set up") {
        //check if all the posasion settings are intigers.
        let sxe = oddOrEven(snake[0].x * 2);
        let sye = oddOrEven(snake[0].y * 2);
        let axe = oddOrEven(applePosation.x * 2);
        let aye = oddOrEven(applePosation.y * 2);
        if (!sxe || !sye || !axe || !aye) {
            alert("error:set up");
        }
    } else {
        alert("error:unitTest id");
    }
}
//test the settings.
unitTest("set up");
/**
 * end the game.
 */
function gameOver() {
    //draw the word 'GAME OVER'p5.BandPass()
    noStroke();
    fill("white");
    textSize(50);
    text("GAME OVER", 50, 200);
    noFill();
}
/**
 * init the p5 canvas.
 */
function setup() {
    createCanvas(400, 400);
}
/**
 * replay when the game ended or revival when the snake was golden.
 * @param {*} reset if need to reset(be used to revival when the snake was golden).
 */
function replay(reset) {
    //reset golden state
    isGolden = false;
    //revival or replay
    if (reset) {
        //replay:
        //reset the snake's head
        snake = [
            {
                x: Math.floor((Math.random() * 400) / size),
                y: Math.floor((Math.random() * 400) / size),
                direction: "left",
            },
        ];
        //reset the game score
        score = 0;
        //reset the data of the apple
        applePosation.x = Math.floor((Math.random() * 350 + 25) / size);
        applePosation.y = Math.floor((Math.random() * 350 + 25) / size);
        appleColor =
            appleColors[Math.floor(Math.random() * appleColors.length)];
        //reset the snake's length
        for (let a = 0; a < 5; a++) {
            addSnakePiece();
        }
    } else {
        //revival:
        //reset the snake's posasion
        snake = [
            {
                x: Math.floor((Math.random() * 400) / size),
                y: Math.floor((Math.random() * 400) / size),
                direction: "left",
            },
        ];
        for (let a = 0; a < score + 5; a++) {
            addSnakePiece();
        }
    }
    //reset the collision data
    collision = false;
    appleCollision = false;
}
/**
 * draw the edge of the game board by the width.
 */
function drawWalls() {
    //set the stroke state
    stroke("grey");
    strokeWeight(size);
    //draw
    rect(0, 0, 400, 400);
}
/**
 * write the game score on the left-up corner.
 */
function drawScore() {
    //set the stroke state, fill state and the size of the text
    noStroke();
    fill("white");
    textSize(15);
    //write the score
    text("score:" + score, 20, 20);
}
/**
 * draw a snake piece on the board.
 * @param {*} x value x in the snake's piece's posision.
 * @param {*} y value y in the snake's piece's posision.
 * @param {*} size the width of the snake.
 */
function drawSnakePiece(x, y, size) {
    rect(x * size - size / 2, y * size - size / 2, size, size);
}
/**
 * draw the snake piece by piece.
 * @param {*} color the color of the snake's body.
 * @param {*} size the width of the snake.
 */
function drawSnake(color, size) {
    //set the stroke state
    strokeWeight(0);
    //begin drawing
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
/**
 * move the snake step by step.
 * @param {*} speed the snake's speed.
 */
function updateSnakePosition(speed) {
    //set the x and y of the snake's pieces.
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
/**
 * update the direction of the snake when it turns.
 */
function updateSnakeDirection() {
    //the snake's pieces follow the forth piece
    for (let a = snake.length - 1; a > 0; a--) {
        snake[a].direction = snake[a - 1].direction;
    }
    //set direction
    if (nextHeadDirection !== "" && !isUTurn()) {
        snake[0].direction = nextHeadDirection;
    }
}
/**
 * check if the snake's direction is the opposite of the next direction.
 * @returns if the snake took a U-turn
 */
function isUTurn() {
    return (
        (snake[0].direction === "down" && nextHeadDirection === "up") ||
        (snake[0].direction === "up" && nextHeadDirection === "down") ||
        (snake[0].direction === "left" && nextHeadDirection === "right") ||
        (snake[0].direction === "right" && nextHeadDirection === "left")
    );
}
/**
 * check if the two selves bounced.
 * @param {*} self1 the first self.
 * @param {*} self2 the second self.
 * @returns if bouncing.
 */
function equal(self1, self2) {
    return (
        (self1.x == self2.x &&
            (self1.y == self2.y + 1 || self1.y == self2.y - 1)) ||
        (self1.y == self2.y &&
            (self1.x == self2.x + 1 || self1.x == self2.x - 1))
    );
}
/**
 * add one snake piece to make the snake longer.
 */
function addSnakePiece() {
    /*
    first, get the direction of the tail of the snake.
    next, push a new piece to the snake.
    */
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
/**
 * if the snake touched the apple, the snake eats it, and set the golden state.
 */
function eatApple() {
    //set the apple collision
    appleCollision = equal(applePosation, snake[0]);
    if (appleCollision) {
        //set the golden state and the state timeout
        if (appleColor === "yellow") {
            isGolden = true;
            goldenTimeout = setTimeout(() => {
                isGolden = false;
            }, 10000);
        }
        //add the score
        score += 1;
        //reset the apple's posation
        applePosation.x = Math.floor((Math.random() * 350 + 25) / size);
        applePosation.y = Math.floor((Math.random() * 350 + 25) / size);
        //reset the apple's color
        appleColor =
            appleColors[Math.floor(Math.random() * appleColors.length)];
        appleCollision = false;
        //add a snake piece
        addSnakePiece();
    }
}
/**
 * check if the snake touched the wall or itself, and change the state.
 */
function checkCollision() {
    //set wall collision
    wallCollision =
        snake[0].x <= 1 ||
        snake[0].x >= 49 ||
        snake[0].y <= 1 ||
        snake[0].y >= 49;
    //set the self collision
    snake.forEach((piece) => {
        if (piece != snake[0] && piece != snake[1]) {
            if (equal(piece, snake[0])) {
                selfCollision = true;
            } else {
                selfCollision = false;
            }
        }
    });
    //set the collision
    collision = wallCollision || selfCollision;
}
/**
 * draw the apple.
 * @param {*} x the X value of the apple's posasion.
 * @param {*} y the Y value of the apple's posation.
 * @param {*} size the apple's size
 */
function drawApple(x, y, size) {
    fill(appleColor);
    apple = rect(x * size - size / 2, y * size - size / 2, size, size);
    noFill();
}
/**
 * the step counter
 */
var counter = 0;
/**
 * check if the snake needs to update the posation.
 * @param {*} speed the speed of the snake.
 * @returns if the snake moved one whole step.
 */
function hasMovedOneStep(speed) {
    counter += 1;
    counter = counter >= 1 / speed ? 0 : counter;
    return counter >= 1 / speed;
}
/**
 * check the key event.
 */
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
    } else if (keyCode === 32 && collision) {
        //SPACE is replay
        replay(true);
    }
    return false;
}
/**
 * set the direction by touching.
 */
function touchStarted() {
    //touch to set the direction
    //the snake following the touch place
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
            replay(true);
        }
    }
}
/**
 * run the game.
 */
function draw() {
    checkCollision();
    if (collision) {
        if (isGolden) {
            replay(false);
        } else {
            gameOver();
            return;
        }
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
