type Cell = number;
type RowCol = [number, number];
type Adj = {
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
  visitingDistance: number;
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
  startNode!: Node;
  endNode!: Node;
  nodes: Record<NodeId, Node> = {};
  maxFound: number = 0;

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

    result = result.filter(
      (res) =>
        !adj.parent ||
        this.cellKey(adj.parent.rowCol) !== this.cellKey(res.rowCol)
    );
    return result.map((r) => ({
      ...r,
      parent: adj,
      distance: adj.distance + 1,
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

  followEdge(start: Adj) {
    let startNodeId = this.cellKey(start.parent!.rowCol);
    let startNode = this.nodes[startNodeId];
    let adj = start;
    let adjs = this.adjCells(start);
    let edgeDistance = 1;
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

  solve() {
    this.startNode = {
      distToNeighbor: {},
      id: this.cellKey(this.root.rowCol),
    };
    this.endNode = {
      distToNeighbor: {},
      id: this.cellKey([this.grid.length - 1, this.grid[0].length - 2]),
    };
    this.nodes[this.startNode.id] = this.startNode;
    this.nodes[this.endNode.id] = this.endNode;
    const startingEdge = this.adjCells(this.root)[0];
    this.followEdge(startingEdge);

    const searchNode: SearchNode = {
      ...this.startNode,
      visited: [this.startNode.id],
      visitingDistance: 0,
    };
    this.maxDistToEndFrom(searchNode);
    return this.maxFound;
  }

  maxDistToEndFrom(searchNode: SearchNode) {
    Object.entries(searchNode.distToNeighbor).map(([neighborId, distance]) => {
      if (searchNode.visited.includes(neighborId)) {
        return;
      }
      if (neighborId === this.endNode.id) {
        this.maxFound = Math.max(
          this.maxFound,
          distance + searchNode.visitingDistance
        );
        return;
      }

      const visited = searchNode.visited;
      visited.push(neighborId);
      const newSearch: SearchNode = {
        ...this.nodes[neighborId],
        visited,
        visitingDistance: distance + searchNode.visitingDistance,
      };
      this.maxDistToEndFrom(newSearch);
      visited.pop();
    });
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
