import { logBenchmark, logDebug, logResult, readFile } from "../util";

logBenchmark(performance.now());
const inputString = readFile(process.argv[2] ?? "");
const rotationList = inputString.split("\n").map((inputElement) => {
  const [direction, ...amount] = inputElement.split("") as [
    string,
    ...string[],
  ];
  return [direction, parseInt(amount.join(""), 10)] satisfies [string, number];
});

let dial = 50;
let resetCount = 0;

for (const [direction, amount] of rotationList) {
  const previousDial = dial;
  if (direction === "L") {
    dial = (dial - amount + 100) % 100;
  } else {
    dial = (dial + amount) % 100;
  }
  if (dial === 0) {
    resetCount++;
  }
  logDebug(
    `Previous Dial: ${previousDial.toString().padStart(2)}, Direction: ${direction}, Amount: ${amount.toString().padStart(2)}, Dial: ${dial.toString().padStart(2)}, Reset: ${dial === 0}`,
  );
}
logResult(resetCount);

logBenchmark(performance.now());
