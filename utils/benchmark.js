const logBenchmarkTimes = (functions, compare) => {
  const times = [];
  for (const { name, func } of functions) {
    const result = func();
    let timeSum = 0;
    const runCount = 10;
    for (let _runIndex = 0; _runIndex < runCount; _runIndex += 1) {
      const start = performance.now();
      func();
      const end = performance.now();
      timeSum += end - start;
    }
    times.push({
      name,
      result,
      average: Math.floor((1000 * timeSum) / runCount) / 1000000,
    });
  }
  if (!compare) {
    console.table(times);
  } else {
    console.table(
      times.map((time, timeIndex) => ({
        ...time,
        speedDifference:
          Math.floor((1000000 * times[(timeIndex + times.length / 2) % times.length].average) / time.average) / 1000000,
      }))
    );
  }
};

module.exports = { logBenchmarkTimes };
