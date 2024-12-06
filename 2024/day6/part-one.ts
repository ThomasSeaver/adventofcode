import { logResult, readFile, logBenchmark } from "../util";
logBenchmark(performance.now());
const inputString = readFile(process.argv[2]);
const map = inputString.split("\n").map((matrixRow) => matrixRow.split(""));

let guardRow = map.findIndex((mapRow) => mapRow.includes("^"));
let guardColumn = map[guardRow].indexOf("^");
let guardDirection = "^";
while (
  0 <= guardRow &&
  guardRow < map.length &&
  0 <= guardColumn &&
  guardColumn < map[guardRow].length
) {
  if (guardDirection == "^") {
    if (guardRow == 0 || map[guardRow - 1][guardColumn] != "#") {
      map[guardRow][guardColumn] = "X";
      guardRow -= 1;
    } else {
      guardDirection = ">";
    }
  } else if (guardDirection == ">") {
    if (
      guardColumn == map[guardRow].length - 1 ||
      map[guardRow][guardColumn + 1] != "#"
    ) {
      map[guardRow][guardColumn] = "X";
      guardColumn += 1;
    } else {
      guardDirection = "v";
    }
  } else if (guardDirection == "v") {
    if (guardRow == map.length - 1 || map[guardRow + 1][guardColumn] != "#") {
      map[guardRow][guardColumn] = "X";
      guardRow += 1;
    } else {
      guardDirection = "<";
    }
  } else if (guardDirection == "<") {
    if (guardColumn == 0 || map[guardRow][guardColumn - 1] != "#") {
      map[guardRow][guardColumn] = "X";
      guardColumn -= 1;
    } else {
      guardDirection = "^";
    }
  }
}

logResult(
  map
    .map((mapRow) => mapRow.filter((mapElement) => mapElement == "X").length)
    .reduce((prev, acc) => prev + acc, 0)
);

logBenchmark(performance.now());
