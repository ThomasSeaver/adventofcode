const { grabText } = require("../../utils/grab-text");
const sample = grabText(`${__dirname}/s.txt`);
const actual = grabText(`${__dirname}/i.txt`);

const handleGameSet = (gameSet) => {
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

console.log("sample", handleGameSet(sample));
console.log("actual", handleGameSet(actual));
