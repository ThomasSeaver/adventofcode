import { useInput } from "../util.js";

const input = useInput();

const acc = [];
let cur = 0;

for (const calories of input) {
  if (calories == "") {
    acc.push(cur);
    cur = 0;
  } else {
    cur += parseInt(calories);
  }
}
acc.push(cur);
acc.sort((a, b) => b - a);
const sum = acc.slice(0, 3).reduce((prev, cur) => prev + cur);

console.log(acc, sum);
