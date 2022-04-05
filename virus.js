const INIT_PERSON_NUMBER = 50;
let curetime = 10;
let spreadSpeed = 0.01;
function setup() {
    createCanvas(600, 600);
    background("#969696");
    noStroke();
    ellipse(50, 50, 10, 10);
}
const randInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;
let samples = [];
for (let index = 0; index < INIT_PERSON_NUMBER; index++) {
    samples.push({
        x: randInt(0, 600),
        y: randInt(0, 600),
        xs: randInt(-2, 2),
        ys: randInt(-2, 2),
        isPositive: false,
    });
}
samples[0].isPositive = true;
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
    if (Math.random() <= spreadSpeed) {
        if (sample1.isPositive && !sample2.isPositive) {
            sample2.isPositive = true;
            clearTimeout("smp1");
            setTimeout(
                () => (sample2.isPositive = false),
                curetime * 1000,
                "smp2"
            );
        } else if (sample2.isPositive && !sample1.isPositive) {
            sample1.isPositive = true;
            clearTimeout("smp2");
            setTimeout(
                () => (sample1.isPositive = false),
                curetime * 1000,
                "smp1"
            );
        }
    }
}
function draw() {
    fill(150);
    rect(0, 0, 600, 600);
    samples.forEach((elm1) => {
        updatePosition(elm1);
        fill(elm1.isPositive ? "#f00" : "#0f0");
        ellipse(elm1.x, elm1.y, 10, 10);
        samples.forEach((elm2) => {
            if (dist(elm1.x, elm1.y, elm2.x, elm2.y) <= 30)
                updateState(elm1, elm2);
        });
    });
}
function reset() {
    samples = [];
    for (let index = 0; index < INIT_PERSON_NUMBER; index++) {
        samples.push({
            x: randInt(0, 600),
            y: randInt(0, 600),
            xs: randInt(-2, 2),
            ys: randInt(-2, 2),
            isPositive: false,
        });
    }
    samples[0].isPositive = true;
}
function change() {
    spreadSpeed = document.getElementById("spreadSpeed").value;
    spreadSpeedOutput = document.getElementById("spreadSpeedOutput");
    spreadSpeedOutput.innerHTML = str(spreadSpeed * 100) + "%";
}
