const { grabText } = require("../../utils/grab-text");
const sample = grabText(`${__dirname}/s.txt`);
const actual = grabText(`${__dirname}/i.txt`);


const handleInput = (input) => {
  const scratchCardSets = input.split("\n").map((row) => [...row.split(': '  )[1].split(' | ').map((cardSet) => cardSet.split(' ').flatMap((value) => Number.isInteger(parseInt(value)) ? [parseInt(value)] : [])), 1]);
  for (let scratchCardIndex = 0; scratchCardIndex < scratchCardSets.length; scratchCardIndex += 1) {
    const [winningCards, ownedCards, cardInstanceCount] = scratchCardSets[scratchCardIndex];
    const ownedWinningCards = ownedCards.filter((ownedCard) => {
      for (const winningCard of winningCards) {
        if (ownedCard == winningCard) {
          return true;
        }
      }
      return false;
    });
    for (let duplicateIndex = scratchCardIndex + 1; duplicateIndex <= scratchCardIndex + ownedWinningCards.length; duplicateIndex += 1) {
      scratchCardSets[duplicateIndex][2] += cardInstanceCount;
    }
  }
  return scratchCardSets.map((set) => set[2]).reduce((prev, cur) => prev += cur, 0);
};

console.log("sample", handleInput(sample));
console.log("actual", handleInput(actual));
