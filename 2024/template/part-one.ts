import { logResult, logDebug, readFile, logBenchmark } from "../util";
logBenchmark(performance.now());
const inputString = readFile(process.argv[2]);
const [start, end] = inputString
  .split(",")
  .map((inputElement) => parseInt(inputElement.trim()));

let sum = 0;
for (let index = start; index <= end; index += 1) {
  sum += index;
  logDebug(sum);
}
logResult(sum);

logBenchmark(performance.now());
