import { useInput } from "../util.js";

const signalStrength = (input) => {
  let X = 1;
  let cycleCount = 1;
  let signalStrengthSum = 0;

  for (const line of input) {
    if (line === "noop") {
      cycleCount += 1;
    } else {
      if ((cycleCount + 1 - 20) % 40 === 0 && cycleCount + 1 > 0) {
        signalStrengthSum += (cycleCount + 1) * X;
      }
      cycleCount += 2;
      X += parseInt(line.split(" ")[1]);
    }
    if ((cycleCount - 20) % 40 === 0 && cycleCount > 0) {
      signalStrengthSum += cycleCount * X;
    }
  }

  return signalStrengthSum;
};

const buildImage = (input) => {
  const image = ["\n"];
  let X = 1;
  let cycleCount = 1;

  //blech
  const cycle = (addX) => {
    image.push(
      (cycleCount - 1) % 40 >= X - 1 && (cycleCount - 1) % 40 <= X + 1
        ? "#"
        : "."
    );
    if (addX) X += addX;
    if (cycleCount % 40 === 0) image.push("\n");
    cycleCount += 1;
  };

  for (const line of input) {
    cycle();
    if (line !== "noop") {
      cycle(parseInt(line.split(" ")[1]));
    }
  }

  return image.join("");
};

const handleInput = (input) => {
  const res = [];

  res.push(signalStrength(input));
  res.push(buildImage(input));

  return res;
};

console.log("example outcome", ...handleInput(useInput("e.txt")));
console.log("example-2 outcome", ...handleInput(useInput("e2.txt")));
console.log("real outcome", ...handleInput(useInput("i.txt")));
