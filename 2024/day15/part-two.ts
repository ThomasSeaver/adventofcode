import { logResult, logDebug, readFile, logBenchmark } from "../util";
logBenchmark(performance.now());
const inputString = readFile(process.argv[2]);
const [roomMatrixString, moveString] = inputString.split("\n\n");
let roomMatrix = roomMatrixString.split("\n").map((roomRow) =>
  roomRow.split("").flatMap((roomColumn) => {
    if (roomColumn === "#") {
      return ["#", "#"];
    } else if (roomColumn === "O") {
      return ["[", "]"];
    } else if (roomColumn === ".") {
      return [".", "."];
    } else {
      return ["@", "."];
    }
  })
);
const moveList = moveString.split("\n").join("").split("");

const handleMove = (sourceX, sourceY, move, roomMatrix) => {
  const sourceElement = roomMatrix[sourceY][sourceX];
  if (sourceElement === "[") {
  } else if (sourceElement === "]") {
  } else {
    const targetX =
      move === "^" || move === "v"
        ? sourceX
        : move === "<"
        ? sourceX - 1
        : sourceX + 1;
    const targetY =
      move === "<" || move === ">"
        ? sourceY
        : move === "^"
        ? sourceY - 1
        : sourceY + 1;

    // logDebug(sourceX, sourceY, move, targetX, targetY);

    const editedRoomMatrix = handleMove(targetX, targetY, move, roomMatrix);

    if (
      roomMatrix[targetY][targetX] === "." ||
      (roomMatrix[targetY][targetX] !== "#" && editedRoomMatrix !== null)
    ) {
      editedRoomMatrix[targetY][targetX] = editedRoomMatrix[sourceY][sourceX];
      editedRoomMatrix[sourceY][sourceX] = ".";
      return editedRoomMatrix;
    }
    return null;
  }
};

logDebug(roomMatrix.map((roomRow) => roomRow.join("")).join("\n"));

for (const move of moveList) {
  const sourceY = roomMatrix.findIndex((roomRow) => roomRow.includes("@"));
  const sourceX = roomMatrix[sourceY].indexOf("@");
  roomMatrix =
    handleMove(sourceX, sourceY, move, [
      ...roomMatrix.map((originalRoomRow) => [...originalRoomRow]),
    ]) ?? roomMatrix;
}

// logDebug(roomMatrix.map((roomRow) => roomRow.join("")).join("\n"));

logResult(
  roomMatrix.reduce(
    (previousRowSum, roomRow, roomRowIndex) =>
      previousRowSum +
      roomRow.reduce(
        (previousColumnSum, roomColumn, roomColumnIndex) =>
          previousColumnSum +
          (roomColumn === "O" ? roomRowIndex * 100 + roomColumnIndex : 0),
        0
      ),
    0
  )
);
logBenchmark(performance.now());
