import { useInput } from "../util.js";

let rocks = [
  ["####"],
  [".#.", "###", ".#."],
  ["###", "..#", "..#"],
  ["#", "#", "#", "#"],
  ["##", "##"],
];

let constructedRocks = rocks.map((rock) => {
  const indexedRock = [];
  for (let yIndex = 0; yIndex < rock.length; yIndex += 1) {
    for (let xIndex = 0; xIndex < rock[yIndex].length; xIndex += 1) {
      if (rock[yIndex].charAt(xIndex) === "#")
        indexedRock.push([xIndex, yIndex]);
    }
  }
  return indexedRock;
});

const parseInput = (input) => input[0].split("");

let chamber = [];

for (let i = 0; i < 3; i += 1) {
  let row = [];
  for (let j = 0; j < 7; j += 1) {
    row.push(0);
  }
  chamber.push(row);
}

let highestFloor = 0;
let rockPresent = false;
let rockIndex = 0;

const handleInput = async (input) => {
  const res = [];

  const jets = parseInput(input);

  for (const jet of jets) {
    console.log(rockPresent);
    if (!rockPresent) {
      const currentRock = constructedRocks[rockIndex % constructedRocks.length];
      const chamberHeightDifference =
        highestFloor +
        3 +
        rocks[rockIndex % constructedRocks.length].length -
        chamber.length;
      rockIndex += 1;
      console.log(chamberHeightDifference);
      for (let i = 0; i < chamberHeightDifference; i += 1) {
        chamber.unshift([0, 0, 0, 0, 0, 0, 0]);
      }
      for (const rockPiece of currentRock) {
        chamber[rockPiece[1]][rockPiece[0] + 2] = 2;
      }
      rockPresent = true;
    }

    // fall down
    const oldCopy = structuredClone(chamber);
    let foundEnd = false;
    for (let row = chamber.length - 1; row > -1; row -= 1) {
      for (let column = 0; column < chamber[row].length; column += 1) {
        const value = chamber[row][column];
        if (value === 2) {
          if (row + 1 === chamber.length || chamber[row + 1][column] !== 0) {
            foundEnd = true;
            highestFloor = row;
            break;
          }
          chamber[row][column] = 0;
          chamber[row + 1][column] = 3;
        }
      }
      if (foundEnd) break;
    }
    console.log(foundEnd);
    if (foundEnd) {
      chamber = oldCopy.map((row) =>
        row.map((column) => (column != 0 ? 1 : 0))
      );
      rockPresent = false;
    } else {
      chamber = chamber.map((row) =>
        row.map((column) => (column === 3 ? 2 : column))
      );
    }

    console.log(
      chamber
        .map((row) => row.map((column) => (column === 0 ? "." : "@")).join(""))
        .join("\n"),
      "\n-------",
      "\n"
    );
  }

  return res;
};

console.log("example outcome", ...(await handleInput(useInput("e.txt"))));
//console.log("real outcome", ...(await handleInput(useInput("i.txt"))));
