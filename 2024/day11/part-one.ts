import { logResult, logDebug, readFile, logBenchmark } from "../util";
logBenchmark(performance.now());
const inputString = readFile(process.argv[2]);
let stoneList = inputString
  .trim()
  .split(" ")
  .map((inputElement) => parseInt(inputElement.trim()));

for (let blinkIndex = 0; blinkIndex < 25; blinkIndex += 1) {
  let stoneListCopy = [];
  for (const stone of stoneList) {
    if (stone === 0) {
      stoneListCopy.push(1);
    } else if (`${stone}`.length % 2 === 0) {
      stoneListCopy.push(
        parseInt(`${stone}`.substring(0, `${stone}`.length / 2))
      );
      stoneListCopy.push(parseInt(`${stone}`.substring(`${stone}`.length / 2)));
    } else {
      stoneListCopy.push(stone * 2024);
    }
  }
  stoneList = stoneListCopy;
}

logResult(stoneList.length);

logBenchmark(performance.now());
