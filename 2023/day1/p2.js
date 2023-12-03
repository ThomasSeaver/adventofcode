const { grabText } = require("../../utils/grab-text");
const text = grabText(`${__dirname}/i1.txt`);

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

let sum = 0;
for (const line of text.trim().split("\n")) {
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
console.log(sum);
