import { useInput } from "../util.js";

const parseHeights = (input) => {
  const heightMap = input.map((line) =>
    line.split("").map((char) => {
      if (char == "E") return 122;
      else if (char == "S") return 97;
      else return char.charCodeAt(0);
    })
  );

  const initialY = input.findIndex((line) => line.includes("S"));
  const initialX = input[initialY].indexOf("S");

  const finalY = input.findIndex((line) => line.includes("E"));
  const finalX = input[finalY].indexOf("E");

  return { heightMap, finalX, finalY, initialX, initialY };
};

const getPathLength = (heightMap, initialX, initialY, finalX, finalY) => {
  const xLength = heightMap[0].length - 1;
  const yLength = heightMap.length - 1;

  const paths = [{ position: [initialX, initialY], history: {} }];
  const visitedPositions = { [`${initialX}-${initialY}`]: true };

  while (paths.length > 0) {
    const { position: currentPosition, history: currentHistory } =
      paths.shift();

    const [currentX, currentY] = currentPosition;
    visitedPositions[`${currentX}-${currentY}`] = true;
    const currentHeight = heightMap[currentY][currentX];

    if (currentX === finalX && currentY === finalY) {
      return Object.entries(currentHistory).length;
    }

    const options = [];

    if (currentX > 0) options.push([currentX - 1, currentY]);
    if (currentX < xLength) options.push([currentX + 1, currentY]);
    if (currentY > 0) options.push([currentX, currentY - 1]);
    if (currentY < yLength) options.push([currentX, currentY + 1]);

    const filteredOptions = options.filter(
      ([optionX, optionY]) =>
        heightMap[optionY][optionX] <= currentHeight + 1 &&
        !currentHistory[`${optionX}-${optionY}`] &&
        !visitedPositions[`${optionX}-${optionY}`]
    );

    filteredOptions.forEach(([optionX, optionY]) => {
      visitedPositions[`${optionX}-${optionY}`] = true;
      paths.push({
        position: [optionX, optionY],
        history: { ...currentHistory, [`${optionX}-${optionY}`]: true },
      });
    });
  }
};

const handleInput = (input) => {
  const res = [];

  const { heightMap, finalX, finalY, initialX, initialY } = parseHeights(input);

  const shortestPath = getPathLength(
    heightMap,
    initialX,
    initialY,
    finalX,
    finalY
  );

  res.push(shortestPath);

  const startingLocations = heightMap.flatMap((line, Y) =>
    line.flatMap((height, X) => (height === 97 ? [[X, Y]] : []))
  );

  const hikePathLengths = startingLocations.flatMap((startingLocation) => {
    const [startX, startY] = startingLocation;
    const pathLength = getPathLength(heightMap, startX, startY, finalX, finalY);

    return pathLength
      ? [
          {
            pathLength,
            position: startingLocation,
          },
        ]
      : [];
  });

  hikePathLengths.sort(
    (lengthA, lengthB) => lengthA.pathLength - lengthB.pathLength
  );

  res.push(hikePathLengths[0]);

  return res;
};

console.log("example outcome", ...handleInput(useInput("e.txt")));
console.log("real outcome", ...handleInput(useInput("i.txt")));
