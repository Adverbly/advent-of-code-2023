import { Solver } from "./Solver";

const order = [
  "A",
  "K",
  "Q",
  "J",
  "T",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
].reverse();
const handCompositions = {
  [JSON.stringify([5])]: { strength: 7, label: "5k" },
  [JSON.stringify([4, 1])]: { strength: 6, label: "4k" },
  [JSON.stringify([3, 2])]: { strength: 5, label: "fhk" },
  [JSON.stringify([3, 1, 1])]: { strength: 4, label: "3k" },
  [JSON.stringify([2, 2, 1])]: { strength: 3, label: "2p" },
  [JSON.stringify([2, 1, 1, 1])]: { strength: 2, label: "p" },
  [JSON.stringify([1, 1, 1, 1, 1])]: { strength: 1, label: "h" },
} as Record<string, { strength: number; label: string }>;

const solve = (lines: string[]) => {
  const solver = new Solver(lines);
  console.log(solver.solve());
};
// const inputFile = Bun.file(import.meta.dir + "/example.txt");
const inputFile = Bun.file(import.meta.dir + "/../input.txt");
const input = await inputFile.text();
const lines = input.split("\n");
lines.pop(); // remove trailing newline :(

const start = Bun.nanoseconds();
solve(lines); // yay for top-level await!
const end = Bun.nanoseconds();
console.log(`duration: ${end - start}ns`);
