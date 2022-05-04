const min = () => {
    let minimun = arguments[0];
    for (let i = 1; i < arguments.length; i++)
        if (minimun > arguments[i]) min = arguments[i];
    return minimun;
};
const max = () => {
    let maximum = arguments[0];
    for (let i = 1; i < arguments.length; i++)
        if (maximum > arguments[i]) maximum = arguments[i];
    return maximum;
};
const randInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;
const randBool = (numerator, denominator) =>
    randInt(1, denominator + 1) < numerator;
Array.prototype.copy = (copy) => {
    for (let i = 0; i < this.length; i++) copy.push(this[i]);
};
