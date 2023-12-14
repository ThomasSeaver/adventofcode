const { grabText } = require("../../utils/grab-text");
const sample = grabText(`${__dirname}/s.txt`);
const actual = grabText(`${__dirname}/i.txt`);

const getPatternReflections = (pattern) => {
  let reflections = { vertical: [], horizontal: [] };
  // search for potential vertical reflection lines
  let possibleReflectionPoints = [...Array(pattern[0].length).keys()];
  possibleReflectionPoints.shift(); // Just get rid of the unnecessary 0
  for (const patternRow of pattern) {
    possibleReflectionPoints = possibleReflectionPoints.filter((possibleReflectionPoint) => {
      // looking for a reflection basically means taking the slice before and the reversed slice after and comparing
      const firstSlice = patternRow.join("").slice(0, possibleReflectionPoint).split("").reverse();
      const secondSlice = patternRow.join("").slice(possibleReflectionPoint).split("");
      for (
        let sliceIndex = 0;
        sliceIndex < (firstSlice.length < secondSlice.length ? firstSlice.length : secondSlice.length);
        sliceIndex += 1
      ) {
        if (firstSlice[sliceIndex] !== secondSlice[sliceIndex]) {
          return false;
        }
      }
      return true;
    });
  }
  reflections.vertical = possibleReflectionPoints;

  // search for potential horizontal reflection lines
  possibleReflectionPoints = [...Array(pattern.length).keys()];
  possibleReflectionPoints.shift(); // Just get rid of the unnecessary 0
  for (let patternColumnIndex = 0; patternColumnIndex < pattern[0].length; patternColumnIndex += 1) {
    const patternColumn = pattern.map((patternRow) => patternRow[patternColumnIndex]).join("");
    possibleReflectionPoints = possibleReflectionPoints.filter((possibleReflectionPoint) => {
      const firstSlice = patternColumn.slice(0, possibleReflectionPoint).split("").reverse();
      const secondSlice = patternColumn.slice(possibleReflectionPoint).split("");
      for (
        let sliceIndex = 0;
        sliceIndex < (firstSlice.length < secondSlice.length ? firstSlice.length : secondSlice.length);
        sliceIndex += 1
      ) {
        if (firstSlice[sliceIndex] !== secondSlice[sliceIndex]) {
          return false;
        }
      }
      return true;
    });
  }

  reflections.horizontal = possibleReflectionPoints;
  return reflections;
};

const handleInputPartOne = (input) => {
  const patterns = input.split("\n\n").map((pattern) => pattern.split("\n").map((patternRow) => patternRow.split("")));
  let total = 0;

  for (const pattern of patterns) {
    const reflections = getPatternReflections(pattern);
    total +=
      reflections.vertical.reduce((previous, current) => previous + current, 0) +
      reflections.horizontal.reduce((previous, current) => previous + current * 100, 0);
  }

  return total;
};

// brute force?
const handleInputPartTwo = (input) => {
  const patterns = input.split("\n\n").map((pattern) => pattern.split("\n").map((patternRow) => patternRow.split("")));
  let total = 0;

  for (const pattern of patterns) {
    const standardReflections = getPatternReflections(pattern);
    let smudgeFound = false;
    for (let patternRowIndex = 0; patternRowIndex < pattern.length; patternRowIndex += 1) {
      for (let patternColumnIndex = 0; patternColumnIndex < pattern[patternRowIndex].length; patternColumnIndex += 1) {
        pattern[patternRowIndex][patternColumnIndex] = pattern[patternRowIndex][patternColumnIndex] === "." ? "#" : ".";
        const desmudgedReflections = getPatternReflections(pattern);
        pattern[patternRowIndex][patternColumnIndex] = pattern[patternRowIndex][patternColumnIndex] === "." ? "#" : ".";
        const differentReflections = {
          horizontal: desmudgedReflections.horizontal.filter(
            (reflectionLine) => !standardReflections.horizontal.includes(reflectionLine)
          ),
          vertical: desmudgedReflections.vertical.filter(
            (reflectionLine) => !standardReflections.vertical.includes(reflectionLine)
          ),
        };
        if (differentReflections.horizontal.length > 0 || differentReflections.vertical.length > 0) {
          total +=
            differentReflections.vertical.reduce((previous, current) => previous + current, 0) +
            differentReflections.horizontal.reduce((previous, current) => previous + current * 100, 0);
          smudgeFound = true;
          break;
        }
      }
      if (smudgeFound) {
        break;
      }
    }
  }

  return total;
};

console.log(`p1: sample`, handleInputPartOne(sample));
console.log("p1: actual", handleInputPartOne(actual));

console.log(`p2: sample`, handleInputPartTwo(sample));
console.log("p2: actual", handleInputPartTwo(actual));
