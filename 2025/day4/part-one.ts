import { logBenchmark, logResult, readFile } from "../util";

logBenchmark(performance.now());
const inputString = readFile(process.argv[2] ?? "");
const grid = inputString.split("\n").map((inputElement) => inputElement.split(""));

let count = 0;
for (let rowIndex = 0; rowIndex < grid.length; rowIndex += 1) {
  for (let columnIndex = 0; columnIndex < grid[rowIndex]!.length; columnIndex += 1) {
    if (grid[rowIndex]![columnIndex] !== "@") {
      continue;
    }
    let neighborSum = 0;
    for (
      let neighborRowIndex = rowIndex - 1;
      neighborRowIndex <= rowIndex + 1;
      neighborRowIndex += 1
    ) {
      for (
        let neighborColumnIndex = columnIndex - 1;
        neighborColumnIndex <= columnIndex + 1;
        neighborColumnIndex += 1
      ) {
        if (neighborRowIndex === rowIndex && neighborColumnIndex === columnIndex) {
          continue;
        }
        neighborSum += grid[neighborRowIndex]?.[neighborColumnIndex] === "@" ? 1 : 0;
      }
    }
    if (neighborSum < 4) {
      count += 1;
    }
  }
}

logResult(count);

logBenchmark(performance.now());
