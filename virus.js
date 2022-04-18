/**the setting number of people */
const INIT_PEOPLE_NUMBER = 50;
/**the size of the world */
const WORLD_SIZE = 600;
/**how long an infected people will be cured after being infected */
const recoverTime = 500;
/**how possible an infected person can infect an uninfected people */
let infectionRatio = 0.01;
/**how many people are infected */
let infectedPeopleNumber = 1;
/**the population in the world */
let population = [];
/**count down for changing the chart */
let changeChartCount = 60;
/**context */
const ctx = document.getElementById("infectionChart").getContext("2d");
ctx.beginPath();
ctx.lineWidth = 2;
ctx.fillStyle = "#333";
let chartData = [];
/**
 * random int
 * @param {int} min the minimum number
 * @param {int} max the maximum number
 * @returns {int} a random int between min and max
 */
const randInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;
/**
 * create the person
 * @returns {object} a person
 */
const createPerson = () => ({
    x: randInt(0, WORLD_SIZE),
    y: randInt(0, WORLD_SIZE),
    xs: randInt(-2, 2),
    ys: randInt(-2, 2),
    isPositive: false,
    healthLevel: recoverTime,
    hasAntibody: false,
});
/**
 * create a population in the world
 * @returns the created population
 */
function createPopulation() {
    let population = [];
    for (let index = 0; index < INIT_PEOPLE_NUMBER; index++) {
        population.push(createPerson());
    }
    return population;
}

/**
 * infect a person: make his health level become 0, let him be positive and give him an antibody
 * @param {object} person the people to infect
 */
function infect(person) {
    person.isPositive = true;
    person.hasAntibody = true;
    person.healthLevel = 0;
}

/**
 * update a person's poosition
 * @param {object} person the person to move
 */
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
/**
 * recover the person
 * @param {object} person person
 */
function recover(person) {
    //TODO: 有几率死亡
    if (person.healthLevel < recoverTime) {
        person.healthLevel++;
    } else person.isPositive = false;
}

/**
 * check the distance betwee p1 and p2
 * @param {object} p1 person one
 * @param {object} p2 person two
 * @returns {Boolean} whether p1 and p2 are close enough
 */
const closeEnough = (p1, p2) => dist(p1.x, p1.y, p2.x, p2.y) < 30;
/**
 * judge whether one in the two people should be infected
 * @param {object} targetPerson the first person to check
 * @param {object} sourcePerson the second person to check
 * @returns {Boolean} if target person should be infected
 */
const checkInfection = (targetPerson, sourcePerson) =>
    targetPerson !== sourcePerson &&
    closeEnough(targetPerson, sourcePerson) &&
    sourcePerson.isPositive &&
    !targetPerson.hasAntibody &&
    Math.random() <= infectionRatio;

/**
 * create the population and let a person be infected
 */
function initWorld() {
    population = createPopulation();
    infect(population[0]);
}
/**
 * the set up function for the p5 library
 */
function setup() {
    let c = createCanvas(WORLD_SIZE, WORLD_SIZE);
    c.parent("sim");
    frameRate(60);
    background("#000000");
    noStroke();
    initWorld();
}

/**
 * draw the person
 * @param {object} person person
 */
function drawPerson(person) {
    if (person.isPositive) fill("#f00");
    else if (person.hasAntibody) fill("#00f");
    else fill("#0f0");
    ellipse(person.x, person.y, 10);
}
/**
 * draw the chart
 * @param {Array} data the data of the chart
 * @param {int} width
 * @param {int} intervalWidth
 * @param {int} width
 */
function drawChart(data, width, intervalWidth, intervalHeight) {
    ctx.clearRect(0, 0, ctx.width, ctx.height);
    const len = data.length;
    if (width / intervalWidth < len) {
        data.shift();
    }
    data.push(infectedPeopleNumber);
    for (let i = 0; i < len - 2; i++) {
        ctx.moveTo(i * intervalWidth, WORLD_SIZE - intervalHeight * data[i]);
        ctx.lineTo(
            (i + 1) * intervalWidth,
            WORLD_SIZE - intervalHeight * data[i + 1]
        );
        ctx.stroke();
    }
}
/**
 *
 */
function showInfection() {
    document.getElementById("infectionOutput").innerHTML =
        "infected people number: " +
        str(infectedPeopleNumber) +
        "/" +
        str(INIT_PEOPLE_NUMBER);
}

function calculatePositiveCount(persons) {
    let currentTotal = persons.reduce((total, person) => {
        return person.isPositive ? total + 1 : total;
    }, 0);
    infectedPeopleNumber = currentTotal;
}

function draw() {
    fill(0);
    rect(0, 0, WORLD_SIZE, WORLD_SIZE);
    population.forEach((person) => {
        randomWalk(person);
        recover(person);
        population.forEach((otherPerson) => {
            if (checkInfection(person, otherPerson)) infect(person);
        });
        drawPerson(person);
    });
    calculatePositiveCount(population);
    showInfection();
    if (changeChartCount-- === 0) {
        drawChart(chartData, WORLD_SIZE, 10, 12);
        changeChartCount = 60;
    }
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
