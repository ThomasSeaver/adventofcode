import { logResult, readFile, logBenchmark } from "../util";
logBenchmark(performance.now());
const inputString = readFile(process.argv[2]);
const byteCoordinateList = inputString
  .split("\n")
  .map((byteCoordinateString) =>
    byteCoordinateString
      .split(",")
      .map((byteCoordinate) => parseInt(byteCoordinate))
  );

const gridSize = byteCoordinateList.length === 25 ? 7 : 71;
const fallingBytesCount = byteCoordinateList.length === 25 ? 12 : 1024;
const fallingBytesCoordinatesList = byteCoordinateList.slice(
  0,
  fallingBytesCount
);
const matrix = Array.from({ length: gridSize }, (_, rowIndex) =>
  Array.from({ length: gridSize }, (_, columnIndex) =>
    fallingBytesCoordinatesList.some(
      ([fallingByteColumnIndex, fallingByteRowIndex]) =>
        fallingByteRowIndex === rowIndex &&
        fallingByteColumnIndex === columnIndex
    )
      ? "#"
      : "."
  )
);

const positionQueue = [[0, 0, 0]];
const visitedSet = new Set();
while (positionQueue.length > 0) {
  const [columnIndex, rowIndex, pathLength] = positionQueue.shift()!;
  if (columnIndex === gridSize - 1 && rowIndex === gridSize - 1) {
    logResult(pathLength);
    break;
  }
  const cardinalOffsets = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];
  for (const [cardinalColumnOffset, cardinalRowOffset] of cardinalOffsets) {
    const offsetColumnIndex = columnIndex + cardinalColumnOffset;
    const offsetRowIndex = rowIndex + cardinalRowOffset;
    if (
      0 <= offsetColumnIndex &&
      offsetColumnIndex < gridSize &&
      0 <= offsetRowIndex &&
      offsetRowIndex < gridSize &&
      matrix[offsetRowIndex][offsetColumnIndex] !== "#" &&
      !visitedSet.has(`${offsetColumnIndex}-${offsetRowIndex}`)
    ) {
      positionQueue.push([offsetColumnIndex, offsetRowIndex, pathLength + 1]);
      visitedSet.add(`${offsetColumnIndex}-${offsetRowIndex}`);
    }
  }
}

logBenchmark(performance.now());
