import { logResult, logDebug, readFile, logBenchmark } from "../util";
logBenchmark(performance.now());
const inputString = readFile(process.argv[2]);
const schematicMatrixList = inputString
  .split("\n\n")
  .map((schematicString) =>
    schematicString
      .split("\n")
      .map((schematicRowString) => schematicRowString.split(""))
  );
const lockHeightList = schematicMatrixList
  .filter((schematicMatrix) => schematicMatrix[0][0] === "#")
  .map((lockSchematicMatrix) => {
    const heightList = [];
    for (let tumblerIndex = 0; tumblerIndex < 5; tumblerIndex += 1) {
      heightList.push(
        lockSchematicMatrix.filter(
          (lockSchematicRow) => lockSchematicRow[tumblerIndex] === "#"
        ).length - 1
      );
    }
    return heightList;
  });
const keyHeightList = schematicMatrixList
  .filter((schematicMatrix) => schematicMatrix[0][0] === ".")
  .map((keySchematicMatrix) => {
    const heightList = [];
    for (let tumblerIndex = 0; tumblerIndex < 5; tumblerIndex += 1) {
      heightList.push(
        keySchematicMatrix.filter(
          (lockSchematicRow) => lockSchematicRow[tumblerIndex] === "#"
        ).length - 1
      );
    }
    return heightList;
  });
logResult(
  lockHeightList.reduce(
    (previousCount, currentLockHeightList) =>
      previousCount +
      keyHeightList.filter(
        (currentKeyHeightList) =>
          !currentKeyHeightList.some(
            (tumblerHeight, tumblerIndex) =>
              currentLockHeightList[tumblerIndex] + tumblerHeight > 5
          )
      ).length,
    0
  )
);

logBenchmark(performance.now());
