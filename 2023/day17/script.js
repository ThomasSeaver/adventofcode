const { logBenchmarkTimes } = require("../../utils/benchmark");
const { grabText } = require("../../utils/grab-text");
const samples = grabText(`${__dirname}/s.txt`);
const actual = grabText(`${__dirname}/i.txt`);

// been too long since I implemented a path finding algo, especially one with path constraints
// definitely way too slow, don't think I implemented it completely right
// the memo strategy is definitely dumb too lmao
const handleInputPartOne = (input) => {
  const field = input.split("\n").map((row, rowIndex) =>
    row.split("").map((heatLoss, columnIndex) => ({
      heatLoss: parseInt(heatLoss),
      visited: rowIndex === 0 && columnIndex === 0 ? { right: { 0: true } } : null,
    }))
  );

  const [goalRowIndex, goalColumnIndex] = [field.length - 1, field[0].length - 1];
  const priorityQueue = [{ direction: "right", pathCost: 0, positionList: [[0, 0]], directionTime: 0 }];
  while (priorityQueue.length > 0) {
    const { direction, directionTime, pathCost, positionList } = priorityQueue.shift();
    const [currentRowIndex, currentColumnIndex] = positionList.at(-1);

    if (currentRowIndex === goalRowIndex && currentColumnIndex === goalColumnIndex) {
      // console.log(
      //   field
      //     .map((row, rowIndex) =>
      //       row
      //         .map((_, columnIndex) =>
      //           positionList.find((position) => position[0] === rowIndex && position[1] === columnIndex) ? "#" : "."
      //         )
      //         .join("")
      //     )
      //     .join("\n")
      // );
      return pathCost;
    }

    let possibleDirections = [];
    if (direction === "right") {
      possibleDirections = ["up", "down", "right"];
    } else if (direction === "down") {
      possibleDirections = ["right", "left", "down"];
    } else if (direction === "left") {
      possibleDirections = ["up", "down", "left"];
    } else if (direction === "up") {
      possibleDirections = ["right", "left", "up"];
    }

    for (const possibleDirection of possibleDirections) {
      const rowModifier = possibleDirection === "down" ? 1 : possibleDirection === "up" ? -1 : 0;
      const columnModifier = possibleDirection === "right" ? 1 : possibleDirection === "left" ? -1 : 0;
      const newDirectionTime = possibleDirection === direction ? directionTime + 1 : 1;
      const newPosition = [currentRowIndex + rowModifier, currentColumnIndex + columnModifier];
      if (
        0 <= newPosition[0] &&
        newPosition[0] < field.length &&
        0 <= newPosition[1] &&
        newPosition[1] < field[0].length &&
        newDirectionTime <= 3 &&
        !field[newPosition[0]][newPosition[1]]?.visited?.[possibleDirection]?.[newDirectionTime]
      ) {
        field[newPosition[0]][newPosition[1]].visited = {
          ...field[newPosition[0]][newPosition[1]].visited,
          [possibleDirection]: {
            ...field[newPosition[0]][newPosition[1]].visited?.[possibleDirection],
            [newDirectionTime]: true,
          },
        };
        priorityQueue.push({
          direction: possibleDirection,
          directionTime: newDirectionTime,
          pathCost: pathCost + field[newPosition[0]][newPosition[1]].heatLoss,
          positionList: [...positionList, newPosition],
        });
      }
    }

    priorityQueue.sort((a, b) => a.pathCost - b.pathCost);
  }
};

// really only required some debugging since I was originally doing it wrong, technically
// modifying the constraints for part two was easy enough, and the ask wasn't too bad
// definitely can be mega improved though still
const handleInputPartTwo = (input) => {
  const field = input.split("\n").map((row, rowIndex) =>
    row.split("").map((heatLoss, columnIndex) => ({
      heatLoss: parseInt(heatLoss),
      visited: rowIndex === 0 && columnIndex === 0 ? { right: { 0: true } } : null,
    }))
  );

  const [goalRowIndex, goalColumnIndex] = [field.length - 1, field[0].length - 1];
  const priorityQueue = [
    { direction: "right", pathCost: 0, positionList: [[0, 0]], directionTime: 0 },
    { direction: "down", pathCost: 0, positionList: [[0, 0]], directionTime: 0 },
  ];
  while (priorityQueue.length > 0) {
    const { direction, directionTime, pathCost, positionList } = priorityQueue.shift();
    const [currentRowIndex, currentColumnIndex] = positionList.at(-1);
    // debugging priority queue values lead me to realize my direction modifiers were flipped
    // console.log(
    //   field
    //     .map((row, rowIndex) =>
    //       row
    //         .map((column, columnIndex) =>
    //           positionList.find((position) => position[0] === rowIndex && position[1] === columnIndex)
    //             ? "#"
    //             : column.heatLoss
    //         )
    //         .join("")
    //     )
    //     .join("\n"),
    //   "\n",
    //   priorityQueue.map((queuedValue) => queuedValue.pathCost),
    //   "\n"
    // );

    if (currentRowIndex === goalRowIndex && currentColumnIndex === goalColumnIndex) {
      if (directionTime < 4) {
        continue;
      }
      // easiest way to verify path
      // console.log(
      //   field
      //     .map((row, rowIndex) =>
      //       row
      //         .map((column, columnIndex) =>
      //           positionList.find((position) => position[0] === rowIndex && position[1] === columnIndex)
      //             ? "#"
      //             : column.heatLoss
      //         )
      //         .join("")
      //     )
      //     .join("\n")
      // );
      return pathCost;
    }

    let possibleDirections = [];
    if (direction === "right") {
      possibleDirections = ["up", "down", "right"];
    } else if (direction === "down") {
      possibleDirections = ["right", "left", "down"];
    } else if (direction === "left") {
      possibleDirections = ["up", "down", "left"];
    } else if (direction === "up") {
      possibleDirections = ["right", "left", "up"];
    }

    for (const possibleDirection of possibleDirections) {
      const rowModifier = possibleDirection === "down" ? 1 : possibleDirection === "up" ? -1 : 0;
      const columnModifier = possibleDirection === "right" ? 1 : possibleDirection === "left" ? -1 : 0;
      const newDirectionTime = possibleDirection === direction ? directionTime + 1 : 1;
      const newPosition = [currentRowIndex + rowModifier, currentColumnIndex + columnModifier];
      if (
        0 <= newPosition[0] &&
        newPosition[0] < field.length &&
        0 <= newPosition[1] &&
        newPosition[1] < field[0].length &&
        (direction === possibleDirection || directionTime >= 4) &&
        newDirectionTime <= 10 &&
        !field[newPosition[0]][newPosition[1]]?.visited?.[possibleDirection]?.[newDirectionTime]
      ) {
        field[newPosition[0]][newPosition[1]].visited = {
          ...field[newPosition[0]][newPosition[1]].visited,
          [possibleDirection]: {
            ...field[newPosition[0]][newPosition[1]].visited?.[possibleDirection],
            [newDirectionTime]: true,
          },
        };
        priorityQueue.push({
          direction: possibleDirection,
          directionTime: newDirectionTime,
          pathCost: pathCost + field[newPosition[0]][newPosition[1]].heatLoss,
          positionList: [...positionList, newPosition],
        });
      }
    }
    priorityQueue.sort((a, b) => a.pathCost - b.pathCost);
  }
};

const [firstSample, secondSample] = samples.split("\n\n");

logBenchmarkTimes([
  { name: `p1: sample 1`, func: () => handleInputPartOne(firstSample) },
  { name: `p1: sample 2`, func: () => handleInputPartOne(secondSample) },
  { name: `p1: actual`, func: () => handleInputPartOne(actual) },
  { name: `p2: sample 1`, func: () => handleInputPartTwo(firstSample) },
  { name: `p2: sample 2`, func: () => handleInputPartTwo(secondSample) },
  { name: `p2: actual`, func: () => handleInputPartTwo(actual) },
]);
