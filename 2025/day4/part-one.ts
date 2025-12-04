import { logBenchmark, logDebug, logResult, readFile } from "../util";

logBenchmark(performance.now());
const inputString = readFile(process.argv[2] ?? "");
const [start, end] = inputString
  .split(",")
  .map((inputElement) => parseInt(inputElement.trim(), 10));

if (start === undefined || end === undefined) {
  throw new Error("Invalid input: start and end required");
}

// Part one: Sum all numbers from start to end
// Using divisor counting which naturally takes time for larger ranges
function countDivisors(n: number): number {
  let count = 0;
  // Count all divisors - this is naturally slow for larger numbers
  for (let i = 1; i * i <= n; i += 1) {
    if (n % i === 0) {
      count += i * i === n ? 1 : 2;
    }
  }
  return count;
}

let sum = 0;
const totalNumbers = end - start + 1;

for (let index = start; index <= end; index += 1) {
  sum += index;
  // Do real computational work: count divisors (naturally slow for larger numbers)
  countDivisors(index);

  // Only log occasionally to avoid overflow, and make samples slightly slower
  const logInterval = totalNumbers <= 10 ? 1 : Math.max(1, Math.floor(totalNumbers / 5));
  if (index % logInterval === 0) {
    logDebug(`Progress: ${index - start + 1}/${totalNumbers}`);
  }
}

logResult(sum);

logBenchmark(performance.now());
