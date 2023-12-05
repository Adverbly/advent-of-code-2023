const solve = (lines: string[]) => {
  const cardValues = Array(lines.length).fill(1);
  lines
    .reverse()
    // .slice(0, 2)
    .forEach((line, index) => {
      const [gameId, games] = line.split(": ");
      const [winning, picked] = games
        .split(" | ")
        .map((game) => new Set(game.split(" ").filter((str) => str)));
      const intersection = [...winning].filter((num) => picked.has(num));
      const total = intersection
        .map((_, intersectionIndex) => {
          const finalIndex = index - intersectionIndex - 1;
          const value = cardValues[finalIndex];
          return value;
        })
        .reduce((sum, nextNum) => {
          return sum + nextNum;
        }, 1);

      cardValues[index] = total;
    });
  const result = cardValues.reduce((sum, total) => sum + total, 0);

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
