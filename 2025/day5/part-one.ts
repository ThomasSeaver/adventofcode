import { logBenchmark, logDebug, logResult, readFile } from "../util";

logBenchmark(performance.now());
const inputString = readFile(process.argv[2] ?? "");
const [freshRangeString, idListString] = inputString.split("\n\n");
const freshRangeList = freshRangeString!
  .split("\n")
  .map((inputElement) => inputElement.split("-").map((id) => parseInt(id, 10)) as [number, number]);
const idList = idListString!.split("\n").map((inputElement) => parseInt(inputElement, 10));

let sum = 0;
for (const id of idList) {
  for (const range of freshRangeList) {
    if (id >= range![0] && id <= range![1]) {
      logDebug(`${id} is in range ${range![0]} - ${range![1]}`);
      sum += 1;
      break;
    }
  }
}

logResult(sum);

logBenchmark(performance.now());
