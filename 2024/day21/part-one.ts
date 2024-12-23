import { logResult, readFile, logBenchmark } from "../util";
logBenchmark(performance.now());
const inputString = readFile(process.argv[2]);
const codeList = inputString.split("\n");

const numericKeypad = [
  ["7", "8", "9"],
  ["4", "5", "6"],
  ["1", "2", "3"],
  ["X", "0", "A"],
];
const directionalKeypad = [
  ["X", "^", "A"],
  ["<", "v", ">"],
];

const findSequences = (
  keypad: string[][],
  rowIndex: number,
  columnIndex: number,
  sequence: string,
  path: [number, number][]
): Record<string, string[]> => {
  const sequenceMap: Record<string, string[]> = {};
  if (
    rowIndex > 0 &&
    keypad[rowIndex - 1][columnIndex] !== "X" &&
    !path.some(
      ([pathRowIndex, pathColumnIndex]) =>
        pathRowIndex === rowIndex - 1 && pathColumnIndex === columnIndex
    )
  ) {
    const newSequence = `${sequence}^`;
    sequenceMap[keypad[rowIndex - 1][columnIndex]] = [newSequence];
    const subsequentSequenceMap = findSequences(
      keypad,
      rowIndex - 1,
      columnIndex,
      newSequence,
      [...path, [rowIndex - 1, columnIndex]]
    );
    for (const subsequentKey in subsequentSequenceMap) {
      sequenceMap[subsequentKey] = [
        ...(sequenceMap[subsequentKey] ?? []),
        ...subsequentSequenceMap[subsequentKey],
      ];
    }
  }

  if (
    rowIndex < keypad.length - 1 &&
    keypad[rowIndex + 1][columnIndex] !== "X" &&
    !path.some(
      ([pathRowIndex, pathColumnIndex]) =>
        pathRowIndex === rowIndex + 1 && pathColumnIndex === columnIndex
    )
  ) {
    const newSequence = `${sequence}v`;
    sequenceMap[keypad[rowIndex + 1][columnIndex]] = [newSequence];
    const subsequentSequenceMap = findSequences(
      keypad,
      rowIndex + 1,
      columnIndex,
      newSequence,
      [...path, [rowIndex + 1, columnIndex]]
    );
    for (const subsequentKey in subsequentSequenceMap) {
      sequenceMap[subsequentKey] = [
        ...(sequenceMap[subsequentKey] ?? []),
        ...subsequentSequenceMap[subsequentKey],
      ];
    }
  }

  if (
    columnIndex > 0 &&
    keypad[rowIndex][columnIndex - 1] !== "X" &&
    !path.some(
      ([pathRowIndex, pathColumnIndex]) =>
        pathRowIndex === rowIndex && pathColumnIndex === columnIndex - 1
    )
  ) {
    const newSequence = `${sequence}<`;
    sequenceMap[keypad[rowIndex][columnIndex - 1]] = [newSequence];
    const subsequentSequenceMap = findSequences(
      keypad,
      rowIndex,
      columnIndex - 1,
      newSequence,
      [...path, [rowIndex, columnIndex - 1]]
    );
    for (const subsequentKey in subsequentSequenceMap) {
      sequenceMap[subsequentKey] = [
        ...(sequenceMap[subsequentKey] ?? []),
        ...subsequentSequenceMap[subsequentKey],
      ];
    }
  }

  if (
    columnIndex < keypad[rowIndex].length - 1 &&
    keypad[rowIndex][columnIndex + 1] !== "X" &&
    !path.some(
      ([pathRowIndex, pathColumnIndex]) =>
        pathRowIndex === rowIndex && pathColumnIndex === columnIndex + 1
    )
  ) {
    const newSequence = `${sequence}>`;
    sequenceMap[keypad[rowIndex][columnIndex + 1]] = [newSequence];
    const subsequentSequenceMap = findSequences(
      keypad,
      rowIndex,
      columnIndex + 1,
      newSequence,
      [...path, [rowIndex, columnIndex + 1]]
    );
    for (const subsequentKey in subsequentSequenceMap) {
      sequenceMap[subsequentKey] = [
        ...(sequenceMap[subsequentKey] ?? []),
        ...subsequentSequenceMap[subsequentKey],
      ];
    }
  }
  return sequenceMap;
};

const numericKeypadPathMap: Record<string, Record<string, string[]>> = {};
for (let rowIndex = 0; rowIndex < numericKeypad.length; rowIndex += 1) {
  for (
    let columnIndex = 0;
    columnIndex < numericKeypad[rowIndex].length;
    columnIndex += 1
  ) {
    const key = numericKeypad[rowIndex][columnIndex];
    if (key === "X") {
      continue;
    }

    numericKeypadPathMap[key] = findSequences(
      numericKeypad,
      rowIndex,
      columnIndex,
      "",
      [[rowIndex, columnIndex]]
    );
  }
}

for (const numericKeypadOriginKey in numericKeypadPathMap) {
  for (const numericKeypadDestinationKey in numericKeypadPathMap[
    numericKeypadOriginKey
  ]) {
    let minimumSequenceLength =
      numericKeypadPathMap[numericKeypadOriginKey][
        numericKeypadDestinationKey
      ][0].length;
    for (const sequence of numericKeypadPathMap[numericKeypadOriginKey][
      numericKeypadDestinationKey
    ]) {
      minimumSequenceLength = Math.min(sequence.length, minimumSequenceLength);
    }
    numericKeypadPathMap[numericKeypadOriginKey][numericKeypadDestinationKey] =
      numericKeypadPathMap[numericKeypadOriginKey][numericKeypadDestinationKey]
        .filter((sequence) => sequence.length === minimumSequenceLength)
        .map((sequence) => `${sequence}A`);
  }
}

const directionalKeypadPathMap: Record<string, Record<string, string[]>> = {};
for (let rowIndex = 0; rowIndex < directionalKeypad.length; rowIndex += 1) {
  for (
    let columnIndex = 0;
    columnIndex < directionalKeypad[rowIndex].length;
    columnIndex += 1
  ) {
    const key = directionalKeypad[rowIndex][columnIndex];
    if (key === "X") {
      continue;
    }

    directionalKeypadPathMap[key] = {
      [key]: [""],
      ...findSequences(directionalKeypad, rowIndex, columnIndex, "", [
        [rowIndex, columnIndex],
      ]),
    };
  }
}

for (const directionalKeypadOriginKey in directionalKeypadPathMap) {
  for (const directionalKeypadDestinationKey in directionalKeypadPathMap[
    directionalKeypadOriginKey
  ]) {
    let minimumSequenceLength =
      directionalKeypadPathMap[directionalKeypadOriginKey][
        directionalKeypadDestinationKey
      ][0].length;
    for (const sequence of directionalKeypadPathMap[directionalKeypadOriginKey][
      directionalKeypadDestinationKey
    ]) {
      minimumSequenceLength = Math.min(sequence.length, minimumSequenceLength);
    }
    directionalKeypadPathMap[directionalKeypadOriginKey][
      directionalKeypadDestinationKey
    ] = directionalKeypadPathMap[directionalKeypadOriginKey][
      directionalKeypadDestinationKey
    ]
      .filter((sequence) => sequence.length === minimumSequenceLength)
      .map((sequence) => `${sequence}A`);
  }
}

let sum = 0;
for (const code of codeList) {
  let lastInput = "A";
  let sequenceList = [""];
  for (const input of [...code]) {
    const inputPaths = numericKeypadPathMap[lastInput][input];
    sequenceList = sequenceList.flatMap((oldSequence) =>
      inputPaths.map((newSequence) => `${oldSequence}${newSequence}`)
    );
    lastInput = input;
  }

  sequenceList = sequenceList.flatMap((sequence) => {
    let lastInput = "A";
    let innerSequenceList = [""];
    for (const input of [...sequence]) {
      const inputPaths = directionalKeypadPathMap[lastInput][input];
      innerSequenceList = innerSequenceList.flatMap((oldSequence) =>
        inputPaths.map((newSequence) => `${oldSequence}${newSequence}`)
      );
      lastInput = input;
    }
    return innerSequenceList;
  });
  const minimumSequenceFirstPassLength = sequenceList.reduce(
    (previousValue, currentSequence) =>
      Math.min(currentSequence.length, previousValue),
    sequenceList[0].length
  );
  sequenceList = sequenceList.filter(
    (sequence) => sequence.length === minimumSequenceFirstPassLength
  );

  sequenceList = sequenceList.flatMap((sequence) => {
    let lastInput = "A";
    let innerSequenceList = [""];
    for (const input of [...sequence]) {
      const inputPaths = directionalKeypadPathMap[lastInput][input];
      innerSequenceList = innerSequenceList.flatMap((oldSequence) =>
        inputPaths.map((newSequence) => `${oldSequence}${newSequence}`)
      );
      lastInput = input;
    }
    return innerSequenceList;
  });
  const minimumSequenceSecondPassLength = sequenceList.reduce(
    (previousValue, currentSequence) =>
      Math.min(currentSequence.length, previousValue),
    sequenceList[0].length
  );
  sequenceList = sequenceList.filter(
    (sequence) => sequence.length === minimumSequenceSecondPassLength
  );
  sum +=
    minimumSequenceSecondPassLength * parseInt(code.slice(0, code.length - 1));
}

logResult(sum);
logBenchmark(performance.now());
