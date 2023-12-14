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

console.log(`p1: sample`, handleInputPartOne(sample));
console.log("p1: actual", handleInputPartOne(actual));

console.log(`p2: sample`, handleInputPartTwo(sample));
console.log("p2: actual", handleInputPartTwo(actual));
