const { logBenchmarkTimes } = require("../../utils/benchmark");
const { grabText } = require("../../utils/grab-text");
const sample = grabText(`${__dirname}/s.txt`);
const actual = grabText(`${__dirname}/i.txt`);

const getEnergizedCount = (input, initialBeam) => {
  const field = input.split("\n").map((row) => row.split("").map((column) => ({ spotType: column, isEnergized: {} })));
  const beamQueue = [initialBeam];
  while (beamQueue.length > 0) {
    const { rowIndex, columnIndex, direction } = beamQueue.shift();

    field[rowIndex][columnIndex].isEnergized[direction] = true;
    const currentSpot = field[rowIndex][columnIndex].spotType;

    if (currentSpot === "\\") {
      if (direction === "right") {
        if (field[rowIndex + 1]?.[columnIndex] != null && !field[rowIndex + 1][columnIndex].isEnergized["down"]) {
          beamQueue.push({ rowIndex: rowIndex + 1, columnIndex, direction: "down" });
        }
      } else if (direction === "down") {
        if (field[rowIndex]?.[columnIndex + 1] != null && !field[rowIndex][columnIndex + 1].isEnergized["right"]) {
          beamQueue.push({ rowIndex, columnIndex: columnIndex + 1, direction: "right" });
        }
      } else if (direction === "left") {
        if (field[rowIndex - 1]?.[columnIndex] != null && !field[rowIndex - 1][columnIndex].isEnergized["up"]) {
          beamQueue.push({ rowIndex: rowIndex - 1, columnIndex, direction: "up" });
        }
      } else if (direction === "up") {
        if (field[rowIndex]?.[columnIndex - 1] != null && !field[rowIndex][columnIndex - 1].isEnergized["left"]) {
          beamQueue.push({ rowIndex, columnIndex: columnIndex - 1, direction: "left" });
        }
      }
    } else if (currentSpot === "/") {
      if (direction === "right") {
        if (field[rowIndex - 1]?.[columnIndex] != null && !field[rowIndex - 1][columnIndex].isEnergized["up"]) {
          beamQueue.push({ rowIndex: rowIndex - 1, columnIndex, direction: "up" });
        }
      } else if (direction === "down") {
        if (field[rowIndex]?.[columnIndex - 1] != null && !field[rowIndex][columnIndex - 1].isEnergized["left"]) {
          beamQueue.push({ rowIndex, columnIndex: columnIndex - 1, direction: "left" });
        }
      } else if (direction === "left") {
        if (field[rowIndex + 1]?.[columnIndex] != null && !field[rowIndex + 1][columnIndex].isEnergized["down"]) {
          beamQueue.push({ rowIndex: rowIndex + 1, columnIndex, direction: "down" });
        }
      } else if (direction === "up") {
        if (field[rowIndex]?.[columnIndex + 1] != null && !field[rowIndex][columnIndex + 1].isEnergized["right"]) {
          beamQueue.push({ rowIndex, columnIndex: columnIndex + 1, direction: "right" });
        }
      }
    } else if (currentSpot === "|" && (direction === "right" || direction === "left")) {
      if (field[rowIndex - 1]?.[columnIndex] != null && !field[rowIndex - 1][columnIndex].isEnergized["up"]) {
        beamQueue.push({ rowIndex: rowIndex - 1, columnIndex, direction: "up" });
      }
      if (field[rowIndex + 1]?.[columnIndex] != null && !field[rowIndex + 1][columnIndex].isEnergized["down"]) {
        beamQueue.push({ rowIndex: rowIndex + 1, columnIndex, direction: "down" });
      }
    } else if (currentSpot === "-" && (direction === "up" || direction === "down")) {
      if (field[rowIndex]?.[columnIndex - 1] != null && !field[rowIndex][columnIndex - 1].isEnergized["left"]) {
        beamQueue.push({ rowIndex, columnIndex: columnIndex - 1, direction: "left" });
      }
      if (field[rowIndex]?.[columnIndex + 1] != null && !field[rowIndex][columnIndex + 1].isEnergized["right"]) {
        beamQueue.push({ rowIndex, columnIndex: columnIndex + 1, direction: "right" });
      }
    } else if (
      currentSpot !== undefined &&
      field[rowIndex + (direction === "down" ? 1 : direction === "up" ? -1 : 0)]?.[
        columnIndex + (direction === "right" ? 1 : direction === "left" ? -1 : 0)
      ] != null &&
      !field[rowIndex + (direction === "down" ? 1 : direction === "up" ? -1 : 0)][
        columnIndex + (direction === "right" ? 1 : direction === "left" ? -1 : 0)
      ].isEnergized[direction]
    ) {
      beamQueue.push({
        rowIndex: rowIndex + (direction === "down" ? 1 : direction === "up" ? -1 : 0),
        columnIndex: columnIndex + (direction === "right" ? 1 : direction === "left" ? -1 : 0),
        direction,
      });
    }
  }

  return field.reduce(
    (previousCount, currentRow) =>
      previousCount + currentRow.filter((column) => Object.keys(column.isEnergized).length > 0).length,
    0
  );
};

const handleInputPartOne = (input) => {
  return getEnergizedCount(input, { rowIndex: 0, columnIndex: 0, direction: "right" });
};

const handleInputPartTwo = (input) => {
  const field = input.split("\n").map((row) => row.split("").map((column) => ({ spotType: column, isEnergized: {} })));
  let maxEnergization = 0;

  for (let rowIndex = 0; rowIndex < field.length; rowIndex += 1) {
    maxEnergization = Math.max(
      maxEnergization,
      getEnergizedCount(input, { rowIndex, columnIndex: 0, direction: "right" })
    );
    maxEnergization = Math.max(
      maxEnergization,
      getEnergizedCount(input, { rowIndex, columnIndex: field[0].length - 1, direction: "left" })
    );
  }

  for (let columnIndex = 0; columnIndex < field[0].length; columnIndex += 1) {
    maxEnergization = Math.max(
      maxEnergization,
      getEnergizedCount(input, { rowIndex: 0, columnIndex, direction: "down" })
    );
    maxEnergization = Math.max(
      maxEnergization,
      getEnergizedCount(input, { rowIndex: field.length - 1, columnIndex, direction: "up" })
    );
  }

  return maxEnergization;
};

logBenchmarkTimes([
  { name: `p1: sample`, func: () => handleInputPartOne(sample) },
  { name: `p1: actual`, func: () => handleInputPartOne(actual) },
  { name: `p2: sample`, func: () => handleInputPartTwo(sample) },
  { name: `p2: actual`, func: () => handleInputPartTwo(actual) },
]);
