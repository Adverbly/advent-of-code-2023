const coordDiffs = [
  [-1, 1],
  [-1, 0],
  [-1, -1],
  [0, 1],
  [0, -1],
  [1, 1],
  [1, 0],
  [1, -1],
];

const adjacentGearCoords = (
  lines: string[],
  rowIndex: number,
  colIndex: number,
  trailingNum: string
) => {
  const adjs = [];
  for (const [rowDelta, colDelta] of coordDiffs) {
    const y = rowDelta + rowIndex;
    const x = colIndex + colDelta;
    const char = lines[y]?.[x];
    if (char === "*") {
      // its a symbol so number is a keeper
      adjs.push([x, y]);
    }
  }

  for (const [rowDelta, colDelta] of coordDiffs) {
    const y = rowDelta + rowIndex;
    const x = colIndex + colDelta - (trailingNum.length - 1);
    const char = lines[y]?.[x];
    if (char === "*") {
      // its a symbol so number is a keeper
      adjs.push([x, y]);
    }
  }
  return adjs;
};

const solve = (lines: string[]) => {
  const gearNeighbors: Record<string, string[]> = {};
  let sum = 0;
  lines.forEach((line, rowIndex) => {
    let trailingNum = "";
    line.split("").forEach((char, colIndex) => {
      if (isNaN(Number(char))) {
        if (trailingNum) {
          const adjs = adjacentGearCoords(
            lines,
            rowIndex,
            colIndex - 1,
            trailingNum
          );
          adjs.forEach((coords) => {
            const existingCell = gearNeighbors[coords.join(",")];
            if (!existingCell) {
              gearNeighbors[coords.join(",")] = [trailingNum];
            } else {
              existingCell.push(trailingNum);
            }
          });
          trailingNum = "";
        }
      } else {
        trailingNum += char;
      }
    });

    if (trailingNum) {
      const adjs = adjacentGearCoords(
        lines,
        rowIndex,
        line.length - 1,
        trailingNum
      );
      adjs.forEach((coords) => {
        const existingCell = gearNeighbors[coords.join(",")];
        if (!existingCell) {
          gearNeighbors[coords.join(",")] = [trailingNum];
        } else {
          existingCell.push(trailingNum);
        }
      });
      trailingNum = "";
    }
  });

  const result = Object.values(gearNeighbors)
    .map((values) => [...new Set(values)])
    .filter((neighbors) => neighbors.length === 2)
    .reduce((sum, next) => {
      return sum + Number(next[0]) * Number(next[1]);
    }, 0);

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
