import { logResult, readFile, logBenchmark } from "../util";
logBenchmark(performance.now());
const inputString = readFile(process.argv[2]);
const reportList = inputString
  .split("\n")
  .map((levelList) =>
    levelList.split(" ").map((inputElement) => parseInt(inputElement))
  );

logResult(
  reportList.filter((levelList) => {
    const isIncreasing = levelList[0] < levelList[1];
    for (let index = 1; index < levelList.length; index += 1) {
      if (
        (!isIncreasing && levelList[index] > levelList[index - 1]) ||
        (isIncreasing && levelList[index] < levelList[index - 1]) ||
        Math.abs(levelList[index] - levelList[index - 1]) === 0 ||
        Math.abs(levelList[index] - levelList[index - 1]) > 3
      ) {
        return false;
      }
    }
    return true;
  }).length
);
logBenchmark(performance.now());
