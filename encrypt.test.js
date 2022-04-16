const {codebook, upcaseCodeBook, included, wordEncrypt, wordDisencrypt} = require("./encrypt");

test('should wordEncrypt("abc", 1) to equal "bcd"', () => {
    expect(wordEncrypt("abc", 1)).toEqual("bcd");
});
