import { readFileSync } from "fs";
import { resolve } from "path";

export const readFile = (filename: string) => {
  try {
    return readFileSync(resolve(filename), "utf-8");
  } catch (err) {
    console.error(`Error reading ${filename}:`, err);
    return "";
  }
};

export const logDebug = (...value: unknown[]) =>
  console.log("[DEBUG]", ...value);
export const logResult = (...value: unknown[]) =>
  console.log("[RESULT]", ...value);
export const logError = (...value: unknown[]) =>
  console.log("[ERROR]", ...value);
export const logBenchmark = (...value: unknown[]) =>
  console.log("[BENCHMARK]", ...value);
