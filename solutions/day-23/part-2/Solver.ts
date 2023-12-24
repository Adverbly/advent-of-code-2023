type Cell = number;
type RowCol = [number, number];
type Adj = {
  seen: Set<string>;
  value: Cell;
  rowCol: RowCol;
  parent: Adj | null;
  distance: number;
};
type NodeId = string;
type Node = {
  id: NodeId;
  distToNeighbor: Record<NodeId, number>;
};
type SearchNode = Node & {
  visited: NodeId[];
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
  rootNode!: Node;
  nodes: Record<NodeId, Node> = {};

  constructor(lines: string[]) {
    this.parseLines(lines);
    this.root = {
      seen: new Set(),
      value: EMPTY,
      distance: 0,
      rowCol: [0, 1],
      parent: null,
    };
  }

  adjCells(adj: Adj): Adj[] {
    let result = [];
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

    let seen = adj.seen;

    result = result.filter(
      (res) =>
        !adj.parent ||
        (this.cellKey(adj.parent.rowCol) !== this.cellKey(res.rowCol) &&
          !seen.has(this.cellKey(res.rowCol)))
    );
    if (result.length === 1) {
      const key = this.cellKey(result[0].rowCol);
      if (seen.has(key)) {
        return [];
      }
      seen.add(key);
      return result.map((res) => ({
        ...res,
        distance: adj.distance + 1,
        parent: adj,
        seen,
      }));
    } else {
      return result
        .filter((res) => {
          // TODO: Use entirely different approach where I parse the grid and create a graph to find the branching points, and then do a path cost maximization where each edge has weight equal to the length to the next node.

          // TODO: Idea to improve perf here: After each split, do a BFS to see if the end is still reachable. When its not reachable, filter out that branch.
          const foundEnd = this.dfsGridForEnd({
            ...res,
            seen: new Set([...seen, this.cellKey(res.rowCol)]),
            distance: 0,
            parent: adj,
          });
          // if (!foundEnd) {
          //   console.log("didnt find end!", this.cellKey(res.rowCol));
          // } else {
          //   console.log("Can still find end...", this.cellKey(res.rowCol));
          // }

          return foundEnd;
        })
        .map((res) => {
          // console.log("Splitting at", res.rowCol, result.length)c;
          const newSeen = new Set([...seen, this.cellKey(res.rowCol)]);
          return {
            ...res,
            distance: adj.distance + 1,
            parent: adj,
            seen: newSeen,
          };
        });
    }
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

  isAncestor({ seen }: Adj, candidateKey: string): boolean | null {
    return seen.has(candidateKey);
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

      const adjCells = this.adjCells(currentAdj);
      forEach(currentAdj, adjCells);

      adjCells.forEach((adj, index) => {
        horizon.push(adj);
      });
    }
  }

  printGrid() {
    console.log(this.grid.map((row) => row.join("")).join("\n"));
  }

  dfsGridForEnd(node: Adj): boolean {
    if (
      node.rowCol[0] === this.grid.length - 1 &&
      node.rowCol[1] === this.grid[0].length - 2
    ) {
      return true;
    }
    const children = this.adjCells(node);
    children.forEach((c) => node.seen.add(this.cellKey(c.rowCol)));
    return children.some((child) =>
      this.dfsGridForEnd({
        ...child,
        distance: node.distance + 1,
        parent: node,
      })
    );
  }

  followEdge(start: Adj) {
    console.log(start);

    let startNodeId = this.cellKey(start.rowCol);
    let startNode = this.nodes[startNodeId];
    let adj = start;
    let adjs = this.adjCells(start);
    let edgeDistance = 0;
    while (adjs.length === 1) {
      edgeDistance++;
      adj = adjs[0];
      adjs = this.adjCells(adj);
    }

    const nodeId = this.cellKey(adj.rowCol);
    if (this.nodes[nodeId]) {
      const destNode = this.nodes[nodeId];
      destNode.distToNeighbor[startNodeId] = edgeDistance;
      startNode.distToNeighbor[nodeId] = edgeDistance;
      return;
    }
    const destNode = {
      id: nodeId,
      distToNeighbor: { [startNodeId]: edgeDistance },
    };
    this.nodes[nodeId] = destNode;
    startNode.distToNeighbor[nodeId] = edgeDistance;
    const nextAdjs = this.adjCells(adj);
    nextAdjs.forEach((nextAdj) => this.followEdge(nextAdj));
  }

  ancestors(node: Adj): Adj[] {
    return [node, ...(node.parent ? this.ancestors(node.parent) : [])];
  }

  solve() {
    let longestResult = this.root;
    const startNode: Node = {
      distToNeighbor: {},
      id: this.cellKey(this.root.rowCol),
    };
    const endNode: Node = {
      distToNeighbor: {},
      id: this.cellKey([this.grid.length - 1, this.grid[0].length - 2]),
    };
    this.nodes[startNode.id] = startNode;
    this.nodes[endNode.id] = endNode;
    const startingEdge = this.adjCells(this.root)[0];
    this.followEdge(startingEdge);
    console.log(this.nodes);

    // this.bfsGrid({
    //   horizon: [this.root],
    //   forEach: (cell, children) => {
    //     if (children.length === 0) {
    //       console.log(cell.distance);
    //     }
    //     if (
    //       children.length === 0 &&
    //       cell.seen.has(
    //         this.cellKey([this.grid.length - 1, this.grid[0].length - 2])
    //       )
    //     ) {
    //       console.log("valid!", cell.distance);
    //       longestResult =
    //         longestResult.distance < cell.distance ? cell : longestResult;
    //     }
    //   },
    // });
    // this.printGridAncestors(longestResult);

    return longestResult.distance;
  }
  printGridAncestors(longestResult: Adj) {
    const ancestors = this.ancestors(longestResult).map((a) =>
      this.cellKey(a.rowCol)
    );
    console.log(
      this.grid
        .map((row, rowIndex) =>
          row
            .map((c, colIndex) =>
              ancestors.includes(this.cellKey([rowIndex, colIndex]))
                ? "O"
                : c === 1
                ? "#"
                : "."
            )
            .join("")
        )
        .join("\n")
    );
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
            return EMPTY;
          } else if (char === "v") {
            return EMPTY;
          } else if (char === "<") {
            return EMPTY;
          } else if (char === ">") {
            return EMPTY;
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
