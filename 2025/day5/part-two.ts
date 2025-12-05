import { logBenchmark, logDebug, logResult, readFile } from "../util";

logBenchmark(performance.now());
const inputString = readFile(process.argv[2] ?? "");
const [freshRangeString] = inputString.split("\n\n");
const freshRangeList = freshRangeString!
  .split("\n")
  .map((inputElement) => inputElement.split("-").map((id) => parseInt(id, 10)) as [number, number]);

let found = true;
while (found) {
  found = false;
  for (let rangeIndexA = 0; rangeIndexA < freshRangeList.length; rangeIndexA += 1) {
    for (let rangeIndexB = rangeIndexA + 1; rangeIndexB < freshRangeList.length; rangeIndexB += 1) {
      const rangeA = freshRangeList[rangeIndexA]!;
      const rangeB = freshRangeList[rangeIndexB]!;

      if (
        (rangeA[0] <= rangeB[0] && rangeB[0] <= rangeA[1]) ||
        (rangeA[0] <= rangeB[1] && rangeB[1] <= rangeA[1]) ||
        (rangeB[0] <= rangeA[0] && rangeA[0] <= rangeB[1]) ||
        (rangeB[0] <= rangeA[1] && rangeA[1] <= rangeB[1])
      ) {
        freshRangeList[rangeIndexA] = [
          Math.min(rangeA[0], rangeB[0]),
          Math.max(rangeA[1], rangeB[1]),
        ];
        freshRangeList.splice(rangeIndexB, 1);
        found = true;
        break;
      }
    }
    if (found) {
      break;
    }
  }
}

let sum = BigInt(0);
for (const range of freshRangeList) {
  logDebug(`Range: ${range![0]} - ${range![1]}`);
  sum += BigInt(range![1] - range![0] + 1);
}
logResult(sum);

logBenchmark(performance.now());
