const { logBenchmarkTimes } = require("../../utils/benchmark");
const { grabText } = require("../../utils/grab-text");
const sample = grabText(`${__dirname}/s.txt`);
const actual = grabText(`${__dirname}/i.txt`);

const maxRed = 12;
const maxGreen = 13;
const maxBlue = 14;

const handleInputPartOne = (gameSet) => {
  const games = gameSet.split("\n");
  let sumId = 0;
  for (const game of games) {
    let possibleGame = true;
    const [gameId, gameData] = game.split(":");
    const idNumber = parseInt(gameId.split(" ")[1]);
    const cubeSets = gameData.split(";").map((cubeSet) =>
      cubeSet
        .trim()
        .split(", ")
        .map((revealedData) => {
          const [number, color] = revealedData.split(" ");
          return [parseInt(number), color];
        })
    );

    for (const cubeSet of cubeSets) {
      for (const revealedData of cubeSet) {
        if (
          (revealedData[1] === "red" && maxRed < revealedData[0]) ||
          (revealedData[1] === "green" && maxGreen < revealedData[0]) ||
          (revealedData[1] === "blue" && maxBlue < revealedData[0])
        ) {
          possibleGame = false;
          break;
        }
      }
      if (!possibleGame) {
        break;
      }
    }
    if (possibleGame) {
      sumId += idNumber;
    }
  }
  return sumId;
};

const handleInputPartTwo = (gameSet) => {
  const games = gameSet.split("\n");
  let sumPower = 0;
  for (const game of games) {
    let maxRed = 0;
    let maxGreen = 0;
    let maxBlue = 0;
    const [, gameData] = game.split(":");
    const cubeSets = gameData.split(";").map((cubeSet) =>
      cubeSet
        .trim()
        .split(", ")
        .map((revealedData) => {
          const [number, color] = revealedData.split(" ");
          return [parseInt(number), color];
        })
    );

    for (const cubeSet of cubeSets) {
      for (const revealedData of cubeSet) {
        maxRed = revealedData[1] === "red" && revealedData[0] > maxRed ? revealedData[0] : maxRed;
        maxGreen = revealedData[1] === "green" && revealedData[0] > maxGreen ? revealedData[0] : maxGreen;
        maxBlue = revealedData[1] === "blue" && revealedData[0] > maxBlue ? revealedData[0] : maxBlue;
      }
    }
    sumPower += maxRed * maxBlue * maxGreen;
  }
  return sumPower;
};

logBenchmarkTimes([
  { name: `p1: sample`, func: () => handleInputPartOne(sample) },
  { name: `p1: actual`, func: () => handleInputPartOne(actual) },
  { name: `p2: sample`, func: () => handleInputPartTwo(sample) },
  { name: `p2: actual`, func: () => handleInputPartTwo(actual) },
]);
