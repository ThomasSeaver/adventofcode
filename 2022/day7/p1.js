import { useInput } from "../util.js";

const handleInput = (input) => {
  const res = [];

  let curNode = {
    name: undefined,
    parent: undefined,
    dirs: [],
    size: 0,
    dirsAdded: false,
  };
  let root = curNode;
  curNode.dirs.push({
    name: "/",
    parent: curNode,
    dirs: [],
    dirsAdded: false,
    size: 0,
  });
  for (const line of input) {
    if (line.charAt(0) == "$") {
      if (line.charAt(2) == "c") {
        if (line.charAt(5) != ".") {
          curNode = curNode.dirs.find((dir) => dir.name == line.split(" ")[2]);
        } else {
          curNode = curNode.parent;
        }
      }
    } else {
      const [size, name] = line.split(" ");
      if (size == "dir") {
        curNode.dirs.push({
          name,
          parent: curNode,
          dirs: [],
          size: 0,
          dirsAdded: false,
        });
      } else {
        curNode.size += parseInt(size);
      }
    }
  }

  const sizeList = [];
  const getSize = (node) => {
    if (!node.dirsAdded) {
      node.dirsAdded = true;
      node.size += node.dirs.reduce(
        (acc, cur) => acc + parseInt(getSize(cur)),
        0
      );
      sizeList.push(parseInt(node.size));
    }
    return parseInt(node.size);
  };
  getSize(root);

  res.push(
    sizeList.filter((size) => size <= 100000).reduce((acc, cur) => acc + cur, 0)
  );

  const requiredSpace = 30000000 - (70000000 - root.size);

  res.push(
    sizeList.filter((size) => size >= requiredSpace).sort((a, b) => a - b)[0]
  );

  return res;
};

console.log("example outcome", handleInput(useInput("e.txt")));

console.log("real outcome", handleInput(useInput("i.txt")));
