import { logResult, readFile, logBenchmark } from "../util";
logBenchmark(performance.now());
const inputString = readFile(process.argv[2]);
const [roomMatrixString, moveString] = inputString.split("\n\n");
const roomMatrix = roomMatrixString
  .split("\n")
  .map((roomRow) => roomRow.split(""));
const moveList = moveString.split("\n").join("").split("");

const handleMove = (sourceX: number, sourceY: number, move: string) => {
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

  if (
    roomMatrix[targetY][targetX] === "." ||
    (roomMatrix[targetY][targetX] === "O" && handleMove(targetX, targetY, move))
  ) {
    roomMatrix[targetY][targetX] = roomMatrix[sourceY][sourceX];
    roomMatrix[sourceY][sourceX] = ".";
    return true;
  } else {
    return false;
  }
};

for (const move of moveList) {
  const sourceY = roomMatrix.findIndex((roomRow) => roomRow.includes("@"));
  const sourceX = roomMatrix[sourceY].indexOf("@");
  handleMove(sourceX, sourceY, move);
}

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
