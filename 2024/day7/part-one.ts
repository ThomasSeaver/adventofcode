import { logResult, logDebug, readFile, logBenchmark } from "../util";
logBenchmark(performance.now());
const inputString = readFile(process.argv[2]);
const equations = inputString.split("\n").map((inputRow) => {
  const split = inputRow.split(": ");
  return [
    parseInt(split[0]),
    split[1]
      .split(" ")
      .map((value) => parseInt(value))
      .reverse(),
  ];
}) as [number, number[]][];

const equationCheck = (
  expectedValue: number,
  numberList: number[]
): boolean => {
  const [currentNumber, ...remainingNumberList] = numberList;
  if (remainingNumberList.length === 0) {
    return currentNumber === expectedValue;
  }
  return (
    equationCheck(expectedValue - currentNumber, remainingNumberList) ||
    (expectedValue % currentNumber === 0
      ? equationCheck(expectedValue / currentNumber, remainingNumberList)
      : false)
  );
};
logDebug(equations);

logResult(
  equations
    .filter((equation) => equationCheck(equation[0], equation[1]))
    .reduce((previous, current) => previous + current[0], 0)
);

logBenchmark(performance.now());
