import { useInput } from "../util.js";

const parseInput = (input) => {
  const lines = input.map((line) =>
    line
      .split(" -> ")
      .map((position) =>
        position.split(",").map((coordinate) => parseInt(coordinate))
      )
  );

  const xMin =
    lines.reduce((previousCandidate, currentLine) => {
      const newCandidate = currentLine.reduce(
        (previousLineCandidate, currentCandidate) =>
          currentCandidate[0] < previousLineCandidate
            ? currentCandidate[0]
            : previousLineCandidate,
        500
      );
      return newCandidate < previousCandidate
        ? newCandidate
        : previousCandidate;
    }, 500) - 400;

  const xMax =
    lines.reduce((previousCandidate, currentLine) => {
      const newCandidate = currentLine.reduce(
        (previousLineCandidate, currentCandidate) =>
          currentCandidate[0] > previousLineCandidate
            ? currentCandidate[0]
            : previousLineCandidate,
        500
      );
      return newCandidate > previousCandidate
        ? newCandidate
        : previousCandidate;
    }, 500) + 400;

  const yMax =
    lines.reduce((previousCandidate, currentLine) => {
      const newCandidate = currentLine.reduce(
        (previousLineCandidate, currentCandidate) =>
          currentCandidate[1] > previousLineCandidate
            ? currentCandidate[1]
            : previousLineCandidate,
        0
      );
      return newCandidate > previousCandidate
        ? newCandidate
        : previousCandidate;
    }, 0) + 2;

  const map = [];
  for (let lineIndex = 0; lineIndex <= yMax; lineIndex += 1) {
    const line = [];
    for (let columnIndex = xMin; columnIndex <= xMax; columnIndex += 1) {
      line.push(lineIndex < yMax ? 0 : 1);
    }
    map.push(line);
  }

  for (const line of lines) {
    for (
      let linePointIndex = 0;
      linePointIndex < line.length - 1;
      linePointIndex += 1
    ) {
      const [aX, aY] = line[linePointIndex];
      const [bX, bY] = line[linePointIndex + 1];
      const [startX, endX] = [aX, bX].sort((a, b) => a - b);
      const [startY, endY] = [aY, bY].sort((a, b) => a - b);

      if (aX === bX) {
        for (let lineIndex = startY; lineIndex <= endY; lineIndex += 1) {
          map[lineIndex][startX - xMin] = 1;
        }
      } else {
        for (let lineIndex = startX; lineIndex <= endX; lineIndex += 1) {
          map[startY][lineIndex - xMin] = 1;
        }
      }
    }
  }

  map[0][500 - xMin] = 3;

  return map;
};

const visualize = (map) =>
  console.log(
    map
      .map((line) =>
        line
          .map((val) =>
            val === 0
              ? "."
              : val === 1
              ? "#"
              : val === 2
              ? "o"
              : val === 3
              ? "+"
              : "~"
          )
          .join("")
      )
      .join("\n"),
    "\n"
  );

const handleInput = async (input) => {
  const res = [];

  const rockMap = parseInput(input);

  let sandCount = 0;
  let sandOffMap = false;
  let sandFullMap = false;
  while (!sandOffMap || !sandFullMap) {
    sandCount += 1;
    let sandPos = [rockMap[0].indexOf(3), 0];
    while (true) {
      const [sandX, sandY] = sandPos;

      if (!sandOffMap && sandY == rockMap.length - 2) {
        sandOffMap = true;

        res.push(sandCount - 1);
      }

      if (rockMap[sandY + 1][sandX] == 0) {
        sandPos[1] += 1;
      } else if (rockMap[sandY + 1][sandX - 1] == 0) {
        sandPos[0] -= 1;
        sandPos[1] += 1;
      } else if (rockMap[sandY + 1][sandX + 1] == 0) {
        sandPos[0] += 1;
        sandPos[1] += 1;
      } else {
        if (sandY === 0) {
          sandFullMap = true;
          res.push(sandCount);
        }
        rockMap[sandY][sandX] = 2;
        break;
      }
    }
    //visualize(rockMap);
  }

  return res;
};

console.log("example outcome", ...(await handleInput(useInput("e.txt"))));
console.log("real outcome", ...(await handleInput(useInput("i.txt"))));
