import { logResult, logDebug, readFile, logBenchmark } from "../util";
logBenchmark(performance.now());
const inputString = readFile(process.argv[2]);
const [start, end] = inputString
  .split(",")
  .map((inputElement) => parseInt(inputElement.trim()));

let multiplier = 1;
for (let index = start; index <= end; index += 1) {
  multiplier *= index;
  logDebug(multiplier);
}
logResult(multiplier);

logBenchmark(performance.now());
