type RowCol = [number, number];
type Node = {
  rowIndex: number;
  colIndex: number;
};
type Beam = {
  rowCol: RowCol;
  dir: "r" | "d" | "l" | "u";
};

export class Solver {
  grid!: string[][];
  nodes: Record<string, Node> = {};
  seenBeamStates: Set<string> = new Set();

  constructor(lines: string[]) {
    this.parseLines(lines);
  }

  printEnergized(energized: Set<string>) {
    console.log(
      this.grid
        .map((row, rowIndex) =>
          row
            .map((col, colIndex) =>
              energized.has(this.seenKey([rowIndex, colIndex])) ? "#" : "."
            )
            .join("")
        )
        .join("\n")
    );
  }

  newBeams(beams: Beam[]) {
    return beams.filter((beam) => {
      const beamState = JSON.stringify(beam);
      if (this.seenBeamStates.has(beamState)) {
        return false;
      } else {
        this.seenBeamStates.add(beamState);
        return true;
      }
    });
  }

  resetNewBeams() {
    this.seenBeamStates = new Set();
  }

  solveInitial(beam: Beam) {
    let beams: Beam[] = [beam];
    const energized: Set<string> = new Set();
    while (beams.length > 0) {
      const nextBeams = beams.flatMap((beam): Beam[] => {
        let nextRowCol: RowCol = [0, 0];
        if (beam.dir === "r") {
          nextRowCol = [beam.rowCol[0], beam.rowCol[1] + 1];
        } else if (beam.dir === "d") {
          nextRowCol = [beam.rowCol[0] + 1, beam.rowCol[1]];
        } else if (beam.dir === "l") {
          nextRowCol = [beam.rowCol[0], beam.rowCol[1] - 1];
        } else if (beam.dir === "u") {
          nextRowCol = [beam.rowCol[0] - 1, beam.rowCol[1]];
        }
        if (
          nextRowCol[0] < 0 ||
          nextRowCol[1] < 0 ||
          nextRowCol[0] >= this.grid[0].length ||
          nextRowCol[1] >= this.grid.length
        ) {
          return [];
        }

        const nextChar = this.grid[nextRowCol[0]][nextRowCol[1]];
        energized.add(this.seenKey(nextRowCol));

        if (nextChar === ".") {
          return this.newBeams([{ dir: beam.dir, rowCol: nextRowCol }]);
        } else if (nextChar === "|") {
          if (beam.dir === "r" || beam.dir === "l") {
            return this.newBeams([
              { dir: "u", rowCol: nextRowCol },
              { dir: "d", rowCol: nextRowCol },
            ]);
          } else {
            return this.newBeams([{ dir: beam.dir, rowCol: nextRowCol }]);
          }
        } else if (nextChar === "\\") {
          if (beam.dir === "r") {
            return this.newBeams([{ dir: "d", rowCol: nextRowCol }]);
          } else if (beam.dir === "d") {
            return this.newBeams([{ dir: "r", rowCol: nextRowCol }]);
          } else if (beam.dir === "l") {
            return this.newBeams([{ dir: "u", rowCol: nextRowCol }]);
          } else if (beam.dir === "u") {
            return this.newBeams([{ dir: "l", rowCol: nextRowCol }]);
          }
        } else if (nextChar === "/") {
          if (beam.dir === "r") {
            return this.newBeams([{ dir: "u", rowCol: nextRowCol }]);
          } else if (beam.dir === "d") {
            return this.newBeams([{ dir: "l", rowCol: nextRowCol }]);
          } else if (beam.dir === "l") {
            return this.newBeams([{ dir: "d", rowCol: nextRowCol }]);
          } else if (beam.dir === "u") {
            return this.newBeams([{ dir: "r", rowCol: nextRowCol }]);
          }
        } else if (nextChar === "-") {
          if (beam.dir === "u" || beam.dir === "d") {
            return this.newBeams([
              { dir: "l", rowCol: nextRowCol },
              { dir: "r", rowCol: nextRowCol },
            ]);
          } else {
            return this.newBeams([{ dir: beam.dir, rowCol: nextRowCol }]);
          }
        }
        return [];
      });

      beams = nextBeams;
    }

    // this.printEnergized(energized);
    this.resetNewBeams();

    return energized.size;
  }

  solve() {
    let maxEnergized = 0;
    const mergeMax = ({ dir, rowCol }: Beam) => {
      const value = this.solveInitial({
        dir,
        rowCol,
      });

      maxEnergized = Math.max(maxEnergized, value);
    };
    for (let rowIndex = 0; rowIndex < this.grid.length; rowIndex++) {
      const rowCol = [rowIndex, -1] as RowCol;
      mergeMax({ dir: "r", rowCol });
    }
    for (let rowIndex = 0; rowIndex < this.grid.length; rowIndex++) {
      const rowCol = [rowIndex, this.grid[0].length] as RowCol;
      mergeMax({ dir: "l", rowCol });
    }
    for (let colIndex = 0; colIndex < this.grid[0].length; colIndex++) {
      const rowCol = [-1, colIndex] as RowCol;
      mergeMax({ dir: "d", rowCol });
    }
    for (let colIndex = 0; colIndex < this.grid[0].length; colIndex++) {
      const rowCol = [this.grid.length, colIndex] as RowCol;
      mergeMax({ dir: "u", rowCol });
    }
    return maxEnergized;
  }

  seenKey(rowCol: RowCol) {
    return `${rowCol[0]}:${rowCol[1]}`;
  }

  parseGrid(lines: string[]) {
    this.grid = lines.map((line) => line.split(""));
  }

  parseLines(lines: string[]) {
    this.parseGrid(lines);
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
