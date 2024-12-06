import { logResult, readFile, logBenchmark } from "../util";
logBenchmark(performance.now());
const inputString = readFile(process.argv[2]);
const map = inputString.split("\n").map((matrixRow) => matrixRow.split(""));

const originalGuardRow = map.findIndex((mapRow) => mapRow.includes("^"));
const originalGuardColumn = map[originalGuardRow].indexOf("^");
const originalGuardDirection = "^";
let loopCount = 0;

for (
  let potentialObstructionRow = 0;
  potentialObstructionRow < map.length;
  potentialObstructionRow += 1
) {
  for (
    let potentialObstructionColumn = 0;
    potentialObstructionColumn < map[0].length;
    potentialObstructionColumn += 1
  ) {
    if (
      (potentialObstructionRow === originalGuardRow &&
        potentialObstructionColumn == originalGuardColumn) ||
      map[potentialObstructionRow][potentialObstructionColumn] == "#"
    ) {
      continue;
    }
    map[potentialObstructionRow][potentialObstructionColumn] = "#";
    let guardRow = originalGuardRow;
    let guardColumn = originalGuardColumn;
    let guardDirection = originalGuardDirection;
    const history: string[] = [];
    while (
      0 <= guardRow &&
      guardRow < map.length &&
      0 <= guardColumn &&
      guardColumn < map[guardRow].length
    ) {
      if (history.includes(`${guardRow}-${guardColumn}-${guardDirection}`)) {
        loopCount += 1;
        break;
      }
      history.push(`${guardRow}-${guardColumn}-${guardDirection}`);
      if (guardDirection == "^") {
        if (guardRow == 0 || map[guardRow - 1][guardColumn] != "#") {
          guardRow -= 1;
        } else {
          guardDirection = ">";
        }
      } else if (guardDirection == ">") {
        if (
          guardColumn == map[guardRow].length - 1 ||
          map[guardRow][guardColumn + 1] != "#"
        ) {
          guardColumn += 1;
        } else {
          guardDirection = "v";
        }
      } else if (guardDirection == "v") {
        if (
          guardRow == map.length - 1 ||
          map[guardRow + 1][guardColumn] != "#"
        ) {
          guardRow += 1;
        } else {
          guardDirection = "<";
        }
      } else if (guardDirection == "<") {
        if (guardColumn == 0 || map[guardRow][guardColumn - 1] != "#") {
          guardColumn -= 1;
        } else {
          guardDirection = "^";
        }
      }
    }
    map[potentialObstructionRow][potentialObstructionColumn] = ".";
  }
}

logResult(loopCount);

logBenchmark(performance.now());
