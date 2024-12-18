import { readFile, logBenchmark, logResult } from "../util";
logBenchmark(performance.now());
const inputString = readFile(process.argv[2]);
const mapMatrix = inputString
  .split("\n")
  .map((inputElement) => inputElement.split(""));

const startRowIndex = mapMatrix.findIndex((mapRow) => mapRow.includes("S"));
const startColumnIndex = mapMatrix[startRowIndex].indexOf("S");
const endRowIndex = mapMatrix.findIndex((mapRow) => mapRow.includes("E"));
const endColumnIndex = mapMatrix[endRowIndex].indexOf("E");
mapMatrix[startRowIndex][startColumnIndex] = ".";
mapMatrix[endRowIndex][endColumnIndex] = ".";

const unvisitedQueue = [
  {
    cost: 0,
    positionKey: `${startRowIndex}-${startColumnIndex}-E`,
    path: [] as [number, number][],
  },
];
const visitedList: typeof unvisitedQueue = [];
const optimalPositionSet = new Set();
let optimalPathCost = Number.MAX_SAFE_INTEGER;
while (unvisitedQueue.length > 0) {
  const { cost, positionKey, path } = unvisitedQueue.shift()!;
  const [rowIndex, columnIndex, direction] = positionKey
    .split("-")
    .map((keyPart, keyPartIndex) =>
      keyPartIndex < 2 ? parseInt(keyPart) : keyPart
    ) as [number, number, string];
  visitedList.push({
    cost,
    positionKey,
    path: [...path, [rowIndex, columnIndex]],
  });

  if (columnIndex === endColumnIndex && rowIndex === endRowIndex) {
    if (optimalPathCost === Number.MAX_SAFE_INTEGER) {
      optimalPathCost = cost;
    }
    if (cost === optimalPathCost) {
      for (const [pathRowIndex, pathColumnIndex] of [
        ...path,
        [rowIndex, columnIndex],
      ]) {
        optimalPositionSet.add(`${pathRowIndex}-${pathColumnIndex}`);
      }
    }
    continue;
  }

  const [forwardRowOffset, forwardColumnOffset] = [
    direction === "N" ? 1 : direction === "S" ? -1 : 0,
    direction === "E" ? 1 : direction === "W" ? -1 : 0,
  ];
  const forwardCost = cost + 1;
  const forwardPositionKey = `${rowIndex + forwardRowOffset}-${
    columnIndex + forwardColumnOffset
  }-${direction}`;
  const indexInUnvisitedQueue = unvisitedQueue.findIndex(
    ({ positionKey: unvisitedPositionKey }) =>
      unvisitedPositionKey === forwardPositionKey
  );
  const indexInVisitedList = visitedList.findIndex(
    ({ positionKey: visitedPositionKey }) =>
      visitedPositionKey === forwardPositionKey
  );

  if (
    mapMatrix[rowIndex + forwardRowOffset][
      columnIndex + forwardColumnOffset
    ] !== "#" &&
    (indexInUnvisitedQueue === -1 ||
      unvisitedQueue[indexInUnvisitedQueue].cost >= forwardCost) &&
    (indexInVisitedList === -1 ||
      visitedList[indexInVisitedList].cost >= forwardCost)
  ) {
    if (indexInUnvisitedQueue !== -1) {
      unvisitedQueue[indexInUnvisitedQueue] = {
        cost: forwardCost,
        positionKey: forwardPositionKey,
        path: [
          ...path,
          ...(unvisitedQueue[indexInUnvisitedQueue].cost === forwardCost
            ? [...unvisitedQueue[indexInUnvisitedQueue].path]
            : []),
          [rowIndex, columnIndex],
        ],
      };
    } else {
      unvisitedQueue.push({
        cost: forwardCost,
        positionKey: forwardPositionKey,
        path: [...path, [rowIndex, columnIndex]],
      });
    }
  }

  const alternateDirectionList =
    direction === "E" || direction === "W" ? ["N", "S"] : ["E", "W"];
  const alternateDirectionCost = cost + 1000;

  for (const alternateDirection of alternateDirectionList) {
    const alternateDirectionPositionKey = `${rowIndex}-${columnIndex}-${alternateDirection}`;
    const indexInUnvisitedQueue = unvisitedQueue.findIndex(
      ({ positionKey: unvisitedPositionKey }) =>
        unvisitedPositionKey === alternateDirectionPositionKey
    );
    const indexInVisitedList = visitedList.findIndex(
      ({ positionKey: visitedPositionKey }) =>
        visitedPositionKey === alternateDirectionPositionKey
    );

    if (
      (indexInUnvisitedQueue === -1 ||
        unvisitedQueue[indexInUnvisitedQueue].cost > alternateDirectionCost) &&
      (indexInVisitedList === -1 ||
        visitedList[indexInVisitedList].cost > alternateDirectionCost)
    ) {
      if (indexInUnvisitedQueue !== -1) {
        unvisitedQueue[indexInUnvisitedQueue] = {
          cost: alternateDirectionCost,
          positionKey: alternateDirectionPositionKey,
          path: [...path, [rowIndex, columnIndex]],
        };
      } else {
        unvisitedQueue.push({
          cost: alternateDirectionCost,
          positionKey: alternateDirectionPositionKey,
          path: [...path, [rowIndex, columnIndex]],
        });
      }
    }
  }

  unvisitedQueue
    .sort(({ cost: costA }, { cost: costB }) => costA - costB)
    .splice(
      unvisitedQueue.findIndex(({ cost }) => cost > optimalPathCost),
      unvisitedQueue.findIndex(({ cost }) => cost > optimalPathCost) === -1
        ? 0
        : unvisitedQueue.length -
            unvisitedQueue.findIndex(({ cost }) => cost > optimalPathCost)
    );
  visitedList.sort(({ cost: costA }, { cost: costB }) => costA - costB);
}

logResult(optimalPositionSet.size);
logBenchmark(performance.now());
