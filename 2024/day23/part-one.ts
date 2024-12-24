import { logResult, readFile, logBenchmark } from "../util";
logBenchmark(performance.now());
const inputString = readFile(process.argv[2]);
const connectionList = inputString
  .split("\n")
  .map((connection) => connection.split("-"));

const machineMap: Record<string, string[]> = {};
for (const connection of connectionList) {
  for (const [firstMember, secondMember] of [
    connection,
    connection.slice().reverse(),
  ]) {
    if (machineMap[firstMember] == null) {
      machineMap[firstMember] = [];
    }
    machineMap[firstMember].push(secondMember);
  }
}

logResult(
  new Set(
    Object.entries(machineMap)
      .filter(([key]) => key.startsWith("t"))
      .flatMap(([key, connectedMachineList]) => {
        const threeFamilyList = [];
        for (const connectedMachine of connectedMachineList) {
          const matchingMemberList = connectedMachineList.filter(
            (adjacentMachine) =>
              machineMap[adjacentMachine].includes(connectedMachine)
          );
          for (const matchingMember of matchingMemberList) {
            threeFamilyList.push(
              [matchingMember, connectedMachine, key].sort().join("-")
            );
          }
        }
        return threeFamilyList;
      })
  ).size
);
logBenchmark(performance.now());
