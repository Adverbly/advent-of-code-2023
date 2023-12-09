import { argv } from "bun";
import { exit } from "process";

const exitHelp = () => {
  console.log(
    `Invalid arguments

For day 24 part 2 with input data:
bun run index.ts 24 2

For day 24 part 2 on example file under day-24/part-1/example.txt:
bun run index.ts 24 2 part-1/example.txt

To develop, use bun --watch index.ts [...]`
  );
  exit(128);
};

if (![4, 5].includes(argv.length)) {
  exitHelp();
}

type TargetResolution = {
  day: number;
  part: number;
  example?: string;
};

const dayDir = (resolver: TargetResolution) =>
  `/solutions/day-${resolver.day}/`;

const importSolver = async (resolver: TargetResolution) =>
  import(`.${dayDir(resolver)}part-${resolver.part}/Solver.ts`);

const getFileLines = async (resolver: TargetResolution) => {
  const inputFile = Bun.file(
    import.meta.dir + `${dayDir(resolver)}${resolver.example}`
  );
  const input = await inputFile.text();
  const lines = input.split("\n");
  lines.pop(); // remove trailing newline :(
  return lines;
};

const createSolver = async (resolver: TargetResolution) => {
  const { Solver } = await importSolver(resolver);
  const lines = await getFileLines(resolver);
  return new Solver(lines);
};

const solve = async (resolver: TargetResolution) => {
  const solver = await createSolver(resolver);

  const start = Bun.nanoseconds();
  const solution = solver.solve();
  const end = Bun.nanoseconds();

  console.log(solution);
  console.log(`duration: ${end - start}ns`);
};

// yay for top-level await!
await solve({
  day: Number(argv[2]) || exitHelp(),
  part: Number(argv[3]) || exitHelp(),
  example: argv[4] ?? "input.txt",
});
