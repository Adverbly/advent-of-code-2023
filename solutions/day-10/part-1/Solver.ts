type RowCol = [number, number];
type Children = [RowCol, RowCol];
type Node = {
  rowCol: RowCol;
  children: Children;
};

export class Solver {
  grid!: string[];
  rootNode!: Node;
  nodes: Record<string, Node> = {};
  generationCount: number = 0;

  constructor(lines: string[]) {
    this.parseLines(lines);
  }

  solve() {
    return this.generationCount;
  }

  seenKey(rowCol: RowCol) {
    return `${rowCol[0]}:${rowCol[1]}`;
  }

  parseLines(lines: string[]) {
    const startRow = lines.findIndex((line) => line.includes("S"));
    const startCol = lines[startRow].split("").findIndex((c) => c === "S");
    this.grid = lines;
    let children = this.connectedNeighbors(startRow, startCol) as RowCol[];
    this.rootNode = {
      children: children as Children,
      rowCol: [startRow, startCol],
    };
    while (children.length > 0) {
      this.generationCount += 1;
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
