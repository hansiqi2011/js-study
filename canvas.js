const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
function circle(x, y, randius, fill) {
    ctx.beginPath();
    ctx.arc(x, y, randius, 0, Math.TWO_PI, false);
    ctx.stroke();
    if (fill) {
        ctx.fill();
    }
}
ctx.fillStyle = "Black";
const randint = (min, max) => floor(random(max - min)) + min;
class Ball {
    constructor(x, y, randius, xs, ys) {
        x = this.x;
        y = this.y;
        randius = this.r;
        xs = this.xs;
        ys = this.ys;
    }
    draw() {
        circle(this.x, this.y, this.r, true);
    }
    move() {
        this.x += this.xs;
        this.y += this.ys;
    }
    collision() {
        if (this.x <= 0 || this.x >= 400) {
            this.xs = -this.xs;
        }
        if (this.y <= 0 || this.y >= 400) {
            this.ys = -this.ys;
        }
    }
}
let ball = new Ball(0, 0, 10, 10, 5);
setInterval(() => {
    ball.draw();
    ball.move();
    ball.collision();
}, 10);
