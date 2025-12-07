import { logBenchmark, logDebug, logResult, readFile } from "../util";

logBenchmark(performance.now());
const inputString = readFile(process.argv[2] ?? "");
const map = inputString.split("\n").map((row) => row.split(""));

let startPosition = [0, map[0]!.indexOf("S")] satisfies [number, number];

let runCount = 0;
const tachyonTimelineMap = new Map<string, number>();
const getTachyonTimelineCount = ([rowIndex, columnIndex]: [number, number]): number => {
  const key = `${rowIndex}-${columnIndex}`;
  runCount += 1;
  if (tachyonTimelineMap.has(key)) {
    return tachyonTimelineMap.get(key)!;
  }
  let value;
  if (rowIndex + 1 >= map.length) {
    value = 1;
  } else if (map[rowIndex + 1]![columnIndex] === ".") {
    value = getTachyonTimelineCount([rowIndex + 1, columnIndex]);
  } else {
    value =
      getTachyonTimelineCount([rowIndex + 1, columnIndex - 1]) +
      getTachyonTimelineCount([rowIndex + 1, columnIndex + 1]);
  }
  tachyonTimelineMap.set(key, value);
  return value;
};

logResult(getTachyonTimelineCount(startPosition));
logDebug(`Run count: ${runCount}`);

logBenchmark(performance.now());
