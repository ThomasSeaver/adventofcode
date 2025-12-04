import { spawn } from "node:child_process";
import fs, { watch } from "node:fs";
import { dirname, join } from "node:path";
import { Box, render, Text } from "ink";
import Spinner from "ink-spinner";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { readFile } from "./util";

const SolutionView = ({
	label,
	inputFilePath,
	solutionFilePath,
	shouldRun,
	onFinished,
	expectedResultFilePath,
	fileVersion,
}: {
	label: string;
	inputFilePath: string;
	solutionFilePath: string;
	shouldRun: boolean;
	onFinished: () => void;
	expectedResultFilePath: string;
	fileVersion: number;
}) => {
	const [result, setResult] = useState<null | string>(null);
	const [debugLogList, setDebugLogList] = useState<string[]>([]);
	const [error, setError] = useState<null | string>(null);
	const [benchmarkData, setBenchmarkData] = useState<null | {
		startMilliseconds?: number;
		endMilliseconds?: number;
	}>(null);
	const processRef = useRef<ReturnType<typeof spawn> | null>(null);

	const expectedResult = useMemo(() => {
		const resultString = readFile(expectedResultFilePath).trim();
		return resultString.length > 0 ? resultString : null;
	}, [expectedResultFilePath]);

	useEffect(() => {
		if (!shouldRun) return;

		// Kill previous process if it's still running
		if (processRef.current && !processRef.current.killed) {
			processRef.current.kill();
		}

		// Reset state when starting a new run
		setResult(null);
		setDebugLogList([]);
		setError(null);
		setBenchmarkData(null);

		const solutionProcess = spawn("bun", [solutionFilePath, inputFilePath]);
		processRef.current = solutionProcess;

		solutionProcess.stdout.setEncoding("utf8");
		solutionProcess.stdout.on("data", (data: string) => {
			let messageString = data;
			do {
				const messageEnd = Math.min(
					...[messageString.indexOf("[RESULT]", 1), messageString.indexOf("[DEBUG]", 1), messageString.indexOf("[ERROR]", 1), messageString.indexOf("[BENCHMARK]", 1)].filter((index) => index !== -1),
				);
				const message = messageString.slice(0, messageEnd);
				messageString = messageString.slice(messageEnd);
				if (message.startsWith("[RESULT]")) {
					setResult(message.slice(8).trim());
				} else if (message.startsWith("[DEBUG]")) {
					setDebugLogList((previousDebugData) => [...previousDebugData, ...message.slice(7).trim().split("\n")].slice(-8));
				} else if (message.startsWith("[ERROR]")) {
					setError(message.slice(7).trim());
				} else if (message.startsWith("[BENCHMARK]")) {
					setBenchmarkData((previousBenchmarkData) =>
						previousBenchmarkData?.startMilliseconds == null
							? { startMilliseconds: Number(message.slice(11).trim()) }
							: {
									...previousBenchmarkData,
									endMilliseconds: Number(message.slice(11).trim()),
								},
					);
				}
			} while (messageString.length > 0);
		});

		solutionProcess.stdout.on("error", (data: string) => {
			setError(data);
		});

		solutionProcess.stdout.on("close", () => {
			setResult((currentResult) => (currentResult === null ? "X" : currentResult));
			onFinished();
		});

		return () => {
			if (!solutionProcess.killed) {
				solutionProcess.kill();
			}
			processRef.current = null;
		};
	}, [shouldRun, inputFilePath, onFinished, solutionFilePath, fileVersion]);

	return (
		<Box flexDirection="column">
			<Text>{label}:</Text>
			<Box>
				<Box borderStyle="single" width="69%" flexDirection="column" overflowY="hidden">
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
					<Box borderStyle="single" height="75%" flexDirection="column" overflowY="hidden">
						<Text>Benchmark:</Text>
						<Box height="100%" overflowY="hidden">
							{benchmarkData?.endMilliseconds == null || benchmarkData.startMilliseconds == null ? null : (
								<Box flexDirection="row" width="100%" justifyContent="space-between">
									<Text>Runtime (s):</Text>
									<Text>{((benchmarkData.endMilliseconds - benchmarkData.startMilliseconds) / 1000).toFixed(3)}</Text>
								</Box>
							)}
						</Box>
					</Box>
					<Box borderStyle="single" height="25%" flexDirection="row" justifyContent="space-between" overflowY="hidden">
						<Box minWidth="20%">
							<Text>Result: </Text>
						</Box>
						{result == null ? (
							<Box marginRight={1}>
								<Spinner />
							</Box>
						) : (
							<Text color={result == null || expectedResult == null ? "yellow" : result === expectedResult ? "green" : "red"}>{result}</Text>
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

	return Math.max(...directoryList.map((dir) => parseInt(dir.replace("day", ""), 10)));
}

export function instantiateNewDay(): number {
	const nextDayNumber = getLatestDayNumber() + 1;
	const newDayDirectory = `day${nextDayNumber}`;

	fs.cpSync(`${scriptDirectory}/template`, `${scriptDirectory}/${newDayDirectory}`, {
		recursive: true,
	});
	return nextDayNumber;
}

function computeBaseDirectory(): string {
	const processArguments = process.argv.slice(2);
	const shouldCreateNewDay = processArguments.includes("--new-day");
	const passedDayDirectory = processArguments.find((arg) => !arg.startsWith("--"));

	let dayDirectory: string;
	if (passedDayDirectory && passedDayDirectory.length > 0) {
		dayDirectory = passedDayDirectory;
	} else if (shouldCreateNewDay) {
		const dayNumber = instantiateNewDay();
		dayDirectory = `day${dayNumber}`;
	} else {
		dayDirectory = `day${getLatestDayNumber()}`;
	}

	const baseDir = `${scriptDirectory}/${dayDirectory}`;
	if (!fs.existsSync(baseDir)) {
		throw Error(`Invalid directory: ${baseDir}`);
	}
	return baseDir;
}

const baseDirectory = computeBaseDirectory();

const filesToWatch = {
	partOne: join(baseDirectory, "part-one.ts"),
	partTwo: join(baseDirectory, "part-two.ts"),
	sampleInput: join(baseDirectory, "sample.txt"),
	fullInput: join(baseDirectory, "input.txt"),
};

// Module-level file version tracking
const fileVersions: { [key: string]: number } = {
	partOne: 0,
	partTwo: 0,
	sampleInput: 0,
	fullInput: 0,
};

// Module-level callbacks to notify React when files change
let fileChangeCallbacks: Array<() => void> = [];

// Set up file watchers at module level
for (const [key, path] of Object.entries(filesToWatch)) {
	if (fs.existsSync(path)) {
		let lastModified = fs.statSync(path).mtimeMs;
		const watcher = watch(path, (eventType) => {
			if (eventType === "change") {
				try {
					const stats = fs.statSync(path);
					if (stats.mtimeMs > lastModified) {
						lastModified = stats.mtimeMs;
						fileVersions[key] = (fileVersions[key] || 0) + 1;
						// Notify all React components
						fileChangeCallbacks.forEach((cb) => cb());
					}
				} catch {
					// File might be temporarily unavailable
				}
			}
		});
		watcher.on("error", () => {
			// Ignore watcher errors
		});
	}
}

const FullView = () => {
	const [runningIndex, setRunningIndex] = useState(0);
	const [version, setVersion] = useState(0);

	const onFinished = useCallback(() => {
		setRunningIndex((previousRunningIndex) => previousRunningIndex + 1);
	}, []);

	// Subscribe to file changes
	useEffect(() => {
		const callback = () => {
			setVersion((v) => v + 1);
			setRunningIndex(0);
		};
		fileChangeCallbacks.push(callback);
		return () => {
			fileChangeCallbacks = fileChangeCallbacks.filter((cb) => cb !== callback);
		};
	}, []);

	return (
		<Box height={24} flexDirection="column">
			<Box height="50%">
				<SolutionView
					label="Part one sample"
					inputFilePath={filesToWatch.sampleInput}
					solutionFilePath={filesToWatch.partOne}
					shouldRun={runningIndex >= 0}
					onFinished={onFinished}
					expectedResultFilePath={`${baseDirectory}/expected-part-one-sample-result.txt`}
					fileVersion={(fileVersions.partOne || 0) + (fileVersions.sampleInput || 0) + version}
				/>
				<SolutionView
					label="Part one input"
					inputFilePath={filesToWatch.fullInput}
					solutionFilePath={filesToWatch.partOne}
					shouldRun={runningIndex >= 2}
					onFinished={onFinished}
					expectedResultFilePath={`${baseDirectory}/expected-part-one-input-result.txt`}
					fileVersion={(fileVersions.partOne || 0) + (fileVersions.fullInput || 0) + version}
				/>
			</Box>
			<Box height="50%">
				<SolutionView
					label="Part two sample"
					inputFilePath={filesToWatch.sampleInput}
					solutionFilePath={filesToWatch.partTwo}
					shouldRun={runningIndex >= 1}
					onFinished={onFinished}
					expectedResultFilePath={`${baseDirectory}/expected-part-two-sample-result.txt`}
					fileVersion={(fileVersions.partTwo || 0) + (fileVersions.sampleInput || 0) + version}
				/>
				<SolutionView
					label="Part two input"
					inputFilePath={filesToWatch.fullInput}
					solutionFilePath={filesToWatch.partTwo}
					shouldRun={runningIndex >= 3}
					onFinished={onFinished}
					expectedResultFilePath={`${baseDirectory}/expected-part-two-input-result.txt`}
					fileVersion={(fileVersions.partTwo || 0) + (fileVersions.fullInput || 0) + version}
				/>
			</Box>
		</Box>
	);
};

const instance = render(<FullView />);

process.on("SIGINT", () => {
	instance.unmount();
	process.exit(0);
});
