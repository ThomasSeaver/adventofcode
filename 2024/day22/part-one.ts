import { logResult, readFile, logBenchmark } from "../util";
logBenchmark(performance.now());
const inputString = readFile(process.argv[2]);
const secretNumberList = inputString
  .split("\n")
  .map((secretNumber) => BigInt(secretNumber.trim()));

let sum = 0n;
for (let secretNumber of secretNumberList) {
  for (
    let secretNumberTransformationIndex = 0;
    secretNumberTransformationIndex < 2000;
    secretNumberTransformationIndex += 1
  ) {
    const sixtyFourTimes = secretNumber * 64n;
    secretNumber = sixtyFourTimes ^ secretNumber;
    secretNumber = secretNumber % 16777216n;
    const thirtyTwoDivided = secretNumber / 32n;
    secretNumber = thirtyTwoDivided ^ secretNumber;
    secretNumber = secretNumber % 16777216n;
    const twentyFortyEightTimes = secretNumber * 2048n;
    secretNumber = twentyFortyEightTimes ^ secretNumber;
    secretNumber = secretNumber % 16777216n;
  }
  sum += secretNumber;
}

logResult(sum);

logBenchmark(performance.now());
