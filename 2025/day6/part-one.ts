import { logBenchmark, logResult, readFile } from "../util";

logBenchmark(performance.now());
const inputString = readFile(process.argv[2] ?? "");
const inputLineList = inputString
  .split("\n")
  .map((inputLine) => inputLine.split(" ").filter((inputElement) => inputElement !== ""))
  .reverse();
let sum = 0;
for (let problemIndex = 0; problemIndex < inputLineList[0]!.length; problemIndex += 1) {
  const problemType = inputLineList[0]![problemIndex];
  let value = parseInt(inputLineList[1]![problemIndex]!, 10);
  for (let numberIndex = 2; numberIndex < inputLineList.length; numberIndex += 1) {
    const nextValue = parseInt(inputLineList[numberIndex]![problemIndex]!, 10);
    if (problemType === "+") {
      value += nextValue;
    } else if (problemType === "*") {
      value *= nextValue;
    }
  }
  sum += value;
}

logResult(sum);

logBenchmark(performance.now());
