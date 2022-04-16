const DFA = (array, element) => {
    array = array.filter(value => !value === element);
    return array;
}
const RIA = length => {
    let array = [];
    let choises = [];
    for (let i = 0; i < length; i++) {
        choises.push(i + 1);
    }
    for (let i = 0; i < length; i++) {
        const elmv = choises[Math.floor(Math.random() * choises.length)]
        array.push(elmv);
        DFA(choises, elmv);
    }
    return array;
}
const IAS = array => {
    let correctArray = [];
    for (let i = 0; i < array.length; i++) {
        correctArray.push(i + 1);
    }
    while (array != correctArray) {
        array = array.map((value, index) => {
            if (index != array.length - 1 && value > array[index] + 1) {
                const backValue = array[index] + 1;
                array[index] = value;
                value = backValue;
            }
        });
    }
    return array;
}
module.export = {DFA, RIA, IAS};