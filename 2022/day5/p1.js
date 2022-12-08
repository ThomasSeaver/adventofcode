import { useInput } from "../util.js";

const decode = (letter) => letter;

const handleInput = (input) => {
  const res = [];

  let output = 0;
  let stackData = [];
  let stacks = [];
  for (const line of input) {
    if (line.charAt(0) == "m") {
      const command = line.split(" ");
      const amount = parseInt(command[1]);
      const source = parseInt(command[3]) - 1;
      const target = parseInt(command[5]) - 1;

      for (let i = 0; i < amount; i++) {
        const crate = stacks[source].pop();
        stacks[target].push(crate);
      }
    } else if (line.charAt(1) != "1") {
      stackData.push(line);
    } else if (line.charAt(1) == "1") {
      const stackNum = line.charAt(line.length - 2);
      for (let i = 0; i < stackNum; i++) {
        stacks.push([]);
      }
      stackData.reverse();
      for (const stackSlice of stackData) {
        for (
          let stackIndex = 1;
          stackIndex < stackSlice.length;
          stackIndex += 4
        ) {
          const char = stackSlice.charAt(stackIndex);
          if (char != " ") {
            stacks[Math.floor(stackIndex / 4)].push(char);
          }
        }
      }
    }
    output = stacks.map((stack) => stack[stack.length - 1]).join("");
  }

  res.push(output);

  output = 0;
  stackData = [];
  stacks = [];
  for (const line of input) {
    if (line.charAt(0) == "m") {
      const command = line.split(" ");
      const amount = parseInt(command[1]);
      const source = parseInt(command[3]) - 1;
      const target = parseInt(command[5]) - 1;

      let temp = [];
      for (let i = 0; i < amount; i++) {
        const crate = stacks[source].pop();
        temp.push(crate);
      }
      temp.reverse();
      for (let i = 0; i < temp.length; i++) {
        stacks[target].push(temp[i]);
      }
    } else if (line.charAt(1) != "1") {
      stackData.push(line);
    } else if (line.charAt(1) == "1") {
      const stackNum = line.charAt(line.length - 2);
      for (let i = 0; i < stackNum; i++) {
        stacks.push([]);
      }
      stackData.reverse();
      for (const stackSlice of stackData) {
        for (
          let stackIndex = 1;
          stackIndex < stackSlice.length;
          stackIndex += 4
        ) {
          const char = stackSlice.charAt(stackIndex);
          if (char != " ") {
            stacks[Math.floor(stackIndex / 4)].push(char);
          }
        }
      }
    }
    output = stacks.map((stack) => stack[stack.length - 1]).join("");
  }
  res.push(output);

  return res;
};

console.log("example outcome", handleInput(useInput("e.txt", "\n", false)));

console.log("real outcome", handleInput(useInput("i.txt", "\n", false)));
