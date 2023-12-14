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

  solve() {
    return this.tables.reduce((sum, table, index) => {
      let score = 0;
      for (let index = 1; index < table.colNums.length; index++) {
        const left = table.colNums.slice(index);
        const right = table.colNums.slice(0, index).reverse();
        const different = [
          ...new Array(Math.min(left.length, right.length)).fill(0),
        ].some((_, index) => {
          return left[index] !== right[index];
        });

        if (!different) {
          score = 100 * index;
          break;
        }
      }

      if (!score) {
        for (let index = 1; index < table.rowNums.length; index++) {
          const left = table.rowNums.slice(index);
          const right = table.rowNums.slice(0, index).reverse();
          const different = [
            ...new Array(Math.min(left.length, right.length)).fill(0),
          ].some((_, index) => {
            return left[index] !== right[index];
          });

          if (!different) {
            score = index;
            break;
          }
        }
      }

      return sum + score;
    }, 0);
  }

  parseLines(lines: string[]) {
    const rawTables = lines
      .join("\n")
      .split("\n\n")
      .map((str) => str.split("\n"));
    this.tables = rawTables.map((raw) => {
      const rawChars = raw.map((s) => s.split(""));
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
