/**the setting number of people */
let peopleNumber = 50;
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
let instructionsHidden = true;
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
                suggestedMin: peopleNumber,
                suggestedMax: peopleNumber,
            },
        },
    },
});
const languages = {
    eng: [
        "select language mode: ",
        "select the sort of the virus: ",
        "infection ratio: ",
        "distance for infecting: ",
        "use vaccine",
        "vaccination ratio: ",
        "vaccine effective ratio: ",
        "virus infection simulator",
        "infected people number: ",
        "customized",
        "normal cold virus",
        "flu virus",
        "SARS",
        "COVID 19 alpha(&alpha;) strain",
        "COVID 19 delta(&delta;) strain",
        "COVID 19 omicron(&omicron;) strain",
        "people number: ",
        "click to show the instructions",
        "reset/start",
        "add positive",
        "how many people infected",
        "how many people cured",
    ],
    simchn: [
        "选择语言：",
        "选择病毒、毒株：",
        "感染率：",
        "感染所需距离：",
        "是否使用疫苗",
        "疫苗有效率：",
        "疫苗接种率：",
        "病毒传染模拟器",
        "感染人数：",
        "自定义",
        "普通感冒病毒",
        "流行性感冒病毒",
        "非典型肺炎病毒",
        "新型冠状病毒阿尔法(&alpha;)毒株",
        "新型冠状病毒德尔塔(&delta;)毒株",
        "新型冠状病毒奥密克戎(&omicron;)毒株",
        "人数：",
        "显示使用说明",
        "重新开始模拟/开始模拟",
        "增加感染者（病例）",
        "感染人数",
        "治愈人数",
    ],
};
const langs = [new pair(), new pair()];
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
let langMode = "simchn";
setPageLang();
setPageLang();
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
    for (let index = 0; index < peopleNumber; index++) {
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
    person.xs = randInt(-1, 1);
    person.ys = randInt(-1, 1);
}

/**
 * update a person's poosition
 * @param {object} person the person to move
 */
function randomWalk(person) {
    if (Math.random() < 0.02) {
        if (person.isPositive) {
            person.xs = randInt(-1, 1);
            person.ys = randInt(-1, 1);
        }
        if (person.isPositive) {
            person.xs = randInt(-2, 2);
            person.ys = randInt(-2, 2);
        }
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
        str(infectionCount) + "/" + str(peopleNumber);
}
/**
 * count the number of people cured in the area
 * @param {object[]} population the population in the area
 * @returns how many cured people there are in the area
 */
function countCured(population) {
    return population.reduce((result, person) => {
        return !person.isPositive && person.hasAntibody ? result + 1 : result;
    }, 0);
}
/**
//  * count the number of people infected (but not cured) in the area
//  * @param {object[]} population the population in the area
//  * @returns how many infected (but not cured) people there are in the area
//  */
function countInfected(population) {
    return population.reduce((result, person) => {
        return person.isPositive ? result + 1 : result;
    }, 0);
}
/**
//  * update the varible infectionCount and the varible antibodyCount
//  * @param {Object[]} persons the population
//  */
function calculatePositiveCount(persons) {
    simulationCompleted();
    infectionCount = countInfected(persons);
    antibodyCount = countCured(persons);
}

/**
//  * the draw function for p5js
//  */
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
function onInfectionRangeChange() {
    infectionRange = getid("infectionRange").value;
    getid("infectionRangeOutput").innerHTML = infectionRange;
}
function addPositive() {
    if (started) infect(population[randInt(1, peopleNumber)]);
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
    getid("reset").value = languages[langMode][18];
    getid("addPositive").value = languages[langMode][19];
    infectionChart.data.datasets[0].label = languages[langMode][20];
    infectionChart.data.datasets[1].label = languages[langMode][21];
    infectionChart.update();
    let keys = [
        "slm",
        "svs",
        "ir",
        "irg",
        "vs",
        "vr",
        "ver",
        "title",
        "I",
        "default-customized",
        "cold",
        "flu",
        "sars",
        "covid19alpha",
        "covid19delta",
        "covid19omicron",
        "pn",
        "instructionLink",
    ];
    keys.forEach((k, idx) => {
        const elm = getid(k);
        const txt = languages[langMode][idx];
        elm.innerHTML = txt;
    });
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
        getid("infectionRatio").value = infectionRatio =
            r0s[getid("virusSelect").value] / 50;
        getid("infectionRatioOutput").innerHTML =
            str(Math.round(infectionRatio * 100)) + "%";
        infectionChart.data.labels[infectionChart.data.labels.length - 1] =
            str(count);
    }
}

function onPersonNumberChange() {
    infectionChart.options.scales.y.suggestedMin =
        infectionChart.options.scales.y.suggestedMax =
        peopleNumber =
            getid("peopleNumberInput").value;
    getid("peopleNumberOutput").innerHTML = str(peopleNumber);
}
