/* eslint-disable react/react-in-jsx-scope */
import { render, Box, Text } from "ink";
import { spawn } from "child_process";
import { useEffect, useMemo, useState } from "react";
import Spinner from "ink-spinner";
import { readFile } from "./util";
import fs from "fs";
import { dirname } from "path";

const SolutionView = ({
  label,
  inputFilePath,
  solutionFilePath,
  shouldRun,
  onFinished,
  expectedResultFilePath,
}: {
  label: string;
  inputFilePath: string;
  solutionFilePath: string;
  shouldRun: boolean;
  onFinished: () => void;
  expectedResultFilePath: string;
}) => {
  const [result, setResult] = useState<null | string>(null);
  const [debugLogList, setDebugLogList] = useState<string[]>([]);
  const [error, setError] = useState<null | string>(null);
  const [benchmarkData, setBenchmarkData] = useState<null | {
    startMilliseconds?: number;
    endMilliseconds?: number;
  }>(null);

  const expectedResult = useMemo(() => {
    const resultString = readFile(expectedResultFilePath).trim();
    return resultString.length > 0 ? resultString : null;
  }, []);

  useEffect(() => {
    if (shouldRun) {
      const solutionProcess = spawn("npx", [
        "tsx",
        solutionFilePath,
        inputFilePath,
      ]);

      solutionProcess.stdout.setEncoding("utf8");
      solutionProcess.stdout.on("data", (data: string) => {
        let messageString = data;
        do {
          const messageEnd = Math.min(
            ...[
              messageString.indexOf("[RESULT]", 1),
              messageString.indexOf("[DEBUG]", 1),
              messageString.indexOf("[ERROR]", 1),
              messageString.indexOf("[BENCHMARK]", 1),
            ].filter((index) => index != -1)
          );
          const message = messageString.slice(0, messageEnd);
          messageString = messageString.slice(messageEnd);
          if (message.startsWith("[RESULT]")) {
            setResult(message.slice(8).trim());
          } else if (message.startsWith("[DEBUG]")) {
            setDebugLogList((previousDebugData) =>
              [
                ...previousDebugData,
                ...message.slice(7).trim().split("\n"),
              ].slice(-8)
            );
          } else if (message.startsWith("[ERROR]")) {
            setError(message.slice(7).trim());
          } else if (message.startsWith("[BENCHMARK]")) {
            setBenchmarkData((previousBenchmarkData) =>
              previousBenchmarkData?.startMilliseconds == null
                ? { startMilliseconds: Number(message.slice(11).trim()) }
                : {
                    ...previousBenchmarkData,
                    endMilliseconds: Number(message.slice(11).trim()),
                  }
            );
          }
        } while (messageString.length > 0);
      });

      solutionProcess.stdout.on("error", (data: string) => {
        setError(data);
      });

      solutionProcess.stdout.on("close", () => {
        setResult((currentResult) =>
          currentResult === null ? "X" : currentResult
        );
        onFinished();
      });

      ["SIGINT", "SIGTERM", "SIGQUIT"].forEach((signal) => {
        process.on(signal, () => {
          solutionProcess.kill();
          process.exit();
        });
      });
    }
  }, [shouldRun]);

  return (
    <Box flexDirection="column">
      <Text>{label}:</Text>
      <Box>
        <Box
          borderStyle="single"
          width="69%"
          flexDirection="column"
          overflowY="hidden"
        >
          {error == null ? (
            <>
              <Text>Logs:</Text>
              <Box height="100%" overflowY="hidden" flexDirection="column">
                {debugLogList.map((debugLog, index) => (
                  <Text key={index}>{debugLog}</Text>
                ))}
              </Box>
            </>
          ) : (
            <>
              <Text>Error:</Text>
              <Text>{error}</Text>
            </>
          )}
        </Box>
        <Box width="30%" flexDirection="column">
          <Box
            borderStyle="single"
            height="75%"
            flexDirection="column"
            overflowY="hidden"
          >
            <Text>Benchmark:</Text>
            <Box height="100%" overflowY="hidden">
              {benchmarkData?.endMilliseconds == null ||
              benchmarkData.startMilliseconds == null ? null : (
                <Box
                  flexDirection="row"
                  width="100%"
                  justifyContent="space-between"
                >
                  <Text>Runtime (s):</Text>
                  <Text>
                    {(
                      (benchmarkData.endMilliseconds -
                        benchmarkData.startMilliseconds) /
                      1000
                    ).toFixed(3)}
                  </Text>
                </Box>
              )}
            </Box>
          </Box>
          <Box
            borderStyle="single"
            height="25%"
            flexDirection="row"
            justifyContent="space-between"
            overflowY="hidden"
          >
            <Box minWidth="20%">
              <Text>Result: </Text>
            </Box>
            {result == null ? (
              <Box marginRight={1}>
                <Spinner />
              </Box>
            ) : (
              <Text
                color={
                  result == null || expectedResult == null
                    ? "yellow"
                    : result == expectedResult
                    ? "green"
                    : "red"
                }
              >
                {result}
              </Text>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const scriptDirectory = dirname(new URL(import.meta.url).pathname);
export function getLatestDayNumber(): number {
  const directoryList = fs
    .readdirSync(dirname(new URL(import.meta.url).pathname))
    .filter((name) => fs.lstatSync(`${scriptDirectory}/${name}`).isDirectory())
    .filter((directoryName) => /^day\d+$/.test(directoryName));

  if (directoryList.length === 0) return 0;

  return Math.max(
    ...directoryList.map((dir) => parseInt(dir.replace("day", "")))
  );
}

export function instantiateNewDay(): number {
  const nextDayNumber = getLatestDayNumber() + 1;
  const newDayDirectory = `day${nextDayNumber}`;

  fs.cpSync(
    `${scriptDirectory}/template`,
    `${scriptDirectory}/${newDayDirectory}`,
    { recursive: true }
  );
  return nextDayNumber;
}

const FullView = () => {
  const baseDirectory = useMemo(() => {
    const processArguments = process.argv.slice(2);
    const shouldCreateNewDay = processArguments.includes("--new-day");
    const passedDayDirectory = processArguments.find(
      (arg) => !arg.startsWith("--")
    );
    const dayDirectory =
      (passedDayDirectory?.length ?? 0) != 0
        ? passedDayDirectory
        : shouldCreateNewDay
        ? `/day${instantiateNewDay()}`
        : `/day${getLatestDayNumber()}`;

    return `${dirname(new URL(import.meta.url).pathname)}/${dayDirectory}`;
  }, []);
  if (!fs.existsSync(baseDirectory)) {
    throw Error("Invalid directory!");
  }
  const [runningIndex, setRunningIndex] = useState(0);
  const onFinished = () =>
    setRunningIndex((previousRunningIndex) => previousRunningIndex + 1);
  return (
    <Box height={24} flexDirection="column">
      <Box height="50%">
        <SolutionView
          label="Part one sample"
          inputFilePath={`${baseDirectory}/sample.txt`}
          solutionFilePath={`${baseDirectory}/part-one.ts`}
          shouldRun={runningIndex >= 0}
          onFinished={onFinished}
          expectedResultFilePath={`${baseDirectory}/expected-part-one-sample-result.txt`}
        />
        <SolutionView
          label="Part one input"
          inputFilePath={`${baseDirectory}/input.txt`}
          solutionFilePath={`${baseDirectory}/part-one.ts`}
          shouldRun={runningIndex >= 2}
          onFinished={onFinished}
          expectedResultFilePath={`${baseDirectory}/expected-part-one-input-result.txt`}
        />
      </Box>
      <Box height="50%">
        <SolutionView
          label="Part two sample"
          inputFilePath={`${baseDirectory}/sample.txt`}
          solutionFilePath={`${baseDirectory}/part-two.ts`}
          shouldRun={runningIndex >= 1}
          onFinished={onFinished}
          expectedResultFilePath={`${baseDirectory}/expected-part-two-sample-result.txt`}
        />
        <SolutionView
          label="Part two input"
          inputFilePath={`${baseDirectory}/input.txt`}
          solutionFilePath={`${baseDirectory}/part-two.ts`}
          shouldRun={runningIndex >= 3}
          onFinished={onFinished}
          expectedResultFilePath={`${baseDirectory}/expected-part-two-input-result.txt`}
        />
      </Box>
    </Box>
  );
};

render(<FullView />);
