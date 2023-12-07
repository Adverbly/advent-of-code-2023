import { findFirstSeedInOverlappingBounds } from "./findFirstSeedInOverlappingBounds";
import { mapSource } from "./mapSource";
import { parseInputLines } from "./parseInputLines";

const solve = (lines: string[]) => {
  const { maps } = parseInputLines(lines);
  const bounds = maps.byDestination.location.bounds;
  const firstSeed = findFirstSeedInOverlappingBounds(
    maps.byDestination,
    "location",
    bounds
  );

  let type = "seed";
  let result = firstSeed;
  while (type !== "location") {
    const map = maps.bySource[type];
    result = mapSource(result as number, map, 0, map.bounds.length - 1);
    type = map.to;
  }

  console.log(result);
};

// const inputFile = Bun.file(import.meta.dir + "/example.txt");
const inputFile = Bun.file(import.meta.dir + "/../input.txt");
const input = await inputFile.text();
const lines = input.split("\n");
lines.pop(); // remove trailing newline :(

const start = Bun.nanoseconds();
solve(lines); // yay for top-level await!
const end = Bun.nanoseconds();
console.log(`duration: ${end - start}ns`);
