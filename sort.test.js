const {DFA, RIA, IAS} = require("./sort");

test('should DFA([1, 2, 3], 1) to equal [2, 3]', () => {
    expect(DFA([1, 2, 3], 1)).toEqual([2, 3]);
});