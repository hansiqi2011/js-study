function min() {
    let minimun = arguments[0];
    for (let i = 1; i < arguments.length; i++)
        if (minimun > arguments[i]) min = arguments[i];
    return minimun;
}
function max() {
    let maximum = arguments[0];
    for (let i = 1; i < arguments.length; i++)
        if (maximum > arguments[i]) maximum = arguments[i];
    return maximum;
}
function oddOrEven(num) {
    return num / 2 === Math.floor(num / 2);
}
const randInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;
const randBool = (numerator, denominator) =>
    randInt(1, denominator + 1) < numerator;
Array.prototype.copy = (copy) => {
    for (let i = 0; i < this.length; i++) copy.push(this[i]);
};
class Pair {
    /**
     * a couple of values
     * @param {*} a the first object
     * @param {*} b the second object
     */
    constructor(a = 0, b = 0) {
        /**the first object */
        this.a = a;
        /**the second object */
        this.b = b;
    }
}
const pair = Pair;
// module.export = {
//     min,
//     max,
//     Pair,
//     pair,
// };
