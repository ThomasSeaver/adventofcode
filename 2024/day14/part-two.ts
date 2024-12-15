import { logResult, logDebug, readFile, logBenchmark } from "../util";
logBenchmark(performance.now());
const inputString = readFile(process.argv[2]);
let robotList = inputString.split("\n").map((robotString) =>
  robotString.split(" ").map((substring) =>
    substring
      .substring(2)
      .split(",")
      .map((value) => parseInt(value))
  )
);

const christmasTreePattern = [
  [0, 0, 1, 0, 0],
  [0, 1, 1, 1, 0],
  [1, 1, 1, 1, 1],
];

const roomWidth = robotList.length === 12 ? 11 : 101;
const roomHeight = robotList.length === 12 ? 7 : 103;
let found = false;
for (let second = 1; second <= 10000; second += 1) {
  logDebug(second);
  robotList = robotList.map(([[pX, pY], [vX, vY]]) => [
    [
      (((pX + vX) % roomWidth) + roomWidth) % roomWidth,
      (((pY + vY) % roomHeight) + roomHeight) % roomHeight,
    ],
    [vX, vY],
  ]);

  for (
    let rowIndex = 0;
    rowIndex < roomHeight - christmasTreePattern.length;
    rowIndex += 1
  ) {
    for (
      let columnIndex = 0;
      columnIndex < roomWidth - christmasTreePattern[0].length;
      columnIndex += 1
    ) {
      const doesntMatch = christmasTreePattern.some(
        (row, patternRowIndex) =>
          !row.some(
            (count, patternColumnIndex) =>
              robotList.filter(
                ([[pX, pY]]) =>
                  pX === rowIndex + patternRowIndex &&
                  pY === columnIndex + patternColumnIndex
              ).length !== count
          )
      );
      if (!doesntMatch) {
        logResult(second);
        found = true;
        break;
      }
    }
    if (found) {
      break;
    }
  }

  if (found) {
    const map = [];
    for (let rowIndex = 0; rowIndex < roomHeight; rowIndex += 1) {
      const mapRow = [];
      for (let columnIndex = 0; columnIndex < roomWidth; columnIndex += 1) {
        const robotCount = robotList.filter(
          ([[pX, pY]]) => pX === columnIndex && pY === rowIndex
        ).length;
        mapRow.push(robotCount === 0 ? " " : robotCount);
      }
      map.push(mapRow);
    }

    logDebug(
      second + "\n" + map.map((mapRow) => mapRow.join("")).join("\n") + "\n"
    );
    break;
  }
}

logBenchmark(performance.now());
