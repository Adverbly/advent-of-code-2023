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
      let adjChain = chain === "dd" ? "ddd" : chain === "d" ? "dd" : "d";
      let adjSeen = JSON.stringify(adj) + adjChain;
      if (!seen.has(adjSeen) && chain !== "ddd" && !chain.includes("u")) {
        horizon.push({
          rowCol: adj,
          cost: cost + this.grid[adj[0]]?.[adj[1]],
          chain: adjChain,
          path: path.concat([adj]),
        });
        seen.add(adjSeen);
      }
      adj = [rowCol[0] - 1, rowCol[1]];
      adjChain = chain === "uu" ? "uuu" : chain === "u" ? "uu" : "u";
      adjSeen = JSON.stringify(adj) + adjChain;
      if (!seen.has(adjSeen) && chain !== "uuu" && !chain.includes("d")) {
        horizon.push({
          rowCol: adj,
          cost: cost + this.grid[adj[0]]?.[adj[1]],
          chain: adjChain,
          path: path.concat([adj]),
        });
        seen.add(adjSeen);
      }
      adj = [rowCol[0], rowCol[1] + 1];
      adjChain = chain === "rr" ? "rrr" : chain === "r" ? "rr" : "r";
      adjSeen = JSON.stringify(adj) + adjChain;
      if (!seen.has(adjSeen) && chain !== "rrr" && !chain.includes("l")) {
        horizon.push({
          rowCol: adj,
          cost: cost + this.grid[adj[0]]?.[adj[1]],
          chain: adjChain,
          path: path.concat([adj]),
        });
        seen.add(adjSeen);
      }
      adj = [rowCol[0], rowCol[1] - 1];
      adjChain = chain === "ll" ? "lll" : chain === "l" ? "ll" : "l";
      adjSeen = JSON.stringify(adj) + adjChain;
      if (!seen.has(adjSeen) && chain !== "lll" && !chain.includes("r")) {
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
