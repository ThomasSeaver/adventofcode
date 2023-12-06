const { grabText } = require("../../utils/grab-text");
const sample = grabText(`${__dirname}/s.txt`);
const actual = grabText(`${__dirname}/i.txt`);

const handleInputPartOne = (input) => {
  const times = input
    .split("\n")[0]
    .split(":")[1]
    .split(" ")
    .filter((value) => value != "")
    .map((value) => parseInt(value));
  const distances = input
    .split("\n")[1]
    .split(":")[1]
    .split(" ")
    .filter((value) => value != "")
    .map((value) => parseInt(value));

  let total = 1;

  for (let raceIndex = 0; raceIndex < times.length; raceIndex += 1) {
    const time = times[raceIndex];
    const distance = distances[raceIndex];

    let winCount = 0;
    for (let speed = 1; speed < time; speed += 1) {
      let distanceAtSpeed = speed * (time - speed);
      if (distanceAtSpeed > distance) {
        winCount += 1;
      }
    }

    total *= winCount;
  }

  return total;
};

const handleInputPartTwo = (input) => {
  const time = BigInt(input.split("\n")[0].split(":")[1].split(" ").join(""));
  const distance = BigInt(input.split("\n")[1].split(":")[1].split(" ").join(""));

  let wins = 0;
  for (let speed = BigInt(1); speed < time; speed += BigInt(1)) {
    if (speed * (time - speed) > distance) {
      wins += 1;
    }
  }

  return wins;
};

// I'm pretty sure the 'correct' method here is to solve an equation, but N is pretty small
// xy = distance, where xy is symmetric since x = timeHeldDown and y = timeRemaining
// a smarter person could probably factorize or would just stop once a single value met the constraint,
// since you could just get the distance from the alternate end and find the between length
// anyway I'm not smart enough for that

console.log("p1: sample", handleInputPartOne(sample));
console.log("p1: actual", handleInputPartOne(actual));
console.log("p2: sample", handleInputPartTwo(sample));
console.log("p2: actual", handleInputPartTwo(actual));
