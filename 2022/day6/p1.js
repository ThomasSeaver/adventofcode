import { useInput } from "../util.js";

const handleInput = (input) => {
  const res = [];

  let output = [];
  for (const line of input) {
    const arr = line.split("");
    for (let i = 0; i < arr.length - 4; i++) {
      const slice = arr
        .slice(i, i + 4)
        .reduce(
          (prev, cur) => (prev.includes(cur) ? prev : [...prev, cur]),
          []
        );
      if (slice.length == 4) {
        output.push(i + 4);
        break;
      }
    }
  }
  res.push(output);

  output = [];
  for (const line of input) {
    const arr = line.split("");
    for (let i = 0; i < arr.length - 14; i++) {
      const slice = arr
        .slice(i, i + 14)
        .reduce(
          (prev, cur) => (prev.includes(cur) ? prev : [...prev, cur]),
          []
        );
      if (slice.length == 14) {
        output.push(i + 14);
        break;
      }
    }
  }
  res.push(output);

  return res;
};

console.log("example outcome", handleInput(useInput("e.txt")));

console.log("real outcome", handleInput(useInput("i.txt")));
