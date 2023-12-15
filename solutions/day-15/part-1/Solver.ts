export class Solver {
  sequence: string[] = [];

  constructor(lines: string[]) {
    this.parseLines(lines);
  }

  solve() {
    return this.sequence.reduce((sum, string) => {
      const hash = this.hash(string);
      return hash + sum;
    }, 0);
  }

  parseLines(lines: string[]) {
    this.sequence = lines[0].split(",");
  }

  hash(string: string) {
    return string.split("").reduce((currentValue, char) => {
      return ((currentValue + char.charCodeAt(0)) * 17) % 256;
    }, 0);
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
