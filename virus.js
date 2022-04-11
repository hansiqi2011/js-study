const INIT_PERSON_NUMBER = 50;
let curetime = 100;
let spreadSpeed = 0.01;
let infetedPeopleNumber = 1;
function setup() {
    createCanvas(600, 600);
    background("#000000");
    noStroke();
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
        healthLevel: curetime * 1000,
        antibudyLevel: 0,
    });
}
samples[0].isPositive = true;
samples[0].healthLevel = 0;
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
const updateState = (sample1, sample2) => {
    if (Math.random() <= spreadSpeed) {
        sample1.isPositive = true;
        sample1.healthLevel = 0;
        sample2.isPositive = true;
        sample2.healthLevel = 0;
    }
};

function draw() {
    infetedPeopleNumber = 0;
    fill(0);
    rect(0, 0, 600, 600);
    samples.forEach((elm1) => {
        if (elm1.isPositive) infetedPeopleNumber++;
        if (elm1.healthLevel < 100) elm1.healthLevel++;
        else elm1.isPositive = false;
        updatePosition(elm1);
        fill(elm1.isPositive ? "#f00" : "#0f0");
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
        "infected people number: " + str(infetedPeopleNumber) + "/50";
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
            healthLevel: curetime * 1000,
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
    let unluckyman = samples[randInt(1, INIT_PERSON_NUMBER)];
    unluckyman.isPositive = true;
    unluckyman.healthLevel = 0;
}
