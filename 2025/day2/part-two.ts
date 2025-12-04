import { logBenchmark, logDebug, logResult, readFile } from "../util";

logBenchmark(performance.now());
const inputString = readFile(process.argv[2] ?? "");
const inputList = inputString
  .split(",")
  .map((inputElement) => inputElement.split("-").map((id) => BigInt(id)) as [bigint, bigint]);

// This is still really stupid and unfortunatley I don't think I care to find out the right way to do it
let invalidIdSum = BigInt(0);
for (const [start, end] of inputList) {
  logDebug(`Start: ${`${start.toString()},`.padEnd(16)} End: ${end}`);
  for (let index = start; index <= end; index += BigInt(1)) {
    const stringIndex = index.toString();
    for (let indexIndex = 1; indexIndex <= stringIndex.length / 2; indexIndex += 1) {
      if (stringIndex.length % indexIndex === 0) {
        let indexIndexCount = 1;
        while (indexIndexCount * indexIndex < stringIndex.length) {
          if (
            stringIndex.slice((indexIndexCount - 1) * indexIndex, indexIndexCount * indexIndex) !==
            stringIndex.slice(indexIndexCount * indexIndex, (indexIndexCount + 1) * indexIndex)
          ) {
            break;
          }
          indexIndexCount += 1;
        }
        if (indexIndexCount * indexIndex === stringIndex.length) {
          invalidIdSum += index;
          break;
        }
      }
    }
  }
}

logResult(invalidIdSum);
logBenchmark(performance.now());
