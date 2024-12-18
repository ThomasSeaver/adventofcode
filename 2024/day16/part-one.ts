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

const unvisitedPriorityQueue = [
  {
    cost: 0,
    priority: 0,
    positionKey: `${startRowIndex}-${startColumnIndex}-E`,
  },
];

const visitedList: typeof unvisitedPriorityQueue = [];

while (unvisitedPriorityQueue.length > 0) {
  const { cost, positionKey, priority } = unvisitedPriorityQueue.shift()!;
  visitedList.push({ cost, positionKey, priority });
  const [rowIndex, columnIndex, direction] = positionKey
    .split("-")
    .map((keyPart, keyPartIndex) =>
      keyPartIndex < 2 ? parseInt(keyPart) : keyPart
    ) as [number, number, string];

  if (columnIndex === endColumnIndex && rowIndex === endRowIndex) {
    logResult(cost);
    break;
  }

  const [forwardRowOffset, forwardColumnOffset] = [
    direction === "N" ? 1 : direction === "S" ? -1 : 0,
    direction === "E" ? 1 : direction === "W" ? -1 : 0,
  ];
  const forwardCost = cost + 1;
  const forwardDistance =
    Math.abs(endRowIndex - (rowIndex + forwardRowOffset)) +
    Math.abs(endColumnIndex - (columnIndex + forwardColumnOffset));
  const forwardPriority = forwardCost + forwardDistance;
  const forwardPositionKey = `${rowIndex + forwardRowOffset}-${
    columnIndex + forwardColumnOffset
  }-${direction}`;
  const indexInUnvisitedPriorityQueue = unvisitedPriorityQueue.findIndex(
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
    (indexInUnvisitedPriorityQueue === -1 ||
      unvisitedPriorityQueue[indexInUnvisitedPriorityQueue].priority >
        forwardPriority) &&
    (indexInVisitedList === -1 ||
      visitedList[indexInVisitedList].priority > forwardPriority)
  ) {
    if (indexInUnvisitedPriorityQueue !== -1) {
      unvisitedPriorityQueue[indexInUnvisitedPriorityQueue] = {
        cost: forwardCost,
        priority: forwardPriority,
        positionKey: forwardPositionKey,
      };
    } else {
      unvisitedPriorityQueue.push({
        cost: forwardCost,
        priority: forwardPriority,
        positionKey: forwardPositionKey,
      });
    }
    if (indexInVisitedList !== -1) {
      visitedList.splice(indexInVisitedList, 1);
    }
  }

  const alternateDirectionList =
    direction === "E" || direction === "W" ? ["N", "S"] : ["E", "W"];
  const alternateDirectionCost = cost + 1000;
  const alternateDirectionDistance =
    Math.abs(endRowIndex - rowIndex) + Math.abs(endColumnIndex - columnIndex);
  const alternateDirectionPriority =
    alternateDirectionCost + alternateDirectionDistance;

  for (const alternateDirection of alternateDirectionList) {
    const alternateDirectionPositionKey = `${rowIndex}-${columnIndex}-${alternateDirection}`;
    const indexInUnvisitedPriorityQueue = unvisitedPriorityQueue.findIndex(
      ({ positionKey: unvisitedPositionKey }) =>
        unvisitedPositionKey === alternateDirectionPositionKey
    );
    const indexInVisitedList = visitedList.findIndex(
      ({ positionKey: visitedPositionKey }) =>
        visitedPositionKey === alternateDirectionPositionKey
    );

    if (
      (indexInUnvisitedPriorityQueue === -1 ||
        unvisitedPriorityQueue[indexInUnvisitedPriorityQueue].priority >
          alternateDirectionPriority) &&
      (indexInVisitedList === -1 ||
        visitedList[indexInVisitedList].priority > alternateDirectionPriority)
    ) {
      if (indexInUnvisitedPriorityQueue !== -1) {
        unvisitedPriorityQueue[indexInUnvisitedPriorityQueue] = {
          cost: alternateDirectionCost,
          priority: alternateDirectionPriority,
          positionKey: alternateDirectionPositionKey,
        };
      } else {
        unvisitedPriorityQueue.push({
          cost: alternateDirectionCost,
          priority: alternateDirectionPriority,
          positionKey: alternateDirectionPositionKey,
        });
      }
      if (indexInVisitedList !== -1) {
        visitedList.splice(indexInVisitedList, 1);
      }
    }
  }

  unvisitedPriorityQueue.sort(
    ({ priority: priorityA }, { priority: priorityB }) => priorityA - priorityB
  );
}

logBenchmark(performance.now());
