import fs from "fs";

export const read = (filename = "i.txt") => {
  let data;
  try {
    data = fs.readFileSync(filename, "utf8");
  } catch (err) {
    console.error(err);
  }
  return data;
};

export const split = (data, splitter = "\n") => {
  return data.split(splitter).map((line) => line.trim());
};

export const useInput = (filename = "i.txt", splitter = "\n") => {
  return split(read(filename), splitter);
};
