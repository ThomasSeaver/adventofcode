import { logResult, readFile, logBenchmark } from "../util";
logBenchmark(performance.now());
const inputString = readFile(process.argv[2]);
const matrix = inputString.split("\n").map((matrixRow) => matrixRow.split(""));

let masCount = 0;
for (let i = 1; i < matrix.length - 1; i += 1) {
  for (let j = 1; j < matrix[0].length - 1; j += 1) {
    if (
      matrix[i][j] === "A" &&
      ((matrix[i - 1][j - 1] === "M" && matrix[i + 1][j + 1] === "S") ||
        (matrix[i - 1][j - 1] === "S" && matrix[i + 1][j + 1] === "M")) &&
      ((matrix[i + 1][j - 1] === "M" && matrix[i - 1][j + 1] === "S") ||
        (matrix[i + 1][j - 1] === "S" && matrix[i - 1][j + 1] === "M"))
    ) {
      masCount += 1;
    }
  }
}

logResult(masCount);

logBenchmark(performance.now());
