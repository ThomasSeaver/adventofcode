const { logBenchmarkTimes } = require("../../utils/benchmark");
const { grabText } = require("../../utils/grab-text");
const sample = grabText(`${__dirname}/s.txt`);
const actual = grabText(`${__dirname}/i.txt`);

const handleInputPartOne = (input) => {
  const springRows = input.split("\n").map((inputRow) => [
    inputRow.split(" ")[0],
    inputRow
      .split(" ")[1]
      .split(",")
      .map((group) => parseInt(group)),
  ]);

  const possibleSolutionCounts = springRows.map(([springSet, groups]) => {
    let possibleSpringSets = [""];
    for (let springIndex = 0; springIndex < springSet.length; springIndex += 1) {
      const spring = springSet[springIndex];
      let newPossibleSpringSets = [];
      for (
        let possibleSpringSetIndex = 0;
        possibleSpringSetIndex < possibleSpringSets.length;
        possibleSpringSetIndex += 1
      ) {
        const possibleSpringSet = possibleSpringSets[possibleSpringSetIndex];
        if (spring === "?") {
          newPossibleSpringSets.push(possibleSpringSet + ".");
          newPossibleSpringSets.push(possibleSpringSet + "#");
        } else {
          newPossibleSpringSets.push(possibleSpringSet + spring);
        }
      }
      possibleSpringSets = newPossibleSpringSets;
    }

    const groupedDamagedSprings = possibleSpringSets.map((possibleSpringSet) =>
      possibleSpringSet
        .split(".")
        .filter((chunk) => chunk.length > 0)
        .map((chunk) => chunk.length)
    );

    const correctGroupedDamagedSprings = groupedDamagedSprings
      .filter((groupedSet) => groupedSet.length == groups.length)
      .filter((groupedSet) => {
        for (let groupLengthIndex = 0; groupLengthIndex < groupedSet.length; groupLengthIndex += 1) {
          if (groupedSet[groupLengthIndex] !== groups[groupLengthIndex]) {
            return false;
          }
        }
        return true;
      });
    return correctGroupedDamagedSprings.length;
  });

  return possibleSolutionCounts.reduce((previous, current) => previous + current, 0);
};

// burned a lot of time thinking through combinatoric solutions before just trying this
// dunno why I thought it would be as slow as just enumerating the solutions
const memo = {};
const countValidStrings = (springSet, groups, inGroup) => {
  if (springSet.length === 0 && (groups.length === 0 || (groups.length === 1 && groups[0] === 0))) {
    return 1;
  }
  const memoKey = [springSet.join(","), groups.join("|"), inGroup].join("-");
  if (memo[memoKey] != null) {
    return memo[memoKey];
  }
  const [currentSpring, ...remainingSprings] = springSet;
  const [currentGroup, ...remainingGroups] = groups;

  let validStringCount = 0;

  if (currentSpring === "#" || currentSpring === "?") {
    if (inGroup && currentGroup > 0) {
      validStringCount += countValidStrings(remainingSprings, [currentGroup - 1, ...remainingGroups], true);
    } else if (!inGroup) {
      validStringCount += countValidStrings(remainingSprings, [currentGroup - 1, ...remainingGroups], true);
    }
  }
  if (currentSpring === "." || currentSpring === "?") {
    if (!inGroup) {
      validStringCount += countValidStrings(remainingSprings, groups, false);
    } else if (currentGroup === 0) {
      validStringCount += countValidStrings(remainingSprings, remainingGroups, false);
    }
  }

  memo[memoKey] = validStringCount;
  return validStringCount;
};

const handleInputPartTwo = (input) => {
  const springRows = input.split("\n").map((inputRow) => [
    inputRow.split(" ")[0].split(""),
    inputRow
      .split(" ")[1]
      .split(",")
      .map((group) => parseInt(group)),
  ]);

  const unfoldedSpringRows = springRows.map(([springSet, groups]) => [
    [...springSet, "?", ...springSet, "?", ...springSet, "?", ...springSet, "?", ...springSet],
    [...groups, ...groups, ...groups, ...groups, ...groups],
  ]);

  const possibleSolutionCounts = unfoldedSpringRows.map(([springSet, groups], currentIndex) => {
    return countValidStrings(springSet, groups, false);
  });

  return possibleSolutionCounts.reduce((previous, current) => previous + current, 0);
};

const refinedHandleInput = (input, part) => {
  let springRows = input.split("\n").map((inputRow) => [
    inputRow.split(" ")[0].split(""),
    inputRow
      .split(" ")[1]
      .split(",")
      .map((group) => parseInt(group)),
  ]);

  if (part === 2) {
    springRows = springRows.map(([springSet, groups]) => [
      [...springSet, "?", ...springSet, "?", ...springSet, "?", ...springSet, "?", ...springSet],
      [...groups, ...groups, ...groups, ...groups, ...groups],
    ]);
  }

  return springRows
    .map(([springSet, groups]) => countValidStrings(springSet, groups, false))
    .reduce((previous, current) => previous + current, 0);
};

logBenchmarkTimes(
  [
    { name: `p1: sample`, func: () => handleInputPartOne(sample) },
    { name: `p1: actual`, func: () => handleInputPartOne(actual) },
    { name: `p2: sample`, func: () => handleInputPartTwo(sample) },
    { name: `p2: actual`, func: () => handleInputPartTwo(actual) },
    { name: `p1: sample | refined`, func: () => refinedHandleInput(sample, 1) },
    { name: `p1: actual | refined`, func: () => refinedHandleInput(actual, 1) },
    { name: `p2: sample | refined`, func: () => refinedHandleInput(sample, 2) },
    { name: `p2: actual | refined`, func: () => refinedHandleInput(actual, 2) },
  ],
  true
);
