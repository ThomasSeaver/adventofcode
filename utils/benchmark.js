const logBenchmarkTimes = (functions) => {
  const times = [];
  for (const { name, func } of functions) {
    const start = performance.now();
    const result = func();
    const end = performance.now();
    times.push({ name, result, time: Math.floor((end - start) * 1000) / 1000000 });
  }
  console.table(times);
};

module.exports = { logBenchmarkTimes };
