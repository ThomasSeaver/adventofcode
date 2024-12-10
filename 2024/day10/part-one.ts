import { logResult, readFile, logBenchmark } from "../util";
logBenchmark(performance.now());
const inputString = readFile(process.argv[2]);
const mapMatrix = inputString
  .split("\n")
  .map((mapRow) => mapRow.split("").map((mapColumn) => parseInt(mapColumn)));

let trailheadScoreSum = 0;
for (let mapRowIndex = 0; mapRowIndex < mapMatrix.length; mapRowIndex += 1) {
  for (
    let mapColumnIndex = 0;
    mapColumnIndex < mapMatrix[mapRowIndex].length;
    mapColumnIndex += 1
  ) {
    if (mapMatrix[mapRowIndex][mapColumnIndex] === 0) {
      const reachableNinePositions = new Set();
      const positionQueue: [number, number][] = [[mapRowIndex, mapColumnIndex]];
      while (positionQueue.length > 0) {
        const [positionRow, positionColumn] = positionQueue.shift();
        const positionValue = mapMatrix[positionRow][positionColumn];
        if (positionValue === 9) {
          reachableNinePositions.add(`${positionRow}-${positionColumn}`);
          continue;
        }
        if (
          positionRow > 0 &&
          mapMatrix[positionRow - 1][positionColumn] === positionValue + 1
        ) {
          positionQueue.push([positionRow - 1, positionColumn]);
        }
        if (
          positionRow < mapMatrix.length - 1 &&
          mapMatrix[positionRow + 1][positionColumn] === positionValue + 1
        ) {
          positionQueue.push([positionRow + 1, positionColumn]);
        }
        if (
          positionColumn > 0 &&
          mapMatrix[positionRow][positionColumn - 1] === positionValue + 1
        ) {
          positionQueue.push([positionRow, positionColumn - 1]);
        }
        if (
          positionColumn < mapMatrix[positionRow].length - 1 &&
          mapMatrix[positionRow][positionColumn + 1] === positionValue + 1
        ) {
          positionQueue.push([positionRow, positionColumn + 1]);
        }
      }
      trailheadScoreSum += reachableNinePositions.size;
    }
  }
}
logResult(trailheadScoreSum);

logBenchmark(performance.now());
