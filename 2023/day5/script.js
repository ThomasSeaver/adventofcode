const { logBenchmarkTimes } = require("../../utils/benchmark");
const { grabText } = require("../../utils/grab-text");
const sample = grabText(`${__dirname}/s.txt`);
const actual = grabText(`${__dirname}/i.txt`);

const parseMap = (mapString) => {
  const [destinationRangeStart, sourceRangeStart, rangeLength] = mapString.split(" ").map((value) => BigInt(value));
  return {
    destinationRangeStart,
    sourceRangeStart,
    mapRangeLength: rangeLength,
    rangeLength,
    destinationRangeEnd: destinationRangeStart + rangeLength,
    sourceRangeEnd: sourceRangeStart + rangeLength,
    mapShift: destinationRangeStart - sourceRangeStart,
  };
};

const handleInputPartOne = (input) => {
  const inputGroups = input.split("\n\n");
  const seeds = inputGroups[0]
    .split(": ")[1]
    .split(" ")
    .map((seed) => BigInt(seed));
  const seedSoilMap = inputGroups[1]
    .split(":\n")[1]
    .split("\n")
    .map((mapValue) => parseMap(mapValue));
  const soilFertilizerMap = inputGroups[2]
    .split(":\n")[1]
    .split("\n")
    .map((mapValue) => parseMap(mapValue));
  const fertilizerWaterMap = inputGroups[3]
    .split(":\n")[1]
    .split("\n")
    .map((mapValue) => parseMap(mapValue));
  const waterLightMap = inputGroups[4]
    .split(":\n")[1]
    .split("\n")
    .map((mapValue) => parseMap(mapValue));
  const lightTemperatureMap = inputGroups[5]
    .split(":\n")[1]
    .split("\n")
    .map((mapValue) => parseMap(mapValue));
  const temperatureHumidityMap = inputGroups[6]
    .split(":\n")[1]
    .split("\n")
    .map((mapValue) => parseMap(mapValue));
  const humidityLocationMap = inputGroups[7]
    .split(":\n")[1]
    .split("\n")
    .map((mapValue) => parseMap(mapValue));

  const locations = [];

  for (const seed of seeds) {
    let value = seed;
    for (const map of seedSoilMap) {
      const { destinationRangeStart, rangeLength, sourceRangeStart } = map;
      if (value >= sourceRangeStart && value <= sourceRangeStart + rangeLength) {
        value = destinationRangeStart + (value - sourceRangeStart);
        break;
      }
    }
    for (const map of soilFertilizerMap) {
      const { destinationRangeStart, rangeLength, sourceRangeStart } = map;
      if (value >= sourceRangeStart && value <= sourceRangeStart + rangeLength) {
        value = destinationRangeStart + (value - sourceRangeStart);
        break;
      }
    }
    for (const map of fertilizerWaterMap) {
      const { destinationRangeStart, rangeLength, sourceRangeStart } = map;
      if (value >= sourceRangeStart && value <= sourceRangeStart + rangeLength) {
        value = destinationRangeStart + (value - sourceRangeStart);
        break;
      }
    }
    for (const map of waterLightMap) {
      const { destinationRangeStart, rangeLength, sourceRangeStart } = map;
      if (value >= sourceRangeStart && value <= sourceRangeStart + rangeLength) {
        value = destinationRangeStart + (value - sourceRangeStart);
        break;
      }
    }
    for (const map of lightTemperatureMap) {
      const { destinationRangeStart, rangeLength, sourceRangeStart } = map;
      if (value >= sourceRangeStart && value <= sourceRangeStart + rangeLength) {
        value = destinationRangeStart + (value - sourceRangeStart);
        break;
      }
    }
    for (const map of temperatureHumidityMap) {
      const { destinationRangeStart, rangeLength, sourceRangeStart } = map;
      if (value >= sourceRangeStart && value <= sourceRangeStart + rangeLength) {
        value = destinationRangeStart + (value - sourceRangeStart);
        break;
      }
    }
    for (const map of humidityLocationMap) {
      const { destinationRangeStart, rangeLength, sourceRangeStart } = map;
      if (value >= sourceRangeStart && value <= sourceRangeStart + rangeLength) {
        value = destinationRangeStart + (value - sourceRangeStart);
        break;
      }
    }
    locations.push(value);
  }
  locations.sort((a, b) => {
    if (a > b) {
      return 1;
    } else if (a < b) {
      return -1;
    } else {
      return 0;
    }
  });

  return locations[0];
};

const handleInputPartTwo = (input) => {
  const inputGroups = input.split("\n\n");
  const seeds = inputGroups[0]
    .split(": ")[1]
    .split(" ")
    .map((seed) => BigInt(seed));
  const seedSoilMap = inputGroups[1]
    .split(":\n")[1]
    .split("\n")
    .map((mapValue) => parseMap(mapValue));
  const soilFertilizerMap = inputGroups[2]
    .split(":\n")[1]
    .split("\n")
    .map((mapValue) => parseMap(mapValue));
  const fertilizerWaterMap = inputGroups[3]
    .split(":\n")[1]
    .split("\n")
    .map((mapValue) => parseMap(mapValue));
  const waterLightMap = inputGroups[4]
    .split(":\n")[1]
    .split("\n")
    .map((mapValue) => parseMap(mapValue));
  const lightTemperatureMap = inputGroups[5]
    .split(":\n")[1]
    .split("\n")
    .map((mapValue) => parseMap(mapValue));
  const temperatureHumidityMap = inputGroups[6]
    .split(":\n")[1]
    .split("\n")
    .map((mapValue) => parseMap(mapValue));
  const humidityLocationMap = inputGroups[7]
    .split(":\n")[1]
    .split("\n")
    .map((mapValue) => parseMap(mapValue));

  const maps = [
    seedSoilMap,
    soilFertilizerMap,
    fertilizerWaterMap,
    waterLightMap,
    lightTemperatureMap,
    temperatureHumidityMap,
    humidityLocationMap,
  ];
  let inputRanges = [];

  for (let seedIndex = 0; seedIndex < seeds.length; seedIndex += 2) {
    inputRanges.push({
      inputRangeStart: seeds[seedIndex],
      inputRangeLength: seeds[seedIndex + 1],
      inputRangeEnd: seeds[seedIndex] + seeds[seedIndex + 1],
    });
  }

  // general solution strategy:
  // iterate across maps => push ranges through map ranges, splitting as necessary
  for (const map of maps) {
    let outputRanges = [];
    // iterate across ranges; new input ranges can be created if an input range gets split by a mapping
    for (let inputRangeIndex = 0; inputRangeIndex < inputRanges.length; inputRangeIndex += 1) {
      const { inputRangeLength, inputRangeStart, inputRangeEnd } = inputRanges[inputRangeIndex];
      // by default unless it falls through a mapping, the range is mapped to the same integers
      let outputRange = { inputRangeLength, inputRangeStart, inputRangeEnd };
      // iterate across mapping, check if input range intersects
      for (const {
        sourceRangeStart,
        destinationRangeStart,
        mapRangeLength,
        destinationRangeEnd,
        sourceRangeEnd,
        mapShift,
      } of map) {
        // find where intersection would exist
        const intersectionStart = sourceRangeStart < inputRangeStart ? inputRangeStart : sourceRangeStart;
        const intersectionEnd = sourceRangeEnd < inputRangeEnd ? sourceRangeEnd : inputRangeEnd;
        const intersectionLength = intersectionEnd - intersectionStart;

        // if there is no intersection, continue
        if (intersectionLength <= 0) {
          continue;
        }

        // Otherwise this intersection becomes the output range, except shifted into the destination space
        outputRange = {
          inputRangeStart: intersectionStart + mapShift,
          inputRangeEnd: intersectionEnd + mapShift,
          inputRangeLength: intersectionLength,
        };

        // Check for uncaptured input range before intersection
        if (intersectionStart > inputRangeStart) {
          const rangeBeforeIntersection = {
            inputRangeStart,
            inputRangeEnd: intersectionStart,
            inputRangeLength: intersectionStart - inputRangeStart,
          };
          inputRanges.push(rangeBeforeIntersection);
        }

        // Check for uncaptured input range after intersection
        if (intersectionEnd < inputRangeEnd) {
          const rangeAfterIntersection = {
            inputRangeStart: intersectionEnd,
            inputRangeEnd,
            inputRangeLength: inputRangeEnd - intersectionEnd,
          };
          inputRanges.push(rangeAfterIntersection);
        }

        // At this point our business searching for maps for this range is done
        break;
      }
      outputRanges.push(outputRange);
    }
    inputRanges = outputRanges;
  }

  inputRanges.sort((a, b) => {
    if (a.inputRangeStart > b.inputRangeStart) {
      return 1;
    } else if (a.inputRangeStart < b.inputRangeStart) {
      return -1;
    } else {
      return 0;
    }
  });

  return inputRanges[0].inputRangeStart;
};

logBenchmarkTimes([
  { name: `p1: sample`, func: () => handleInputPartOne(sample) },
  { name: `p1: actual`, func: () => handleInputPartOne(actual) },
  { name: `p2: sample`, func: () => handleInputPartTwo(sample) },
  { name: `p2: actual`, func: () => handleInputPartTwo(actual) },
]);
