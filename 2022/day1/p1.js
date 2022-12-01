import { useInput } from "../util.js";

const input = useInput();

let acc = 0;
let cur = 0;

for (const calories of input) {
  console.log(calories, acc, cur);
  if (calories == "") {
    if (cur > acc) {
      acc = cur;
    }
    cur = 0;
  } else {
    cur += parseInt(calories);
  }
}

if (cur > acc) {
  acc = cur;
}

console.log(acc);
