const solve = (lines: string[]) => {
  const maxes = [
    [" red", 0],
    [" green", 0],
    [" blue", 0],
  ] as [string, number][];
  const result = lines.reduce((sum, line) => {
    const [gameId, games] = line.split(":");
    const pulls = games.split(";").map((game) => game.split(", "));

    pulls.forEach((game) =>
      game.forEach((pull) =>
        maxes.forEach((maxData) => {
          const [color, max] = maxData;
          const pullCount = Number(pull.split(color)[0]);
          if (pull.includes(color) && pullCount > max) {
            maxData[1] = pullCount;
          }
        })
      )
    );

    const score = maxes.reduce(
      (product, nextValue) => product * nextValue[1],
      1
    );
    maxes.forEach((max) => (max[1] = 0));
    return sum + score;
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
