import { logBenchmark, logResult, readFile, logDebug } from "../util";

logBenchmark(performance.now());
const inputString = readFile(process.argv[2] ?? "");
const inputList = inputString
  .split("\n")
  .map((inputElement) => inputElement.split("").map((id) => parseInt(id, 10)));

// This is weirded wordly but whatever
const getJoltage = (array: number[], recurseCount: number): string => {
  const [selectedJoltage, selectedJoltageIndex] = array.reduce(
    ([selectedJoltage, selectedJoltageIndex], currentJoltage, currentJoltageIndex) => {
      if (recurseCount < array.length - currentJoltageIndex && selectedJoltage < currentJoltage) {
        return [currentJoltage, currentJoltageIndex];
      }
      return [selectedJoltage, selectedJoltageIndex];
    },
    [0, 0],
  );

  if (recurseCount > 0) {
    return `${selectedJoltage}${getJoltage(array.slice(selectedJoltageIndex + 1), recurseCount - 1)}`;
  }
  return `${selectedJoltage}`;
};

let joltageSum = BigInt(0);
for (const bank of inputList) {
  joltageSum += BigInt(getJoltage(bank, 11));
}

logResult(joltageSum);
logBenchmark(performance.now());
