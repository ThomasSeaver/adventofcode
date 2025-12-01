import { logBenchmark, logDebug, logResult, readFile } from "../util";

logBenchmark(performance.now());
const inputString = readFile(process.argv[2] ?? "");
const [start, end] = inputString
  .split(",")
  .map((inputElement) => parseInt(inputElement.trim(), 10));

if (start === undefined || end === undefined) {
  throw new Error("Invalid input: start and end required");
}

// Part two: Product of all numbers from start to end
// Using prime factorization for each number - naturally takes more time
function getPrimeFactors(n: number): number[] {
  const factors: number[] = [];
  let d = 2;
  while (d * d <= n) {
    while (n % d === 0) {
      factors.push(d);
      n /= d;
    }
    d += 1;
  }
  if (n > 1) factors.push(n);
  return factors;
}

let product = 1;
const totalNumbers = end - start + 1;
// Use modulo to prevent overflow for large ranges
const MOD = 1000000007;

for (let index = start; index <= end; index += 1) {
  // Do real computational work: factorize each number (naturally slow for larger numbers)
  getPrimeFactors(index);
  // Use modulo to prevent overflow while still doing the computation
  product = (product * index) % MOD;

  // Only log occasionally to avoid overflow, and make samples slightly slower
  const logInterval =
    totalNumbers <= 10 ? 1 : Math.max(1, Math.floor(totalNumbers / 5));
  if (index % logInterval === 0) {
    logDebug(`Progress: ${index - start + 1}/${totalNumbers}`);
  }
}

// For small ranges, calculate actual product; for large ranges, use modulo result
const result =
  totalNumbers <= 20
    ? Array.from({ length: totalNumbers }, (_, i) => start + i).reduce(
        (acc, n) => acc * n,
        1,
      )
    : product;
logResult(result);

logBenchmark(performance.now());
