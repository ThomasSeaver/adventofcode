const { grabText } = require("../../utils/grab-text");
const sample = grabText(`${__dirname}/s.txt`);
const actual = grabText(`${__dirname}/i.txt`);

const maxRed = 12;
const maxGreen = 13;
const maxBlue = 14;

const handleGameSet = (gameSet) => {
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

console.log("sample", handleGameSet(sample));
console.log("actual", handleGameSet(actual));
