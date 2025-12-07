import type { Subprocess } from "bun";
import { existsSync, watch as fsWatch } from "node:fs";
import { basename, dirname, join } from "node:path";
import { Box, render, Text, useInput, useStdout } from "ink";
import Spinner from "ink-spinner";
import { useEffect, useMemo, useRef, useState } from "react";
import { readFile } from "./util";

type RunState = {
  result: string | null;
  debugLogs: string[];
  error: string | null;
  runtimeMs: number | null;
  benchmarkAvg: number | null;
  benchmarkMin: number | null;
  benchmarkMax: number | null;
  isRunning: boolean;
  isBenchmarking: boolean;
};

const CompactResult = ({
  label,
  state,
  expectedResult,
}: {
  label: string;
  state: RunState;
  expectedResult: string | null;
}) => {
  const resultColor =
    state.result === null
      ? "yellow"
      : expectedResult === null
        ? "cyan"
        : state.result === expectedResult
          ? "green"
          : "red";

  const resultText = state.isRunning && state.result === null ? "..." : state.result || "?";
  const timeText =
    state.benchmarkAvg !== null
      ? `[avg: ${(state.benchmarkAvg / 1000).toFixed(3)}s]`
      : state.runtimeMs !== null
        ? `[${(state.runtimeMs / 1000).toFixed(3)}s]`
        : "";

  return (
    <Box flexDirection="row" gap={1}>
      <Text dimColor>{label}:</Text>
      {(state.isRunning && state.result === null) || state.isBenchmarking ? <Spinner /> : null}
      <Text color={resultColor}>{resultText}</Text>
      {timeText && <Text dimColor>{timeText}</Text>}
      {state.error && <Text color="red"> ERR</Text>}
    </Box>
  );
};

const scriptDirectory = dirname(new URL(import.meta.url).pathname);

function getLatestDayNumber() {
  const glob = new Bun.Glob("day*");
  const dirs: string[] = [];

  for (const file of glob.scanSync({ cwd: scriptDirectory, onlyFiles: false })) {
    if (/^day\d+$/.test(file)) {
      dirs.push(file);
    }
  }

  if (dirs.length === 0) return 0;
  return Math.max(...dirs.map((dir) => Number.parseInt(dir.replace("day", ""), 10)));
}

async function instantiateNewDay() {
  const nextDayNumber = getLatestDayNumber() + 1;
  const newDayDirectory = `day${nextDayNumber}`;
  const sourcePath = `${scriptDirectory}/template`;
  const destPath = `${scriptDirectory}/${newDayDirectory}`;

  const proc = Bun.spawn(["cp", "-r", sourcePath, destPath]);
  await proc.exited;

  return nextDayNumber;
}

async function computeBaseDirectory() {
  const processArguments = process.argv.slice(2);
  const shouldCreateNewDay = processArguments.includes("--new-day");
  const passedDayDirectory = processArguments.find((arg) => !arg.startsWith("--"));

  let dayDirectory: string;
  if (passedDayDirectory && passedDayDirectory.length > 0) {
    dayDirectory = passedDayDirectory;
  } else if (shouldCreateNewDay) {
    const dayNumber = await instantiateNewDay();
    dayDirectory = `day${dayNumber}`;
  } else {
    dayDirectory = `day${getLatestDayNumber()}`;
  }

  const baseDir = `${scriptDirectory}/${dayDirectory}`;
  if (!existsSync(baseDir)) {
    throw Error(`Invalid directory: ${baseDir}`);
  }
  return baseDir;
}

const baseDirectory = await computeBaseDirectory();

const parts = [
  {
    label: "P1 Sample",
    solutionPath: join(baseDirectory, "part-one.ts"),
    inputPath: join(baseDirectory, "sample.txt"),
    expectedPath: join(baseDirectory, "expected-part-one-sample-result.txt"),
  },
  {
    label: "P1 Input",
    solutionPath: join(baseDirectory, "part-one.ts"),
    inputPath: join(baseDirectory, "input.txt"),
    expectedPath: join(baseDirectory, "expected-part-one-input-result.txt"),
  },
  {
    label: "P2 Sample",
    solutionPath: join(baseDirectory, "part-two.ts"),
    inputPath: join(baseDirectory, "sample.txt"),
    expectedPath: join(baseDirectory, "expected-part-two-sample-result.txt"),
  },
  {
    label: "P2 Input",
    solutionPath: join(baseDirectory, "part-two.ts"),
    inputPath: join(baseDirectory, "input.txt"),
    expectedPath: join(baseDirectory, "expected-part-two-input-result.txt"),
  },
];

let fileChangeCallbacks: (() => void)[] = [];

const filesToWatch = [
  join(baseDirectory, "part-one.ts"),
  join(baseDirectory, "part-two.ts"),
  join(baseDirectory, "sample.txt"),
  join(baseDirectory, "input.txt"),
];

for (const path of filesToWatch) {
  if (existsSync(path)) {
    const watcher = fsWatch(path, () => {
      fileChangeCallbacks.forEach((cb) => cb());
    });
    watcher.on("error", () => {});
  }
}

const emptyState: RunState = {
  result: null,
  debugLogs: [],
  error: null,
  runtimeMs: null,
  benchmarkAvg: null,
  benchmarkMin: null,
  benchmarkMax: null,
  isRunning: false,
  isBenchmarking: false,
};

const FullView = () => {
  const [states, setStates] = useState<RunState[]>([
    { ...emptyState },
    { ...emptyState },
    { ...emptyState },
    { ...emptyState },
  ]);
  const [selectedDebugView, setSelectedDebugView] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [version, setVersion] = useState(0);
  const processRefs = useRef<(Subprocess | null)[]>([null, null, null, null]);
  const { stdout } = useStdout();

  const terminalHeight = stdout?.rows ?? 24;
  const maxLogLines = Math.max(1, terminalHeight - 13);

  useInput((input, key) => {
    if (key.leftArrow) {
      setSelectedDebugView((prev) => {
        setScrollOffset(0);
        return (prev - 1 + 4) % 4;
      });
    } else if (key.rightArrow) {
      setSelectedDebugView((prev) => {
        setScrollOffset(0);
        return (prev + 1) % 4;
      });
    } else if (key.upArrow) {
      setScrollOffset((prev) => Math.max(0, prev - 1));
    } else if (key.downArrow) {
      const maxScroll = Math.max(0, states[selectedDebugView]!.debugLogs.length - maxLogLines);
      setScrollOffset((prev) => Math.min(maxScroll, prev + 1));
    } else if (input === "q" || (key.ctrl && input === "c")) {
      process.exit(0);
    }
  });

  useEffect(() => {
    const callback = () => setVersion((v) => v + 1);
    fileChangeCallbacks.push(callback);
    return () => {
      fileChangeCallbacks = fileChangeCallbacks.filter((cb) => cb !== callback);
    };
  }, []);

  useEffect(() => {
    let isCancelled = false;

    const runPart = async (index: number) => {
      if (isCancelled) return;

      const part = parts[index];
      if (!part) return;

      if (processRefs.current[index]) {
        processRefs.current[index]!.kill();
        processRefs.current[index] = null;
      }

      setStates((prev) => {
        const next = [...prev];
        next[index] = {
          result: null,
          debugLogs: [],
          error: null,
          runtimeMs: null,
          benchmarkAvg: null,
          benchmarkMin: null,
          benchmarkMax: null,
          isRunning: true,
          isBenchmarking: false,
        };
        return next;
      });

      try {
        const proc = Bun.spawn(["bun", part.solutionPath, part.inputPath], {
          stdout: "pipe",
          stderr: "pipe",
        });
        processRefs.current[index] = proc;

        const reader = proc.stdout.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let startTime: number | null = null;
        let endTime: number | null = null;

        while (true) {
          const { done, value } = await reader.read();
          if (done || isCancelled) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("[RESULT]")) {
              const result = line.slice(8).trim();
              setStates((prev) => {
                const next = [...prev];
                next[index] = { ...next[index]!, result };
                return next;
              });
            } else if (line.startsWith("[DEBUG]")) {
              const debugMsg = line.slice(7).trim();
              setStates((prev) => {
                const next = [...prev];
                next[index] = {
                  ...next[index]!,
                  debugLogs: [...next[index]!.debugLogs, debugMsg],
                };
                return next;
              });
            } else if (line.startsWith("[ERROR]")) {
              const error = line.slice(7).trim();
              setStates((prev) => {
                const next = [...prev];
                next[index] = { ...next[index]!, error };
                return next;
              });
            } else if (line.startsWith("[BENCHMARK]")) {
              const time = Number(line.slice(11).trim());
              if (startTime === null) {
                startTime = time;
              } else {
                endTime = time;
              }
            }
          }
        }

        if (startTime !== null && endTime !== null) {
          const runtimeMs = endTime - startTime;
          setStates((prev) => {
            const next = [...prev];
            next[index] = { ...next[index]!, runtimeMs };
            return next;
          });
        }

        await proc.exited;
      } catch (err) {
        if (!isCancelled) {
          setStates((prev) => {
            const next = [...prev];
            next[index] = { ...next[index]!, error: String(err) };
            return next;
          });
        }
      } finally {
        if (!isCancelled) {
          setStates((prev) => {
            const next = [...prev];
            next[index] = { ...next[index]!, isRunning: false };
            return next;
          });
        }
        processRefs.current[index] = null;
      }
    };

    const benchmark = async (index: number, runs = 10) => {
      if (isCancelled) return;

      const part = parts[index];
      if (!part) return;

      setStates((prev) => {
        const next = [...prev];
        next[index] = { ...next[index]!, isBenchmarking: true };
        return next;
      });

      const times: number[] = [];

      for (let run = 0; run < runs; run++) {
        if (isCancelled) return;

        const proc = Bun.spawn(["bun", part.solutionPath, part.inputPath], {
          stdout: "pipe",
          stderr: "pipe",
        });

        const reader = proc.stdout.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let startTime: number | null = null;
        let endTime: number | null = null;

        while (true) {
          const { done, value } = await reader.read();
          if (done || isCancelled) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("[BENCHMARK]")) {
              const time = Number(line.slice(11).trim());
              if (startTime === null) {
                startTime = time;
              } else {
                endTime = time;
              }
            }
          }
        }

        await proc.exited;

        if (startTime !== null && endTime !== null) {
          times.push(endTime - startTime);
        }
      }

      if (times.length > 0 && !isCancelled) {
        const avg = times.reduce((a, b) => a + b, 0) / times.length;
        const min = Math.min(...times);
        const max = Math.max(...times);

        setStates((prev) => {
          const next = [...prev];
          next[index] = {
            ...next[index]!,
            benchmarkAvg: avg,
            benchmarkMin: min,
            benchmarkMax: max,
            isBenchmarking: false,
          };
          return next;
        });
      } else {
        setStates((prev) => {
          const next = [...prev];
          next[index] = { ...next[index]!, isBenchmarking: false };
          return next;
        });
      }
    };

    const runAllSequentially = async () => {
      for (let i = 0; i < parts.length; i++) {
        await runPart(i);
      }

      await Promise.all(parts.map((_, i) => benchmark(i)));
    };

    runAllSequentially();

    return () => {
      isCancelled = true;
      for (let i = 0; i < processRefs.current.length; i++) {
        if (processRefs.current[i]) {
          processRefs.current[i]!.kill();
          processRefs.current[i] = null;
        }
      }
    };
  }, [version]);

  const expectedResults = useMemo(
    () =>
      parts.map((part) => {
        const result = readFile(part.expectedPath).trim();
        return result.length > 0 ? result : null;
      }),
    [],
  );

  const allLogs = states[selectedDebugView]!.debugLogs;
  const startIdx = Math.min(scrollOffset, Math.max(0, allLogs.length - maxLogLines));
  const displayLogs = allLogs.slice(startIdx, startIdx + maxLogLines);

  return (
    <Box flexDirection="column">
      <Box borderStyle="round" borderColor="cyan" paddingX={1} marginBottom={1}>
        <Text>
          <Text bold>{basename(baseDirectory)}</Text> | ←/→ Switch | ↑↓ Scroll | q Quit
        </Text>
      </Box>

      <Box flexDirection="column" marginBottom={1}>
        <Box flexDirection="row" justifyContent="space-between">
          <Box width="48%">
            <CompactResult
              label={parts[0]!.label}
              state={states[0]!}
              expectedResult={expectedResults[0] ?? null}
            />
          </Box>
          <Box width="48%">
            <CompactResult
              label={parts[1]!.label}
              state={states[1]!}
              expectedResult={expectedResults[1] ?? null}
            />
          </Box>
        </Box>
        <Box flexDirection="row" justifyContent="space-between">
          <Box width="48%">
            <CompactResult
              label={parts[2]!.label}
              state={states[2]!}
              expectedResult={expectedResults[2] ?? null}
            />
          </Box>
          <Box width="48%">
            <CompactResult
              label={parts[3]!.label}
              state={states[3]!}
              expectedResult={expectedResults[3] ?? null}
            />
          </Box>
        </Box>
      </Box>

      <Box flexDirection="column" borderStyle="single" paddingX={1}>
        <Text>
          Debug:{" "}
          <Text bold color="cyan">
            {parts[selectedDebugView]!.label}
          </Text>
          {allLogs.length > 0 && (
            <Text dimColor>
              {" "}
              ({startIdx + 1}-{startIdx + displayLogs.length}/{allLogs.length})
            </Text>
          )}
          {states[selectedDebugView]!.benchmarkAvg !== null && (
            <Text dimColor>
              {" "}
              [avg: {(states[selectedDebugView]!.benchmarkAvg / 1000).toFixed(3)}s, min:{" "}
              {(states[selectedDebugView]!.benchmarkMin! / 1000).toFixed(3)}s, max:{" "}
              {(states[selectedDebugView]!.benchmarkMax! / 1000).toFixed(3)}s]
            </Text>
          )}
        </Text>
        {states[selectedDebugView]!.error ? (
          <Box flexDirection="column" marginTop={1}>
            <Text color="red" bold>
              Error:
            </Text>
            <Text color="red">{states[selectedDebugView]!.error}</Text>
          </Box>
        ) : displayLogs.length > 0 ? (
          <Box flexDirection="column" marginTop={1}>
            {displayLogs.map((log, i) => (
              <Text key={i}>{log}</Text>
            ))}
          </Box>
        ) : (
          <Box marginTop={1}>
            <Text dimColor>(no debug output)</Text>
          </Box>
        )}
      </Box>
    </Box>
  );
};

const instance = render(<FullView />);

process.on("SIGINT", () => {
  instance.unmount();
  process.exit(0);
});
process.on("SIGTERM", () => {
  instance.unmount();
  process.exit(0);
});
