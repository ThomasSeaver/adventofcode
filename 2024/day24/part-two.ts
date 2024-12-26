import { logResult, readFile, logBenchmark, logDebug } from "../util";
logBenchmark(performance.now());
const inputString = readFile(process.argv[2]);
const [wireList, gateStringList] = inputString
  .split("\n\n")
  .map((inputSet) => inputSet.split("\n"));

// Compose static wire values
const wireMap: Record<string, number> = {};
for (const [wireKey, wireValue] of wireList.map((wireString) =>
  wireString.split(": ")
)) {
  wireMap[wireKey] = parseInt(wireValue);
}

// Parse gates and add info
const originalGateList = gateStringList.map((gateString) => {
  const [inputGateString, outputWire] = gateString.split(" -> ");
  const [wireA, gateType, wireB] = inputGateString.split(" ");
  return { wireA, gateType, wireB, outputWire };
});

// Set up initial data and function for bumping which gates we swap
let gateList = [...originalGateList.map((gateData) => ({ ...gateData }))];
let xBinaryValue, yBinaryValue, zBinaryValue, swappedGateList;
let swapList = gateList.length === 6 ? [0, 1, 2, 3] : [0, 1, 2, 3, 4, 5, 6, 7];
const handleBump = (
  array: number[],
  bumpingIndex: number,
  sourceArrayLength: number
) => {
  if (
    array[bumpingIndex] <
    sourceArrayLength - 1 - (array.length - bumpingIndex - 1)
  ) {
    array[bumpingIndex] += 1;
    return array;
  }
  array = handleBump(array, bumpingIndex - 1, sourceArrayLength);
  array[bumpingIndex] = array[bumpingIndex - 1] + 1;
  return array;
};

// Repeat swapping until our binary values align
do {
  // Create list of indices to try swapping
  const swapSetList = [];
  for (let i = 0; i < swapList.length; i += 1) {
    for (let j = 0; j < swapList.length; j += 1) {
      for (let k = 0; k < swapList.length; k += 1) {
        for (let l = 0; l < swapList.length; l += 1) {
          if (gateList.length === 6) {
            if (new Set([i, j, k, l]).size === 4 && i < k && i < j && k < l) {
              swapSetList.push([
                swapList[i],
                swapList[j],
                swapList[k],
                swapList[l],
              ]);
            }
            continue;
          }
          for (let m = 0; m < swapList.length; m += 1) {
            for (let n = 0; n < swapList.length; n += 1) {
              for (let o = 0; o < swapList.length; o += 1) {
                for (let p = 0; p < swapList.length; p += 1) {
                  if (new Set([i, j, k, l, m, n, o, p]).size === 8) {
                    if (
                      new Set([i, j, k, l, m, n, o, p]).size === 8 &&
                      i < j &&
                      k < l &&
                      m < n &&
                      o < p &&
                      i < j &&
                      k < m &&
                      m < o
                    ) {
                      swapSetList.push([
                        swapList[i],
                        swapList[j],
                        swapList[k],
                        swapList[l],
                        swapList[m],
                        swapList[n],
                        swapList[o],
                        swapList[p],
                      ]);
                    }
                    continue;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  logDebug(swapSetList);

  // Swap output wires
  for (const swapSet of swapSetList) {
    swappedGateList = [];
    gateList = [...originalGateList.map((gateData) => ({ ...gateData }))];
    for (let swapIndex = 0; swapIndex < swapSet.length; swapIndex += 2) {
      const gateIndexA = swapSet[swapIndex];
      const gateIndexB = swapSet[swapIndex + 1];

      const temp = gateList[gateIndexA].outputWire;
      gateList[gateIndexA].outputWire = gateList[gateIndexB].outputWire;
      gateList[gateIndexB].outputWire = temp;
      swappedGateList.push(
        gateList[gateIndexA].outputWire,
        gateList[gateIndexB].outputWire
      );
    }

    // Process gates until no more gates
    while (gateList.length > 0) {
      const gateObject = gateList.shift()!;
      const { wireA, wireB, gateType, outputWire } = gateObject;
      if (wireMap[wireA] == null || wireMap[wireB] == null) {
        gateList.push(gateObject);
        continue;
      }
      if (gateType === "AND") {
        wireMap[outputWire] =
          wireMap[wireA] === 1 && wireMap[wireB] === 1 ? 1 : 0;
      } else if (gateType === "OR") {
        wireMap[outputWire] =
          wireMap[wireA] === 1 || wireMap[wireB] === 1 ? 1 : 0;
      } else {
        wireMap[outputWire] =
          (wireMap[wireA] === 1 && wireMap[wireB] === 0) ||
          (wireMap[wireA] === 0 && wireMap[wireB] === 1)
            ? 1
            : 0;
      }
    }

    // Calculate values
    xBinaryValue = parseInt(
      Object.entries(wireMap)
        .filter(([key]) => key.startsWith("x"))
        .sort(([keyA], [keyB]) => keyB.localeCompare(keyA))
        .map(([, value]) => value)
        .join(""),
      2
    );
    yBinaryValue = parseInt(
      Object.entries(wireMap)
        .filter(([key]) => key.startsWith("y"))
        .sort(([keyA], [keyB]) => keyB.localeCompare(keyA))
        .map(([, value]) => value)
        .join(""),
      2
    );
    zBinaryValue = parseInt(
      Object.entries(wireMap)
        .filter(([key]) => key.startsWith("z"))
        .sort(([keyA], [keyB]) => keyB.localeCompare(keyA))
        .map(([, value]) => value)
        .join(""),
      2
    );
    if (((xBinaryValue ?? 0) & (yBinaryValue ?? 0)) == zBinaryValue) {
      break;
    }
  }

  gateList = [...originalGateList.map((gateData) => ({ ...gateData }))];
  swapList = handleBump(swapList, swapList.length - 1, gateList.length);
} while (((xBinaryValue ?? 0) & (yBinaryValue ?? 0)) != zBinaryValue);

logResult((swappedGateList ?? []).sort().join(","));

logBenchmark(performance.now());
