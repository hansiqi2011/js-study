let appleColors=["blue","yellow","green"];
var snake=[{x:8,y:10}, {x:8, y:11}, {x:8, y:12}];
var appleColor;
var applePosation=[100,100];
function setup() {
    createCanvas(400, 400);
}

function drawWalls() {
    stroke('grey');
    strokeWeight(10);
    rect(0, 0, 400, 400);
}

function drawSnakePiece(x, y, color="blue", size=8) {
    rect(x*size-size/2, y*size-size/2, size, size);
}

function drawSnake(color="blue") {
    strokeWeight(0);
    fill(color);
    snake.forEach(piece => {
        drawSnakePiece(piece.x, piece.y);
    });
    noFill();
}

function updateSnake() {
    snake.forEach(piece=> {
        piece.y = piece.y+0.1;
    });
}

function equal(posation1,posation2){
    return posation1===posation2;
}

function drawApple() {

}


function draw() {
    background("white");
    drawWalls();
    updateSnake();
    drawSnake("blue");
    drawApple();
}