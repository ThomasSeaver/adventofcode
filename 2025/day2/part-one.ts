import { logBenchmark, logDebug, logResult, readFile } from "../util";

logBenchmark(performance.now());
const inputString = readFile(process.argv[2] ?? "");
const inputList = inputString
  .split(",")
  .map(
    (inputElement) =>
      inputElement.split("-").map((id) => BigInt(id)) as [bigint, bigint],
  );

// wow this sucks but it works so who cares
let invalidIdSum = BigInt(0);
for (const [start, end] of inputList) {
  logDebug(`Start: ${(`${start.toString()},`).padEnd(16)} End: ${end}`);
  for (let index = start; index <= end; index += BigInt(1)) {
    const stringIndex = index.toString();
    if (
      stringIndex.length % 2 === 0 &&
      stringIndex.slice(0, stringIndex.length / 2) ===
        stringIndex.slice(stringIndex.length / 2)
    ) {
      invalidIdSum += index;
    }
  }
}

logResult(invalidIdSum);
logBenchmark(performance.now());
