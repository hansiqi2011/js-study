const codeBook = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
];
const upcaseCodeBook = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
];
Array.prototype.isIncluded = (value) =>
    !(this.filter((element) => element === value) === []);
/**
 * encrypt a word by a key in Caesar cipher
 * @param {*} word the word to encrypt.
 * @param {*} key the key to encrypt the word.
 */
const wordEncrypt = (word, key) => {
    let wordList = [];
    for (let i = 0; i < word.length; i++) {
        wordList.push(word[i]);
    }
    wordList = wordList.map((char) => {
        if (wordList.isIncluded(char)) {
            if (char != "z") {
                char = codeBook[codeBook[char] + key];
            } else {
                char = "a";
            }
        }
        if (wordList.isIncluded(char)) {
            if (char != "Z") {
                char = upcaseCodeBook[upcaseCodeBook[char] + key];
            } else {
                char = "a";
            }
        }
    });
    word = wordList.join("");
    return word;
};
/**
 * disencrypt a word by a key in Caesar cipher
 * @param {*} word the word to disencrypt.
 * @param {*} key the key to disencrypt the word.
 */
const wordDisencrypt = (word, key) => wordEncrypt(word, 26 - key);
module.export = {
    codeBook,
    upcaseCodeBook,
    included,
    wordEncrypt,
    wordDisencrypt,
};
