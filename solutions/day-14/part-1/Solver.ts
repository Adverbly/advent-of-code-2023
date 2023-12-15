export class Solver {
  grid: string[][] = [];

  constructor(lines: string[]) {
    this.parseLines(lines);
  }

  solve() {
    this.rollUp();
    const rowCount = this.grid.length;
    // console.log(this.grid.map((row) => row.join("")).join("\n"));

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

  rollUp() {
    this.grid.forEach((row, rowIndex) => {
      if (rowIndex === 0) {
        return;
      }
      row.forEach((col, colIndex) => {
        if (col !== "O") {
          return;
        }
        let currentRowIndex = rowIndex;
        let nextRow = this.grid[currentRowIndex - 1];
        while (nextRow && nextRow[colIndex] === ".") {
          currentRowIndex -= 1;
          nextRow = this.grid[currentRowIndex - 1];
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
