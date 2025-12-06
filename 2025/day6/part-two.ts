import { logBenchmark, logDebug, logResult, readFile } from "../util";

logBenchmark(performance.now());
const inputString = readFile(process.argv[2] ?? "");
const inputLineList = inputString.split("\n").reverse();

let sum = 0;
let numberList: number[] = [];
let type = "";
for (let columnIndex = 0; columnIndex < inputLineList[0]!.length; columnIndex += 1) {
  let currentNumber = "";
  for (let rowIndex = 0; rowIndex < inputLineList.length; rowIndex += 1) {
    const currentValue = inputLineList[rowIndex]![columnIndex]!.trim();
    if (currentValue === "+" || currentValue === "*") {
      type = currentValue;
    } else {
      currentNumber += currentValue;
    }
  }
  if (currentNumber !== "") {
    numberList.push(parseInt(currentNumber.split("").reverse().join(""), 10));
  } else {
    sum +=
      type === "+"
        ? numberList.reduce((acc, curr) => acc + curr, 0)
        : numberList.reduce((acc, curr) => acc * curr, 1);
    numberList = [];
    type = "";
  }
}
sum +=
  type === "+"
    ? numberList.reduce((acc, curr) => acc + curr, 0)
    : numberList.reduce((acc, curr) => acc * curr, 1);

logResult(sum);

logBenchmark(performance.now());
