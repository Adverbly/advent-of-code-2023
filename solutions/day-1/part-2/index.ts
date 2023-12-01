const solve = (lines: string[]) => {
  const result = lines.reduce((sum, line) => {
    const subs = [
      [1, "one"],
      [2, "two"],
      [3, "three"],
      [4, "four"],
      [5, "five"],
      [6, "six"],
      [7, "seven"],
      [8, "eight"],
      [9, "nine"],
    ] as [number, string][];
    subs.forEach(([num, chars]) => {
      line = line.replaceAll(chars, chars + num.toString() + chars);
    });
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
