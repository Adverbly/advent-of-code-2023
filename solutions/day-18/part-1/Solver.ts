type Cell = number;
type RowCol = [number, number];
type Adj = {
  value: Cell;
  rowCol: RowCol;
};

const TRENCH = 1;
const UNKNOWN = 0;
const OUTSIDE = 2;
const INSIDE = 3;

export class Solver {
  grid: Cell[][] = [];

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
    const value = this.grid[rowCol[0]]?.[rowCol[1]];
    if (value === undefined) return null;
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

  floodOutside() {
    const horizon: RowCol[] = [[0, 0]];
    this.bfsGrid({
      horizon,
      forEach: (adj: Adj) => {
        this.grid[adj.rowCol[0]][adj.rowCol[1]] = OUTSIDE;
      },
      predicate: (adj: Adj) => {
        return adj.value === UNKNOWN;
      },
    });
  }

  printGrid() {
    console.log(this.grid.map((row) => row.join("")).join("\n"));
  }

  solve() {
    this.floodOutside();
    // this.printGrid();
    const score = this.grid.reduce(
      (rowSum, row) =>
        rowSum +
        row.reduce((sum, cell) => (cell === OUTSIDE ? sum : sum + 1), 0),
      0
    );
    return score;
  }

  parseLines(lines: string[]) {
    const size = 500;
    this.grid = new Array(size).fill(0).map(() => new Array(size).fill(0));

    let boundsX = [size / 2, size / 2];
    let boundsY = [size / 2, size / 2];
    const initRowCol = [size / 2, size / 2];
    let rowCol = initRowCol;
    lines.forEach((line) => {
      const [dir, length, code] = line.split(" ");
      new Array(Number(length)).fill("").map(() => {
        rowCol = [
          dir === "D" ? rowCol[0] + 1 : dir === "U" ? rowCol[0] - 1 : rowCol[0],
          dir === "L" ? rowCol[1] - 1 : dir === "R" ? rowCol[1] + 1 : rowCol[1],
        ];
        if (this.grid[rowCol[0]][rowCol[1]] === undefined) {
          throw JSON.stringify(rowCol);
        }

        this.grid[rowCol[0]][rowCol[1]] = TRENCH;
        boundsY[0] = Math.min(rowCol[0], boundsY[0]);
        boundsY[1] = Math.max(rowCol[0], boundsY[1]);
        boundsX[0] = Math.min(rowCol[1], boundsX[0]);
        boundsX[1] = Math.max(rowCol[1], boundsX[1]);
      });
    });

    this.grid = this.grid
      .slice(boundsY[0] - 1, boundsY[1] + 2)
      .map((row) => row.slice(boundsX[0] - 1, boundsX[1] + 2));
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
