const solve = (lines: string[]) => {
  const result = lines.reduce((sum, line) => {
    const numbers = line.replaceAll(/[a-z]/g, "");
    return sum + Number(`${numbers[0]}${numbers[numbers.length - 1]}`);
  }, 0);

  console.log(result);
};

const inputFile = Bun.file(import.meta.dir + "/../input.txt");
const input = await inputFile.text();
const lines = input.split("\n");
lines.pop(); // remove trailing newline :(

const start = Bun.nanoseconds();
solve(lines); // yay for top-level await!
const end = Bun.nanoseconds();
console.log(`duration: ${end - start}ns`);
