type Cell = number;
type RowCol = [number, number];
type Adj = {
  value: Cell;
  rowCol: RowCol;
};

const ROCK = 1;
const EMPTY = 0;

export class Solver {
  grid: Cell[][] = [];
  start: RowCol = [0, 0];

  constructor(lines: string[]) {
    this.parseLines(lines);
  }

  adjCells(rowCol: RowCol) {
    const result = [];
    let n = this.adjCell(rowCol, [1, 0]);
    n !== null && result.push(n);
    n = this.adjCell(rowCol, [-1, 0]);
    n !== null && result.push(n);
    n = this.adjCell(rowCol, [0, 1]);
    n !== null && result.push(n);
    n = this.adjCell(rowCol, [0, -1]);
    n !== null && result.push(n);
    return result;
  }

  adjCell(mid: RowCol, diff: RowCol): Adj | null {
    const rowCol = [mid[0] + diff[0], mid[1] + diff[1]] as RowCol;
    const value =
      this.grid[rowCol[0] % this.grid.length]?.[
        rowCol[1] % this.grid[0].length
      ];
    return {
      rowCol,
      value,
    };
  }

  cellKey(rowCol: RowCol) {
    return JSON.stringify(rowCol);
  }

  bfsGrid({
    horizon,
    forEach,
    predicate,
  }: {
    horizon: RowCol[];
    forEach: (cell: Adj) => void;
    predicate?: (adj: Adj, index?: number) => boolean;
  }) {
    const seen = new Set<string>();

    while (horizon.length > 0) {
      const rowCol = horizon.shift()!;
      this.adjCells(rowCol).forEach((adj, index) => {
        const key = this.cellKey(adj.rowCol);
        if (seen.has(key) || (predicate ? !predicate(adj, index) : false)) {
          seen.add(key);

          return;
        }

        horizon.push(adj.rowCol);
        forEach(adj);
        seen.add(key);
      });
    }
  }

  walk() {
    let horizon: RowCol[] = [this.start];

    const seen = new Set<string>();
    const seenEmpty = new Set<string>();
    const parity = (this.start[0] + this.start[1]) % 2;

    let counter = 0;
    while (horizon.length > 0 && counter !== 26501365) {
      const nextHorizon: RowCol[] = [];
      while (horizon.length > 0) {
        const rowCol = horizon.shift()!;
        this.adjCells(rowCol).forEach((adj, index) => {
          const key = this.cellKey(adj.rowCol);
          if (seen.has(key)) {
            return;
          }
          if (adj.value === EMPTY) {
            if (!seenEmpty.has(key)) {
              nextHorizon.push(adj.rowCol);
            }
            seenEmpty.add(key);
            seen.add(key);
          }
        });
      }
      horizon = nextHorizon;

      counter++;
    }
    return [...seenEmpty].filter((seenEmpty) => {
      const rowCol = JSON.parse(seenEmpty);

      return (rowCol[0] + rowCol[1]) % 2 === parity;
    }).length;
  }

  printGrid() {
    console.log(this.grid.map((row) => row.join("")).join("\n"));
  }

  solve() {
    return this.walk();
  }

  parseLines(lines: string[]) {
    this.grid = lines.map((line, rowIndex) =>
      line.split("").map((char, colIndex) => {
        if (char === ".") {
          return EMPTY;
        } else if (char === "#") {
          return ROCK;
        } else {
          this.start = [rowIndex, colIndex];
          return EMPTY;
        }
      })
    );
  }
}

if (import.meta.main) {
  const dir = import.meta.dir.split("/");
  const day = dir[dir.length - 2].split("-")[1];
  const part = dir[dir.length - 1].split("-")[1];
  Bun.env.AOC_DAY = day;
  Bun.env.AOC_PART = part;
  Bun.env.AOC_INPUT = "part-1/example.txt";
  import(`../../../index.ts`);
}
