const { logBenchmarkTimes } = require("../../utils/benchmark");
const { grabText } = require("../../utils/grab-text");
const samples = grabText(`${__dirname}/s.txt`);
const actual = grabText(`${__dirname}/i.txt`);

const handleInputPartOne = (input) => {
  const workflows = Object.fromEntries(
    input
      .split("\n\n")[0]
      .split("\n")
      .map((inputRow) => [
        inputRow.split("{")[0],
        inputRow
          .slice(inputRow.indexOf("{") + 1, inputRow.indexOf("}"))
          .split(",")
          .map((rule) => ({
            workflowKey: rule.split(":")[1] ?? rule,
            condition: rule.split(":")[1] ? rule.split(":")[0] : undefined,
          })),
      ])
  );

  const parts = input
    .split("\n\n")[1]
    .split("\n")
    .map((inputRow) =>
      Object.fromEntries(
        inputRow
          .slice(inputRow.indexOf("{") + 1, inputRow.indexOf("}"))
          .split(",")
          .map((attribute) => attribute.split("="))
          .map((attribute) => [attribute[0], parseInt(attribute[1])])
      )
    );

  let acceptedSum = 0;
  for (const part of parts) {
    let currentWorkflow = "in";
    while (!(currentWorkflow === "A" || currentWorkflow === "R")) {
      const rules = workflows[currentWorkflow];
      for (const rule of rules) {
        if (rule.condition === undefined) {
          currentWorkflow = rule.workflowKey;
          break;
        }

        const conditionParameter = rule.condition[0];
        const conditionDirection = rule.condition[1];
        const conditionRequirement = parseInt(rule.condition.slice(2));
        const meetsCondition =
          conditionDirection === ">"
            ? part[conditionParameter] > conditionRequirement
            : part[conditionParameter] < conditionRequirement;
        if (meetsCondition) {
          currentWorkflow = rule.workflowKey;
          break;
        }
      }
    }
    if (currentWorkflow === "A") {
      acceptedSum += part.x + part.m + part.a + part.s;
    }
  }
  return acceptedSum;
};

const handleInputPartTwo = (input) => {
  const workflows = input.split("\n\n")[0].split("\n");

  const conditions = {};

  for (const workflow of workflows) {
    const key = workflow.split("{")[0];
    const workflowConditions = workflow.split("{")[1].slice(0, -1).split(",");

    while (workflowConditions.length > 2) {
      const subKey = `${key}${workflowConditions.length}`;
      conditions[subKey] = {
        rule: workflowConditions.at(-2).split(":")[0],
        passState: workflowConditions.at(-2).split(":")[1],
        failState: workflowConditions.at(-1),
      };
      workflowConditions.pop();
      workflowConditions[workflowConditions.length - 1] = subKey;
    }
    conditions[key] = {
      rule: workflowConditions[0].split(":")[0],
      passState: workflowConditions[0].split(":")[1],
      failState: workflowConditions[1],
    };
  }

  const checkConditions = (conditionKey, validRanges) => {
    if (conditionKey === "A") {
      return Object.values(validRanges).reduce((previousTotal, range) => previousTotal * (range[1] + 1 - range[0]), 1);
    } else if (conditionKey === "R") {
      return 0;
    }

    const { rule, passState, failState } = conditions[conditionKey];

    const ruleParameter = rule[0];
    const ruleDirection = rule[1];
    const ruleRequirement = parseInt(rule.slice(2));

    const passRanges = {
      ...validRanges,
      [ruleParameter]:
        ruleDirection === ">"
          ? [Math.max(validRanges[ruleParameter][0], ruleRequirement + 1), validRanges[ruleParameter][1]]
          : [validRanges[ruleParameter][0], Math.min(validRanges[ruleParameter][1], ruleRequirement - 1)],
    };
    const failRanges = {
      ...validRanges,
      [ruleParameter]:
        ruleDirection === "<"
          ? [Math.max(validRanges[ruleParameter][0], ruleRequirement), validRanges[ruleParameter][1]]
          : [validRanges[ruleParameter][0], Math.min(validRanges[ruleParameter][1], ruleRequirement)],
    };

    return checkConditions(passState, passRanges) + checkConditions(failState, failRanges);
  };

  return checkConditions("in", { x: [1, 4000], m: [1, 4000], a: [1, 4000], s: [1, 4000] });
};

logBenchmarkTimes([
  ...samples.split("\n---\n").map((sample, sampleIndex, samples) => ({
    name: `p1: sample${samples.length > 1 ? " " + sampleIndex : ""}`,
    func: () => handleInputPartOne(sample),
  })),
  { name: `p1: actual`, func: () => handleInputPartOne(actual) },
  ...samples.split("\n---\n").map((sample, sampleIndex, samples) => ({
    name: `p2: sample${samples.length > 1 ? " " + sampleIndex : ""}`,
    func: () => handleInputPartTwo(sample),
  })),
  { name: `p2: actual`, func: () => handleInputPartTwo(actual) },
]);
