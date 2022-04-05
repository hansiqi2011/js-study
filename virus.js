function setup() {
    createCanvas(600, 600);
    background("#969696");
    noStroke();
    ellipse(50, 50, 10, 10);
}
const randInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;
let samples = [];
for (let index = 0; index < 40; index++) {
    samples.push({
        x: randInt(0, 600),
        y: randInt(0, 600),
        xs: randInt(-2, 2),
        ys: randInt(-2, 2),
        isPositive: false,
    });
}
for (let index = 0; index < 1; index++) {
    samples[index].isPositive = true;
}
function updatePosition(sample) {
    if (random() < 0.01) {
        sample.xs = randInt(-2, 2);
        sample.ys = randInt(-2, 2);
    }
    sample.x += sample.xs;
    sample.y += sample.ys;
    if (sample.x <= 0 || sample.x >= 600) sample.xs *= -1;
    if (sample.y <= 0 || sample.y >= 600) sample.ys *= -1;
}
function updateState(sample1, sample2) {
    if (Math.random() <= 0.005) {
        if (sample1.isPositive) sample2.isPositive = true;
        else if (sample2.isPositive) sample1.isPositive = true;
    }
}
function draw() {
    fill(150);
    rect(0, 0, 600, 600);
    samples.forEach((element) => {
        updatePosition(element);
        fill(element.isPositive ? "#f00" : "#0f0");
        ellipse(element.x, element.y, 10, 10);
    });
    samples.forEach((elm1) =>
        samples.forEach((elm2) => {
            if (dist(elm1.x, elm1.y, elm2.x, elm2.y) <= 30)
                updateState(elm1, elm2);
        })
    );
}
