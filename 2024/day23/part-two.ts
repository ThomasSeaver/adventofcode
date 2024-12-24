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
  [
    ...new Set(
      Object.entries(machineMap).flatMap(([key, connectedMachineList]) => {
        const potentialFamilyList = [key, ...connectedMachineList];
        let connectionCountList = potentialFamilyList
          .map((familyMember) => ({
            key: familyMember,
            count: machineMap[familyMember].filter((familyMemberConnection) =>
              potentialFamilyList.includes(familyMemberConnection)
            ).length,
          }))
          .sort(({ count: countA }, { count: countB }) => countA - countB);
        while (
          connectionCountList.some(
            ({ count }) => count !== potentialFamilyList.length - 1
          )
        ) {
          potentialFamilyList.splice(
            potentialFamilyList.indexOf(connectionCountList[0].key),
            1
          );
          connectionCountList = potentialFamilyList.map((familyMember) => ({
            key: familyMember,
            count: machineMap[familyMember].filter((familyMemberConnection) =>
              potentialFamilyList.includes(familyMemberConnection)
            ).length,
          }));
        }

        return potentialFamilyList.sort().join(",");
      })
    ).entries(),
  ]
    .map(([key]) => key)
    .sort((listA, listB) => listB.length - listA.length)[0]
);
logBenchmark(performance.now());
