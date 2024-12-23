import { logResult, readFile, logBenchmark } from "../util";
logBenchmark(performance.now());
const inputString = readFile(process.argv[2]);
const secretNumberList = inputString
  .split("\n")
  .map((secretNumber) => BigInt(secretNumber.trim()));

const priceListList = [];
for (let secretNumber of secretNumberList) {
  const priceList = [];
  for (
    let secretNumberTransformationIndex = 0;
    secretNumberTransformationIndex < 2000;
    secretNumberTransformationIndex += 1
  ) {
    const originalSecretNumber = secretNumber;
    const sixtyFourTimes = secretNumber * 64n;
    secretNumber = sixtyFourTimes ^ secretNumber;
    secretNumber = secretNumber % 16777216n;
    const thirtyTwoDivided = secretNumber / 32n;
    secretNumber = thirtyTwoDivided ^ secretNumber;
    secretNumber = secretNumber % 16777216n;
    const twentyFortyEightTimes = secretNumber * 2048n;
    secretNumber = twentyFortyEightTimes ^ secretNumber;
    secretNumber = secretNumber % 16777216n;
    priceList.push([
      secretNumber % 10n,
      (secretNumber % 10n) - (originalSecretNumber % 10n),
    ]);
  }
  priceListList.push(priceList);
}

const possibleSequences = new Set([
  ...priceListList[0].flatMap((value, index, list) =>
    index >= 3
      ? [
          `${list[index - 3][1]}|${list[index - 2][1]}|${list[index - 1][1]}|${
            value[1]
          }`,
        ]
      : []
  ),
  ...priceListList[1].flatMap((value, index, list) =>
    index >= 3
      ? [
          `${list[index - 3][1]}|${list[index - 2][1]}|${list[index - 1][1]}|${
            value[1]
          }`,
        ]
      : []
  ),
  ...priceListList[2].flatMap((value, index, list) =>
    index >= 3
      ? [
          `${list[index - 3][1]}|${list[index - 2][1]}|${list[index - 1][1]}|${
            value[1]
          }`,
        ]
      : []
  ),
  ...priceListList[3].flatMap((value, index, list) =>
    index >= 3
      ? [
          `${list[index - 3][1]}|${list[index - 2][1]}|${list[index - 1][1]}|${
            value[1]
          }`,
        ]
      : []
  ),
]);

let bestSum = 0;
for (const sequence of possibleSequences) {
  const [first, second, third, fourth] = sequence
    .split("|")
    .map((value) => BigInt(value));
  const sum = priceListList.reduce((previousSum, currentPriceList) => {
    return (
      previousSum +
      Number(
        currentPriceList.find(
          (currentPrice, currentPriceIndex) =>
            currentPriceIndex >= 3 &&
            currentPriceList[currentPriceIndex - 3][1] === first &&
            currentPriceList[currentPriceIndex - 2][1] === second &&
            currentPriceList[currentPriceIndex - 1][1] === third &&
            currentPriceList[currentPriceIndex][1] === fourth
        )?.[0] ?? 0
      )
    );
  }, 0);
  if (sum > bestSum) {
    bestSum = sum;
  }
}

logResult(bestSum);
logBenchmark(performance.now());
