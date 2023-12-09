const { grabText } = require("../../utils/grab-text");
const { primeFactorize } = require("../../utils/primes");
const firstSample = grabText(`${__dirname}/s1.txt`);
const secondSample = grabText(`${__dirname}/s2.txt`);
const thirdSample = grabText(`${__dirname}/s3.txt`);
const actual = grabText(`${__dirname}/i.txt`);

const handleInputPartOne = (input) => {
  const instructionList = input.split("\n\n")[0].split("");

  const pathMap = Object.fromEntries(
    input
      .split("\n\n")[1]
      .split("\n")
      .map((pathSplit) => {
        const source = pathSplit.split(" = ")[0];
        const destinations = pathSplit.split(" = ")[1].slice(1, -1).split(", ");

        return [source, destinations];
      })
  );

  let currentNode = "AAA";
  let currentInstructionIndex = 0;
  let stepCount = 0;

  while (currentNode != "ZZZ") {
    currentNode = pathMap[currentNode][instructionList[currentInstructionIndex] === "L" ? 0 : 1];
    currentInstructionIndex = (currentInstructionIndex + 1) % instructionList.length;
    stepCount += 1;
  }

  return stepCount;
};

const handleInputPartTwo = (input) => {
  const instructionList = input.split("\n\n")[0].split("");

  const pathMap = Object.fromEntries(
    input
      .split("\n\n")[1]
      .split("\n")
      .map((pathSplit) => {
        const source = pathSplit.split(" = ")[0];
        const destinations = pathSplit.split(" = ")[1].slice(1, -1).split(", ");

        return [source, destinations];
      })
  );

  const startPositions = Object.keys(pathMap).filter((source) => source.split("").at(-1) === "A");
  const stepCounts = startPositions.map((startPosition) => {
    let currentPosition = startPosition;
    let stepCount = 0;
    let currentInstructionIndex = 0;
    while (true) {
      currentPosition = pathMap[currentPosition][instructionList[currentInstructionIndex] === "L" ? 0 : 1];
      stepCount += 1;
      currentInstructionIndex = (currentInstructionIndex + 1) % instructionList.length;
      if (currentPosition.at(-1) === "Z") {
        return stepCount;
      }
    }
  });
  // Gross don't look at this
  const factorizedStepCounts = stepCounts.map((stepCount) => primeFactorize(stepCount));
  const primeFactors = factorizedStepCounts.reduce((currentStepFactors, nextStepFactors) => {
    const finalStepFactors = { ...currentStepFactors, ...nextStepFactors };
    for (const key of Object.keys(currentStepFactors)) {
      if (nextStepFactors[key] !== undefined) {
        finalStepFactors[key] =
          currentStepFactors[key] > nextStepFactors[key] ? currentStepFactors[key] : nextStepFactors[key];
      }
    }
    return finalStepFactors;
  });
  const unifiedStepCount = Object.entries(primeFactors).reduce(
    (currentCount, nextPrime) => (currentCount *= Math.pow(nextPrime[0], nextPrime[1])),
    1
  );
  return unifiedStepCount;
};
console.log("p1: sample 1", handleInputPartOne(firstSample));
console.log("p1: sample 2", handleInputPartOne(secondSample));
console.log("p1: actual", handleInputPartOne(actual));
console.log("p2: sample 3", handleInputPartTwo(thirdSample));
console.log("p2: actual", handleInputPartTwo(actual));
