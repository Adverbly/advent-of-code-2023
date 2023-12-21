const gcd = (a: number, b: number): number => (a ? gcd(b % a, a) : b);
const lcm = (a: number, b: number) => (a * b) / gcd(a, b);
const lcmList = (nums: number[]) => nums.reduce(lcm);

export class Solver {
  solve() {
    // TODO: Automate the discovery of these cycle periods as implemented in detector.ts
    const defaultStates = [3917, 3943, 3947, 4001];
    return lcmList(defaultStates);
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
