type Cell = number;
type RowCol = [number, number];
type Adj = {
  value: Cell;
  rowCol: RowCol;
  parent: Adj | null;
  distance: number;
};

const UP = 5;
const DOWN = 4;
const LEFT = 3;
const RIGHT = 2;
const FOREST = 1;
const EMPTY = 0;

export class Solver {
  grid: Cell[][] = [];
  start: RowCol = [0, 1];
  root!: Adj;

  constructor(lines: string[]) {
    this.parseLines(lines);
    this.root = {
      value: EMPTY,
      distance: 0,
      rowCol: [0, 1],
      parent: null,
    };
  }

  adjCells(adj: Adj): Adj[] {
    const result = [];
    const { rowCol, value } = adj;

    if (value === EMPTY) {
      let n = this.adjCell(rowCol, [1, 0]);
      n.value !== FOREST && n.value !== undefined && result.push(n);
      n = this.adjCell(rowCol, [-1, 0]);
      n.value !== FOREST && n.value !== undefined && result.push(n);
      n = this.adjCell(rowCol, [0, 1]);
      n.value !== FOREST && n.value !== undefined && result.push(n);
      n = this.adjCell(rowCol, [0, -1]);
      n.value !== FOREST && n.value !== undefined && result.push(n);
    } else if (value === RIGHT) {
      let n = this.adjCell(rowCol, [0, 1]);
      n.value !== FOREST && n.value !== undefined && result.push(n);
    } else if (value === LEFT) {
      let n = this.adjCell(rowCol, [0, -1]);
      n.value !== FOREST && n.value !== undefined && result.push(n);
    } else if (value === UP) {
      let n = this.adjCell(rowCol, [-1, 0]);
      n.value !== FOREST && n.value !== undefined && result.push(n);
    } else if (value === DOWN) {
      let n = this.adjCell(rowCol, [1, 0]);
      n.value !== FOREST && n.value !== undefined && result.push(n);
    }

    return result.map((res) => ({
      ...res,
      distance: adj.distance + 1,
      parent: adj,
    }));
  }

  adjCell(mid: RowCol, diff: RowCol) {
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

  isAncestor({ rowCol, parent }: Adj, candidateKey: string): boolean | null {
    if (parent === null) {
      return false;
    }
    return (
      this.cellKey(rowCol) === candidateKey ||
      this.isAncestor(parent, candidateKey)
    );
  }

  bfsGrid({
    horizon,
    forEach,
  }: {
    horizon: Adj[];
    forEach: (cell: Adj, children: Adj[]) => void;
  }) {
    while (horizon.length > 0) {
      const currentAdj = horizon.shift()!;

      const adjCells = this.adjCells(currentAdj).filter(
        (adj) => !this.isAncestor(currentAdj, this.cellKey(adj.rowCol))
      );
      forEach(currentAdj, adjCells);

      adjCells.forEach((adj, index) => {
        horizon.push(adj);
      });
    }
  }

  printGrid() {
    console.log(this.grid.map((row) => row.join("")).join("\n"));
  }

  dfsGrid(node: Adj, onLeaf?: (leaf: Adj) => void) {
    const children = this.adjCells(node);
    if (children.length === 0 && onLeaf) {
      onLeaf(node);
    } else {
      children.forEach((child) =>
        this.dfsGrid(
          {
            ...child,
            distance: node.distance + 1,
            parent: node,
          },
          onLeaf
        )
      );
    }
  }

  ancestors(node: Adj): Adj[] {
    return [node, ...(node.parent ? this.ancestors(node.parent) : [])];
  }

  solve() {
    let longestResult = this.root;
    this.bfsGrid({
      horizon: [this.root],
      forEach: (cell, children) => {
        if (children.length === 0) {
          longestResult =
            longestResult.distance < cell.distance ? cell : longestResult;
        }
      },
    });

    return longestResult.distance;
  }

  parseLines(lines: string[]) {
    this.grid = lines.map(
      (line, rowIndex) =>
        line.split("").map((char, colIndex) => {
          if (char === ".") {
            return EMPTY;
          } else if (char === "#") {
            return FOREST;
          } else if (char === "^") {
            return UP;
          } else if (char === "v") {
            return DOWN;
          } else if (char === "<") {
            return LEFT;
          } else if (char === ">") {
            return RIGHT;
          }
        }) as Cell[]
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
