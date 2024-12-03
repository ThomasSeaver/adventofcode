import { logResult, readFile, logBenchmark } from "../util";
logBenchmark(performance.now());
const inputString = readFile(process.argv[2]);

logResult(
  inputString
    .match(/mul\(\d+,\d+\)/g)
    ?.filter((match) => {
      const matchIndex = inputString.indexOf(match);
      const lastDo = inputString.lastIndexOf("do()", matchIndex);
      const lastDont = inputString.lastIndexOf("don't()", matchIndex);
      return lastDo >= lastDont;
    })
    ?.map((match) =>
      match
        .slice(4, match.length - 1)
        .split(",")
        .map((str) => parseInt(str))
        .reduce((prev, acc) => prev * acc, 1)
    )
    .reduce((prev, acc) => prev + acc, 0)
);

logBenchmark(performance.now());
