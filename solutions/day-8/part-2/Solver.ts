type NodeId = string;
type Dir = "R" | "L";
type Children = { R: NodeId; L: NodeId };

const gcd = (a: number, b: number): number => (a ? gcd(b % a, a) : b);
const lcm = (a: number, b: number) => (a * b) / gcd(a, b);
const lcmList = (nums: number[]) => nums.reduce(lcm);

export class Solver {
  dirs: Dir[] = [];
  nodes: Record<NodeId, Children> = {};
  dirIndex: number = 0;
  nodeIds: NodeId[] = [];
  visited = 0;

  constructor(lines: string[]) {
    this.parseLines(lines);
  }

  detectCycleLength(nodeId: NodeId): number {
    let pointer = nodeId;
    let visited = 0;
    let dirIndex = 0;
    while (true) {
      pointer = this.nodes[pointer][this.dirs[dirIndex % this.dirs.length]];

      dirIndex++;
      visited++;

      if (pointer[2] === "Z") {
        return visited;
      }
    }
  }

  solve() {
    const cycleLengths = this.nodeIds.map((nodeId) =>
      this.detectCycleLength(nodeId)
    );
    return lcmList(cycleLengths);
    // while (true) {
    //   let nonZCount = 0;
    //   this.nodeIds = this.nodeIds.map((nodeId) => {
    //     const nextId =
    //       this.nodes[nodeId][this.dirs[this.dirIndex % this.dirs.length]];
    //     if (nextId[2] !== "Z") {
    //       nonZCount++;
    //     }
    //     return nextId;
    //   });

    //   this.dirIndex++;
    //   this.visited++;

    //   if (nonZCount === 0) {
    //     return this.visited;
    //   } else if (nonZCount < 3) {
    //     console.log(nonZCount, this.visited);
    //     // console.log(this.visited);
    //   }
    // }
  }

  parseLines(lines: string[]) {
    const dirLine = lines.shift()?.split("");
    this.dirs = dirLine as Dir[];
    lines.shift();

    for (const line of lines) {
      const [nodeId, childIds] = line.split(" = ");
      const [L, R] = childIds.slice(1, -1).split(", ");

      this.nodes[nodeId] = { L, R };

      if (nodeId.endsWith("A")) {
        this.nodeIds.push(nodeId);
      }
    }
  }
}
