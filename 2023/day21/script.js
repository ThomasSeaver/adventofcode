const { logBenchmarkTimes } = require("../../utils/benchmark");
const { grabText } = require("../../utils/grab-text");
const { toDebugFile } = require("../../utils/to-debug-file");
const samples = grabText(`${__dirname}/s.txt`);
const actual = grabText(`${__dirname}/i.txt`);

const handleInputPartOne = (input) => {
  const inputArray = input.split("\n\n");
  const maxStepCount = parseInt(inputArray[0] === "-1" ? 64 : inputArray[0]);
  const map = inputArray[1].split("\n").map((row, rowIndex) =>
    row.split("").map((column, columnIndex) => ({
      type: column,
      rowIndex,
      columnIndex,
      ...(column === "." ? { shortestPathLength: -1 } : {}),
    }))
  );

  const { rowIndex: originRowIndex, columnIndex: originColumnIndex } = map
    .find((row) => row.find((column) => column.type === "S") !== undefined)
    .find((column) => column.type === "S");

  map[originRowIndex][originColumnIndex].shortestPathLength = 0;
  const positionQueue = [{ rowIndex: originRowIndex, columnIndex: originColumnIndex, stepCount: 0 }];
  while (positionQueue.length > 0) {
    const { rowIndex, columnIndex, stepCount } = positionQueue.shift();
    if (stepCount === maxStepCount) {
      continue;
    }
    const above = map[rowIndex - 1]?.[columnIndex] ?? {};
    const below = map[rowIndex + 1]?.[columnIndex] ?? {};
    const left = map[rowIndex]?.[columnIndex - 1] ?? {};
    const right = map[rowIndex]?.[columnIndex + 1] ?? {};
    const possibleMoves = [above, below, left, right];
    for (const { type, shortestPathLength, rowIndex: moveRowIndex, columnIndex: moveColumnIndex } of possibleMoves) {
      if (type === "." && shortestPathLength === -1) {
        map[moveRowIndex][moveColumnIndex].shortestPathLength = stepCount + 1;
        positionQueue.push({ rowIndex: moveRowIndex, columnIndex: moveColumnIndex, stepCount: stepCount + 1 });
      }
    }
  }

  // map visualization
  toDebugFile(
    map
      .map((row) =>
        row.map((column) => ((maxStepCount - column.shortestPathLength) % 2 === 0 ? "O" : column.type)).join("")
      )
      .join("\n")
  );

  return map
    .flatMap((row) => row.map(({ shortestPathLength }) => shortestPathLength))
    .filter((shortestPathLength) => (maxStepCount - shortestPathLength) % 2 === 0).length;
};

const getMapKey = (rowIndex, columnIndex) => `${rowIndex}-${columnIndex}`;
const getPathKey = (originRowIndex, originColumnIndex, rowIndex, columnIndex) =>
  `${originRowIndex}-${originColumnIndex}:${rowIndex}-${columnIndex}`;

const getPaths = (map, originRowIndex, originColumnIndex) => {
  const getOriginatedPathKey = (rowIndex, columnIndex) =>
    getPathKey(originRowIndex, originColumnIndex, rowIndex, columnIndex);
  const paths = { [getOriginatedPathKey(originRowIndex, originColumnIndex)]: 0 };
  const positionQueue = [{ rowIndex: originRowIndex, columnIndex: originColumnIndex }];
  while (positionQueue.length > 0) {
    const { rowIndex, columnIndex } = positionQueue.shift();
    const stepCount = paths[getOriginatedPathKey(rowIndex, columnIndex)];
    if (
      map[getMapKey(rowIndex - 1, columnIndex)]?.type === "." &&
      paths[getOriginatedPathKey(rowIndex - 1, columnIndex)] === undefined
    ) {
      positionQueue.push({ rowIndex: rowIndex - 1, columnIndex });
      paths[getOriginatedPathKey(rowIndex - 1, columnIndex)] = stepCount + 1;
    }
    if (
      map[getMapKey(rowIndex + 1, columnIndex)]?.type === "." &&
      paths[getOriginatedPathKey(rowIndex + 1, columnIndex)] === undefined
    ) {
      positionQueue.push({ rowIndex: rowIndex + 1, columnIndex });
      paths[getOriginatedPathKey(rowIndex + 1, columnIndex)] = stepCount + 1;
    }
    if (
      map[getMapKey(rowIndex, columnIndex - 1)]?.type === "." &&
      paths[getOriginatedPathKey(rowIndex, columnIndex - 1)] === undefined
    ) {
      positionQueue.push({ rowIndex: rowIndex, columnIndex: columnIndex - 1 });
      paths[getOriginatedPathKey(rowIndex, columnIndex - 1)] = stepCount + 1;
    }
    if (
      map[getMapKey(rowIndex, columnIndex + 1)]?.type === "." &&
      paths[getOriginatedPathKey(rowIndex, columnIndex + 1)] === undefined
    ) {
      positionQueue.push({ rowIndex: rowIndex, columnIndex: columnIndex + 1 });
      paths[getOriginatedPathKey(rowIndex, columnIndex + 1)] = stepCount + 1;
    }
  }
  return paths;
};

// This doesn't work for the samples explicitly (undercounts) because while the actual text is clear of blockers on the central columns and rows,
// thats not the case for the samples
// I tried to figure out for a while the 'correct' way to solve them, but I'm probably not doing it correctly regardless
// I tried to be clever and sum up the corners in one go rather than a for loop, but I kept getting it wrong so I went with the dumb and slow way
// there's almost certainly a correct way to do the central pillars, but I couldn't understand it like how I intuited the corners
// overall I'm just glad I got it. this was a weird one to conceptualize on my own, even though I'm almost certainly missing some algo everybody else knew
const handleInputPartTwo = (input) => {
  const inputArray = input.split("\n\n");
  const maxStepCount = parseInt(inputArray[0] === "-1" ? 26501365 : inputArray[0]);
  const map = Object.fromEntries(
    inputArray[1].split("\n").flatMap((row, rowIndex) =>
      row.split("").map((column, columnIndex) => [
        `${rowIndex}-${columnIndex}`,
        {
          type: column,
          rowIndex,
          columnIndex,
        },
      ])
    )
  );
  const rowCount = inputArray[1].split("\n").length;
  const columnCount = inputArray[1].split("\n")[0].length;
  const { rowIndex: originRowIndex, columnIndex: originColumnIndex } = Object.values(map).find(
    (column) => column.type === "S"
  );
  map[getMapKey(originRowIndex, originColumnIndex)].type = ".";

  const originPaths = getPaths(map, originRowIndex, originColumnIndex);
  // count origin positions
  let positionCount = Object.values(originPaths).filter(
    (pathCost) => maxStepCount >= pathCost && (maxStepCount - pathCost) % 2 == 0
  ).length;

  // count corners
  const corners = [
    [0, 0],
    [0, columnCount - 1],
    [rowCount - 1, 0],
    [rowCount - 1, columnCount - 1],
  ];
  for (const [cornerRowIndex, cornerColumnIndex] of corners) {
    const initialExitCost =
      originPaths[getPathKey(originRowIndex, originColumnIndex, cornerRowIndex, cornerColumnIndex)] + 2;
    // invert the corner since it exits into the opposite corner
    const cornerPaths = getPaths(
      map,
      cornerRowIndex === 0 ? rowCount - 1 : 0,
      cornerColumnIndex === 0 ? columnCount - 1 : 0
    );
    const longestPath = Object.values(cornerPaths).reduce(
      (previousPathCost, currentPathCost) => Math.max(previousPathCost, currentPathCost),
      0
    );
    const positionsForEvenSteps = Object.values(cornerPaths).filter((pathCost) => pathCost % 2 === 0).length;
    const positionsForOddSteps = Object.values(cornerPaths).filter((pathCost) => pathCost % 2 === 1).length;

    let currentStepCount = maxStepCount - initialExitCost;
    let sectorsAffected = 1;
    while (currentStepCount > 0) {
      if (currentStepCount > longestPath) {
        positionCount += sectorsAffected * (currentStepCount % 2 === 0 ? positionsForEvenSteps : positionsForOddSteps);
      } else {
        positionCount +=
          sectorsAffected *
          Object.values(cornerPaths).filter(
            (pathCost) => pathCost <= currentStepCount && (currentStepCount - pathCost) % 2 === 0
          ).length;
      }

      currentStepCount -= rowCount;
      sectorsAffected += 1;
    }
  }

  const sides = ["up", "down", "left", "right"];
  for (const side of sides) {
    let cheapestCost = Number.POSITIVE_INFINITY;
    let cheapestPosition = [0, 0];
    for (let spotIndex = 0; spotIndex < rowCount; spotIndex += 1) {
      if (
        originPaths[
          getPathKey(
            originRowIndex,
            originColumnIndex,
            side === "up" ? 0 : side === "down" ? rowCount - 1 : spotIndex,
            side === "left" ? 0 : side === "right" ? rowCount - 1 : spotIndex
          )
        ] < cheapestCost
      ) {
        cheapestCost =
          originPaths[
            getPathKey(
              originRowIndex,
              originColumnIndex,
              side === "up" ? 0 : side === "down" ? rowCount - 1 : spotIndex,
              side === "left" ? 0 : side === "right" ? rowCount - 1 : spotIndex
            )
          ];
        cheapestPosition = [
          side === "up" ? 0 : side === "down" ? rowCount - 1 : spotIndex,
          side === "left" ? 0 : side === "right" ? rowCount - 1 : spotIndex,
        ];
      }
    }

    const pathMemos = {};
    let currentPosition = [
      side === "left" || side === "right" ? cheapestPosition[0] : cheapestPosition[0] === 0 ? rowCount - 1 : 0,
      side === "up" || side === "down" ? cheapestPosition[1] : cheapestPosition[1] === 0 ? rowCount - 1 : 0,
    ];
    let currentSteps = maxStepCount - cheapestCost - 1;
    while (currentSteps > 0) {
      let [currentRowIndex, currentColumnIndex] = currentPosition;
      if (pathMemos[`${currentRowIndex}-${currentColumnIndex}`] === undefined) {
        const positionPaths = getPaths(map, currentRowIndex, currentColumnIndex);
        const longestPath = Object.values(positionPaths).reduce(
          (previousPathCost, currentPathCost) => Math.max(previousPathCost, currentPathCost),
          0
        );
        const positionsForEvenSteps = Object.values(positionPaths).filter((pathCost) => pathCost % 2 === 0).length;
        const positionsForOddSteps = Object.values(positionPaths).filter((pathCost) => pathCost % 2 === 1).length;
        pathMemos[`${currentRowIndex}-${currentColumnIndex}`] = {
          positionPaths,
          longestPath,
          positionsForEvenSteps,
          positionsForOddSteps,
        };
      }
      const { positionPaths, positionsForEvenSteps, positionsForOddSteps, longestPath } =
        pathMemos[`${currentRowIndex}-${currentColumnIndex}`];
      positionCount +=
        currentSteps >= longestPath
          ? currentSteps % 2 === 1
            ? positionsForOddSteps
            : positionsForEvenSteps
          : Object.values(positionPaths).filter(
              (pathCost) => currentSteps >= pathCost && (currentSteps - pathCost) % 2 === 0
            ).length;

      let cheapestCost = Number.POSITIVE_INFINITY;
      let cheapestPosition = [0, 0];
      for (let spotIndex = 0; spotIndex < rowCount; spotIndex += 1) {
        if (
          positionPaths[
            getPathKey(
              currentRowIndex,
              currentColumnIndex,
              side === "up" ? 0 : side === "down" ? rowCount - 1 : spotIndex,
              side === "left" ? 0 : side === "right" ? rowCount - 1 : spotIndex
            )
          ] < cheapestCost
        ) {
          cheapestCost =
            positionPaths[
              getPathKey(
                currentRowIndex,
                currentColumnIndex,
                side === "up" ? 0 : side === "down" ? rowCount - 1 : spotIndex,
                side === "left" ? 0 : side === "right" ? rowCount - 1 : spotIndex
              )
            ];
          cheapestPosition = [
            side === "up" ? 0 : side === "down" ? rowCount - 1 : spotIndex,
            side === "left" ? 0 : side === "right" ? rowCount - 1 : spotIndex,
          ];
        }
      }
      currentSteps -= cheapestCost + 1;
      currentPosition = [
        side === "left" || side === "right" ? cheapestPosition[0] : cheapestPosition[0] === 0 ? rowCount - 1 : 0,
        side === "up" || side === "down" ? cheapestPosition[1] : cheapestPosition[1] === 0 ? rowCount - 1 : 0,
      ];
    }
  }

  return positionCount;
};

logBenchmarkTimes([
  ...samples.split("\n---\n").map((sample, sampleIndex, samples) => ({
    name: `p1: sample${samples.length > 1 ? " " + sampleIndex : ""}`,
    func: () => handleInputPartOne(sample),
  })),
  { name: `p1: actual`, func: () => handleInputPartOne(actual) },
  ...samples.split("\n---\n").map((sample, sampleIndex, samples) => ({
    name: `p2: sample${samples.length > 1 ? " " + sampleIndex : ""}`,
    func: () => handleInputPartTwo(sample),
  })),
  { name: `p2: actual`, func: () => handleInputPartTwo(actual) },
]);
