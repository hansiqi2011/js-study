const INIT_PERSON_NUMBER = 50;
const WORLD_SIZE = 400;
let curetime = 1000;
let spreadSpeed = 0.01;
let infetedPeopleNumber = 1;
function setup() {
    createCanvas(WORLD_SIZE, WORLD_SIZE);
    background("#000000");
    noStroke();
}
const randInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;
let samples = [];
for (let index = 0; index < INIT_PERSON_NUMBER; index++) {
    samples.push({
        x: randInt(0, WORLD_SIZE),
        y: randInt(0, WORLD_SIZE),
        xs: randInt(-2, 2),
        ys: randInt(-2, 2),
        isPositive: false,
        healthLevel: curetime * 1000,
        antibodyLevel: 0,
    });
}
samples[0].isPositive = true;
samples[0].antibodyLevel = 1000;
samples[0].healthLevel = 0;
function updatePosition(sample) {
    if (random() < 0.01) {
        sample.xs = randInt(-2, 2);
        sample.ys = randInt(-2, 2);
    }
    sample.x += sample.xs;
    sample.y += sample.ys;
    if (sample.x <= 0 || sample.x >= WORLD_SIZE) sample.xs *= -1;
    if (sample.y <= 0 || sample.y >= WORLD_SIZE) sample.ys *= -1;
}
function updateState(sample1, sample2) {
    if (Math.random() <= spreadSpeed) {
        if (sample1.antibodyLevel == 0) {
            sample1.isPositive = true;
            sample1.antibodyLevel = 1000;
            sample1.healthLevel = 0;
        }
        if (sample2.antibodyLevel == 0) {
            sample2.isPositive = true;
            sample2.antibodyLevel = 1000;
            sample2.healthLevel = 0;
        }
    }
}
function draw() {
    infetedPeopleNumber = 0;
    fill(0);
    rect(0, 0, WORLD_SIZE, WORLD_SIZE);
    samples.forEach((elm1) => {
        if (elm1.isPositive) infetedPeopleNumber++;
        if (elm1.healthLevel < 100) {
            elm1.healthLevel++;
            if (elm1.healthLevel == 0) elm1.antibodyLevel = 1;
        } else elm1.isPositive = false;
        updatePosition(elm1);
        if (elm1.isPositive) {
            fill("#f00");
        } else if (elm1.antibodyLevel > 0) {
            fill("orange");
        } else {
            fill("#0f0");
        }
        ellipse(elm1.x, elm1.y, 10, 10);
        samples.forEach((elm2) => {
            if (
                dist(elm1.x, elm1.y, elm2.x, elm2.y) <= 30 &&
                (elm1.isPositive || elm2.isPositive)
            )
                updateState(elm1, elm2);
        });
    });
    document.getElementById("infectionOutput").innerHTML =
        "infected people number: " +
        str(infetedPeopleNumber) +
        "/" +
        str(INIT_PERSON_NUMBER);
}
function reset() {
    samples = [];
    for (let index = 0; index < INIT_PERSON_NUMBER; index++) {
        samples.push({
            x: randInt(0, WORLD_SIZE),
            y: randInt(0, WORLD_SIZE),
            xs: randInt(-2, 2),
            ys: randInt(-2, 2),
            isPositive: false,
            healthLevel: curetime * 1000,
            antibodyLevel: 0,
        });
    }
    samples[0].isPositive = true;
    samples[0].healthLevel = 0;
}
function change() {
    spreadSpeed = document.getElementById("spreadSpeed").value;
    spreadSpeedOutput = document.getElementById("spreadSpeedOutput");
    spreadSpeedOutput.innerHTML = str(spreadSpeed * 100) + "%";
}
function addPositive() {
    let positive = samples[randInt(1, INIT_PERSON_NUMBER)];
    positive.isPositive = true;
    positive.healthLevel = 0;
}
