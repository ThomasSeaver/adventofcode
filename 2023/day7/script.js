const { grabText } = require("../../utils/grab-text");
const sample = grabText(`${__dirname}/s.txt`);
const actual = grabText(`${__dirname}/i.txt`);

const labels = "A, K, Q, J, T, 9, 8, 7, 6, 5, 4, 3, 2".split(", ");
const handTypes = ["fivekind", "fourkind", "fullhouse", "threekind", "twopair", "onepair", "highcard"];

const handleInputPartOne = (input) => {
  const hands = input.split("\n").map((hand) => hand.split(" "));
  const handsMapped = hands.map(([hand, bid]) => {
    const cards = hand.split("");
    const labelCount = labels.map((label) => cards.filter((card) => card === label).length).sort((a, b) => b - a);
    if (labelCount[0] === 5) {
      return [cards, "fivekind", bid];
    }
    if (labelCount[0] === 4) {
      return [cards, "fourkind", bid];
    }
    if (labelCount[0] === 3 && labelCount[1] === 2) {
      return [cards, "fullhouse", bid];
    }
    if (labelCount[0] === 3) {
      return [cards, "threekind", bid];
    }
    if (labelCount[0] === 2 && labelCount[1] === 2) {
      return [cards, "twopair", bid];
    }
    if (labelCount[0] === 2) {
      return [cards, "onepair", bid];
    }
    return [cards, "highcard", bid];
  });
  handsMapped.sort((handA, handB) => {
    const typeRank =
      handTypes.findIndex((handType) => handType === handA[1]) -
      handTypes.findIndex((handType) => handType === handB[1]);
    if (typeRank != 0) {
      return typeRank;
    }
    for (let cardIndex = 0; cardIndex < 5; cardIndex += 1) {
      const cardRank =
        labels.findIndex((label) => label === handA[0][cardIndex]) -
        labels.findIndex((label) => label === handB[0][cardIndex]);
      if (cardRank != 0) {
        return cardRank;
      }
    }
    return 0;
  });
  handsMapped.reverse();
  return handsMapped.reduce((previous, current, index) => previous + parseInt(current[2]) * (index + 1), 0);
};

const labelsP2 = "A, K, Q, T, 9, 8, 7, 6, 5, 4, 3, 2, J".split(", ");

const handleInputPartTwo = (input) => {
  const hands = input.split("\n").map((hand) => hand.split(" "));
  const handsMapped = hands.map(([hand, bid]) => {
    const cards = hand.split("");
    const labelCount = labelsP2
      .slice(0, 12)
      .map((label) => cards.filter((card) => card === label).length)
      .sort((a, b) => b - a);
    const jokerCount = cards.filter((card) => card === "J").length;
    if (labelCount[0] + jokerCount === 5) {
      return [cards, "fivekind", bid];
    }
    if (labelCount[0] + jokerCount === 4) {
      return [cards, "fourkind", bid];
    }
    if (labelCount[0] + jokerCount === 3 && labelCount[1] === 2) {
      return [cards, "fullhouse", bid];
    }
    if (labelCount[0] + jokerCount === 3) {
      return [cards, "threekind", bid];
    }
    if (labelCount[0] + jokerCount === 2 && labelCount[1] === 2) {
      return [cards, "twopair", bid];
    }
    if (labelCount[0] + jokerCount === 2) {
      return [cards, "onepair", bid];
    }
    return [cards, "highcard", bid];
  });
  handsMapped.sort((handA, handB) => {
    const typeRank =
      handTypes.findIndex((handType) => handType === handA[1]) -
      handTypes.findIndex((handType) => handType === handB[1]);
    if (typeRank != 0) {
      return typeRank;
    }
    for (let cardIndex = 0; cardIndex < 5; cardIndex += 1) {
      const cardRank =
        labelsP2.findIndex((label) => label === handA[0][cardIndex]) -
        labelsP2.findIndex((label) => label === handB[0][cardIndex]);
      if (cardRank != 0) {
        return cardRank;
      }
    }
    return 0;
  });
  handsMapped.reverse();
  return handsMapped.reduce((previous, current, index) => previous + parseInt(current[2]) * (index + 1), 0);
};
console.log("p1: sample", handleInputPartOne(sample));
console.log("p1: actual", handleInputPartOne(actual));
console.log("p2: sample", handleInputPartTwo(sample));
console.log("p2: actual", handleInputPartTwo(actual));
