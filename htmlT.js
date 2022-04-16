/**
 * finding HTML elements by ID, class or structor
 * @param {*}target a STRING to show which HTML element do you want to find.
 */
const $ = (target) => {
    switch (target[0]) {
        case "#":
            return document.getElementById(target.slice(1));
        case ".":
            return document.getElementsByClassName(target.slice(1));
        default:
            return document.getElementsByTagName(target);
    }
};
HTMLElement.prototype.text = (txt) => (this.innerHTML = txt);
