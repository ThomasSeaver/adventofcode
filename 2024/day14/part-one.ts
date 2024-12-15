import { logResult, logDebug, readFile, logBenchmark } from "../util";
logBenchmark(performance.now());
const inputString = readFile(process.argv[2]);
const robotList = inputString.split("\n").map((robotString) =>
  robotString.split(" ").map((substring) =>
    substring
      .substring(2)
      .split(",")
      .map((value) => parseInt(value))
  )
);

const roomWidth = robotList.length === 12 ? 11 : 101;
const roomHeight = robotList.length === 12 ? 7 : 103;
const secondCount = 100;

const updatedRobotList = robotList.map(([[pX, pY], [vX, vY]]) => [
  (((pX + vX * secondCount) % roomWidth) + roomWidth) % roomWidth,
  (((pY + vY * secondCount) % roomHeight) + roomHeight) % roomHeight,
]);

const firstQuadrant = updatedRobotList.filter(
  ([pX, pY]) =>
    pX < Math.floor(roomWidth / 2) && pY < Math.floor(roomHeight / 2)
).length;
const secondQuadrant = updatedRobotList.filter(
  ([pX, pY]) =>
    pX > Math.floor(roomWidth / 2) && pY < Math.floor(roomHeight / 2)
).length;
const thirdQuadrant = updatedRobotList.filter(
  ([pX, pY]) =>
    pX > Math.floor(roomWidth / 2) && pY > Math.floor(roomHeight / 2)
).length;
const fourthQuadrant = updatedRobotList.filter(
  ([pX, pY]) =>
    pX < Math.floor(roomWidth / 2) && pY > Math.floor(roomHeight / 2)
).length;

logResult(firstQuadrant * secondQuadrant * thirdQuadrant * fourthQuadrant);

const map = [];
for (let rowIndex = 0; rowIndex < roomHeight; rowIndex += 1) {
  const mapRow = [];
  for (let columnIndex = 0; columnIndex < roomWidth; columnIndex += 1) {
    const robotCount = updatedRobotList.filter(
      ([pX, pY]) => pX === columnIndex && pY === rowIndex
    ).length;
    mapRow.push(robotCount === 0 ? "." : robotCount);
  }
  map.push(mapRow);
}

logDebug(map.map((mapRow) => mapRow.join("")).join("\n"));

logBenchmark(performance.now());
