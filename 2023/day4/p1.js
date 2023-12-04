const { grabText } = require("../../utils/grab-text");
const sample = grabText(`${__dirname}/s.txt`);
const actual = grabText(`${__dirname}/i.txt`);


const handleInput = (input) => {
  let sum = 0;
  const scratchCardSets = input.split("\n").map((row) => row.split(': '  )[1].split(' | ').map((cardSet) => cardSet.split(' ').flatMap((value) => Number.isInteger(parseInt(value)) ? [parseInt(value)] : [])));

  for (const scratchCardSet of scratchCardSets) {
    const [winningCards, ownedCards] = scratchCardSet;
    const ownedWinningCards = ownedCards.filter((ownedCard) => {
      for (const winningCard of winningCards) {
        if (ownedCard == winningCard) {
          return true;
        }
      }
      return false;
    });
    sum += ownedWinningCards.length > 0 ? 2 ** (ownedWinningCards.length - 1) : 0;
  }
  return sum;
};

console.log("sample", handleInput(sample));
console.log("actual", handleInput(actual));
