import { logResult, logDebug, readFile, logBenchmark } from "../util";
logBenchmark(performance.now());
const inputString = readFile(process.argv[2]);
const [originalRegisterList, programList] = inputString
  .split("\n\n")
  .map((lineGroup) =>
    lineGroup
      .split("\n")
      .map((line) =>
        line
          .split(": ")[1]
          .split(",")
          .map((value) => parseInt(value))
      )
      .flat()
  );

let registerAValue = 0;
let outList: number[] = [];
while (outList.join(",") !== programList.join(",")) {
  let instructionPointer = 0;
  registerAValue += 1;
  if (registerAValue % 10000000 === 0) {
    logDebug(registerAValue);
  }
  const registerList = [
    registerAValue,
    originalRegisterList[1],
    originalRegisterList[2],
  ];
  outList = [];
  while (instructionPointer < programList.length) {
    const [opCode, literalOperand] = programList.slice(
      instructionPointer,
      instructionPointer + 2
    );
    instructionPointer += 2;
    const comboOperand =
      literalOperand >= 4 ? registerList[literalOperand - 4] : literalOperand;

    if (opCode === 0) {
      registerList[0] = Math.trunc(registerList[0] / Math.pow(2, comboOperand));
    } else if (opCode === 1) {
      registerList[1] = registerList[1] ^ literalOperand;
    } else if (opCode === 2) {
      registerList[1] = comboOperand % 8;
    } else if (opCode === 3 && registerList[0] != 0) {
      instructionPointer = literalOperand;
    } else if (opCode === 4) {
      registerList[1] = registerList[1] ^ registerList[2];
    } else if (opCode === 5) {
      if (
        outList.length >= programList.length ||
        programList[outList.length] !== comboOperand % 8
      ) {
        break;
      }
      outList.push(comboOperand % 8);
    } else if (opCode === 6) {
      registerList[1] = Math.trunc(registerList[0] / Math.pow(2, comboOperand));
    } else if (opCode === 7) {
      registerList[2] = Math.trunc(registerList[0] / Math.pow(2, comboOperand));
    }
  }
}

logResult(registerAValue);
logBenchmark(performance.now());
