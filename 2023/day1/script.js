const { logBenchmarkTimes } = require("../../utils/benchmark");
const { grabText } = require("../../utils/grab-text");
const firstPartSample = grabText(`${__dirname}/s1.txt`);
const secondPartSample = grabText(`${__dirname}/s2.txt`);
const actual = grabText(`${__dirname}/i.txt`);

const handleInputPartOne = (input) => {
  let sum = 0;
  for (const line of input.trim().split("\n")) {
    let firstNumber = null;
    let lastNumber = null;
    for (const character of line) {
      if (Number.isInteger(parseInt(character))) {
        if (firstNumber === null) {
          firstNumber = parseInt(character);
        }
        lastNumber = parseInt(character);
      }
    }
    sum += parseInt(`${firstNumber}${lastNumber}`);
  }
  return sum;
};

const digitMap = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

const getDigit = (str, index) => {
  if (Number.isInteger(parseInt(str.charAt(index)))) {
    return parseInt(str.charAt(index));
  }
  const threeLetter = str.substring(index, index + 3);
  const fourLetter = str.substring(index, index + 4);
  const fiveLetter = str.substring(index, index + 5);
  if (
    Object.keys(digitMap).includes(threeLetter) ||
    Object.keys(digitMap).includes(fourLetter) ||
    Object.keys(digitMap).includes(fiveLetter)
  ) {
    return digitMap[threeLetter] || digitMap[fourLetter] || digitMap[fiveLetter];
  }
  return null;
};

const handleInputPartTwo = (input) => {
  let sum = 0;
  for (const line of input.trim().split("\n")) {
    let firstNumber = null;
    let lastNumber = null;
    for (const index in line) {
      const numberIndex = parseInt(index);
      if (firstNumber === null) {
        firstNumber = getDigit(line, numberIndex);
      }
      lastNumber = getDigit(line, numberIndex) ?? lastNumber;
    }
    sum += parseInt(`${firstNumber}${lastNumber}`);
  }
  return sum;
};

logBenchmarkTimes([
  { name: `p1: sample`, func: () => handleInputPartOne(firstPartSample) },
  { name: `p1: actual`, func: () => handleInputPartOne(actual) },
  { name: `p2: sample`, func: () => handleInputPartTwo(secondPartSample) },
  { name: `p2: actual`, func: () => handleInputPartTwo(actual) },
]);
