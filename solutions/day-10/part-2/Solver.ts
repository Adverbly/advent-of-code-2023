type RowCol = [number, number];
type Children = [RowCol, RowCol];
type Node = {
  rowCol: RowCol;
  children: Children;
};

let printDebug = true;
printDebug = false;
const pp = (...args: any[]) => {
  printDebug && console.log(...args);
};
const puts = (s: string) => {
  printDebug && process.stdout.write(s);
};

function setCharAt(str: string, index: number, chr: string) {
  if (index > str.length - 1) return str;
  return str.substring(0, index) + chr + str.substring(index + 1);
}

export class Solver {
  grid!: string[];
  rootNode!: Node & { char: string };
  nodes: Record<string, Node> = {};

  constructor(lines: string[]) {
    this.parseLines(lines);
  }

  solve() {
    this.grid[this.rootNode.rowCol[0]] = setCharAt(
      this.grid[this.rootNode.rowCol[0]],
      this.rootNode.rowCol[1],
      this.rootNode.char
    );
    return this.grid.reduce((sum, row, rowIndex) => {
      let inside = false;
      let grindStartedBy: string | null = null;
      pp("");
      return (
        sum +
        row.split("").reduce((rowSum, cell, colIndex) => {
          if (this.nodes[this.seenKey([rowIndex, colIndex])] && cell !== "-") {
            if (cell === "|") {
              inside = !inside;
              puts("%");
            } else {
              if (grindStartedBy === "F") {
                if (cell === "7") {
                  // bot to bot. No change in inside
                  puts("U");
                  grindStartedBy = null;
                } else if (cell === "J") {
                  // bot to top. Flip inside from a crossing
                  inside = !inside;
                  grindStartedBy = null;
                  puts("%");
                } else if (cell === "-") {
                  puts(cell);
                } else {
                  console.error(cell, grindStartedBy);

                  throw "should never see";
                }
              } else if (grindStartedBy === "L") {
                if (cell === "7") {
                  // top to bot. Flip inside
                  inside = !inside;
                  grindStartedBy = null;
                  puts("%");
                } else if (cell === "J") {
                  // top to top. no change.
                  puts("U");
                  grindStartedBy = null;
                } else if (cell === "-") {
                  puts(cell);
                }
              } else if (!grindStartedBy) {
                grindStartedBy = cell;
                puts("G");
              } else {
                console.error(cell, grindStartedBy);
                throw "should never see2";
              }
            }
          } else if (
            inside &&
            ((grindStartedBy && cell !== "-") || !grindStartedBy)
          ) {
            puts("I");
            return rowSum + 1;
          } else {
            puts(cell);
          }

          return rowSum;
        }, 0)
      );
    }, 0);
  }

  seenKey(rowCol: RowCol) {
    return `${rowCol[0]}:${rowCol[1]}`;
  }

  identifyStartChar(row: number, col: number) {
    let [isN, isS, isE, isW] = [false, false, false, false];

    if (["-", "J", "7"].includes(this.grid[row][col + 1])) {
      isE = true;
    }
    if (["|", "L", "J"].includes(this.grid[row + 1]?.[col])) {
      isS = true;
    }
    if (["|", "7", "F"].includes(this.grid[row - 1]?.[col])) {
      isN = true;
    }
    if (["-", "L", "F"].includes(this.grid[row][col - 1])) {
      isW = true;
    }
    if (isN && isS) {
      return "|";
    } else if (isN && isE) {
      return "L";
    } else if (isN && isW) {
      return "J";
    } else if (isS && isE) {
      return "F";
    } else if (isS && isW) {
      return "7";
    } else if (isE && isW) {
      return "-";
    } else {
      throw "bad S";
    }
  }

  parseLines(lines: string[]) {
    const startRow = lines.findIndex((line) => line.includes("S"));
    const startCol = lines[startRow].split("").findIndex((c) => c === "S");
    this.grid = lines;
    let children = this.connectedNeighbors(startRow, startCol) as RowCol[];
    this.rootNode = {
      children: children as Children,
      rowCol: [startRow, startCol],
      char: this.identifyStartChar(startRow, startCol),
    };

    this.nodes[this.seenKey(this.rootNode.rowCol)] = this.rootNode;
    while (children.length > 0) {
      children = children.flatMap((child) => {
        const childNeighbors = this.connectedNeighbors(...child);
        this.nodes[this.seenKey(child)] = {
          rowCol: child,
          children: childNeighbors,
        };
        return childNeighbors.filter((n) => !this.nodes[this.seenKey(n)]);
      });
    }
  }

  connectedNeighbors(row: number, col: number) {
    const result = [] as number[][];
    switch (this.grid[row][col]) {
      case "S":
        if (["-", "J", "7"].includes(this.grid[row][col + 1])) {
          result.push([row, col + 1]);
        }
        if (["|", "L", "J"].includes(this.grid[row + 1]?.[col])) {
          result.push([row + 1, col]);
        }
        if (["|", "7", "F"].includes(this.grid[row - 1]?.[col])) {
          result.push([row - 1, col]);
        }
        if (["-", "L", "F"].includes(this.grid[row][col - 1])) {
          result.push([row, col - 1]);
        }
        break;
      case "|":
        if (["|", "L", "J"].includes(this.grid[row + 1]?.[col])) {
          result.push([row + 1, col]);
        }
        if (["|", "7", "F"].includes(this.grid[row - 1]?.[col])) {
          result.push([row - 1, col]);
        }
        break;
      case "-":
        if (["-", "J", "7"].includes(this.grid[row][col + 1])) {
          result.push([row, col + 1]);
        }
        if (["-", "L", "F"].includes(this.grid[row][col - 1])) {
          result.push([row, col - 1]);
        }
        break;
      case "L":
        if (["-", "J", "7"].includes(this.grid[row][col + 1])) {
          result.push([row, col + 1]);
        }
        if (["|", "7", "F"].includes(this.grid[row - 1]?.[col])) {
          result.push([row - 1, col]);
        }

        break;
      case "J":
        if (["-", "L", "F"].includes(this.grid[row][col - 1])) {
          result.push([row, col - 1]);
        }
        if (["|", "7", "F"].includes(this.grid[row - 1]?.[col])) {
          result.push([row - 1, col]);
        }

        break;
      case "7":
        if (["-", "L", "F"].includes(this.grid[row][col - 1])) {
          result.push([row, col - 1]);
        }
        if (["|", "L", "J"].includes(this.grid[row + 1]?.[col])) {
          result.push([row + 1, col]);
        }

        break;
      case "F":
        if (["-", "J", "7"].includes(this.grid[row][col + 1])) {
          result.push([row, col + 1]);
        }
        if (["|", "L", "J"].includes(this.grid[row + 1]?.[col])) {
          result.push([row + 1, col]);
        }

        break;
    }
    return result as [RowCol, RowCol];
  }
}
