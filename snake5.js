let appleColors=["blue","yellow","green"];
var snake=[{x:8,y:10,direction:"left"}, {x:9,y:10,direction:"left"}, {x:10,y:10,direction:"left"}];

var appleColor=appleColors[random()*appleColors.length];
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
    fill(color);
    rect(x*size-size/2, y*size-size/2, size, size);
    noFill();
}

function drawSnake(color="blue") {
    strokeWeight(0);
    fill(color);
    snake.forEach(piece => {
        drawSnakePiece(piece.x,piece.y,color);
    });
    noFill();
}

function updateSnake() {
    snake.forEach(piece=> {
        if (piece.direction === "left"){
            piece.x-1;
            piece.posation=[piece.x,piece.y];
        }
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