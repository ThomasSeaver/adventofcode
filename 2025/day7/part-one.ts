import { logBenchmark, logDebug, logResult, readFile } from "../util";

logBenchmark(performance.now());
const inputString = readFile(process.argv[2] ?? "");
const map = inputString.split("\n").map((row) => row.split(""));

let startPosition = [0, map[0]!.indexOf("S")] satisfies [number, number];

let tachyonQueue: [number, number][] = [startPosition];
let splitCount = 0;
while (tachyonQueue.length > 0) {
  let [rowIndex, columnIndex] = tachyonQueue.shift()!;
  if (rowIndex + 1 < map.length && map[rowIndex]![columnIndex] !== "|") {
    map[rowIndex]![columnIndex] = "|";
    if (map[rowIndex + 1]![columnIndex] === ".") {
      tachyonQueue.push([rowIndex + 1, columnIndex]);
    } else {
      splitCount += 1;
      // I don't think splitters can be near the edge
      tachyonQueue.push([rowIndex + 1, columnIndex - 1]);
      tachyonQueue.push([rowIndex + 1, columnIndex + 1]);
    }
  }
}

logDebug(
  map.map((row) => row.map((cell) => (cell === "|" ? "|" : cell)).join("")).join("\n[DEBUG]"),
);
logResult(splitCount);

logBenchmark(performance.now());
