const { logBenchmarkTimes } = require("../../utils/benchmark");
const { grabText } = require("../../utils/grab-text");
const samples = grabText(`${__dirname}/s.txt`);
const actual = grabText(`${__dirname}/i.txt`);

const handleInputPartOne = (input) => {
  const modules = Object.fromEntries(
    input.split("\n").map((module) => {
      const [typedKey, destinations] = module.split(" -> ");
      if (typedKey === "broadcaster") {
        return [typedKey, { key: typedKey, type: typedKey, destinations: destinations.split(", ") }];
      }
      const type = typedKey[0];
      const key = typedKey.slice(1);
      return [key, { key, type, destinations: destinations.split(", ") }];
    })
  );

  for (const moduleKey of Object.keys(modules)) {
    if (modules[moduleKey].type === "&") {
      modules[moduleKey].conjunctions = Object.fromEntries(
        Object.values(modules)
          .filter((conjunctionModule) => conjunctionModule.destinations.includes(moduleKey))
          .map((conjunctionModule) => [conjunctionModule.key, "low"])
      );
    }
    if (modules[moduleKey].type === "%") {
      modules[moduleKey].isOn = false;
    }
  }

  let lowPulseCount = 0;
  let highPulseCount = 0;
  for (let _buttonPress = 0; _buttonPress < 1000; _buttonPress += 1) {
    lowPulseCount += 1;
    const pulses = [{ type: "low", source: "button", destination: "broadcaster" }];
    while (pulses.length > 0) {
      const pulse = pulses.shift();
      if (modules[pulse.destination] === undefined) {
        continue;
      }
      if (modules[pulse.destination].type === "%" && pulse.type === "low") {
        modules[pulse.destination].isOn = !modules[pulse.destination].isOn;
        const typeOfPulseSent = modules[pulse.destination].isOn ? "high" : "low";
        highPulseCount += modules[pulse.destination].destinations.length * (typeOfPulseSent === "high" ? 1 : 0);
        lowPulseCount += modules[pulse.destination].destinations.length * (typeOfPulseSent === "low" ? 1 : 0);
        for (const destination of modules[pulse.destination].destinations) {
          pulses.push({
            type: typeOfPulseSent,
            destination,
            source: modules[pulse.destination].key,
          });
        }
      } else if (modules[pulse.destination].type === "&") {
        modules[pulse.destination].conjunctions[pulse.source] = pulse.type;
        const typeOfPulseSent = Object.values(modules[pulse.destination].conjunctions).includes("low") ? "high" : "low";
        highPulseCount += modules[pulse.destination].destinations.length * (typeOfPulseSent === "high" ? 1 : 0);
        lowPulseCount += modules[pulse.destination].destinations.length * (typeOfPulseSent === "low" ? 1 : 0);
        for (const destination of modules[pulse.destination].destinations) {
          pulses.push({
            type: typeOfPulseSent,
            destination,
            source: modules[pulse.destination].key,
          });
        }
      } else if (modules[pulse.destination].type === "broadcaster") {
        highPulseCount += modules[pulse.destination].destinations.length * (pulse.type === "high" ? 1 : 0);
        lowPulseCount += modules[pulse.destination].destinations.length * (pulse.type === "low" ? 1 : 0);
        for (const destination of modules[pulse.destination].destinations) {
          pulses.push({
            type: pulse.type,
            destination,
            source: modules[pulse.destination].key,
          });
        }
      }
    }
  }

  return lowPulseCount * highPulseCount;
};

const handleInputPartTwo = (input) => {
  const modules = Object.fromEntries(
    input.split("\n").map((module) => {
      const [typedKey, destinations] = module.split(" -> ");
      if (typedKey === "broadcaster") {
        return [typedKey, { key: typedKey, type: typedKey, destinations: destinations.split(", ") }];
      }
      const type = typedKey[0];
      const key = typedKey.slice(1);
      return [key, { key, type, destinations: destinations.split(", ") }];
    })
  );

  for (const moduleKey of Object.keys(modules)) {
    if (modules[moduleKey].type === "&") {
      modules[moduleKey].conjunctions = Object.fromEntries(
        Object.values(modules)
          .filter((conjunctionModule) => conjunctionModule.destinations.includes(moduleKey))
          .map((conjunctionModule) => [conjunctionModule.key, "low"])
      );
    }
    if (modules[moduleKey].type === "%") {
      modules[moduleKey].isOn = false;
    }
  }

  let rxMemo = { mp: 0, ng: 0, qb: 0, qt: 0 };

  for (let buttonPressCount = 1; buttonPressCount < 1000000000; buttonPressCount += 1) {
    const pulses = [{ type: "low", source: "button", destination: "broadcaster" }];
    while (pulses.length > 0) {
      const pulse = pulses.shift();
      if (pulse.destination === "rx" && pulse.type === "low") {
        return buttonPressCount;
      }
      if (modules[pulse.destination] === undefined) {
        continue;
      }
      if (modules[pulse.destination].type === "%" && pulse.type === "low") {
        modules[pulse.destination].isOn = !modules[pulse.destination].isOn;
        for (const destination of modules[pulse.destination].destinations) {
          pulses.push({
            type: modules[pulse.destination].isOn ? "high" : "low",
            destination,
            source: modules[pulse.destination].key,
          });
        }
      } else if (modules[pulse.destination].type === "&") {
        modules[pulse.destination].conjunctions[pulse.source] = pulse.type;
        for (const destination of modules[pulse.destination].destinations) {
          pulses.push({
            type: Object.values(modules[pulse.destination].conjunctions).includes("low") ? "high" : "low",
            destination,
            source: modules[pulse.destination].key,
          });
        }
      } else if (modules[pulse.destination].type === "broadcaster") {
        for (const destination of modules[pulse.destination].destinations) {
          pulses.push({
            type: pulse.type,
            destination,
            source: modules[pulse.destination].key,
          });
        }
      }
      if (pulse.destination === "dr" && pulse.type === "high") {
        rxMemo[pulse.source] = buttonPressCount - rxMemo[pulse.source];
        if (!Object.values(rxMemo).includes(0)) {
          return Object.values(rxMemo).reduce((previousTotal, currentValue) => (currentValue *= previousTotal), 1);
        }
      }
    }
  }
};

logBenchmarkTimes([
  ...samples.split("\n---\n").map((sample, sampleIndex, samples) => ({
    name: `p1: sample${samples.length > 1 ? " " + sampleIndex : ""}`,
    func: () => handleInputPartOne(sample),
  })),
  { name: `p1: actual`, func: () => handleInputPartOne(actual) },
  { name: `p2: actual`, func: () => handleInputPartTwo(actual) },
]);
