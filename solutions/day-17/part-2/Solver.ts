import { sortedIndexOf } from "../../../lib/sortedIndexOf.ts";

export class Solver {
  grid!: number[][];

  constructor(lines: string[]) {
    this.parseLines(lines);
  }

  adjChain(chain: string, char: "d" | "u" | "l" | "r") {
    return chain[0] === char ? chain.concat(char) : char;
  }

  solve() {
    let horizon = [{ rowCol: [0, 0], cost: 0, chain: "", path: [[0, 0]] }];
    let foundCost = 0;
    let seen = new Set<string>();
    while (!foundCost) {
      const { rowCol, cost, chain, path } = horizon.shift()!;

      if (
        rowCol[0] === this.grid.length - 1 &&
        rowCol[1] === this.grid[0].length - 1
      ) {
        foundCost = cost;
        continue;
      }

      let adj = [rowCol[0] + 1, rowCol[1]];
      let adjChain = this.adjChain(chain, "d");
      let adjSeen = JSON.stringify(adj) + adjChain;
      if (
        !seen.has(adjSeen) &&
        chain !== "dddddddddd" &&
        (chain.length >= 4 || chain[0] === "d" || chain.length === 0) &&
        !chain.includes("u")
      ) {
        const newNode = {
          rowCol: adj,
          cost: cost + this.grid[adj[0]]?.[adj[1]],
          chain: adjChain,
          path: path.concat([adj]),
        };
        seen.add(adjSeen);
        if (newNode.cost) {
          const insertIndex = sortedIndexOf(
            horizon,
            (node) => node.cost,
            newNode
          );
          horizon.splice(insertIndex, 0, newNode);
        }
      }
      adj = [rowCol[0] - 1, rowCol[1]];
      adjChain = this.adjChain(chain, "u");
      adjSeen = JSON.stringify(adj) + adjChain;
      if (
        !seen.has(adjSeen) &&
        chain !== "uuuuuuuuuu" &&
        (chain.length >= 4 || chain[0] === "u" || chain.length === 0) &&
        !chain.includes("d")
      ) {
        const newNode = {
          rowCol: adj,
          cost: cost + this.grid[adj[0]]?.[adj[1]],
          chain: adjChain,
          path: path.concat([adj]),
        };
        seen.add(adjSeen);
        if (newNode.cost) {
          const insertIndex = sortedIndexOf(
            horizon,
            (node) => node.cost,
            newNode
          );
          horizon.splice(insertIndex, 0, newNode);
        }
      }
      adj = [rowCol[0], rowCol[1] + 1];
      adjChain = this.adjChain(chain, "r");
      adjSeen = JSON.stringify(adj) + adjChain;
      if (
        !seen.has(adjSeen) &&
        chain !== "rrrrrrrrrr" &&
        (chain.length >= 4 || chain[0] === "r" || chain.length === 0) &&
        !chain.includes("l")
      ) {
        const newNode = {
          rowCol: adj,
          cost: cost + this.grid[adj[0]]?.[adj[1]],
          chain: adjChain,
          path: path.concat([adj]),
        };
        seen.add(adjSeen);
        if (newNode.cost) {
          const insertIndex = sortedIndexOf(
            horizon,
            (node) => node.cost,
            newNode
          );
          horizon.splice(insertIndex, 0, newNode);
        }
      }
      adj = [rowCol[0], rowCol[1] - 1];
      adjChain = this.adjChain(chain, "l");
      adjSeen = JSON.stringify(adj) + adjChain;
      if (
        !seen.has(adjSeen) &&
        chain !== "llllllllll" &&
        (chain.length >= 4 || chain[0] === "l" || chain.length === 0) &&
        !chain.includes("r")
      ) {
        const newNode = {
          rowCol: adj,
          cost: cost + this.grid[adj[0]]?.[adj[1]],
          chain: adjChain,
          path: path.concat([adj]),
        };
        if (newNode.cost) {
          const insertIndex = sortedIndexOf(
            horizon,
            (node) => node.cost,
            newNode
          );
          horizon.splice(insertIndex, 0, newNode);
        }
        seen.add(adjSeen);
      }
    }
    return foundCost;
  }

  parseLines(lines: string[]) {
    this.grid = lines.map((line) => line.split("").map(Number));
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
