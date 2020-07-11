var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var width = canvas.width;
var height = canvas.height;
var blockSize = 10;
var wib = width / blockSize;
var hib = height / blockSize;
var score = 0;
function drawBorder() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, width, blockSize);
  ctx.fillRect(0, height - blockSize, width, blockSize);
  ctx.fillRect(0, 0, blockSize, height);
  ctx.fillRect(width - blockSize, 0, blockSize, height);
}
function circle(x,y,randius,fillCircle){
  ctx.beginPath();
  ctx.arc(x,y,randius,0,Math.PI*2,false);
  if (fillCircle){
    ctx.fill();
  }else{
    ctx.stroke();
  }
}
function drawScore() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "black";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("Score: " + score, blockSize, blockSize);
}
function Block(col, row) {
  this.col = col;
  this.row = row;
}
function gameOver() {
  clearInterval(intervalId);
  ctx.font = "60px Arial";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText("游戏结束", width / 2, height / 2);
}
Block.prototype.drawSquare = function(color) {
  var centerX = this.col * blockSize + blockSize / 2;
  var centerY = this.row * blockSize + blockSize / 2;
  ctx.fillStyle = color;
  ctx.fillRect(centerX, centerY, blockSize, blockSize);
};
Block.prototype.drawCircle = function(color) {
  var centerX = this.col * blockSize + blockSize / 2;
  var centerY = this.row * blockSize + blockSize / 2;
  ctx.fillStyle = color;
  circle(centerX, centerY, blockSize / 2, true);
};
Block.prototype.equal = function(otherblock) {
  return this.col === otherblock.col && this.row === otherblock.row;
};
function Snake(x,y) {
  this.segments = [new Block(x, y), new Block(x-1, y), new Block(x-2, y)];
  this.direction = "right";
  this.nextDirection = "right";
}

let snake1 = new Snake(20,20);
let snake2 = new Snake(20,40);

function Apple() {
  this.position = new Block(10, 10);
}
let apple = new Apple();
Snake.prototype.drawSnake = function(color) {
  for (var i = 0; i < this.segments.length; i++) {
    this.segments[i].drawSquare(color);
  }
};
Apple.prototype.drawApple = function() {
  this.position.drawCircle("limeGreen");
};
Apple.prototype.move = function() {
  var randomCol = Math.floor(Math.random() * (wib - 2)) + 1;
  var randonRow = Math.floor(Math.random() * (hib - 2)) + 1;
  this.position = new Block(randomCol, randonRow);
};
Snake.prototype.move = function() {
  var head = this.segments[0];
  var newHead;
  this.direction = this.nextDirection;
  if (this.direction === "right") {
    newHead = new Block(head.col + 1, head.row);
  } else if (this.direction === "down") {
    newHead = new Block(head.col, head.row + 1);
  } else if (this.direction === "left") {
    newHead = new Block(head.col - 1, head.row);
  } else if (this.direction === "up") {
    newHead = new Block(head.col, head.row - 1);
  }
  if (this.checkCollision(newHead)) {
    gameOver();
    return;
  }
  this.segments.unshift(newHead);
  if (newHead.equal(apple.posation)) {
    score++;
    apple.move();
  } else {
    this.segments.pop();
  }
};
Snake.prototype.printPlayer = function(playerName) {
  ctx.fillStyle = "black";
  ctx.textBaseline = "bottom";
  ctx.font = "20px Arial";
  ctx.textAlign = "center";
  ctx.fillText("playerName", this.newHead.col, this.newHead.row + 20, blockSize);
};
var intervalId = setInterval(function() {
  ctx.clearRect(0, 0, width, height);
  drawScore();
  drawBorder();
  snake1.drawSnake("blue");
  snake2.drawSnake("red");
  snake1.printPlayer("P1");
  snake2.printPlayer("P2")
  apple.drawApple();
  snake1.move();
  snake2.move();
}, 100);
Snake.prototype.checkCollision = function(head) {
  var leftCollision = head.col === 0;
  var topCollision = head.row === 0;
  var rightCollision = head.col === wib - 1;
  var bottomCollision = head.row === hib - 1;
  var wallCollision =
    leftCollision || rightCollision || topCollision || bottomCollision;
  var selfCollision = false;
  for (let i = 0; i < this.segments.length; i++) {
    if (head.equal(this.segments[i])) {
      selfCollision = true;
    }
  }
  var collision = wallCollision || selfCollision;
  return collision;
};
var directions = {
  37: "left",
  38: "up",
  39: "right",
  40: "down"
};
var newDirection;
Snake.prototype.setDirection = function() {
  if (this.direction === "up" && newDirection === "down") {
    return;
  } else if (this.direction === "right" && newDirection === "left") {
    return;
  } else if (this.direction === "duwn" && newDirection === "up") {
    return;
  }
};

$("#body").keydown(function(event) {
  var newDirection = directions[event.keyCode];
  if (newDirection !== undefined) {
    snake.setDirection(newDirection);
  }
  snake.setDirection(null);
});
