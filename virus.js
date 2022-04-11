const INIT_PEOPLE_NUMBER = 50;
const WORLD_SIZE = 400;
let curetime = 1000;
let spreadSpeed = 0.01;
let infetedPeopleNumber = 1;

let samples = [];

const randInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;

function createPopulation() {
    let population = [];
    for (let index = 0; index < INIT_PEOPLE_NUMBER; index++) {
        population.push(createPerson());
    }
    return population;
}
function createPerson() {
    return {
        x: randInt(0, WORLD_SIZE),
        y: randInt(0, WORLD_SIZE),
        xs: randInt(-2, 2),
        ys: randInt(-2, 2),
        isPositive: false,
        healthLevel: curetime * 1000,
        antibodyLevel: 0,
    };
}

function checkInfection(p1, p2) {}

function infect(person) {
    person.isPositive = true;
    person.antibodyLevel = 1;
    person.healthLevel = 0;
}

function drawPerson(person) {
    if (person.isPositive) fill("#f00");
    else if (person.antibodyLevel > 0) fill("orange");
    else fill("#0f0");
    ellipse(person.x, person.y, 10, 10);
}
function updatePersonPosition(person) {}
function initWorld() {
    samples = createPopulation();
    infect(samples[0]);
}
function setup() {
    createCanvas(WORLD_SIZE, WORLD_SIZE);
    background("#000000");
    noStroke();
    initWorld();
}
function move(sample) {
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
            infect(sample1);
        }
        if (sample2.antibodyLevel == 0) {
            infect(sample2);
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
        move(elm1);
        drawPerson(elm1);
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
        str(INIT_PEOPLE_NUMBER);
}
function change() {
    spreadSpeed = document.getElementById("spreadSpeed").value;
    spreadSpeedOutput = document.getElementById("spreadSpeedOutput");
    spreadSpeedOutput.innerHTML = str(spreadSpeed * 100) + "%";
}
function addPositive() {
    let unluckyPerson = samples[randInt(1, INIT_PEOPLE_NUMBER)];
    infect(unluckyPerson);
}
