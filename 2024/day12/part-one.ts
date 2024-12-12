import { logResult, readFile, logBenchmark } from "../util";
logBenchmark(performance.now());
const inputString = readFile(process.argv[2]);
const farmMap = inputString.split("\n").map((inputRow) => inputRow.split(""));

const unmappedPoints = farmMap
  .map((farmRow, rowIndex) =>
    farmRow.map((_farmColumn, columnIndex) => [rowIndex, columnIndex])
  )
  .flat();

let fenceCost = 0;
while (unmappedPoints.length > 0) {
  const [pointRow, pointColumn] = unmappedPoints[0];
  const regionPlantType = farmMap[pointRow][pointColumn];
  const regionQueue: [number, number][] = [[pointRow, pointColumn]];
  let regionQueueIndex = 0;
  let regionPerimeter = 0;
  let regionArea = 0;
  do {
    const [pointRow, pointColumn] = regionQueue[regionQueueIndex];
    unmappedPoints.splice(
      unmappedPoints.findIndex(
        (point) => point[0] === pointRow && point[1] === pointColumn
      ),
      1
    );
    regionArea += 1;
    if (
      pointRow > 0 &&
      farmMap[pointRow - 1][pointColumn] === regionPlantType &&
      regionQueue.findIndex(
        (point) => point[0] === pointRow - 1 && point[1] === pointColumn
      ) === -1
    ) {
      regionQueue.push([pointRow - 1, pointColumn]);
    } else if (
      pointRow === 0 ||
      farmMap[pointRow - 1][pointColumn] !== regionPlantType
    ) {
      regionPerimeter += 1;
    }
    if (
      pointRow < farmMap.length - 1 &&
      farmMap[pointRow + 1][pointColumn] === regionPlantType &&
      regionQueue.findIndex(
        (point) => point[0] === pointRow + 1 && point[1] === pointColumn
      ) === -1
    ) {
      regionQueue.push([pointRow + 1, pointColumn]);
    } else if (
      pointRow === farmMap.length - 1 ||
      farmMap[pointRow + 1][pointColumn] !== regionPlantType
    ) {
      regionPerimeter += 1;
    }
    if (
      pointColumn > 0 &&
      farmMap[pointRow][pointColumn - 1] === regionPlantType &&
      regionQueue.findIndex(
        (point) => point[0] === pointRow && point[1] === pointColumn - 1
      ) === -1
    ) {
      regionQueue.push([pointRow, pointColumn - 1]);
    } else if (
      pointColumn === 0 ||
      farmMap[pointRow][pointColumn - 1] !== regionPlantType
    ) {
      regionPerimeter += 1;
    }
    if (
      pointColumn < farmMap[pointRow].length - 1 &&
      farmMap[pointRow][pointColumn + 1] === regionPlantType &&
      regionQueue.findIndex(
        (point) => point[0] === pointRow && point[1] === pointColumn + 1
      ) === -1
    ) {
      regionQueue.push([pointRow, pointColumn + 1]);
    } else if (
      pointColumn === farmMap[pointRow].length - 1 ||
      farmMap[pointRow][pointColumn + 1] !== regionPlantType
    ) {
      regionPerimeter += 1;
    }
    regionQueueIndex += 1;
  } while (regionQueueIndex < regionQueue.length);
  fenceCost += regionArea * regionPerimeter;
}

logResult(fenceCost);

logBenchmark(performance.now());
