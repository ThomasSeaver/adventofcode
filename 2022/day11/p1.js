import { useInput } from "../util.js";

// This is all gross and I don't even care anymore

const parseMonkeys = (monkeyInput) => {
  const monkeys = [];
  const monkeyChunks = monkeyInput.split("\n\n");

  for (const [monkeyIndex, monkeyChunk] of monkeyChunks.entries()) {
    const monkeyLines = monkeyChunk.split("\n");

    const id = monkeyIndex;
    const items = monkeyLines[1]
      .split("items: ")[1]
      .split(", ")
      .map((val) => parseInt(val));
    const operation = monkeyLines[2]
      .split(" new = old ")[1]
      .split(" ")
      .map((val) => (isNaN(parseInt(val)) ? val : parseInt(val)));
    const testDivisor = parseInt(monkeyLines[3].split(" by ")[1]);
    const testTrue = parseInt(monkeyLines[4].split(" monkey ")[1]);
    const testFalse = parseInt(monkeyLines[5].split(" monkey ")[1]);

    monkeys.push({
      id,
      items,
      operation,
      testDivisor,
      testTrue,
      testFalse,
      activity: 0,
    });
  }

  return monkeys;
};

const handleInput = (input) => {
  const res = [];

  let monkeys = parseMonkeys(input);

  for (let round = 0; round < 20; round += 1) {
    for (let monkeyIndex = 0; monkeyIndex < monkeys.length; monkeyIndex += 1) {
      while (monkeys[monkeyIndex].items.length > 0) {
        let level = monkeys[monkeyIndex].items.shift();
        monkeys[monkeyIndex].activity += 1;

        let [operand, factor] = monkeys[monkeyIndex].operation;

        if (factor == "old") factor = level;

        if (operand == "+") level += factor;
        else level *= factor;

        level = Math.floor(level / 3);

        if (level % monkeys[monkeyIndex].testDivisor == 0) {
          monkeys[monkeys[monkeyIndex].testTrue].items.push(level);
        } else {
          monkeys[monkeys[monkeyIndex].testFalse].items.push(level);
        }
      }
    }
  }

  monkeys.sort((a, b) => b.activity - a.activity);
  res.push([
    ...monkeys.map(
      (monkey) => `Monkey ${monkey.id}: inspected ${monkey.activity} times`
    ),
    `result: ${monkeys[0].activity * monkeys[1].activity}`,
  ]);

  monkeys = parseMonkeys(input);

  monkeys = monkeys.map((monkey) => ({
    ...monkey,
    items: monkey.items.map((item) =>
      monkeys.map((monkey) => ({
        level: item % monkey.testDivisor,
        divisor: monkey.testDivisor,
      }))
    ),
  }));

  for (let round = 0; round < 10000; round += 1) {
    for (let monkeyIndex = 0; monkeyIndex < monkeys.length; monkeyIndex += 1) {
      while (monkeys[monkeyIndex].items.length > 0) {
        let item = monkeys[monkeyIndex].items.shift();
        monkeys[monkeyIndex].activity += 1;
        let [x, op, y] = monkeys[monkeyIndex].operation;

        for (
          let monkeyDivisorIndex = 0;
          monkeyDivisorIndex < item.length;
          monkeyDivisorIndex += 1
        ) {
          let [operand, factor] = monkeys[monkeyIndex].operation;

          if (factor == "old") factor = item[monkeyDivisorIndex].level;

          if (operand == "+") item[monkeyDivisorIndex].level += factor;
          else item[monkeyDivisorIndex].level *= factor;

          item[monkeyDivisorIndex].level =
            item[monkeyDivisorIndex].level % item[monkeyDivisorIndex].divisor;
        }

        if (item[monkeyIndex].level % monkeys[monkeyIndex].testDivisor == 0) {
          monkeys[monkeys[monkeyIndex].testTrue].items.push(item);
        } else {
          monkeys[monkeys[monkeyIndex].testFalse].items.push(item);
        }
      }
    }
  }

  monkeys.sort((a, b) => b.activity - a.activity);

  res.push([
    ...monkeys.map(
      (monkey) => `Monkey ${monkey.id}: inspected ${monkey.activity} times`
    ),
    `result: ${monkeys[0].activity * monkeys[1].activity}`,
  ]);

  return res;
};

console.log(
  "example outcome",
  ...handleInput(useInput("e.txt", null, false, false))
);
console.log(
  "real outcome",
  ...handleInput(useInput("i.txt", null, false, false))
);
