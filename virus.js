/**the setting number of people */
const INIT_PEOPLE_NUMBER = 50;
/**the size of the world */
const WORLD_SIZE = 600;
/**how long an infected people will be cured after being infected */
const recoverTime = 500;
/**how possible an infected person can infect an uninfected people */
let infectionRatio = 0.5;
/**how many people are infected */
let infectionCount = 1;
let antibodyCount = 0;
/**the population in the world*/
let population = [];
const redrawFrameRate = 30;
/**count down for redraw the chart */
let redrawCount = 0;
/**time(s) */
let count = 0;
/**whether the chart will be continue drawing */
let continueDrawing = true;
let vaccinateRatio = 0.5;
let vaccineEffectiveRatio = 0.8;
let infectionRange = 40;
let vaccineUsed = false;
/**context */
const ctx = document.getElementById("infectionChart").getContext("2d");
let infectionChart = new Chart(ctx, {
    type: "line",
    data: {
        labels: [],
        datasets: [
            {
                label: "how many people infected",
                data: [],
                backgroundColor: ["rgba(239, 31, 31, 0.2)"],
                borderColor: ["rgba(255, 0, 0, 0.5)"],
                borderWidth: 2,
            },
            {
                label: "how many people cured",
                data: [],
                backgroundColor: ["rgba(31, 255, 127, 0.2)"],
                borderColor: ["rgba(0, 223, 31, 0.5)"],
                borderWidth: 2,
            },
        ],
    },
    options: {
        animations: false,
        transitions: {
            show: { animations: { x: { from: 0 }, y: { from: 0 } } },
            hide: { animations: { x: { to: 0 }, y: { to: 0 } } },
            responsive: false,
        },
        scales: {
            y: {
                beginAtZero: true,
                suggestedMin: INIT_PEOPLE_NUMBER,
                suggestedMax: INIT_PEOPLE_NUMBER,
            },
        },
    },
});
let langMode = "eng";
const languages = {
    eng: [
        "select language mode: ",
        "reset/start",
        "infection ratio: ",
        "distance for infecting: ",
        "use vaccine",
        "vaccination ratio: ",
        "vaccine effective ratio: ",
        "infected people number: ",
        "add positive",
        "virus infection simulator",
        "how many people infected",
        "how many people cured",
        "select the sort of the virus: ",
        "customized",
        "normal cold virus",
        "flu virus",
        "SARS",
        "COVID 19 alpha(&alpha;) strain",
        "COVID 19 delta(&delta;) strain",
        "COVID 19 omicron(&omicron;) strain",
    ],
    "sim-chn": [
        "选择语言：",
        "重新开始模拟/开始模拟",
        "感染率：",
        "感染所需距离：",
        "是否使用疫苗",
        "疫苗接种率：",
        "疫苗有效率：",
        "感染人数：",
        "增加感染者（病例）",
        "病毒传染模拟器",
        "感染人数",
        "治愈人数",
        "选择病毒、毒株：",
        "自定义",
        "普通感冒病毒",
        "流行性感冒病毒",
        "非典型肺炎病毒",
        "新型冠状病毒阿尔法(&alpha;)毒株",
        "新型冠状病毒德尔塔(&delta;)毒株",
        "新型冠状病毒奥密克戎(&omicron;)毒株",
    ],
};
const r0s = {
    cold: 0,
    flu: 1.3,
    sars: 3.5,
    covid19alpha: 2.6,
    covid19delta: 6.5,
    covid19omicron: 7.5,
};
let started = false;
const getid = (id) => document.getElementById(id);
/**
 * random int
 * @param {int} min the minimum number
 * @param {int} max the maximum number
 * @returns {int} a random int between min and max
 */
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
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
    isVaccinated: Math.random() < vaccinateRatio && vaccineUsed,
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
    if (Math.random() < 0.02) {
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
    if (person.healthLevel < recoverTime) person.healthLevel++;
    else person.isPositive = false;
}

/**
 * check the distance betwee p1 and p2
 * @param {object} p1 person one
 * @param {object} p2 person two
 * @returns {Boolean} whether p1 and p2 are close enough
 */
const closeEnough = (p1, p2) => dist(p1.x, p1.y, p2.x, p2.y) < infectionRange;
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
    (Math.random() >= targetPerson.isVaccinated ? vaccineEffectiveRatio : 0) &&
    Math.random() <= infectionRatio;

/**
 * create the population and let a person be infected
 */
function initWorld() {
    population = createPopulation();
    infect(population[0]);
    clearChart();
    started = true;
}
/**
 * the set up function for the p5 library
 */
function setup() {
    let world = createCanvas(WORLD_SIZE, WORLD_SIZE);
    world.parent("sim");
    frameRate(60);
    background("#000000");
    noStroke();
}

/**
 * draw the person
 * @param {object} person person
 */
function drawPerson(person) {
    if (person.isPositive) fill("#f00");
    else if (person.hasAntibody) fill("#00f");
    else if (person.isVaccinated) fill("#fb0");
    else fill("#0f0");
    ellipse(person.x, person.y, 10);
}

/**
 * show the infection by a number on the web pege
 */
function showInfection() {
    getid("infectionOutput").innerHTML =
        languages[langMode][7] +
        str(infectionCount) +
        "/" +
        str(INIT_PEOPLE_NUMBER);
}
/**
 *
 * @param {object[]} population
 * @returns
 */
function countCured(population) {
    return population.reduce((result, person) => {
        return !person.isPositive && person.hasAntibody ? result + 1 : result;
    }, 0);
}

function countInfected(population) {
    return population.reduce((result, person) => {
        return person.isPositive ? result + 1 : result;
    }, 0);
}

function calculatePositiveCount(persons) {
    simulationCompleted();
    infectionCount = countInfected(persons);
    antibodyCount = countCured(persons);
}

function draw() {
    let tmp = langMode;
    langMode = getid("langSelect").value;
    if (tmp !== langMode) setPageLang();
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
    selectVirus();
}

function onInfectionRatioChange() {
    infectionRatio = getid("infectionRatio").value;
    getid("infectionRatioOutput").innerHTML =
        str(Math.round(infectionRatio * 100)) + "%";
    infectionChart.data.labels[infectionChart.data.labels.length - 1] =
        "!(" + str(count) + ")";
}
function onVaccinateRatioChange() {
    vaccinateRatio = getid("vaccinateRatio").value;
    getid("vaccinateRatioOutput").innerHTML =
        str(Math.round(vaccinateRatio * 100)) + "%";
}
function onVERchange() {
    vaccineEffectiveRatio = getid("VER").value;
    getid("VERoutput").innerHTML =
        str(Math.round(vaccineEffectiveRatio * 100)) + "%";
}
function addPositive() {
    if (started) infect(population[randInt(1, INIT_PEOPLE_NUMBER)]);
}
function simulationCompleted() {
    const d = infectionChart.data.datasets[0].data;
    continueDrawing = !(infectionCount === 0 && d[d.length - 1] === 0);
    if (continueDrawing) redrawChart();
}
function redrawChart() {
    if (redrawCount++ >= redrawFrameRate) {
        count++;
        infectionChart.data.datasets[0].data.push(infectionCount);
        infectionChart.data.datasets[1].data.push(antibodyCount);
        infectionChart.data.labels.push(String(count));
        infectionChart.update();
        redrawCount = 0;
    }
}
function clearChart() {
    infectionChart.data.labels = [];
    infectionChart.data.datasets[0].data = [];
    infectionChart.data.datasets[1].data = [];
    count = -1;
}
function setPageLang() {
    getid("slm").innerHTML = languages[langMode][0];
    document.getElementById("reset").value = languages[langMode][1];
    getid("ir").innerHTML = languages[langMode][2];
    getid("irg").innerHTML = languages[langMode][3];
    getid("vs").innerHTML = languages[langMode][4];
    getid("vr").innerHTML = languages[langMode][5];
    getid("ver").innerHTML = languages[langMode][6];
    getid("addPositive").value = languages[langMode][8];
    getid("title").innerHTML = languages[langMode][9];
    infectionChart.data.datasets[0].label = languages[langMode][10];
    infectionChart.data.datasets[1].label = languages[langMode][11];
    infectionChart.update();
    getid("svs").innerHTML = languages[langMode][12];
    getid("default-customized").innerHTML = languages[langMode][13];
    getid("cold").innerHTML = languages[langMode][14];
    getid("flu").innerHTML = languages[langMode][15];
    getid("sars").innerHTML = languages[langMode][16];
    getid("covid19alpha").innerHTML = languages[langMode][17];
    getid("covid19delta").innerHTML = languages[langMode][18];
    getid("covid19omicron").innerHTML = languages[langMode][19];
}
function onInfectionRangeChange() {
    infectionRange = getid("infectionRange").value;
    getid("infectionRangeOutput").innerHTML = infectionRange;
}
function switchVaccine() {
    vaccineUsed = getid("vaccineSwitch").checked;
    getid("vaccinateRatio").disabled = getid("VER").disabled = !vaccineUsed;
}
function selectVirus() {
    let customizate = getid("virusSelect").value === "customized";
    getid("infectionRange").disabled = getid("infectionRatio").disabled =
        !customizate;
    if (!customizate) {
        infectionRatio = r0s[getid("virusSelect").value] / 50;
    }
}
