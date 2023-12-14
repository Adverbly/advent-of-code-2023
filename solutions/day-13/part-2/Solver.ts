interface Table {
  rowNums: number[];
  colNums: number[];
  raw: string[][];
}

export class Solver {
  tables: Table[] = [];

  constructor(lines: string[]) {
    this.parseLines(lines);
  }

  getSmudgeScore(table: Table): number {
    const oldScore = this.getScore(table);
    for (let rowIndex = 0; rowIndex < table.colNums.length; rowIndex++) {
      for (let colIndex = 0; colIndex < table.rowNums.length; colIndex++) {
        const smudgeTable = this.initializeTable(table.raw, {
          colIndex,
          rowIndex,
        });

        const score = this.getScore(smudgeTable, oldScore);
        if (score !== 0 && score !== oldScore) {
          return score;
        }
      }
    }
    return oldScore;
  }

  getScore(table: Table, rejectScore?: number): number {
    for (let index = 1; index < table.colNums.length; index++) {
      const left = table.colNums.slice(index);
      const right = table.colNums.slice(0, index).reverse();
      const different = [
        ...new Array(Math.min(left.length, right.length)).fill(0),
      ].some((_, index) => {
        return left[index] !== right[index];
      });

      if (!different && 100 * index !== rejectScore) {
        return 100 * index;
      }
    }

    for (let index = 1; index < table.rowNums.length; index++) {
      const left = table.rowNums.slice(index);
      const right = table.rowNums.slice(0, index).reverse();
      const different = [
        ...new Array(Math.min(left.length, right.length)).fill(0),
      ].some((_, index) => {
        return left[index] !== right[index];
      });

      if (!different && index !== rejectScore) {
        return index;
      }
    }
    return 0;
  }

  solve() {
    return this.tables.reduce(
      (sum, table, index) => sum + this.getSmudgeScore(table),
      0
    );
  }

  initializeTable(
    rawChars: string[][],
    flip?: { rowIndex: number; colIndex: number }
  ): Table {
    if (flip) {
      rawChars = [...rawChars];
      const row = [...rawChars[flip.rowIndex]];
      rawChars[flip.rowIndex] = row; // dup
      row[flip.colIndex] = row[flip.colIndex] === "#" ? "." : "#";
    }

    const colNums = rawChars.map((row) =>
      parseInt(row.map((c) => (c === "#" ? "1" : "0")).join(""), 2)
    );
    const rowNums = rawChars[0].map((_, colIndex) => {
      return parseInt(
        rawChars
          .map((_, rowIndex) => {
            return rawChars[rowIndex][colIndex] === "#" ? "1" : "0";
          })
          .join("")
      );
    });
    return {
      raw: rawChars,
      rowNums,
      colNums,
    };
  }

  parseLines(lines: string[]) {
    const rawTables = lines
      .join("\n")
      .split("\n\n")
      .map((str) => str.split("\n"));

    this.tables = rawTables.map((raw) => {
      const rawChars = raw.map((s) => s.split(""));
      return this.initializeTable(rawChars);
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
