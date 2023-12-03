import { useInput } from "../util.js";

const parseInput = (input) => {
  const sensorBeaconPairs = [];

  for (const line of input) {
    const match = line.match(/x=(-?\d+),\s*y=(-?\d+)/g);
    const positions = match.map((position) =>
      position.split(",").map((coord) => parseInt(coord.split("=")[1]))
    );
    sensorBeaconPairs.push(positions);
  }

  return sensorBeaconPairs;
};

const getSensorCoverage = (sensorBeaconPairs, yValue) => {
  const coverages = [];

  for (const [[sensorX, sensorY], [beaconX, beaconY]] of sensorBeaconPairs) {
    const sensorRadius =
      Math.abs(sensorX - beaconX) + Math.abs(sensorY - beaconY);
    const yDistance = Math.abs(sensorY - yValue);
    const widthAtY = sensorRadius - yDistance;
    const coverage = [sensorX - widthAtY, sensorX + widthAtY];
    if (widthAtY > 0) coverages.push(coverage);
  }

  coverages.sort((coverageA, coverageB) => coverageA[0] - coverageB[0]);

  for (let i = 0; i < coverages.length - 1; i += 1) {
    const [a, b] = coverages[i];
    const [c, d] = coverages[i + 1];

    // Check for no interconnection
    if (b < c - 1) continue;

    if ((c <= b && b <= d) || b == c - 1) coverages[i][1] = d;

    // Pop out extra coverage, reset
    coverages.splice(i + 1, 1);
    i -= 1;
  }

  return coverages;
};

const handleInput = async (input, size) => {
  const res = [];

  const sensorBeaconPairs = parseInput(input);

  const coverage = [
    getSensorCoverage(sensorBeaconPairs, 10),
    getSensorCoverage(sensorBeaconPairs, 2000000),
  ];

  const spotsCovered = coverage.map((coverageSet) =>
    coverageSet.reduce(
      (previous, current) => previous + current[1] - current[0],
      0
    )
  );

  res.push(...spotsCovered);

  for (let y = 0; y <= size; y += 1) {
    const coverage = getSensorCoverage(sensorBeaconPairs, y);
    if (coverage.length > 1) {
      res.push((coverage[0][1] + 1) * 4000000 + y);
      break;
    }
  }

  return res;
};

console.log("example outcome", ...(await handleInput(useInput("e.txt"), 20)));
console.log("real outcome", ...(await handleInput(useInput("i.txt"), 4000000)));
