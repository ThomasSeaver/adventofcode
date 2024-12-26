import { logResult, readFile, logBenchmark } from "../util";
logBenchmark(performance.now());
const inputString = readFile(process.argv[2]);
const [wireList, gateStringList] = inputString
  .split("\n\n")
  .map((inputSet) => inputSet.split("\n"));

const wireMap: Record<string, number> = {};
for (const [wireKey, wireValue] of wireList.map((wireString) =>
  wireString.split(": ")
)) {
  wireMap[wireKey] = parseInt(wireValue);
}

const gateList = gateStringList.map((gateString) => {
  const [inputGateString, outputWire] = gateString.split(" -> ");
  const [wireA, gateType, wireB] = inputGateString.split(" ");
  return { wireA, gateType, wireB, outputWire };
});

while (gateList.length > 0) {
  const gateObject = gateList.shift()!;
  const { wireA, wireB, gateType, outputWire } = gateObject;
  if (wireMap[wireA] == null || wireMap[wireB] == null) {
    gateList.push(gateObject);
    continue;
  }
  if (gateType === "AND") {
    wireMap[outputWire] = wireMap[wireA] === 1 && wireMap[wireB] === 1 ? 1 : 0;
  } else if (gateType === "OR") {
    wireMap[outputWire] = wireMap[wireA] === 1 || wireMap[wireB] === 1 ? 1 : 0;
  } else {
    wireMap[outputWire] =
      (wireMap[wireA] === 1 && wireMap[wireB] === 0) ||
      (wireMap[wireA] === 0 && wireMap[wireB] === 1)
        ? 1
        : 0;
  }
}

logResult(
  parseInt(
    Object.entries(wireMap)
      .filter(([key]) => key.startsWith("z"))
      .sort(([keyA], [keyB]) => keyB.localeCompare(keyA))
      .map(([, value]) => value)
      .join(""),
    2
  )
);

logBenchmark(performance.now());
