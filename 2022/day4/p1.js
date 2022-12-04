import { useInput } from "../util.js";

const decode = (letter) => letter;

const handleInput = (input) => {
  const res = [];

  let sum = 0;
  for (const line of input) {
    const [[aStart, aEnd], [bStart, bEnd]] = line
      .split(",")
      .map((assignment) => assignment.split("-").map((num) => parseInt(num)));

    if (
      (aStart <= bStart && bEnd <= aEnd) ||
      (bStart <= aStart && aEnd <= bEnd)
    ) {
      sum += 1;
    }
  }
  res.push(sum);

  sum = 0;
  for (const line of input) {
    const [[aStart, aEnd], [bStart, bEnd]] = line
      .split(",")
      .map((assignment) => assignment.split("-").map((num) => parseInt(num)));

    if (
      (aStart <= bStart && bStart <= aEnd) ||
      (bStart <= aStart && aStart <= bEnd)
    ) {
      sum += 1;
    }
  }
  res.push(sum);

  return res;
};

console.log("example outcome", handleInput(useInput("e.txt")));

console.log("real outcome", handleInput(useInput()));
