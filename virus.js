const INIT_PEOPLE_NUMBER = 50;
const WORLD_SIZE = 600;
let recoverTime = 500;
let infectionRatio = 0.01;
let infetedPeopleNumber = 1;
let population = [];

const randInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const createPerson = () => ({
    x: randInt(0, WORLD_SIZE),
    y: randInt(0, WORLD_SIZE),
    xs: randInt(-2, 2),
    ys: randInt(-2, 2),
    isPositive: false,
    healthLevel: recoverTime,
    hasAntibody: false,
});
function createPopulation() {
    let population = [];
    for (let index = 0; index < INIT_PEOPLE_NUMBER; index++) {
        population.push(createPerson());
    }
    return population;
}

/**
 * 感染一个人，让他成为阳性，健康值降为0，并拥有抗体
 * @param person 被感染的人
 */
function infect(person) {
    person.isPositive = true;
    person.hasAntibody = true;
    person.healthLevel = 0;
}

function randomWalk(person) {
    if (Math.random() < 0.01) {
        person.xs = randInt(-2, 2);
        person.ys = randInt(-2, 2);
    }
    person.x += person.xs;
    person.y += person.ys;
    if (person.x <= 0 || person.x >= WORLD_SIZE) person.xs *= -1;
    if (person.y <= 0 || person.y >= WORLD_SIZE) person.ys *= -1;
}
function recover(person) {
    //TODO: 有几率死亡
    if (person.healthLevel < recoverTime) {
        person.healthLevel++;
    } else person.isPositive = false;
}

function closeEnough(p1, p2) {
    return dist(p1.x, p1.y, p2.x, p2.y) < 30;
}
const checkInfection = (targetPerson, sourcePerson) => {
    return (
        targetPerson !== sourcePerson &&
        closeEnough(targetPerson, sourcePerson) &&
        sourcePerson.isPositive &&
        !targetPerson.hasAntibody &&
        Math.random() <= infectionRatio
    );
};

function initWorld() {
    population = createPopulation();
    infect(population[0]);
}
function setup() {
    createCanvas(WORLD_SIZE, WORLD_SIZE);
    background("#000000");
    noStroke();
    initWorld();
}

function drawPerson(person) {
    if (person.isPositive) fill("#f00");
    else if (person.hasAntibody) fill("#00f");
    else fill("#0f0");
    ellipse(person.x, person.y, 10);
}
function showInfection() {
    document.getElementById("infectionOutput").innerHTML =
        "infected people number: " +
        str(infetedPeopleNumber) +
        "/" +
        str(INIT_PEOPLE_NUMBER);
}

function draw() {
    infetedPeopleNumber = 0;
    fill(0);
    rect(0, 0, WORLD_SIZE, WORLD_SIZE);
    population.forEach((person) => {
        randomWalk(person);
        recover(person);
        population.forEach((otherPerson) => {
            if (checkInfection(person, otherPerson)) infect(person);
        });
        drawPerson(person);
        if (person.isPositive) infetedPeopleNumber++;
    });
    showInfection();
}

function onInfectionRatioChange() {
    infectionRatio = document.getElementById("infectionRatio").value;
    document.getElementById("infectionRatioOutput").innerHTML =
        str(Math.round(infectionRatio * 100)) + "%";
}
function addPositive() {
    let unluckyPerson = population[randInt(1, INIT_PEOPLE_NUMBER)];
    infect(unluckyPerson);
}
