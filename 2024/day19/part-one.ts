import { logResult, readFile, logBenchmark } from "../util";
logBenchmark(performance.now());
const inputString = readFile(process.argv[2]);
const [patternList, designList] = inputString
  .split("\n\n")
  .map((inputString, inputStringIndex) =>
    inputString.split(inputStringIndex === 0 ? ", " : "\n")
  );

const designMap: Record<string, boolean> = { "": true };
const checkDesign = (designString: string) => {
  if (designMap[designString] == null) {
    let viableDesign = false;
    for (const pattern of patternList) {
      if (
        designString.startsWith(pattern) &&
        checkDesign(designString.slice(pattern.length))
      ) {
        viableDesign = true;
        break;
      }
    }
    designMap[designString] = viableDesign;
  }
  return designMap[designString];
};
let viablePatternCount = 0;
for (const design of designList) {
  if (checkDesign(design)) {
    viablePatternCount += 1;
  }
}
logResult(viablePatternCount);

logBenchmark(performance.now());
