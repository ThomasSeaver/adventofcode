import { logResult, readFile, logBenchmark } from "../util";
logBenchmark(performance.now());
const inputString = readFile(process.argv[2]);
const mapMatrix = inputString.split("\n").map((inputRow) => inputRow.split(""));

const startRowIndex = mapMatrix.findIndex((mapRow) => mapRow.includes("S"));
const startColumnIndex = mapMatrix[startRowIndex].indexOf("S");
const endRowIndex = mapMatrix.findIndex((mapRow) => mapRow.includes("E"));
const endColumnIndex = mapMatrix[endRowIndex].indexOf("E");

const positionTimeMap = { [`${startRowIndex}-${startColumnIndex}`]: 0 };

let time = 0;
let lastPosition = [-1, -1];
let currentPosition = [startRowIndex, startColumnIndex];
while (
  currentPosition[0] !== endRowIndex ||
  currentPosition[1] !== endColumnIndex
) {
  time += 1;
  if (
    mapMatrix[currentPosition[0] + 1][currentPosition[1]] !== "#" &&
    currentPosition[0] + 1 !== lastPosition[0]
  ) {
    positionTimeMap[`${currentPosition[0] + 1}-${currentPosition[1]}`] = time;
    lastPosition = [...currentPosition];
    currentPosition = [currentPosition[0] + 1, currentPosition[1]];
  } else if (
    mapMatrix[currentPosition[0] - 1][currentPosition[1]] !== "#" &&
    currentPosition[0] - 1 !== lastPosition[0]
  ) {
    positionTimeMap[`${currentPosition[0] - 1}-${currentPosition[1]}`] = time;
    lastPosition = [...currentPosition];
    currentPosition = [currentPosition[0] - 1, currentPosition[1]];
  } else if (
    mapMatrix[currentPosition[0]][currentPosition[1] + 1] !== "#" &&
    currentPosition[1] + 1 !== lastPosition[1]
  ) {
    positionTimeMap[`${currentPosition[0]}-${currentPosition[1] + 1}`] = time;
    lastPosition = [...currentPosition];
    currentPosition = [currentPosition[0], currentPosition[1] + 1];
  } else if (
    mapMatrix[currentPosition[0]][currentPosition[1] - 1] !== "#" &&
    currentPosition[1] - 1 !== lastPosition[1]
  ) {
    positionTimeMap[`${currentPosition[0]}-${currentPosition[1] - 1}`] = time;
    lastPosition = [...currentPosition];
    currentPosition = [currentPosition[0], currentPosition[1] - 1];
  }
}

const orderedPositionTimeList = Object.entries(positionTimeMap)
  .map(
    ([key, cost]) =>
      [
        key.split("-").map((index) => parseInt(index)) as [number, number],
        cost,
      ] satisfies [[number, number], number]
  )
  .sort(([, costA], [, costB]) => costA - costB);
const cheatTimeMap: Record<number, number> = {};
for (const [
  positionIndex,
  [[positionRowIndex, positionColumnIndex], positionCost],
] of orderedPositionTimeList.entries()) {
  for (const [
    [cheatPositionRowIndex, cheatPositionColumnIndex],
    cheatPositionCost,
  ] of orderedPositionTimeList.slice(positionIndex + 1)) {
    const cheatLength =
      Math.abs(cheatPositionRowIndex - positionRowIndex) +
      Math.abs(cheatPositionColumnIndex - positionColumnIndex);
    if (cheatLength <= 20) {
      const timeSaving = Math.max(
        cheatPositionCost - positionCost - cheatLength,
        0
      );
      cheatTimeMap[timeSaving] = (cheatTimeMap[timeSaving] ?? 0) + 1;
    }
  }
}

logResult(
  Object.entries(cheatTimeMap)
    .filter(([key]) => parseInt(key) >= (mapMatrix.length > 15 ? 100 : 50))
    .reduce((accumulator, [, currentCount]) => accumulator + currentCount, 0)
);

logBenchmark(performance.now());
