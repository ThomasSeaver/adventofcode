import { logResult, readFile, logBenchmark } from "../util";
logBenchmark(performance.now());
const inputString = readFile(process.argv[2]);
const matrix = inputString.split("\n").map((matrixRow) => matrixRow.split(""));

const horizontalCount = matrix
  .map((matrixRow) => {
    let count = 0;
    for (let i = 0; i < matrixRow.length - 3; i += 1) {
      if (["XMAS", "SAMX"].includes(matrixRow.join("").substring(i, i + 4))) {
        count += 1;
      }
    }
    return count;
  })
  .reduce((prev, acc) => prev + acc, 0);

let verticalCount = 0;
for (let i = 0; i < matrix.length; i += 1) {
  for (let j = 0; j < matrix[0].length - 3; j += 1) {
    if (
      ["XMAS", "SAMX"].includes(
        [
          matrix[j][i],
          matrix[j + 1][i],
          matrix[j + 2][i],
          matrix[j + 3][i],
        ].join("")
      )
    ) {
      verticalCount += 1;
    }
  }
}

let diagonalCount = 0;
for (let i = 0; i < matrix.length - 3; i += 1) {
  for (let j = 0; j < matrix[0].length - 3; j += 1) {
    if (
      ["XMAS", "SAMX"].includes(
        [
          matrix[i][j],
          matrix[i + 1][j + 1],
          matrix[i + 2][j + 2],
          matrix[i + 3][j + 3],
        ].join("")
      )
    ) {
      diagonalCount += 1;
    }
  }
}

for (let i = 0; i < matrix.length - 3; i += 1) {
  for (let j = 3; j < matrix[0].length; j += 1) {
    if (
      ["XMAS", "SAMX"].includes(
        [
          matrix[i][j],
          matrix[i + 1][j - 1],
          matrix[i + 2][j - 2],
          matrix[i + 3][j - 3],
        ].join("")
      )
    ) {
      diagonalCount += 1;
    }
  }
}

logResult(horizontalCount + verticalCount + diagonalCount);

logBenchmark(performance.now());
