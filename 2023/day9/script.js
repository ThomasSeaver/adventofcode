const { grabText } = require("../../utils/grab-text");
const firstSample = grabText(`${__dirname}/s.txt`);
const actual = grabText(`${__dirname}/i.txt`);

const getSequenceDifferences = (input) => {
  const newSequence = [];
  for (let index = 0; index < input.length - 1; index += 1) {
    newSequence.push(input[index + 1] - input[index]);
  }
  return newSequence;
};

const convertSequence = (input) => {
  const childSequence = getSequenceDifferences(input);
  if (childSequence.filter((number) => number !== 0).length == 0) {
    return [...input, input.at(-1)];
  }
  const nextSequence = convertSequence(childSequence);
  return [...input, input.at(-1) + nextSequence.at(-1)];
};

const handleInputPartOne = (input) => {
  const values = input.split("\n").map((value) => value.split(" ").map((num) => parseInt(num)));
  return values.map((value) => convertSequence(value).at(-1)).reduce((prev, cur) => prev + cur, 0);
};

const convertSequencePartTwo = (input) => {
  const childSequence = getSequenceDifferences(input);
  if (childSequence.filter((number) => number !== 0).length == 0) {
    return [input[0], ...input];
  }
  const nextSequence = convertSequencePartTwo(childSequence);
  return [input[0] - nextSequence[0], ...input];
};

const handleInputPartTwo = (input) => {
  const values = input.split("\n").map((value) => value.split(" ").map((num) => parseInt(num)));
  return values.map((value) => convertSequencePartTwo(value)[0]).reduce((prev, cur) => prev + cur, 0);
};

console.log("p1: sample 1", handleInputPartOne(firstSample));
console.log("p1: actual", handleInputPartOne(actual));
console.log("p2: sample 1", handleInputPartTwo(firstSample));
console.log("p2: actual", handleInputPartTwo(actual));
