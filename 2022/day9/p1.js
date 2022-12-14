import { useInput } from "../util.js";

// hacky
// const handleInput = (input) => {
//   const res = [];

//   let output = 0;
//   const headPos = [500, 500];
//   const tailPos = [500, 500];
//   let visited = {};
//   for (const line of input) {
//     const [dir, count] = line.split(" ");

//     for (let _ = 0; _ < count; _ += 1) {
//       if (dir == "R") {
//         headPos[0] += 1;
//       } else if (dir == "L") {
//         headPos[0] -= 1;
//       } else if (dir == "U") {
//         headPos[1] += 1;
//       } else if (dir == "D") {
//         headPos[1] -= 1;
//       }

//       if (headPos[0] - tailPos[0] > 1 || tailPos[0] - headPos[0] > 1) {
//         tailPos[0] += headPos[0] > tailPos[0] ? 1 : -1;
//         tailPos[1] = headPos[1];
//       }

//       if (headPos[1] - tailPos[1] > 1 || tailPos[1] - headPos[1] > 1) {
//         tailPos[1] += headPos[1] > tailPos[1] ? 1 : -1;
//         tailPos[0] = headPos[0];
//       }

//       visited[tailPos.join("-")] = true;
//     }
//   }
//   output = Object.entries(visited).length;

//   res.push(output);

//   const ropePos = [
//     [200, 200],
//     [200, 200],
//     [200, 200],
//     [200, 200],
//     [200, 200],
//     [200, 200],
//     [200, 200],
//     [200, 200],
//     [200, 200],
//     [200, 200],
//   ];
//   visited = {};
//   for (const line of input) {
//     const [dir, count] = line.split(" ");

//     for (let _ = 0; _ < count; _ += 1) {
//       if (dir == "R") {
//         ropePos[0][0] += 1;
//       } else if (dir == "L") {
//         ropePos[0][0] -= 1;
//       } else if (dir == "U") {
//         ropePos[0][1] += 1;
//       } else if (dir == "D") {
//         ropePos[0][1] -= 1;
//       }

//       for (let ropeIndex = 1; ropeIndex < ropePos.length; ropeIndex += 1) {
//         if (
//           ropePos[ropeIndex - 1][0] - ropePos[ropeIndex][0] > 1 ||
//           ropePos[ropeIndex][0] - ropePos[ropeIndex - 1][0] > 1
//         ) {
//           ropePos[ropeIndex][0] +=
//             ropePos[ropeIndex - 1][0] > ropePos[ropeIndex][0] ? 1 : -1;
//           ropePos[ropeIndex][1] = ropePos[ropeIndex - 1][1];
//         }

//         if (
//           ropePos[ropeIndex - 1][1] - ropePos[ropeIndex][1] > 1 ||
//           ropePos[ropeIndex][1] - ropePos[ropeIndex - 1][1] > 1
//         ) {
//           ropePos[ropeIndex][1] +=
//             ropePos[ropeIndex - 1][1] > ropePos[ropeIndex][1] ? 1 : -1;
//           ropePos[ropeIndex][0] = ropePos[ropeIndex - 1][0];
//         }
//       }
//       let visualization = [];

//       for (let i = 0; i < 6; i += 1) {
//         let row = [];
//         for (let j = 0; j < 6; j += 1) {
//           let pos = ropePos.findIndex(
//             (rope) => rope[0] === j + 200 && rope[1] === i + 200
//           );
//           row.push(pos === -1 ? "." : pos);
//         }
//         visualization.push(row.join(""));
//       }
//       console.log(visualization.reverse().join("\n"), "\n");
//       visited[ropePos.at(-1).join("-")] = true;
//     }
//   }
//   output = Object.entries(visited).length;

//   res.push(output);

//   return res;
// };

const getNewRopeChunkPosition = (currentPosition, parentChunkPosition) => {
  const [currentX, currentY] = currentPosition;
  const [parentX, parentY] = parentChunkPosition;
  const displacementX = parentX - currentX;
  const displacementY = parentY - currentY;

  let movementX = 0;
  if (
    Math.abs(displacementX) > 1 ||
    (Math.abs(displacementX) == 1 && Math.abs(displacementY) > 1)
  ) {
    movementX = Math.sign(displacementX);
  }

  let movementY = 0;
  if (
    Math.abs(displacementY) > 1 ||
    (Math.abs(displacementY) == 1 && Math.abs(displacementX) > 1)
  ) {
    movementY = Math.sign(displacementY);
  }

  return [currentX + movementX, currentY + movementY];
};

const visualize = (rope) => {
  let visualization = [];

  for (let i = -5; i < 5; i += 1) {
    let row = [];
    for (let j = -5; j < 5; j += 1) {
      let pos = rope.findIndex(
        (ropeChunk) => ropeChunk[0] === j && ropeChunk[1] === i
      );
      if (i == 0 && j == 0) {
        row.push("S");
      } else if (pos === -1) {
        row.push(".");
      } else if (pos === 0) {
        row.push("H");
      } else if (pos === rope.length - 1) {
        row.push("T");
      } else {
        row.push(pos);
      }
    }
    visualization.push(row.join(""));
  }
  console.log(visualization.reverse().join("\n"), "\n");
};

const countVisited = (input, ropeLength) => {
  const rope = [];
  for (let _ = 0; _ < ropeLength; _ += 1) {
    rope.push([0, 0]);
  }

  const visited = {};
  for (const line of input) {
    const [dir, count] = line.split(" ");

    for (let _ = 0; _ < count; _ += 1) {
      //console.log(dir, count);
      if (dir == "R") {
        rope[0][0] += 1;
      } else if (dir == "L") {
        rope[0][0] -= 1;
      } else if (dir == "U") {
        rope[0][1] += 1;
      } else if (dir == "D") {
        rope[0][1] -= 1;
      }

      for (
        let ropeChunkIndex = 1;
        ropeChunkIndex < rope.length;
        ropeChunkIndex += 1
      ) {
        rope[ropeChunkIndex] = getNewRopeChunkPosition(
          rope[ropeChunkIndex],
          rope[ropeChunkIndex - 1]
        );
      }
      //console.log(rope);
      //visualize(rope);

      visited[rope.at(-1).join("-")] = true;
    }
  }
  return Object.entries(visited).length;
};

const handleInput = (input) => {
  const res = [];

  res.push(countVisited(input, 2));
  res.push(countVisited(input, 10));

  return res;
};

console.log("example outcome", handleInput(useInput("e.txt")));
console.log("example-2 outcome", handleInput(useInput("e2.txt")));
console.log("real outcome", handleInput(useInput("i.txt")));
