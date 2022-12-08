import { useInput } from "../util.js";

const handleInput = (input) => {
  const res = [];

  let treeMap = [];
  for (const line of input) {
    treeMap.push(line.split("").map((tree) => parseInt(tree)));
  }

  let visible = treeMap.length * 4 - 4;
  for (let row = 1; row < treeMap.length - 1; row += 1) {
    for (let col = 1; col < treeMap.length - 1; col += 1) {
      let curHeight = treeMap[row][col];

      let leftVisible = true;
      for (let rowCheck = row - 1; rowCheck >= 0; rowCheck -= 1) {
        let checkHeight = treeMap[rowCheck][col];
        if (checkHeight >= curHeight) {
          leftVisible = false;
          break;
        }
      }

      let rightVisible = true;
      for (let rowCheck = row + 1; rowCheck < treeMap.length; rowCheck += 1) {
        let checkHeight = treeMap[rowCheck][col];
        if (checkHeight >= curHeight) {
          rightVisible = false;
          break;
        }
      }

      let upVisible = true;
      for (let colCheck = col - 1; colCheck >= 0; colCheck -= 1) {
        let checkHeight = treeMap[row][colCheck];
        if (checkHeight >= curHeight) {
          upVisible = false;
          break;
        }
      }

      let downVisible = true;
      for (let colCheck = col + 1; colCheck < treeMap.length; colCheck += 1) {
        let checkHeight = treeMap[row][colCheck];
        if (checkHeight >= curHeight) {
          downVisible = false;
          break;
        }
      }

      if (upVisible || downVisible || leftVisible || rightVisible) {
        visible += 1;
      }
    }
  }

  res.push(visible);

  let bestScenicScore = 0;
  for (let row = 0; row < treeMap.length; row += 1) {
    for (let col = 0; col < treeMap.length; col += 1) {
      let curHeight = treeMap[row][col];

      let leftScore = 0;
      for (let rowCheck = row - 1; rowCheck >= 0; rowCheck -= 1) {
        let checkHeight = treeMap[rowCheck][col];
        leftScore += 1;
        if (checkHeight >= curHeight) {
          break;
        }
      }

      let rightScore = 0;
      for (let rowCheck = row + 1; rowCheck < treeMap.length; rowCheck += 1) {
        let checkHeight = treeMap[rowCheck][col];
        rightScore += 1;
        if (checkHeight >= curHeight) {
          break;
        }
      }

      let upScore = 0;
      for (let colCheck = col - 1; colCheck >= 0; colCheck -= 1) {
        let checkHeight = treeMap[row][colCheck];
        upScore += 1;
        if (checkHeight >= curHeight) {
          break;
        }
      }

      let downScore = 0;
      for (let colCheck = col + 1; colCheck < treeMap.length; colCheck += 1) {
        let checkHeight = treeMap[row][colCheck];
        downScore += 1;
        if (checkHeight >= curHeight) {
          break;
        }
      }

      const scenicScore = leftScore * upScore * downScore * rightScore;

      if (scenicScore > bestScenicScore) {
        bestScenicScore = scenicScore;
      }
    }
  }

  res.push(bestScenicScore);

  return res;
};

console.log("example outcome", handleInput(useInput("e.txt")));

console.log("real outcome", handleInput(useInput("i.txt")));
