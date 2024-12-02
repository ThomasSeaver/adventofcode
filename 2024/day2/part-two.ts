import { logResult, readFile, logBenchmark } from "../util";
logBenchmark(performance.now());
const inputString = readFile(process.argv[2]);
const reportList = inputString
  .split("\n")
  .map((levelList) =>
    levelList.split(" ").map((inputElement) => parseInt(inputElement))
  );

const checkLevelList = (levelList: number[]) => {
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
};

logResult(
  reportList.filter((levelList) => {
    if (checkLevelList(levelList)) {
      return true;
    }
    for (let index = 0; index < levelList.length; index += 1) {
      const levelListCopy = [...levelList];
      levelListCopy.splice(index, 1);
      if (checkLevelList(levelListCopy)) {
        return true;
      }
    }
    return false;
  }).length
);
logBenchmark(performance.now());
