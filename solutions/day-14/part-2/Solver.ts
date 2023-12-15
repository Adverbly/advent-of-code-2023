const seenStates = new Set();
const scoreCycle: Record<string, { score: number; counter: number }> = {};
export class Solver {
  grid: string[][] = [];

  constructor(lines: string[]) {
    this.parseLines(lines);
  }

  solve() {
    const cycle = ["up", "left", "down", "right"] as const;
    let counter = 0;
    let state = "";
    while (counter < 1_000) {
      const action = cycle[counter % cycle.length];
      switch (action) {
        case "up":
          this.rollVertical({ dir: action });
          break;
        case "left":
          this.rollHorizontal({ dir: action });
          break;
        case "down":
          this.rollVertical({ dir: action });
          break;
        case "right":
          this.rollHorizontal({ dir: action });
          break;
      }
      counter += 1;
      const state = this.grid.map((r) => r.join("")).join("") + action;
      if (seenStates.has(state)) {
        // console.log(this.scoreGrid(), counter);
        const score = this.scoreGrid();
        if (scoreCycle[state]) {
          // we have captured the full cycle
          const sortedCycle = Object.values(scoreCycle).sort(
            (a, b) => a.counter - b.counter
          );
          const cyclesToAdd = Math.floor(
            (4_000_000_000 - sortedCycle[0].counter) / sortedCycle.length
          );

          const bumpedCycles = sortedCycle.map((iter) => ({
            ...iter,
            counter: iter.counter + sortedCycle.length * cyclesToAdd,
          }));

          return bumpedCycles.find((iter) => iter.counter === 4_000_000_000)
            ?.score;
        }
        scoreCycle[state] = { score, counter };
      }
      seenStates.add(state);
    }
    return 0;
  }

  scoreGrid() {
    const rowCount = this.grid.length;

    return this.grid.reduce((sum, row, rowIndex) => {
      const rowTotal =
        sum +
        row.reduce(
          (rowSum, col) =>
            col === "O" ? rowSum + rowCount - rowIndex : rowSum,
          0
        );

      return rowTotal;
    }, 0);
  }

  parseLines(lines: string[]) {
    this.grid = lines.map((line) => line.split(""));
  }

  rollHorizontal({ dir }: { dir: "left" | "right" }) {
    const { step, orient, realColIndex } =
      dir === "left"
        ? {
            step: (num: number) => num - 1,
            orient: <T>(rows: T[]): T[] => rows,
            realColIndex: (x: number) => x,
          }
        : {
            step: (num: number) => num + 1,
            orient: <T>(rows: T[]): T[] => [...rows].reverse(),
            realColIndex: (x: number) => this.grid.length - 1 - x,
          };

    for (let index = 1; index < orient(this.grid[0]).length; index++) {
      const colIndex = realColIndex(index);
      for (let rowIndex = 0; rowIndex < this.grid.length; rowIndex++) {
        const row = this.grid[rowIndex];
        const element = row[colIndex];

        if (element !== "O") {
          continue;
        }
        let currentColIndex = colIndex;
        while (row[step(currentColIndex)] === ".") {
          currentColIndex = step(currentColIndex);
        }
        if (currentColIndex !== colIndex) {
          row[currentColIndex] = "O";
          row[colIndex] = ".";
        }
      }
    }
  }

  rollVertical({ dir }: { dir: "up" | "down" }) {
    const { step, orient, realRowIndex } =
      dir === "up"
        ? {
            step: (num: number) => num - 1,
            orient: <T>(rows: T[]): T[] => rows,
            realRowIndex: (x: number) => x,
          }
        : {
            step: (num: number) => num + 1,
            orient: <T>(rows: T[]): T[] => [...rows].reverse(),
            realRowIndex: (x: number) => this.grid.length - 1 - x,
          };

    orient(this.grid).forEach((row, index) => {
      const rowIndex = realRowIndex(index);
      if (index === 0) {
        return;
      }

      row.forEach((col, colIndex) => {
        if (col !== "O") {
          return;
        }
        let currentRowIndex = rowIndex;
        let nextRow = this.grid[step(currentRowIndex)];
        while (nextRow && nextRow[colIndex] === ".") {
          currentRowIndex = step(currentRowIndex);
          nextRow = this.grid[step(currentRowIndex)];
        }
        if (currentRowIndex !== rowIndex) {
          this.grid[currentRowIndex][colIndex] = "O";
          this.grid[rowIndex][colIndex] = ".";
        }
      });
    });
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
