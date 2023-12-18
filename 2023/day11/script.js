const { logBenchmarkTimes } = require("../../utils/benchmark");
const { grabText } = require("../../utils/grab-text");
const sample = grabText(`${__dirname}/s.txt`);
const actual = grabText(`${__dirname}/i.txt`);

// Lol very ugly very slow but I think I'm too lazy to make it fast atm
// maybe later
const handleInputPartOne = (input) => {
  let field = input
    .split("\n")
    .map((row) => row.split("").map((column) => ({ travelCost: 1, isGalaxy: column === "#" })));

  for (let rowIndex = 0; rowIndex < field.length; rowIndex += 1) {
    if (field[rowIndex].filter((column) => column.isGalaxy).length === 0) {
      field[rowIndex] = field[rowIndex].map((column) => ({ ...column, travelCost: column.travelCost * 2 }));
    }
  }

  for (let columnIndex = 0; columnIndex < field[0].length; columnIndex += 1) {
    if (field.filter((row) => row[columnIndex].isGalaxy).length === 0) {
      field = field.map((row) => {
        row[columnIndex].travelCost *= 2;
        return row;
      });
    }
  }

  const galaxyPathCosts = [];
  for (let rowIndex = 0; rowIndex < field.length; rowIndex += 1) {
    for (let columnIndex = 0; columnIndex < field[rowIndex].length; columnIndex += 1) {
      if (field[rowIndex][columnIndex].isGalaxy) {
        const searchField = field.map((row) => row.map((column) => ({ ...column })));
        searchField[rowIndex][columnIndex].pathLength = 0;
        const searchQueue = [[rowIndex, columnIndex, 0]];

        while (searchQueue.length > 0) {
          const [searchRowIndex, searchColumnIndex, pathLength] = searchQueue.shift();
          if (searchField[searchRowIndex][searchColumnIndex].traversed) {
            continue;
          }
          searchField[searchRowIndex][searchColumnIndex].traversed = true;
          searchField[searchRowIndex][searchColumnIndex].pathLength =
            searchField[searchRowIndex][searchColumnIndex].pathLength < pathLength
              ? searchField[searchRowIndex][searchColumnIndex].pathLength
              : pathLength;
          if (searchRowIndex > 0 && !searchField[searchRowIndex - 1][searchColumnIndex].traversed) {
            searchQueue.push([
              searchRowIndex - 1,
              searchColumnIndex,
              searchField[searchRowIndex][searchColumnIndex].pathLength +
                searchField[searchRowIndex - 1][searchColumnIndex].travelCost,
            ]);
          }
          if (
            searchRowIndex < searchField.length - 1 &&
            !searchField[searchRowIndex + 1][searchColumnIndex].traversed
          ) {
            searchQueue.push([
              searchRowIndex + 1,
              searchColumnIndex,
              searchField[searchRowIndex][searchColumnIndex].pathLength +
                searchField[searchRowIndex + 1][searchColumnIndex].travelCost,
            ]);
          }
          if (searchColumnIndex > 0 && !searchField[searchRowIndex][searchColumnIndex - 1].traversed) {
            searchQueue.push([
              searchRowIndex,
              searchColumnIndex - 1,
              searchField[searchRowIndex][searchColumnIndex].pathLength +
                searchField[searchRowIndex][searchColumnIndex - 1].travelCost,
            ]);
          }
          if (
            searchColumnIndex < searchField[searchRowIndex].length - 1 &&
            !searchField[searchRowIndex][searchColumnIndex + 1].traversed
          ) {
            searchQueue.push([
              searchRowIndex,
              searchColumnIndex + 1,
              searchField[searchRowIndex][searchColumnIndex].pathLength +
                searchField[searchRowIndex][searchColumnIndex + 1].travelCost,
            ]);
          }
        }

        const pathCosts = searchField.flatMap((row) =>
          row.filter((column) => column.isGalaxy).map((column) => column.pathLength)
        );
        galaxyPathCosts.push(pathCosts);
      }
    }
  }

  let sum = 0;
  for (let galaxyIndex = 0; galaxyIndex < galaxyPathCosts.length; galaxyIndex += 1) {
    for (let galaxyPairIndex = galaxyIndex + 1; galaxyPairIndex < galaxyPathCosts.length; galaxyPairIndex += 1) {
      sum += galaxyPathCosts[galaxyIndex][galaxyPairIndex];
    }
  }

  return sum;
};

const handleInputPartTwo = (input) => {
  let field = input
    .split("\n")
    .map((row) => row.split("").map((column) => ({ travelCost: 1, isGalaxy: column === "#" })));

  for (let rowIndex = 0; rowIndex < field.length; rowIndex += 1) {
    if (field[rowIndex].filter((column) => column.isGalaxy).length === 0) {
      field[rowIndex] = field[rowIndex].map((column) => ({ ...column, travelCost: column.travelCost * 1000000 }));
    }
  }

  for (let columnIndex = 0; columnIndex < field[0].length; columnIndex += 1) {
    if (field.filter((row) => row[columnIndex].isGalaxy).length === 0) {
      field = field.map((row) => {
        row[columnIndex].travelCost *= 1000000;
        return row;
      });
    }
  }

  const galaxyPathCosts = [];
  for (let rowIndex = 0; rowIndex < field.length; rowIndex += 1) {
    for (let columnIndex = 0; columnIndex < field[rowIndex].length; columnIndex += 1) {
      if (field[rowIndex][columnIndex].isGalaxy) {
        const searchField = field.map((row) => row.map((column) => ({ ...column })));
        searchField[rowIndex][columnIndex].pathLength = 0;
        const searchQueue = [[rowIndex, columnIndex, 0]];

        while (searchQueue.length > 0) {
          const [searchRowIndex, searchColumnIndex, pathLength] = searchQueue.shift();
          if (searchField[searchRowIndex][searchColumnIndex].traversed) {
            continue;
          }
          searchField[searchRowIndex][searchColumnIndex].traversed = true;
          searchField[searchRowIndex][searchColumnIndex].pathLength =
            searchField[searchRowIndex][searchColumnIndex].pathLength < pathLength
              ? searchField[searchRowIndex][searchColumnIndex].pathLength
              : pathLength;
          if (searchRowIndex > 0 && !searchField[searchRowIndex - 1][searchColumnIndex].traversed) {
            searchQueue.push([
              searchRowIndex - 1,
              searchColumnIndex,
              searchField[searchRowIndex][searchColumnIndex].pathLength +
                searchField[searchRowIndex - 1][searchColumnIndex].travelCost,
            ]);
          }
          if (
            searchRowIndex < searchField.length - 1 &&
            !searchField[searchRowIndex + 1][searchColumnIndex].traversed
          ) {
            searchQueue.push([
              searchRowIndex + 1,
              searchColumnIndex,
              searchField[searchRowIndex][searchColumnIndex].pathLength +
                searchField[searchRowIndex + 1][searchColumnIndex].travelCost,
            ]);
          }
          if (searchColumnIndex > 0 && !searchField[searchRowIndex][searchColumnIndex - 1].traversed) {
            searchQueue.push([
              searchRowIndex,
              searchColumnIndex - 1,
              searchField[searchRowIndex][searchColumnIndex].pathLength +
                searchField[searchRowIndex][searchColumnIndex - 1].travelCost,
            ]);
          }
          if (
            searchColumnIndex < searchField[searchRowIndex].length - 1 &&
            !searchField[searchRowIndex][searchColumnIndex + 1].traversed
          ) {
            searchQueue.push([
              searchRowIndex,
              searchColumnIndex + 1,
              searchField[searchRowIndex][searchColumnIndex].pathLength +
                searchField[searchRowIndex][searchColumnIndex + 1].travelCost,
            ]);
          }
        }

        const pathCosts = searchField.flatMap((row) =>
          row.filter((column) => column.isGalaxy).map((column) => column.pathLength)
        );
        galaxyPathCosts.push(pathCosts);
      }
    }
  }

  let sum = 0;
  for (let galaxyIndex = 0; galaxyIndex < galaxyPathCosts.length; galaxyIndex += 1) {
    for (let galaxyPairIndex = galaxyIndex + 1; galaxyPairIndex < galaxyPathCosts.length; galaxyPairIndex += 1) {
      sum += galaxyPathCosts[galaxyIndex][galaxyPairIndex];
    }
  }

  return sum;
};

// I dunno what I was smoking with that last solution, I guess I just assumed it would have become a pathfinding problem
// only like 1000x as fast
const refinedHandleInput = (input, part) => {
  const emptyMultiplier = part === 1 ? 2 : 1000000;
  const space = input.split("\n").map((row) => row.split(""));
  const galaxies = space.flatMap((row, rowIndex) =>
    row
      .flatMap((column, columnIndex) => (column === "." ? [] : [columnIndex]))
      .map((columnIndex) => [rowIndex, columnIndex])
  );
  const rowCost = space.map((row) => (row.includes("#") ? 1 : emptyMultiplier));
  const columnCost = space
    .map((_, rowIndex) => space.map((row) => row[rowIndex]))
    .map((column) => (column.includes("#") ? 1 : emptyMultiplier));

  let sum = 0;

  for (let galaxyAIndex = 0; galaxyAIndex < galaxies.length - 1; galaxyAIndex += 1) {
    for (let galaxyBIndex = galaxyAIndex + 1; galaxyBIndex < galaxies.length; galaxyBIndex += 1) {
      const [galaxyARow, galaxyAColumn] = galaxies[galaxyAIndex];
      const [galaxyBRow, galaxyBColumn] = galaxies[galaxyBIndex];
      for (
        let rowIndex = Math.min(galaxyARow, galaxyBRow);
        rowIndex < Math.max(galaxyARow, galaxyBRow);
        rowIndex += 1
      ) {
        sum += rowCost[rowIndex];
      }
      for (
        let columnIndex = Math.min(galaxyAColumn, galaxyBColumn);
        columnIndex < Math.max(galaxyAColumn, galaxyBColumn);
        columnIndex += 1
      ) {
        sum += columnCost[columnIndex];
      }
    }
  }
  return sum;
};

logBenchmarkTimes(
  [
    { name: `p1: sample`, func: () => handleInputPartOne(sample) },
    { name: `p1: actual`, func: () => handleInputPartOne(actual) },
    { name: `p2: sample`, func: () => handleInputPartTwo(sample) },
    { name: `p2: actual`, func: () => handleInputPartTwo(actual) },
    { name: `p1: sample | refined`, func: () => refinedHandleInput(sample, 1) },
    { name: `p1: actual | refined`, func: () => refinedHandleInput(actual, 1) },
    { name: `p2: sample | refined`, func: () => refinedHandleInput(sample, 2) },
    { name: `p2: actual | refined`, func: () => refinedHandleInput(actual, 2) },
  ],
  { shouldCompare: true }
);
