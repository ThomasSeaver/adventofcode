import { useInput } from "../util.js";

// This is my nightmare and there's probably a stupidly easy way to do ti
const parsePacket = (string) => {
  const leftEdge = string.indexOf("[");
  const rightEdge = string.lastIndexOf("]");

  if (leftEdge == -1 || rightEdge == -1) return string.split(",");

  const slice = string.slice(leftEdge + 1, rightEdge);
  const chunks = [];
  let bracketCount = 0;
  let substring = "";

  for (let charIndex = 0; charIndex < slice.length; charIndex += 1) {
    const char = slice.charAt(charIndex);

    if (char == "[") {
      if (bracketCount == 0 && substring.length > 1) {
        chunks.push(
          ...substring
            .split(",")
            .filter((subsubstring) => subsubstring.length > 0)
        );
        substring = "";
      }
      bracketCount += 1;
    }

    substring += char;

    if (char == "]") {
      bracketCount -= 1;
      if (bracketCount == 0) {
        chunks.push(parsePacket(substring));
        substring = "";
      }
    }
  }

  if (substring.length > 0)
    chunks.push(
      ...substring.split(",").filter((subsubstring) => subsubstring.length > 0)
    );

  return chunks;
};

const parseInput = (input) =>
  input.map((packetPair) =>
    packetPair.split("\n").map((packet) => parsePacket(packet))
  );

const compareValues = (valueA, valueB) => {
  if (Array.isArray(valueA) && Array.isArray(valueB)) {
    for (
      let listIndex = 0;
      listIndex < Math.max(valueA.length, valueB.length);
      listIndex += 1
    ) {
      if (listIndex >= valueA.length) return true;
      if (listIndex >= valueB.length) return false;
      const compareResult = compareValues(valueA[listIndex], valueB[listIndex]);
      if (compareResult !== null) return compareResult;
    }
    return null;
  } else if (Array.isArray(valueA)) {
    return compareValues(valueA, [valueB]);
  } else if (Array.isArray(valueB)) {
    return compareValues([valueA], valueB);
  } else if (
    Number.isInteger(parseInt(valueA)) &&
    Number.isInteger(parseInt(valueB))
  ) {
    if (parseInt(valueA) === parseInt(valueB)) {
      return null;
    }
    return parseInt(valueA) < parseInt(valueB);
  }
};

const packetsInOrder = (packetA, packetB) => compareValues(packetA, packetB);

const handlePacketPairs = (packets) => {
  let packetSum = 0;

  packets.forEach(([packetA, packetB], packetPairIndex) => {
    const inOrder = packetsInOrder(packetA, packetB);
    if (inOrder) packetSum += packetPairIndex + 1;
  });

  return packetSum;
};

const orderAllPackets = (packets) => {
  const allPackets = [
    ...packets.flatMap((packetPair) => packetPair),
    [["2"]],
    [["6"]],
  ];

  allPackets.sort((packetA, packetB) =>
    compareValues(packetA, packetB) ? -1 : 1
  );

  const multiply =
    (allPackets.findIndex(
      (packet) =>
        packet.length === 1 && packet[0].length === 1 && packet[0][0] === "2"
    ) +
      1) *
    (allPackets.findIndex(
      (packet) =>
        packet.length === 1 && packet[0].length === 1 && packet[0][0] === "6"
    ) +
      1);

  return multiply;
};

const handleInput = (input) => {
  const res = [];

  const packets = parseInput(input);

  const packetCount = handlePacketPairs(packets);
  res.push(packetCount);

  res.push(orderAllPackets(packets));

  return res;
};

console.log("example outcome", ...handleInput(useInput("e.txt", "\n\n")));
console.log("real outcome", ...handleInput(useInput("i.txt", "\n\n")));
