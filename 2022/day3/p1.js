import { useInput } from "../util.js";

const decode = (letter) =>
  letter.charCodeAt(0) -
  (letter.charCodeAt(0) < 97 /* is uppercase */ ? 38 : 96);

const handleInput = (input) => {
  const sums = [];
  let sum = 0;
  for (const line of input) {
    const compartmentA = line.slice(0, line.length / 2).split("");
    const compartmentB = line.slice(line.length / 2).split("");

    for (const letter of compartmentA) {
      if (compartmentB.includes(letter)) {
        sum += decode(letter);
        break;
      }
    }
  }
  sums.push(sum);

  sum = 0;
  for (let groupIndex = 0; groupIndex < input.length; groupIndex += 3) {
    const elfA = input[groupIndex].split("");
    const elfB = input[groupIndex + 1].split("");
    const elfC = input[groupIndex + 2].split("");

    for (const letter of elfA) {
      if (elfB.includes(letter) && elfC.includes(letter)) {
        sum += decode(letter);
        break;
      }
    }
  }
  sums.push(sum);

  return sums;
};

console.log("example outcome", handleInput(useInput("e.txt")));

console.log("real outcome", handleInput(useInput()));
