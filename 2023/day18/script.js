const { logBenchmarkTimes } = require("../../utils/benchmark");
const { grabText } = require("../../utils/grab-text");
const { toDebugFile } = require("../../utils/to-debug-file");
const samples = grabText(`${__dirname}/s.txt`);
const actual = grabText(`${__dirname}/i.txt`);

const handleInputPartOne = (input) => {
  let instructions = input.split("\n").map((inputRow) => ({
    direction: inputRow.split(" ")[0],
    directionLength: inputRow.split(" ")[1],
    color: inputRow.split(" ")[2],
  }));

  let currentPosition = [0, 0];
  const vertices = [];
  for (const instruction of instructions) {
    const { direction, directionLength, color } = instruction;
    const positionAfterInstruction = [
      currentPosition[0] + (direction === "D" ? 1 : direction === "U" ? -1 : 0) * directionLength,
      currentPosition[1] + (direction === "R" ? 1 : direction === "L" ? -1 : 0) * directionLength,
    ];
    vertices.push({ position: positionAfterInstruction });
    currentPosition = positionAfterInstruction;
  }

  const minimumRowIndex = vertices.reduce(
    (previousMinimum, currentVertex) => Math.min(previousMinimum, currentVertex.position[0]),
    vertices[0].position[0]
  );
  const minimumColumnIndex = vertices.reduce(
    (previousMinimum, currentVertex) => Math.min(previousMinimum, currentVertex.position[1]),
    vertices[0].position[1]
  );

  // offset vertices so they exist from origin space, to make it easier to handle
  const adjustedVertices = vertices.map((vertex) => ({
    position: [vertex.position[0] + minimumRowIndex * -1, vertex.position[1] + minimumColumnIndex * -1],
  }));

  const maximumRowIndex = adjustedVertices.reduce(
    (previousMaximum, currentVertex) => Math.max(previousMaximum, currentVertex.position[0]),
    adjustedVertices[0].position[0]
  );
  const maximumColumnIndex = adjustedVertices.reduce(
    (previousMaximum, currentVertex) => Math.max(previousMaximum, currentVertex.position[1]),
    adjustedVertices[0].position[1]
  );

  const field = [];
  for (let rowIndex = 0; rowIndex <= maximumRowIndex; rowIndex += 1) {
    field.push([...Array(maximumColumnIndex + 1).fill(".")]);
  }

  for (let edgeIndex = 0; edgeIndex < adjustedVertices.length; edgeIndex += 1) {
    const edge = [adjustedVertices[edgeIndex], adjustedVertices[(edgeIndex + 1) % adjustedVertices.length]];
    const [edgeMinimumRowIndex, edgeMaximumRowIndex] = [edge[0].position[0], edge[1].position[0]].sort((a, b) => a - b);
    const [edgeMinimumColumnIndex, edgeMaximumColumnIndex] = [edge[0].position[1], edge[1].position[1]].sort(
      (a, b) => a - b
    );
    for (let rowIndex = edgeMinimumRowIndex; rowIndex <= edgeMaximumRowIndex; rowIndex += 1) {
      for (let columnIndex = edgeMinimumColumnIndex; columnIndex <= edgeMaximumColumnIndex; columnIndex += 1) {
        field[rowIndex][columnIndex] = "#";
      }
    }
  }

  for (let rowIndex = 0; rowIndex < field.length; rowIndex += 1) {
    let state = "outside";
    for (let columnIndex = 0; columnIndex < field[0].length; columnIndex += 1) {
      // hitting a wall flips the state
      if (
        field[rowIndex][columnIndex] === "#" &&
        field[rowIndex - 1]?.[columnIndex] === "#" &&
        field[rowIndex + 1]?.[columnIndex] === "#"
      ) {
        if (state === "outside") {
          state = "inside";
        } else if (state === "inside") {
          state = "outside";
        }
        // hitting a corner flips into edge states
      } else if (
        field[rowIndex][columnIndex] === "#" &&
        field[rowIndex - 1]?.[columnIndex] === "#" &&
        field[rowIndex][columnIndex + 1] === "#"
      ) {
        if (state === "outside") {
          state = "inside-is-up";
        } else if (state === "inside") {
          state = "inside-is-down";
        }
      } else if (
        field[rowIndex][columnIndex] === "#" &&
        field[rowIndex + 1]?.[columnIndex] === "#" &&
        field[rowIndex][columnIndex + 1] === "#"
      ) {
        if (state === "outside") {
          state = "inside-is-down";
        } else if (state === "inside") {
          state = "inside-is-up";
        }
      } else if (
        field[rowIndex][columnIndex] === "#" &&
        field[rowIndex - 1]?.[columnIndex] === "#" &&
        field[rowIndex + 1]?.[columnIndex] !== "#"
      ) {
        if (state === "inside-is-up") {
          state = "outside";
        } else if (state === "inside-is-down") {
          state = "inside";
        }
      } else if (
        field[rowIndex][columnIndex] === "#" &&
        field[rowIndex - 1]?.[columnIndex] !== "#" &&
        field[rowIndex + 1]?.[columnIndex] === "#"
      ) {
        if (state === "inside-is-up") {
          state = "inside";
        } else if (state === "inside-is-down") {
          state = "outside";
        }
      } else if (state === "inside") {
        field[rowIndex][columnIndex] = "*";
      }
    }
  }
  // toDebugFile(field.map((row) => row.join("")).join("\n"));

  return field.flatMap((row) => row.filter((column) => column !== ".")).length;
};

// should have seen that one coming...
// I really thought it would be some weird color math
// I spent a ridiculous amount of time trying to solve this with some vertical edge -> vertical edge matching algo
// similar to the first approach, but matching ranges and coalescing that instead of 1 by 1, similar to a previous day
// I could not figure it out; I very nearly got it solved but there was an issue with interior horizontal edges causing double counting
// that issue made me give up and google for the first time for a method of determining the 'interior direction' of a polygon side so I could filter them out
// that lead me to https://stackoverflow.com/questions/22159120/how-to-determine-which-side-of-a-polygon-edge-is-inside-a-polygon-and-which-is
// which lead me to https://stackoverflow.com/questions/1165647/how-to-determine-if-a-list-of-polygon-points-are-in-clockwise-order/1165943#1165943
// which confused me more since it gave the quiet little side quip that the formula resulted in twice the area of a polygon. I didn't realize such a formula existed so I googled,
// leading me to https://stackoverflow.com/questions/34326728/how-do-i-calculate-the-area-of-a-non-convex-polygon
// and https://en.wikipedia.org/wiki/Shoelace_formula
// I guess I should have given up earlier and just looked up the 300 year old formula, but oh well
// I still had to figure out the interiority anyway so I could adjust the area calculation, since it's technically a 0.5 meter offset in certain directions for the polygon vertices
const handleInputPartTwo = (input) => {
  const directionMap = ["R", "D", "L", "U"];
  let instructions = input.split("\n").map((inputRow) => ({
    direction: directionMap[parseInt(inputRow.split(" ")[2].slice(7, 8), 16)],
    directionLength: parseInt(inputRow.split(" ")[2].slice(2, 7), 16),
  }));

  let currentPosition = { rowIndex: 0, columnIndex: 0 };
  const vertices = [];
  for (const instruction of instructions) {
    const { direction, directionLength } = instruction;
    const positionAfterInstruction = {
      rowIndex: currentPosition.rowIndex + (direction === "D" ? 1 : direction === "U" ? -1 : 0) * directionLength,
      columnIndex: currentPosition.columnIndex + (direction === "R" ? 1 : direction === "L" ? -1 : 0) * directionLength,
    };
    vertices.push(currentPosition);
    currentPosition = positionAfterInstruction;
  }

  let unadjustedAreaValue = 0;
  for (let vertexIndex = 0; vertexIndex < vertices.length; vertexIndex += 1) {
    const { rowIndex: rowIndexA, columnIndex: columnIndexA } = vertices[vertexIndex];
    const { rowIndex: rowIndexB, columnIndex: columnIndexB } = vertices[(vertexIndex + 1) % vertices.length];
    unadjustedAreaValue += columnIndexA * rowIndexB - rowIndexA * columnIndexB;
  }
  const isClockwise = Math.sign(unadjustedAreaValue);

  const adjustedVertices = vertices.map((_, vertexIndex) => {
    const previousVertex = vertices.at(vertexIndex - 1);
    const currentVertex = vertices[vertexIndex];
    const nextVertex = vertices[(vertexIndex + 1) % vertices.length];

    const columnDirection =
      previousVertex.columnIndex < currentVertex.columnIndex || currentVertex.columnIndex < nextVertex.columnIndex
        ? "R"
        : "L";
    const rowModifier = (columnDirection === "R" ? -0.5 : 0.5) * (isClockwise ? 1 : -1);

    const rowDirection =
      previousVertex.rowIndex < currentVertex.rowIndex || currentVertex.rowIndex < nextVertex.rowIndex ? "D" : "U";
    const columnModifier = (rowDirection === "U" ? -0.5 : 0.5) * (isClockwise ? 1 : -1);

    return { rowIndex: currentVertex.rowIndex + rowModifier, columnIndex: currentVertex.columnIndex + columnModifier };
  });

  let areaValue = 0;
  for (let vertexIndex = 0; vertexIndex < adjustedVertices.length; vertexIndex += 1) {
    const { rowIndex: rowIndexA, columnIndex: columnIndexA } = adjustedVertices[vertexIndex];
    const { rowIndex: rowIndexB, columnIndex: columnIndexB } =
      adjustedVertices[(vertexIndex + 1) % adjustedVertices.length];
    areaValue += columnIndexA * rowIndexB - rowIndexA * columnIndexB;
  }
  return 0.5 * Math.abs(areaValue);
};

logBenchmarkTimes([
  ...samples.split("\n\n").map((sample, sampleIndex, samples) => ({
    name: `p1: sample${samples.length > 1 ? " " + sampleIndex : ""}`,
    func: () => handleInputPartOne(sample),
  })),
  { name: `p1: actual`, func: () => handleInputPartOne(actual) },
  ...samples.split("\n\n").map((sample, sampleIndex, samples) => ({
    name: `p2: sample${samples.length > 1 ? " " + sampleIndex : ""}`,
    func: () => handleInputPartTwo(sample),
  })),
  { name: `p2: actual`, func: () => handleInputPartTwo(actual) },
]);
