const solve = (lines: string[]) => {
  const result = lines.reduce((sum, line) => {
    const [gameId, games] = line.split(": ");
    const [winning, picked] = games
      .split(" | ")
      .map((game) => new Set(game.split(" ").filter((str) => str)));
    const intersection = [...winning].filter((num) => picked.has(num));

    if (intersection.length === 0) {
      return sum;
    }

    return sum + 2 ** (intersection.length - 1);
  }, 0);

  console.log(result);
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
