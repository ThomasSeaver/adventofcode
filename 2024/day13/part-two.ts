import { logResult, readFile, logBenchmark, logDebug } from "../util";
logBenchmark(performance.now());
const inputString = readFile(process.argv[2]);
const machineInfoList = inputString.split("\n\n").map((machineInfo) =>
  machineInfo.split("\n").map((machineLine) =>
    machineLine
      .split(":")[1]
      .split(",")
      .map(
        (offset) =>
          parseInt(
            offset.indexOf("+") !== -1
              ? offset.split("+")[1]
              : offset.split("=")[1]
          ) + (offset.indexOf("+") !== -1 ? 0 : 10000000000000)
      )
  )
);

const tokenSum = machineInfoList
  .map(([[aX, aY], [bX, bY], [pX, pY]]) => {
    const bPresses = (aX * pY - aY * pX) / (bY * aX - bX * aY);
    const aPresses = (pX - bPresses * bX) / aX;
    if (
      Math.floor(aPresses) === aPresses &&
      Math.floor(bPresses) === bPresses
    ) {
      return aPresses * 3 + bPresses;
    }
    return 0;
  })
  .reduce((previous, current) => previous + current, 0);

logResult(tokenSum);

logBenchmark(performance.now());
