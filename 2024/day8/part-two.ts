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
const antinodeLocationSet = new Set<string>(
  Object.values(locationMap)
    .flat()
    .map(([antennaRow, antennaColumn]) => `${antennaRow}-${antennaColumn}`)
);
for (const locationList of Object.values(locationMap)) {
  for (let indexA = 0; indexA < locationList.length; indexA += 1) {
    for (let indexB = indexA + 1; indexB < locationList.length; indexB += 1) {
      const [rowA, columnA] = locationList[indexA];
      const [rowB, columnB] = locationList[indexB];
      const [firstAntinodeRowDifference, firstAntinodeColumnDifference] = [
        rowA - rowB,
        columnA - columnB,
      ];
      const [secondAntinodeRowDifference, secondAntinodeColumnDifference] = [
        rowB - rowA,
        columnB - columnA,
      ];
      let firstAntinodeVectorMultiplier = 1;
      while (
        0 <=
          rowA + firstAntinodeRowDifference * firstAntinodeVectorMultiplier &&
        rowA + firstAntinodeRowDifference * firstAntinodeVectorMultiplier <
          matrix.length &&
        0 <=
          columnA +
            firstAntinodeColumnDifference * firstAntinodeVectorMultiplier &&
        columnA +
          firstAntinodeColumnDifference * firstAntinodeVectorMultiplier <
          matrix[0].length
      ) {
        antinodeLocationSet.add(
          `${
            rowA + firstAntinodeRowDifference * firstAntinodeVectorMultiplier
          }-${
            columnA +
            firstAntinodeColumnDifference * firstAntinodeVectorMultiplier
          }`
        );
        firstAntinodeVectorMultiplier += 1;
      }
      let secondAntinodeVectorMultiplier = 1;
      while (
        0 <=
          rowB + secondAntinodeRowDifference * secondAntinodeVectorMultiplier &&
        rowB + secondAntinodeRowDifference * secondAntinodeVectorMultiplier <
          matrix.length &&
        0 <=
          columnB +
            secondAntinodeColumnDifference * secondAntinodeVectorMultiplier &&
        columnB +
          secondAntinodeColumnDifference * secondAntinodeVectorMultiplier <
          matrix[0].length
      ) {
        antinodeLocationSet.add(
          `${
            rowB + secondAntinodeRowDifference * secondAntinodeVectorMultiplier
          }-${
            columnB +
            secondAntinodeColumnDifference * secondAntinodeVectorMultiplier
          }`
        );
        secondAntinodeVectorMultiplier += 1;
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

logDebug(
  matrix
    .slice(0, 8)
    .map((row) => row.join(""))
    .join("\n")
);
logResult(antinodeLocationSet.size);

logBenchmark(performance.now());
