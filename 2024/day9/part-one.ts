import { logResult, logDebug, readFile, logBenchmark } from "../util";
logBenchmark(performance.now());
const inputString = readFile(process.argv[2]);
const blockList = inputString
  .split("")
  .map((inputElement) => parseInt(inputElement.trim()));

const fullList = blockList
  .map((blockSize, blockIndex) =>
    new Array(blockSize).fill(blockIndex % 2 === 0 ? blockIndex / 2 : ".")
  )
  .flat();
logDebug(fullList);

let startIndex = 0;
let endIndex = fullList.length - 1;
let sum = 0;
while (startIndex <= endIndex) {
  if (fullList[startIndex] !== ".") {
    sum += fullList[startIndex] * startIndex;
  } else {
    while (fullList[endIndex] === ".") {
      endIndex -= 1;
    }
    sum += fullList[endIndex] * startIndex;
    endIndex -= 1;
  }
  startIndex += 1;
}

logResult(sum);
logBenchmark(performance.now());
