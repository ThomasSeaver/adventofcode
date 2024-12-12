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
    }
    if (
      pointRow < farmMap.length - 1 &&
      farmMap[pointRow + 1][pointColumn] === regionPlantType &&
      regionQueue.findIndex(
        (point) => point[0] === pointRow + 1 && point[1] === pointColumn
      ) === -1
    ) {
      regionQueue.push([pointRow + 1, pointColumn]);
    }
    if (
      pointColumn > 0 &&
      farmMap[pointRow][pointColumn - 1] === regionPlantType &&
      regionQueue.findIndex(
        (point) => point[0] === pointRow && point[1] === pointColumn - 1
      ) === -1
    ) {
      regionQueue.push([pointRow, pointColumn - 1]);
    }
    if (
      pointColumn < farmMap[pointRow].length - 1 &&
      farmMap[pointRow][pointColumn + 1] === regionPlantType &&
      regionQueue.findIndex(
        (point) => point[0] === pointRow && point[1] === pointColumn + 1
      ) === -1
    ) {
      regionQueue.push([pointRow, pointColumn + 1]);
    }
    regionQueueIndex += 1;
  } while (regionQueueIndex < regionQueue.length);
  let sideCount = 0;
  regionQueue.sort(([rowIndexA, columnIndexA], [rowIndexB, columnIndexB]) =>
    rowIndexA - rowIndexB === 0
      ? columnIndexA - columnIndexB
      : rowIndexA - rowIndexB
  );
  for (let rowIndex = 0; rowIndex < farmMap.length; rowIndex += 1) {
    for (const [regionRowIndex, regionColumnIndex] of regionQueue.filter(
      ([regionRowIndex]) => regionRowIndex === rowIndex
    )) {
      const edgeAbove =
        regionRowIndex === 0 ||
        farmMap[regionRowIndex - 1][regionColumnIndex] !== regionPlantType;
      const edgeBelow =
        regionRowIndex === farmMap.length - 1 ||
        farmMap[regionRowIndex + 1][regionColumnIndex] !== regionPlantType;
      const edgeRight =
        regionColumnIndex === farmMap.length - 1 ||
        farmMap[regionRowIndex][regionColumnIndex + 1] !== regionPlantType;
      const edgeRightAbove =
        regionRowIndex !== 0 &&
        regionColumnIndex !== farmMap.length - 1 &&
        farmMap[regionRowIndex - 1][regionColumnIndex + 1] === regionPlantType;
      const edgeRightBelow =
        regionRowIndex !== farmMap.length - 1 &&
        regionColumnIndex !== farmMap.length - 1 &&
        farmMap[regionRowIndex + 1][regionColumnIndex + 1] === regionPlantType;
      if ((edgeRight || edgeRightBelow) && edgeBelow) {
        sideCount += 1;
      }
      if ((edgeRight || edgeRightAbove) && edgeAbove) {
        sideCount += 1;
      }
    }
  }
  regionQueue.sort(([rowIndexA, columnIndexA], [rowIndexB, columnIndexB]) =>
    columnIndexA - columnIndexB === 0
      ? rowIndexA - rowIndexB
      : columnIndexA - columnIndexB
  );
  for (let columnIndex = 0; columnIndex < farmMap.length; columnIndex += 1) {
    for (const [regionRowIndex, regionColumnIndex] of regionQueue.filter(
      ([, regionColumnIndex]) => regionColumnIndex === columnIndex
    )) {
      const edgeBelow =
        regionRowIndex === farmMap.length - 1 ||
        farmMap[regionRowIndex + 1][regionColumnIndex] !== regionPlantType;
      const edgeBelowLeft =
        regionRowIndex !== farmMap.length - 1 &&
        regionColumnIndex !== 0 &&
        farmMap[regionRowIndex + 1][regionColumnIndex - 1] === regionPlantType;
      const edgeBelowRight =
        regionRowIndex !== farmMap.length - 1 &&
        regionColumnIndex !== farmMap.length - 1 &&
        farmMap[regionRowIndex + 1][regionColumnIndex + 1] === regionPlantType;
      const edgeLeft =
        regionColumnIndex === 0 ||
        farmMap[regionRowIndex][regionColumnIndex - 1] !== regionPlantType;
      const edgeRight =
        regionColumnIndex === farmMap.length - 1 ||
        farmMap[regionRowIndex][regionColumnIndex + 1] !== regionPlantType;
      if ((edgeBelow || edgeBelowLeft) && edgeLeft) {
        sideCount += 1;
      }
      if ((edgeBelow || edgeBelowRight) && edgeRight) {
        sideCount += 1;
      }
    }
  }
  fenceCost += regionArea * sideCount;
}

logResult(fenceCost);

logBenchmark(performance.now());
