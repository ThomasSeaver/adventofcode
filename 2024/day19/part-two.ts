import { logResult, readFile, logBenchmark } from "../util";
logBenchmark(performance.now());
const inputString = readFile(process.argv[2]);
const [patternList, designList] = inputString
  .split("\n\n")
  .map((inputString, inputStringIndex) =>
    inputString.split(inputStringIndex === 0 ? ", " : "\n")
  );

const designMap: Record<string, number> = { "": 1 };
const checkDesignCount = (designString: string) => {
  if (designMap[designString] == null) {
    let viableDesignCount = 0;
    for (const pattern of patternList) {
      if (designString.startsWith(pattern)) {
        viableDesignCount += checkDesignCount(
          designString.slice(pattern.length)
        );
      }
    }
    designMap[designString] = viableDesignCount;
  }
  return designMap[designString];
};

let viablePatternCount = 0;
for (const design of designList) {
  viablePatternCount += checkDesignCount(design);
}
logResult(viablePatternCount);

logBenchmark(performance.now());
