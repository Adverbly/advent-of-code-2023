type RowCol = [number, number];
type Node = {
  rowIndex: number;
  colIndex: number;
};

export class Solver {
  grid!: number[][];

  constructor(lines: string[]) {
    this.parseLines(lines);
  }

  score(string: string[]) {
    return 0;
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
      // console.log(rowCol, cost, chain);
      // if (seen.size % 10 === 0) {
      //   console.log(horizon, seen);
      // }
      if (
        rowCol[0] === this.grid.length - 1 &&
        rowCol[1] === this.grid[0].length - 1
      ) {
        foundCost = cost;
        console.log(path);
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
        horizon.push({
          rowCol: adj,
          cost: cost + this.grid[adj[0]]?.[adj[1]],
          chain: adjChain,
          path: path.concat([adj]),
        });
        seen.add(adjSeen);
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
        horizon.push({
          rowCol: adj,
          cost: cost + this.grid[adj[0]]?.[adj[1]],
          chain: adjChain,
          path: path.concat([adj]),
        });
        seen.add(adjSeen);
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
        horizon.push({
          rowCol: adj,
          cost: cost + this.grid[adj[0]]?.[adj[1]],
          chain: adjChain,
          path: path.concat([adj]),
        });
        seen.add(adjSeen);
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
        horizon.push({
          rowCol: adj,
          cost: cost + this.grid[adj[0]]?.[adj[1]],
          chain: adjChain,
          path: path.concat([adj]),
        });
        seen.add(adjSeen);
      }
      horizon = horizon
        .filter((h) => h.cost !== undefined && !isNaN(h.cost))
        .sort((a, b) => a.cost - b.cost);

      // if(rowCol[0] + 1 >= this.grid.length) {
      //   continue;
      // } else if(rowCol[0] - 1 <= 0) {
      //   continue;
      // } else if(rowCol[1] - 1 <= 0) {
      //   continue
      // } else if(rowCol[1] + 1 >= this.grid[0].length) {
      //   continue
      // }

      // const horizonAdj = next?.rowCol

      //       horizon = horizon.flatMap(([rowIndex, colIndex]) => {
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
