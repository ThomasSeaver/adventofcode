import { logBenchmark, logDebug, logResult, readFile } from "../util";

logBenchmark(performance.now());
const inputString = readFile(process.argv[2] ?? "");
const inputList = inputString
  .split("\n")
  .map((inputElement) => inputElement.split("").map((id) => parseInt(id, 10)));

// Naive obviously
let joltageSum = 0;
for (const bank of inputList) {
  let bestJoltage = 0;
  for (let bankIndexA = 0; bankIndexA < bank.length; bankIndexA += 1) {
    for (
      let bankIndexB = bankIndexA + 1;
      bankIndexB < bank.length;
      bankIndexB += 1
    ) {
      const currentJoltage = parseInt(
        `${bank[bankIndexA]}${bank[bankIndexB]}`,
        10,
      );
      if (currentJoltage > bestJoltage) {
        bestJoltage = currentJoltage;
      }
    }
  }
  joltageSum += bestJoltage;
}

logResult(joltageSum);
logBenchmark(performance.now());
