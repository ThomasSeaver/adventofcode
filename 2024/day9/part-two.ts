import { logResult, logDebug, readFile, logBenchmark } from "../util";
logBenchmark(performance.now());
const inputString = readFile(process.argv[2]);
const blockList = inputString
  .split("")
  .map((inputElement) => parseInt(inputElement.trim()));

let fullList = blockList.map((blockSize, blockIndex) => [
  blockIndex % 2 === 0 ? blockIndex / 2 : ".",
  blockSize,
]);
logDebug(fullList);

for (let fileIndex = fullList.length - 1; fileIndex >= 0; fileIndex -= 1) {
  while (fullList[fileIndex][0] == ".") {
    fileIndex -= 1;
  }
  for (let frontIndex = 0; frontIndex < fileIndex; frontIndex += 1) {
    while (fullList[frontIndex][0] != ".") {
      frontIndex += 1;
    }
    if (fullList[frontIndex][1] >= fullList[fileIndex][1]) {
      fullList.splice(frontIndex, 1, fullList[fileIndex], [
        ".",
        fullList[frontIndex][1] - fullList[fileIndex][1],
      ]);
      fullList.splice(fileIndex + 1, 1, [".", fullList[fileIndex + 1][1]]);
      let checkIndex = 0;
      while (checkIndex < fullList.length - 1) {
        if (
          fullList[checkIndex][0] === "." &&
          fullList[checkIndex + 1][0] === "."
        ) {
          fullList.splice(checkIndex, 2, [
            ".",
            fullList[checkIndex][1] + fullList[checkIndex + 1][1],
          ]);
        } else {
          checkIndex += 1;
        }
      }
    }
  }
}
const fullValueList = fullList
  .map(([block, blockSize]) => new Array(blockSize).fill(block))
  .flat();
logResult(
  fullValueList.reduce(
    (previous, fileId, position) =>
      previous + (fileId === "." ? 0 : fileId * position),
    0
  )
);
logBenchmark(performance.now());
