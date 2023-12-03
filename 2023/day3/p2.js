const { grabText } = require("../../utils/grab-text");
const sample = grabText(`${__dirname}/s.txt`);
const actual = grabText(`${__dirname}/i.txt`);

const notSymbols = [".", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

const pointIsInteger = (value) => Number.isInteger(parseInt(value));

const parseNumber = (row, index) => {
  let number = row[index];
  let forwardIndex = index + 1;
  while (index < row.length - 1 && pointIsInteger(row[forwardIndex])) {
    number += row[forwardIndex];
    forwardIndex += 1;
  }
  let backwardIndex = index - 1;
  while (index > 0 && pointIsInteger(row[backwardIndex])) {
    number = row[backwardIndex] + number;
    backwardIndex -= 1;
  }
  return parseInt(number);
};

const handleInput = (input) => {
  const rows = input.split("\n").map((row) => row.split(""));
  let result = 0;

  for (let rowIndex = 0; rowIndex < rows.length; rowIndex += 1) {
    for (let pointIndex = 0; pointIndex < rows[rowIndex].length; pointIndex += 1) {
      if (rows[rowIndex][pointIndex] !== "*") {
        continue;
      }

      let attachedNumbers = [];
      // Checks the left side
      if (pointIndex > 0 && pointIsInteger(rows[rowIndex][pointIndex - 1])) {
        attachedNumbers.push(parseNumber(rows[rowIndex], pointIndex - 1));
      }

      // Checks the right side
      if (pointIndex < rows[rowIndex].length - 1 && pointIsInteger(rows[rowIndex][pointIndex + 1])) {
        attachedNumbers.push(parseNumber(rows[rowIndex], pointIndex + 1));
      }

      // Checks the middle above; either middle above will be present (meaning the corners would be connected)
      // or we have to check the corners separately
      if (rowIndex > 0 && pointIsInteger(rows[rowIndex - 1][pointIndex])) {
        attachedNumbers.push(parseNumber(rows[rowIndex - 1], pointIndex));
      } else if (rowIndex > 0) {
        if (pointIndex > 0 && pointIsInteger(rows[rowIndex - 1][pointIndex - 1])) {
          attachedNumbers.push(parseNumber(rows[rowIndex - 1], pointIndex - 1));
        }
        if (pointIndex < rows[rowIndex - 1].length - 1 && pointIsInteger(rows[rowIndex - 1][pointIndex + 1])) {
          attachedNumbers.push(parseNumber(rows[rowIndex - 1], pointIndex + 1));
        }
      }

      // Checks the middle below, similar strategy to previous
      if (rowIndex < rows.length - 1 && pointIsInteger(rows[rowIndex + 1][pointIndex])) {
        attachedNumbers.push(parseNumber(rows[rowIndex + 1], pointIndex));
      } else if (rowIndex < rows.length - 1) {
        if (pointIndex > 0 && pointIsInteger(rows[rowIndex + 1][pointIndex - 1])) {
          attachedNumbers.push(parseNumber(rows[rowIndex + 1], pointIndex - 1));
        }
        if (pointIndex < rows[rowIndex + 1].length - 1 && pointIsInteger(rows[rowIndex + 1][pointIndex + 1])) {
          attachedNumbers.push(parseNumber(rows[rowIndex + 1], pointIndex + 1));
        }
      }

      // Check for gears
      if (attachedNumbers.length === 2) {
        result += attachedNumbers[0] * attachedNumbers[1]
      }
    }
  }

  return result;
};

console.log("sample", handleInput(sample));
console.log("actual", handleInput(actual));
