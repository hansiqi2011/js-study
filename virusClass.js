/**
 * random int
 * @param {int} min the minimum number
 * @param {int} max the maximum number
 * @returns {int} a random int between min and max
 */
const randInt = (min, max) => Math.random() * (max - min) + min;
class person {
    /**
     * person sample
     * @param {int} xRange the maximum init x
     * @param {int} yRange the maximum init y
     * @param {int} maxXs the maximum speed on x
     * @param {int} maxYs the maximum speed on y
     * @param {Boolean} isPositive is the person ill
     * @param {int} healthLevel How healthy the person is
     * @param {Boolean} hasAntibody does the person have antibody
     */
    constructor(
        xRange = 600,
        yRange = 600,
        maxXs = 2,
        maxYs = 2,
        isPositive = false,
        healthLevel = 600,
        hasAntibody = false
    ) {
        this.x = randInt(0, xRange);
        this.x = randInt(0, yRange);
        this.xs = randInt(-maxXs, maxXs);
        this.ys = randInt(-maxYs);
        this.isPositive = isPositive;
        this.healthLevel = healthLevel;
        this.hasAntibody = hasAntibody;
    }
    /**
     * move the person
     */
    randomWalk() {
        if (Math.random() < 0.01) {
            this.xs = randInt(-2, 2);
            this.ys = randInt(-2, 2);
        }
        this.x += this.xs;
        this.y += this.ys;
        if (this.x <= 0 || this.x >= WORLD_SIZE) this.xs *= -1;
    }
    /**
     * recover the person
     */
    recover() {
        if (this.healthLevel < 100) this.healthLevel++;
        else this.isPositive = false;
    }
    /**
     * infect the person and give him antibody
     */
    infect() {
        this.isPositive = true;
        this.hasAntibody = true;
        this.healthLevel = 0;
    }
    /**
     * Is the person close enough to another?
     * @param {person} other the other person
     * @returns {boolean} if the person is close enough to the other
     */
    isCloseEnoughTo = (other) =>
        Math.sqrt((other.x - this.x) ** 2 + (other.y - this.y) ** 2) < 30;
}
