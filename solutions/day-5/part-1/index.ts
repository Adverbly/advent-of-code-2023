interface Bound {
  destinationStart: number;
  sourceStart: number;
  size: number;
}
interface DataMap {
  name: string;
  bounds: Bound[];
  from: string;
  to: string;
}

const parseLines = (lines: string[]) => {
  let seeds = [] as number[];
  let currentMap = { name: "", bounds: [], from: "", to: "" } as DataMap;
  const maps = {
    bySource: {} as Record<string, typeof currentMap>,
  };
  lines.forEach((line) => {
    if (line.startsWith("seeds: ")) {
      seeds = line.split("seeds: ")[1].split(" ").map(Number);
    } else if (line.length > 0) {
      if (line.includes("map:")) {
        const name = line.split(" map:")[0];
        const [from, to] = name.split("-to-");
        currentMap = {
          name,
          bounds: [],
          from,
          to,
        };
        maps.bySource[from] = currentMap;
      } else {
        const [destinationStart, sourceStart, size] = line
          .split(" ")
          .map(Number);
        currentMap.bounds.push({ destinationStart, sourceStart, size });
      }
    }
  });
  Object.values(maps.bySource).forEach((value) => {
    value.bounds = [...value.bounds].sort(
      (a, b) => a.sourceStart - b.sourceStart
    );
  });
  return { maps, seeds };
};
const mapSource = (
  source: number,
  map: DataMap,
  from: number,
  to: number
): number => {
  const { bounds } = map;
  let index = Math.floor((from + to) / 2);
  const { sourceStart, size, destinationStart } = bounds[index];
  if (source < sourceStart) {
    if (to === from) {
      return source;
    }
    return mapSource(source, map, from, from + Math.floor((to - from) / 2));
  } else if (source > sourceStart + size) {
    if (to === from) {
      return source;
    }
    return mapSource(source, map, Math.ceil((from + to) / 2), to);
  } else {
    return destinationStart + source - sourceStart;
  }
};
const solve = (lines: string[]) => {
  const { maps, seeds } = parseLines(lines);
  let type = "seed";
  let data = seeds;
  while (type !== "location") {
    const map = maps.bySource[type];
    data = data.map((source) =>
      mapSource(source, map, 0, map.bounds.length - 1)
    );

    type = map.to;
  }
  console.log(Math.min(...data));
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
