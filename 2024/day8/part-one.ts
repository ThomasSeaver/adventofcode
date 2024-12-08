import { logResult, logDebug, readFile, logBenchmark } from "../util";
logBenchmark(performance.now());
const inputString = readFile(process.argv[2]);
const matrix = inputString.split("\n").map((inputRow) => inputRow.split(""));

const locationMap: Record<string, [number, number][]> = {};
for (const [rowIndex, row] of matrix.entries()) {
  for (const [columnIndex, column] of row.entries()) {
    if (column !== ".") {
      locationMap[column] = [
        ...(locationMap[column] ?? []),
        [rowIndex, columnIndex],
      ];
    }
  }
}
const antinodeLocationSet = new Set<string>();
for (const locationList of Object.values(locationMap)) {
  for (let indexA = 0; indexA < locationList.length; indexA += 1) {
    for (let indexB = indexA + 1; indexB < locationList.length; indexB += 1) {
      const [rowA, columnA] = locationList[indexA];
      const [rowB, columnB] = locationList[indexB];
      const [firstAntinodeRow, firstAntinodeColumn] = [
        rowA + rowA - rowB,
        columnA + columnA - columnB,
      ];
      const [secondAntinodeRow, secondAntinodeColumn] = [
        rowB + rowB - rowA,
        columnB + columnB - columnA,
      ];
      if (
        0 <= firstAntinodeRow &&
        firstAntinodeRow < matrix.length &&
        0 <= firstAntinodeColumn &&
        firstAntinodeColumn < matrix[0].length
      ) {
        antinodeLocationSet.add(`${firstAntinodeRow}-${firstAntinodeColumn}`);
      }
      if (
        0 <= secondAntinodeRow &&
        secondAntinodeRow < matrix.length &&
        0 <= secondAntinodeColumn &&
        secondAntinodeColumn < matrix[0].length
      ) {
        antinodeLocationSet.add(`${secondAntinodeRow}-${secondAntinodeColumn}`);
      }
    }
  }
}

for (const antinodeLocation of antinodeLocationSet) {
  const [row, column] = antinodeLocation
    .split("-")
    .map((value) => parseInt(value));
  matrix[row][column] = "#";
}

logDebug(matrix.map((row) => row.join("")).join("\n"));
logResult(antinodeLocationSet.size);

logBenchmark(performance.now());
