const { logBenchmarkTimes } = require("../../utils/benchmark");
const { grabText } = require("../../utils/grab-text");
const sample = grabText(`${__dirname}/s.txt`);
const actual = grabText(`${__dirname}/i.txt`);

const handleInputPartOne = (input) => {
  let sum = 0;
  const scratchCardSets = input.split("\n").map((row) =>
    row
      .split(": ")[1]
      .split(" | ")
      .map((cardSet) =>
        cardSet.split(" ").flatMap((value) => (Number.isInteger(parseInt(value)) ? [parseInt(value)] : []))
      )
  );

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
const handleInputPartTwo = (input) => {
  const scratchCardSets = input.split("\n").map((row) => [
    ...row
      .split(": ")[1]
      .split(" | ")
      .map((cardSet) =>
        cardSet.split(" ").flatMap((value) => (Number.isInteger(parseInt(value)) ? [parseInt(value)] : []))
      ),
    1,
  ]);
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
    for (
      let duplicateIndex = scratchCardIndex + 1;
      duplicateIndex <= scratchCardIndex + ownedWinningCards.length;
      duplicateIndex += 1
    ) {
      scratchCardSets[duplicateIndex][2] += cardInstanceCount;
    }
  }
  return scratchCardSets.map((set) => set[2]).reduce((prev, cur) => (prev += cur), 0);
};

logBenchmarkTimes([
  { name: `p1: sample`, func: () => handleInputPartOne(sample) },
  { name: `p1: actual`, func: () => handleInputPartOne(actual) },
  { name: `p2: sample`, func: () => handleInputPartTwo(sample) },
  { name: `p2: actual`, func: () => handleInputPartTwo(actual) },
]);
