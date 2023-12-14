const { grabText } = require("../../utils/grab-text");
const sample = grabText(`${__dirname}/s.txt`);
const actual = grabText(`${__dirname}/i.txt`);

const handleInputPartOne = (input) => {
  const field = input.split("\n").map((row) => row.split(""));

  for (let columnIndex = 0; columnIndex < field[0].length; columnIndex += 1) {
    for (let rowIndex = 0; rowIndex < field.length; rowIndex += 1) {
      let currentRowIndex = rowIndex;
      while (
        currentRowIndex > 0 &&
        field[currentRowIndex][columnIndex] === "O" &&
        field[currentRowIndex - 1][columnIndex] === "."
      ) {
        field[currentRowIndex][columnIndex] = ".";
        currentRowIndex -= 1;
        field[currentRowIndex][columnIndex] = "O";
      }
    }
  }

  const stress = field.reduce(
    (previous, current, index) => previous + current.filter((column) => column === "O").length * (field.length - index),
    0
  );

  return stress;
};

const handleInputPartTwo = (input) => {
  const field = input.split("\n").map((row) => row.split(""));

  let stressList = [];
  let cycleIndex = 0;
  while (cycleIndex < 1000000000) {
    // north
    for (let columnIndex = 0; columnIndex < field[0].length; columnIndex += 1) {
      for (let rowIndex = 0; rowIndex < field.length; rowIndex += 1) {
        let currentRowIndex = rowIndex;
        while (
          currentRowIndex > 0 &&
          field[currentRowIndex][columnIndex] === "O" &&
          field[currentRowIndex - 1][columnIndex] === "."
        ) {
          field[currentRowIndex][columnIndex] = ".";
          currentRowIndex -= 1;
          field[currentRowIndex][columnIndex] = "O";
        }
      }
    }

    // west
    for (let rowIndex = 0; rowIndex < field.length; rowIndex += 1) {
      for (let columnIndex = 0; columnIndex < field[0].length; columnIndex += 1) {
        let currentColumnIndex = columnIndex;
        while (
          currentColumnIndex > 0 &&
          field[rowIndex][currentColumnIndex] === "O" &&
          field[rowIndex][currentColumnIndex - 1] === "."
        ) {
          field[rowIndex][currentColumnIndex] = ".";
          currentColumnIndex -= 1;
          field[rowIndex][currentColumnIndex] = "O";
        }
      }
    }

    // south
    for (let columnIndex = 0; columnIndex < field[0].length; columnIndex += 1) {
      for (let rowIndex = field.length - 1; rowIndex >= 0; rowIndex -= 1) {
        let currentRowIndex = rowIndex;
        while (
          currentRowIndex < field.length - 1 &&
          field[currentRowIndex][columnIndex] === "O" &&
          field[currentRowIndex + 1][columnIndex] === "."
        ) {
          field[currentRowIndex][columnIndex] = ".";
          currentRowIndex += 1;
          field[currentRowIndex][columnIndex] = "O";
        }
      }
    }

    // east
    for (let rowIndex = 0; rowIndex < field.length; rowIndex += 1) {
      for (let columnIndex = field[0].length - 1; columnIndex >= 0; columnIndex -= 1) {
        let currentColumnIndex = columnIndex;
        while (
          currentColumnIndex < field[0].length - 1 &&
          field[rowIndex][currentColumnIndex] === "O" &&
          field[rowIndex][currentColumnIndex + 1] === "."
        ) {
          field[rowIndex][currentColumnIndex] = ".";
          currentColumnIndex += 1;
          field[rowIndex][currentColumnIndex] = "O";
        }
      }
    }

    const stress = field.reduce(
      (previous, current, index) =>
        previous + current.filter((column) => column === "O").length * (field.length - index),
      0
    );
    stressList.push(stress);

    // detect cycles
    const necessaryCycleLength = 10;
    let cycle = null;
    for (let stressIndex = 0; stressIndex <= stressList.length - necessaryCycleLength; stressIndex += 1) {
      const stressListWithoutPrefix = stressList.slice(stressIndex);
      if (stressListWithoutPrefix.length % necessaryCycleLength !== 0) {
        continue;
      }
      const cycleLength = stressListWithoutPrefix.length / necessaryCycleLength;
      let potentialCycleValue = stressListWithoutPrefix.slice(0, cycleLength);
      for (
        let cycleSliceIndex = cycleLength;
        cycleSliceIndex < stressListWithoutPrefix.length;
        cycleSliceIndex += cycleLength
      ) {
        let currentCyclicValue = stressListWithoutPrefix.slice(cycleSliceIndex, cycleSliceIndex + cycleLength);
        if (potentialCycleValue.join("") !== currentCyclicValue.join("")) {
          potentialCycleValue = null;
          break;
        }
      }
      if (potentialCycleValue !== null) {
        cycle = potentialCycleValue;
        break;
      }
    }
    cycleIndex += 1;
    if (cycle !== null) {
      return cycle[(1000000000 - cycleIndex - 1) % cycle.length];
    }
  }
};

console.log(`p1: sample`, handleInputPartOne(sample));
console.log("p1: actual", handleInputPartOne(actual));

console.log(`p2: sample`, handleInputPartTwo(sample));
console.log("p2: actual", handleInputPartTwo(actual));
