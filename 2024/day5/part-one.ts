import { logResult, readFile, logBenchmark } from "../util";
logBenchmark(performance.now());
const inputString = readFile(process.argv[2]);
const [ruleString, updateString] = inputString.split("\n\n");
const ruleList = ruleString
  .split("\n")
  .map((rule) => rule.split("|").map((page) => parseInt(page)));
const updateList = updateString
  .split("\n")
  .map((update) => update.split(",").map((page) => parseInt(page)));

logResult(
  updateList
    .filter((update) => {
      for (let pageIndex = 0; pageIndex < update.length; pageIndex += 1) {
        const currentPage = update[pageIndex];
        const previousPages = update.slice(0, pageIndex);
        for (const [, followingPage] of ruleList.filter(
          ([priorPage]) => priorPage === currentPage
        )) {
          if (previousPages.includes(followingPage)) {
            return false;
          }
        }
      }
      return true;
    })
    .map((update) => update[Math.floor(update.length / 2)])
    .reduce((prev, acc) => prev + acc, 0)
);

logBenchmark(performance.now());
