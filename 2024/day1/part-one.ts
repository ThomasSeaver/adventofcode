import { logResult, logDebug, readFile, logBenchmark } from "../util";
logBenchmark(performance.now());
const inputString = readFile(process.argv[2]);
const listPairList = inputString
  .split("\n")
  .map((line) => line.split("   ").map((number) => parseInt(number)));

const leftList = listPairList.map((list) => list[0]).sort();
const rightList = listPairList.map((list) => list[1]).sort();

let distanceSum = 0;
for (let listIndex = 0; listIndex < listPairList.length; listIndex += 1) {
  distanceSum += Math.abs(leftList[listIndex] - rightList[listIndex]);
}

logDebug(leftList, rightList);

logResult(distanceSum);

logBenchmark(performance.now());
