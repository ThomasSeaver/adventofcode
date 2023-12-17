const { logBenchmarkTimes } = require("../../utils/benchmark");
const { grabText } = require("../../utils/grab-text");
const firstPartSamples = grabText(`${__dirname}/s1.txt`);
const secondPartSamples = grabText(`${__dirname}/s2.txt`);
const actual = grabText(`${__dirname}/i.txt`);

const aboveConnections = ["7", "F", "|"];
const belowConnections = ["J", "L", "|"];
const leftConnections = ["F", "L", "-"];
const rightConnections = ["J", "7", "-"];

const handleInputPartOne = (input) => {
  const field = input.split("\n").map((row) => row.split(""));

  let loopRowIndex = null;
  let loopPipeIndex = null;

  for (let rowIndex = 0; rowIndex < field.length; rowIndex += 1) {
    for (let pipeIndex = 0; pipeIndex < field[rowIndex].length; pipeIndex += 1) {
      if (field[rowIndex][pipeIndex] !== "S") {
        continue;
      }

      loopRowIndex = rowIndex;
      loopPipeIndex = pipeIndex;
      break;
    }
  }

  let loop = [];
  let lastDirection = null;
  while (field[loopRowIndex][loopPipeIndex] !== "S" || loop.length === 0) {
    const currentPipe = field[loopRowIndex][loopPipeIndex];
    loop.push(currentPipe);
    if (currentPipe === "S") {
      const pipeAbove = loopRowIndex > 0 ? field[loopRowIndex - 1][loopPipeIndex] : null;
      if (lastDirection !== "below" && aboveConnections.includes(pipeAbove)) {
        lastDirection = "above";
        loopRowIndex -= 1;
        continue;
      }
      const pipeBelow = loopRowIndex < field.length - 1 ? field[loopRowIndex + 1][loopPipeIndex] : null;
      if (lastDirection !== "above" && belowConnections.includes(pipeBelow)) {
        lastDirection = "below";
        loopRowIndex += 1;
        continue;
      }
      const pipeLeft = loopPipeIndex > 0 ? field[loopRowIndex][loopPipeIndex - 1] : null;
      if (lastDirection !== "right" && leftConnections.includes(pipeLeft)) {
        lastDirection = "left";
        loopPipeIndex -= 1;
        continue;
      }
      const pipeRight = loopPipeIndex < field[loopRowIndex].length - 1 ? field[loopRowIndex][loopPipeIndex + 1] : null;
      if (lastDirection !== "left" && rightConnections.includes(pipeRight)) {
        lastDirection = "right";
        loopPipeIndex += 1;
      }
      console.log("shouldn't get here, theoretically");
      break;
    }

    if (lastDirection === "above") {
      switch (currentPipe) {
        case "|":
          loopRowIndex -= 1;
          break;
        case "F":
          loopPipeIndex += 1;
          lastDirection = "right";
          break;
        case "7":
          loopPipeIndex -= 1;
          lastDirection = "left";
          break;
      }
    }

    if (lastDirection === "below") {
      switch (currentPipe) {
        case "|":
          loopRowIndex += 1;
          break;
        case "L":
          loopPipeIndex += 1;
          lastDirection = "right";
          break;
        case "J":
          loopPipeIndex -= 1;
          lastDirection = "left";
          break;
      }
    }

    if (lastDirection === "right") {
      switch (currentPipe) {
        case "-":
          loopPipeIndex += 1;
          break;
        case "7":
          loopRowIndex += 1;
          lastDirection = "below";
          break;
        case "J":
          loopRowIndex -= 1;
          lastDirection = "above";
          break;
      }
    }

    if (lastDirection === "left") {
      switch (currentPipe) {
        case "-":
          loopPipeIndex -= 1;
          break;
        case "F":
          loopRowIndex += 1;
          lastDirection = "below";
          break;
        case "L":
          loopRowIndex -= 1;
          lastDirection = "above";
          break;
      }
    }
  }

  return loop.length / 2;
};

const handleInputPartTwo = (input) => {
  const field = input.split("\n").map((row) => row.split("").map((pipe) => ({ pipe, loopPiece: false })));

  let loopRowIndex = null;
  let loopPipeIndex = null;

  for (let rowIndex = 0; rowIndex < field.length; rowIndex += 1) {
    for (let pipeIndex = 0; pipeIndex < field[rowIndex].length; pipeIndex += 1) {
      if (field[rowIndex][pipeIndex].pipe !== "S") {
        continue;
      }

      loopRowIndex = rowIndex;
      loopPipeIndex = pipeIndex;
      break;
    }
  }

  let lastDirection = null;
  while (field[loopRowIndex][loopPipeIndex].start !== true) {
    const currentPipe = field[loopRowIndex][loopPipeIndex].pipe;
    field[loopRowIndex][loopPipeIndex] = { pipe: currentPipe, loopPiece: true, start: currentPipe === "S" };
    if (currentPipe === "S") {
      const pipeAbove = loopRowIndex > 0 ? field[loopRowIndex - 1][loopPipeIndex] : null;
      const pipeBelow = loopRowIndex < field.length - 1 ? field[loopRowIndex + 1][loopPipeIndex] : null;
      const pipeLeft = loopPipeIndex > 0 ? field[loopRowIndex][loopPipeIndex - 1] : null;
      const pipeRight = loopPipeIndex < field[loopRowIndex].length - 1 ? field[loopRowIndex][loopPipeIndex + 1] : null;
      const pipeAboveConnects = aboveConnections.includes(pipeAbove?.pipe);
      const pipeBelowConnects = belowConnections.includes(pipeBelow?.pipe);
      const pipeLeftConnects = leftConnections.includes(pipeLeft?.pipe);
      const pipeRightConnects = rightConnections.includes(pipeRight?.pipe);
      if (pipeAboveConnects) {
        if (pipeLeftConnects) {
          field[loopRowIndex][loopPipeIndex].pipe = "J";
        }
        if (pipeRightConnects) {
          field[loopRowIndex][loopPipeIndex].pipe = "L";
        }
        if (pipeBelowConnects) {
          field[loopRowIndex][loopPipeIndex].pipe = "|";
        }
        lastDirection = "above";
        loopRowIndex -= 1;
        continue;
      }
      if (pipeBelowConnects) {
        if (pipeLeftConnects) {
          field[loopRowIndex][loopPipeIndex].pipe = "7";
        }
        if (pipeRightConnects) {
          field[loopRowIndex][loopPipeIndex].pipe = "F";
        }
        if (pipeAboveConnects) {
          field[loopRowIndex][loopPipeIndex].pipe = "|";
        }
        lastDirection = "below";
        loopRowIndex += 1;
        continue;
      }
      if (pipeLeftConnects) {
        if (pipeBelowConnects) {
          field[loopRowIndex][loopPipeIndex].pipe = "7";
        }
        if (pipeAboveConnects) {
          field[loopRowIndex][loopPipeIndex].pipe = "J";
        }
        if (pipeRightConnects) {
          field[loopRowIndex][loopPipeIndex].pipe = "-";
        }
        lastDirection = "left";
        loopPipeIndex -= 1;
        continue;
      }
      if (pipeRightConnects) {
        if (pipeBelowConnects) {
          field[loopRowIndex][loopPipeIndex].pipe = "F";
        }
        if (pipeAboveConnects) {
          field[loopRowIndex][loopPipeIndex].pipe = "L";
        }
        if (pipeLeftConnects) {
          field[loopRowIndex][loopPipeIndex].pipe = "-";
        }
        lastDirection = "right";
        loopPipeIndex += 1;
      }
      console.log("shouldn't get here, theoretically");
      break;
    }

    if (lastDirection === "above") {
      switch (currentPipe) {
        case "|":
          loopRowIndex -= 1;
          break;
        case "F":
          loopPipeIndex += 1;
          lastDirection = "right";
          break;
        case "7":
          loopPipeIndex -= 1;
          lastDirection = "left";
          break;
      }
    }

    if (lastDirection === "below") {
      switch (currentPipe) {
        case "|":
          loopRowIndex += 1;
          break;
        case "L":
          loopPipeIndex += 1;
          lastDirection = "right";
          break;
        case "J":
          loopPipeIndex -= 1;
          lastDirection = "left";
          break;
      }
    }

    if (lastDirection === "right") {
      switch (currentPipe) {
        case "-":
          loopPipeIndex += 1;
          break;
        case "7":
          loopRowIndex += 1;
          lastDirection = "below";
          break;
        case "J":
          loopRowIndex -= 1;
          lastDirection = "above";
          break;
      }
    }

    if (lastDirection === "left") {
      switch (currentPipe) {
        case "-":
          loopPipeIndex -= 1;
          break;
        case "F":
          loopRowIndex += 1;
          lastDirection = "below";
          break;
        case "L":
          loopRowIndex -= 1;
          lastDirection = "above";
          break;
      }
    }
  }

  for (let rowIndex = 0; rowIndex < field.length; rowIndex += 1) {
    let contained = false;
    for (let pipeIndex = 0; pipeIndex < field[rowIndex].length; pipeIndex += 1) {
      const currentPipe = field[rowIndex][pipeIndex];
      switch (contained) {
        case false:
          if (currentPipe.loopPiece && currentPipe.pipe === "|") {
            contained = true;
          }
          if (currentPipe.loopPiece && currentPipe.pipe === "F") {
            contained = "bottom";
          }
          if (currentPipe.loopPiece && currentPipe.pipe === "L") {
            contained = "top";
          }
          break;
        case "bottom":
          if (currentPipe.loopPiece && currentPipe.pipe === "7") {
            contained = false;
          }
          if (currentPipe.loopPiece && currentPipe.pipe === "J") {
            contained = true;
          }
          break;
        case "top":
          if (currentPipe.loopPiece && currentPipe.pipe === "7") {
            contained = true;
          }
          if (currentPipe.loopPiece && currentPipe.pipe === "J") {
            contained = false;
          }
          break;
        case true:
          if (currentPipe.loopPiece && currentPipe.pipe === "|") {
            contained = false;
          }
          if (currentPipe.loopPiece && currentPipe.pipe === "F") {
            contained = "top";
          }
          if (currentPipe.loopPiece && currentPipe.pipe === "L") {
            contained = "bottom";
          }
          if (!currentPipe.loopPiece) {
            field[rowIndex][pipeIndex].isContained = true;
          }
          break;
      }
    }
  }

  const containedCount = field.reduce(
    (previousCount, currentRow) => previousCount + currentRow.filter((pipe) => pipe.isContained).length,
    0
  );

  return containedCount;
};

const functions = [];

for (const [sampleIndex, sample] of firstPartSamples.split("\n\n").entries()) {
  functions.push({ name: `p1: sample ${sampleIndex + 1}`, func: () => handleInputPartOne(sample) });
}
functions.push({ name: `p1: actual`, func: () => handleInputPartOne(actual) });

for (const [sampleIndex, sample] of secondPartSamples.split("\n\n").entries()) {
  functions.push({ name: `p2: sample ${sampleIndex + 1}`, func: () => handleInputPartTwo(sample) });
}
functions.push({ name: `p2: actual`, func: () => handleInputPartTwo(actual) });

logBenchmarkTimes(functions);
