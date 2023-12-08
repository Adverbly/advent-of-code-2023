type NodeId = string;
type Dir = "R" | "L";
type Children = { R: NodeId; L: NodeId };

export class Solver {
  dirs: Dir[] = [];
  nodes: Record<NodeId, Children> = {};
  dirIndex: number = 0;
  nodeId: NodeId = "AAA";
  visited = 0;

  constructor(lines: string[]) {
    this.parseLines(lines);
  }

  solve() {
    while (true) {
      this.nodeId =
        this.nodes[this.nodeId][this.dirs[this.dirIndex % this.dirs.length]];

      this.dirIndex++;
      this.visited++;

      if (this.nodeId === "ZZZ") {
        return this.visited;
      }
    }
  }

  parseLines(lines: string[]) {
    const dirLine = lines.shift()?.split("");
    this.dirs = dirLine as Dir[];
    lines.shift();

    for (const line of lines) {
      const [nodeId, childIds] = line.split(" = ");
      const [L, R] = childIds.slice(1, -1).split(", ");
      this.nodes[nodeId] = { L, R };
    }
  }
}
