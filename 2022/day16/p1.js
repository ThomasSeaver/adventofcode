import { useInput } from "../util.js";

const parseInput = (input) => {
  const valves = {};

  for (const line of input) {
    const parts = line.split(" ");
    const id = parts[1];
    const flowRate = parts[4].slice(5, parts[4].length - 1);
    const tunnels = parts
      .slice(9)
      .map((tunnel, index, valveArray) =>
        index == valveArray.length - 1
          ? tunnel
          : tunnel.slice(0, tunnel.length - 1)
      );
    valves[id] = { id, flowRate, tunnels, opened: false };
  }

  return valves;
};

const generatePaths = (valves) => {
  const routes = {};

  for (const valve of Object.values(valves)) {
    const paths = [{ currentId: valve.id, visited: [] }];
    const valveRoutes = {};

    while (paths.length > 0) {
      const { currentId, visited } = paths.shift();
      const { tunnels } = valves[currentId];

      if (!valveRoutes[currentId] && currentId != valve.id)
        valveRoutes[currentId] = visited.length;

      for (const tunnel of tunnels) {
        if (!visited.includes(tunnel))
          paths.push({ currentId: tunnel, visited: [...visited, currentId] });
      }
    }

    routes[valve.id] = valveRoutes;
  }

  return routes;
};

const findMostPressureReleased = (valves, routes) => {
  const paths = [
    { currentId: "AA", opened: [], pressureReleased: 0, timeRemaining: 30 },
  ];

  let mostPressure = 0;

  while (paths.length > 0) {
    const { currentId, opened, pressureReleased, timeRemaining } =
      paths.shift();
    const options = Object.entries(routes[currentId]);

    for (const [option, cost] of options) {
      const tunnelValve = valves[option];
      if (
        tunnelValve.flowRate > 0 &&
        !opened.includes(option) &&
        timeRemaining > cost + 1
      ) {
        const newTimeRemaining = timeRemaining - (cost + 1);
        const newPressureReleased =
          pressureReleased + newTimeRemaining * tunnelValve.flowRate;
        const newPath = {
          currentId: option,
          opened: [...opened, currentId],
          pressureReleased: newPressureReleased,
          timeRemaining: newTimeRemaining,
        };
        paths.push(newPath);
      }
    }
    if (pressureReleased > mostPressure) {
      mostPressure = pressureReleased;
    }
  }

  return mostPressure;
};
// LMAO this is so dumb and bad it just takes literally hours to brute force it and its fine
const findMostPressureReleasedTwo = (valves, routes) => {
  let debug = 0;
  const recursionTime = (
    workers,
    opened,
    timeRemaining,
    pressureReleased,
    depth
  ) => {
    console.log(depth);
    if (timeRemaining == 0) return pressureReleased;
    const workerOptions = [];
    for (const worker of workers) {
      const workerOptionSet = [];
      if (worker.workRemaining > 0) {
        workerOptionSet.push({
          ...worker,
          workRemaining: worker.workRemaining - 1,
          extraPressureRelease: 0,
        });
      } else {
        const options = Object.entries(routes[worker.currentId]);
        for (const [option, cost] of options) {
          const tunnelValve = valves[option];
          if (
            tunnelValve.flowRate > 0 &&
            !opened.includes(option) &&
            timeRemaining > cost
          ) {
            workerOptionSet.push({
              currentId: option,
              workRemaining: cost,
              extraPressureRelease:
                (timeRemaining - (cost + 1)) * tunnelValve.flowRate,
            });
          }
        }
      }
      workerOptions.push(workerOptionSet);
    }

    if (debug < 10) {
      debug += 1;
      console.log(
        debug,
        workers,
        timeRemaining,
        pressureReleased,
        opened,
        workerOptions,
        "\n"
      );
    }

    const newRecursions = [];
    const pressuresReleased = [];

    for (const workerA of workerOptions[0]) {
      for (const workerB of workerOptions[1]) {
        if (workerA.currentId == workerB.currentId) continue;
        const recursionString = [workerA.currentId, workerB.currentId]
          .sort()
          .join("-");
        if (newRecursions.includes(recursionString)) continue;
        newRecursions.push(recursionString);

        const newOpened = [...opened];
        if (!newOpened.includes(workerA.currentId))
          newOpened.push(workerA.currentId);
        if (!newOpened.includes(workerB.currentId))
          newOpened.push(workerB.currentId);

        const newPressureReleased =
          pressureReleased +
          workerA.extraPressureRelease +
          workerB.extraPressureRelease;

        pressuresReleased.push(
          recursionTime(
            [workerA, workerB],
            newOpened,
            timeRemaining - 1,
            newPressureReleased,
            depth + 1
          )
        );
      }
    }

    return pressuresReleased.length > 0
      ? Math.max(...pressuresReleased)
      : pressureReleased;
  };

  return recursionTime(
    [
      { currentId: "AA", workRemaining: 0, extraPressureRelease: 0 },
      { currentId: "AA", workRemaining: 0, extraPressureRelease: 0 },
    ],
    [],
    26,
    0,
    0
  );
};

const handleInput = async (input) => {
  const res = [];

  const valves = parseInput(input);
  const paths = generatePaths(valves);
  const mostPressureReleased = findMostPressureReleased(valves, paths);
  const mostPressureReleasedTwo = findMostPressureReleasedTwo(valves, paths);
  res.push(mostPressureReleased, mostPressureReleasedTwo);

  return res;
};

console.log("example outcome", ...(await handleInput(useInput("e.txt"))));
console.log("real outcome", ...(await handleInput(useInput("i.txt"))));
