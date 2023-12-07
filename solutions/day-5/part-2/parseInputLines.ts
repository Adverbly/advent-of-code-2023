import { Bound, DataMap, Maps } from "./DataMap";
import { overlappingBounds, withGapBounds } from "./overlappingBounds";

export const parseInputLines = (lines: string[]) => {
  let seeds = [] as number[];
  let seedRanges = { name: "", bounds: [], from: "", to: "" } as DataMap;
  let sourceMap = { name: "", bounds: [], from: "", to: "" } as DataMap;
  let destinationMap = { name: "", bounds: [], from: "", to: "" } as DataMap;
  const maps = {
    bySource: {} as Maps,
    byDestination: {} as Maps,
  };
  lines.forEach((line) => {
    if (line.startsWith("seeds: ")) {
      seeds = line.split("seeds: ")[1].split(" ").map(Number);
      seedRanges.bounds = Array(seeds.length / 2);
      seeds.forEach((seed, index) => {
        const halfIndex = Math.floor(index / 2);
        if (index % 2 === 0) {
          // its a range
          seedRanges.bounds[halfIndex] = {
            destinationStart: seed,
            size: 0,
            sourceStart: seed,
          };
        } else {
          seedRanges.bounds[halfIndex].size = seed;
        }
      });
    } else if (line.length > 0) {
      if (line.includes("map:")) {
        const name = line.split(" map:")[0];
        const [from, to] = name.split("-to-");
        sourceMap = {
          name,
          bounds: [],
          from,
          to,
        };
        maps.bySource[from] = sourceMap;
        destinationMap = {
          name,
          bounds: [],
          from,
          to,
        };
        maps.byDestination[to] = destinationMap;
      } else {
        const [destinationStart, sourceStart, size] = line
          .split(" ")
          .map(Number);
        destinationMap.bounds.push({ destinationStart, sourceStart, size });
        sourceMap.bounds.push({ destinationStart, sourceStart, size });
      }
    }
  });
  Object.values(maps.bySource).forEach((value) => {
    value.bounds = [...value.bounds].sort(
      (a, b) => a.sourceStart - b.sourceStart
    );
  });
  Object.values(maps.byDestination).forEach((value) => {
    value.bounds = withGapBounds(
      [...value.bounds].sort((a, b) => a.destinationStart - b.destinationStart)
    );
  });
  maps.byDestination.seedRanges = seedRanges;
  maps.bySource.seedRanges = seedRanges;
  return { maps, seedRanges };
};
