const { logBenchmarkTimes } = require("../../utils/benchmark");
const { grabText } = require("../../utils/grab-text");
const sample = grabText(`${__dirname}/s.txt`);
const actual = grabText(`${__dirname}/i.txt`);

const hashingAlgorithm = (string) => {
  let value = 0;
  for (const character of string) {
    const asciiCode = character.charCodeAt(0);
    value += asciiCode;
    value *= 17;
    value %= 256;
  }
  return value;
};

const handleInputPartOne = (input) => {
  return input
    .split(",")
    .map((step) => hashingAlgorithm(step))
    .reduce((previous, current) => previous + current, 0);
};

const handleInputPartTwo = (input) => {
  const steps = input.split(",");

  const boxes = [...Array(256)].map(() => []);
  for (const step of steps) {
    if (step.indexOf("=") != -1) {
      const label = step.split("=")[0];
      const boxIndex = hashingAlgorithm(label);
      const focalLength = step.split("=")[1];

      const currentLensIndex = boxes[boxIndex].findIndex((lens) => lens.label === label);
      if (currentLensIndex !== -1) {
        boxes[boxIndex][currentLensIndex].focalLength = focalLength;
      } else {
        boxes[boxIndex].push({ label, focalLength });
      }
    } else {
      const label = step.split("-")[0];
      const boxIndex = hashingAlgorithm(label);
      boxes[boxIndex] = boxes[boxIndex].filter((lens) => lens.label !== label);
    }
  }

  return boxes.reduce(
    (previousTotal, currentBox, currentBoxIndex) =>
      previousTotal +
      currentBox.reduce(
        (previousLensPower, currentLens, currentLensIndex) =>
          previousLensPower + (1 + currentBoxIndex) * (1 + currentLensIndex) * currentLens.focalLength,
        0
      ),
    0
  );
};

logBenchmarkTimes([
  { name: `p1: sample`, func: () => handleInputPartOne(sample) },
  { name: `p1: actual`, func: () => handleInputPartOne(actual) },
  { name: `p2: sample`, func: () => handleInputPartTwo(sample) },
  { name: `p2: actual`, func: () => handleInputPartTwo(actual) },
]);
