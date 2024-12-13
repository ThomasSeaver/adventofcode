import { logResult, readFile, logBenchmark } from "../util";
logBenchmark(performance.now());
const inputString = readFile(process.argv[2]);
const machineInfoList = inputString.split("\n\n").map((machineInfo) =>
  machineInfo.split("\n").map((machineLine) =>
    machineLine
      .split(":")[1]
      .split(",")
      .map((offset) =>
        parseInt(
          offset.indexOf("+") !== -1
            ? offset.split("+")[1]
            : offset.split("=")[1]
        )
      )
  )
);

const tokenSum = machineInfoList
  .map((machineInfo) => {
    let tokenSum = 0;
    for (let aPress = 0; aPress <= 100; aPress += 1) {
      for (let bPress = 0; bPress <= 100; bPress += 1) {
        if (
          aPress * machineInfo[0][0] + bPress * machineInfo[1][0] ===
            machineInfo[2][0] &&
          aPress * machineInfo[0][1] + bPress * machineInfo[1][1] ===
            machineInfo[2][1]
        ) {
          tokenSum = Math.min(
            tokenSum === 0 ? Number.POSITIVE_INFINITY : tokenSum,
            aPress * 3 + bPress
          );
        }
      }
    }
    return tokenSum;
  })
  .reduce((previous, current) => previous + current, 0);

logResult(tokenSum);

logBenchmark(performance.now());
