import { logResult, logDebug, readFile, logBenchmark } from "../util";
logBenchmark(performance.now());
const inputString = readFile(process.argv[2]);
const stoneList = inputString.trim().split(" ");

let stoneMap: Record<string, number> = {};
for (const stone of stoneList) {
  stoneMap[stone] = (stoneMap[stone] ?? 0) + 1;
}

for (let blinkIndex = 0; blinkIndex < 75; blinkIndex += 1) {
  const stoneMapCopy: Record<string, number> = {};
  for (const [stone, stoneCount] of Object.entries(stoneMap)) {
    if (stone === "0") {
      stoneMapCopy["1"] = stoneCount;
    } else if (stone.length % 2 === 0) {
      stoneMapCopy[`${parseInt(stone.substring(0, stone.length / 2))}`] =
        (stoneMapCopy[`${parseInt(stone.substring(0, stone.length / 2))}`] ??
          0) + stoneCount;
      stoneMapCopy[`${parseInt(stone.substring(stone.length / 2))}`] =
        (stoneMapCopy[`${parseInt(stone.substring(stone.length / 2))}`] ?? 0) +
        stoneCount;
    } else {
      stoneMapCopy[`${parseInt(stone) * 2024}`] =
        (stoneMapCopy[`${parseInt(stone) * 2024}`] ?? 0) + stoneCount;
    }
  }
  stoneMap = { ...stoneMapCopy };
}

logResult(
  Object.values(stoneMap).reduce((previous, current) => previous + current, 0)
);

logBenchmark(performance.now());
