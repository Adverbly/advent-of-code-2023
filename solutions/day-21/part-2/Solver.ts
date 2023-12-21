type Cell = number;
type RowCol = [number, number];
type Adj = {
  value: Cell;
  rowCol: RowCol;
};

const ROCK = 1;
const EMPTY = 0;

const modFix = (n: number, m: number) => {
  return ((n % m) + m) % m;
};

export class Solver {
  grid: Cell[][] = [];
  start: RowCol = [0, 0];
  gridSeen: Set<string> = new Set();
  seen: Set<string> = new Set();
  width: number = 0;

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
      this.grid[modFix(rowCol[0], this.width)]?.[modFix(rowCol[1], this.width)];
    return {
      rowCol,
      value,
    };
  }

  cellKey(rowCol: RowCol) {
    return JSON.stringify(rowCol);
  }

  walk(horizon: RowCol[], times: number) {
    let counter = 0;
    while (counter !== times) {
      const nextHorizon: RowCol[] = [];
      while (horizon.length > 0) {
        const rowCol = horizon.shift()!;
        this.adjCells(rowCol).forEach((adj) => {
          const key = this.cellKey(adj.rowCol);
          if (this.seen.has(key)) {
            return;
          }
          this.seen.add(key);
          if (adj.value === EMPTY) {
            nextHorizon.push(adj.rowCol);
          }
        });
      }
      horizon = nextHorizon;

      counter++;
    }
    return horizon;
  }

  printGrid() {
    console.log(this.grid.map((row) => row.join("")).join("\n"));
  }

  calculateGridCounts(parity: 0 | 1, gridSize: number) {
    const gridCounts: number[][] = new Array(gridSize)
      .fill(0)
      .map(() => new Array(gridSize).fill(0));
    const mid: number = Math.floor(gridSize / 2);

    [...this.seen].forEach((rowColStr) => {
      const [row, col]: RowCol = JSON.parse(rowColStr);

      if (modFix(row + col, 2) !== parity) {
        return;
      }
      if (
        this.grid[modFix(row, this.width)][modFix(col, this.width)] === ROCK
      ) {
        return;
      }
      const gridRowIndex = mid + Math.floor(row / this.width);
      const gridColIndex = mid + Math.floor(col / this.width);
      gridCounts[gridRowIndex][gridColIndex] += 1;
    });

    return gridCounts;
  }

  solve() {
    const target = this.width === 131 ? 26501365 : 5000;
    const firstStep = target % this.width;

    const stepBys = [
      firstStep,
      this.width * 2,
      this.width * 2,
      // this.width * 2,
      // this.width * 2,
      // this.width * 2,
    ];
    let projectTo = stepBys[0] === 65 ? 26501365 : 5000;
    let totalSteps = 0;
    let gridCountViews: number[][][] = [];
    let horizon = [this.start];
    stepBys.forEach((stepBy) => {
      totalSteps += stepBy;
      horizon = this.walk(horizon, stepBy);
      const gridCounts = this.calculateGridCounts(
        (totalSteps % 2) as any,
        stepBys.length * 4 + 2
      );
      gridCountViews.push(gridCounts);
    });

    const totals = gridCountViews.map((view) => {
      return view.reduce(
        (sum, row) => sum + row.reduce((rowSum, col) => col + rowSum, 0),
        0
      );
    });
    const diffs = totals.slice(1).map((total, index) => total - totals[index]);
    const diff2s = diffs.slice(1).map((diff, index) => diff - diffs[index]);
    const diff2Init = diff2s[0];
    const diffInit = diffs[0];
    const totalInit = totals[0];
    const requiredCycles = Math.floor(projectTo / (this.width * 2)) + 1;

    const projectedDiff2s = new Array(requiredCycles).fill(diff2Init);
    const projectedDiffs = new Array(requiredCycles).fill(0).map((_, index) => {
      return diffInit + index * projectedDiff2s[index];
    });
    const projectedTotals = new Array(requiredCycles).fill(0);
    projectedDiffs.forEach((_, index) => {
      projectedTotals[index + 1] =
        index === 0
          ? totalInit
          : projectedTotals[index] + projectedDiffs[index - 1];
    });
    const projectedTotal = projectedTotals[projectedTotals.length - 1];
    return projectedTotal;
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
    this.width = this.grid.length;
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
