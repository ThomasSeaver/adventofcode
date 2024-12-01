import { logResult, logDebug, readFile, logBenchmark } from "../util";
logBenchmark(performance.now());
const inputString = readFile(process.argv[2]);
const listPairList = inputString
  .split("\n")
  .map((line) => line.split("   ").map((number) => parseInt(number)));

let sum = 0;
for (let listIndex = 0; listIndex < listPairList.length; listIndex += 1) {
  logDebug(
    listIndex,
    listPairList[listIndex][0],
    listPairList.filter((list) => list[1] === listPairList[listIndex][0]).length
  );
  sum +=
    listPairList[listIndex][0] *
    listPairList.filter(
      (listPair) => listPair[1] === listPairList[listIndex][0]
    ).length;
}

logResult(sum);

logBenchmark(performance.now());
