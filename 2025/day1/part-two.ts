import { logBenchmark, logDebug, logResult, readFile } from "../util";

logBenchmark(performance.now());
const inputString = readFile(process.argv[2] ?? "");
const rotationList = inputString.split("\n").map((inputElement) => {
  const [direction, ...amount] = inputElement.split("") as [string, ...string[]];
  return [direction, parseInt(amount.join(""), 10)] satisfies [string, number];
});

let dial = 50;
let resetCount = 0;

for (const [direction, amount] of rotationList) {
  const rotationCount = Math.floor(amount / 100);
  const meaningfulDelta = amount % 100;

  const previousDial = dial;
  if (direction === "L") {
    dial = dial - meaningfulDelta;
  } else {
    dial = dial + meaningfulDelta;
  }

  const previousResetCount = resetCount;
  resetCount += rotationCount + ((previousDial !== 0 && dial <= 0) || 99 < dial ? 1 : 0);
  dial = (dial + 100) % 100;
  if (resetCount - previousResetCount > 0) {
    logDebug(
      ` Previous Dial: ${previousDial.toString().padStart(2)}, Direction: ${direction}, Amount: ${amount.toString().padStart(2)}, Dial: ${dial.toString().padStart(2)}, Resets: ${resetCount - previousResetCount}`,
    );
  }
}
logResult(resetCount);

logBenchmark(performance.now());
