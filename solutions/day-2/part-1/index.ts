const solve = (lines: string[]) => {
  const maxes = [
    [" red", 12],
    [" green", 13],
    [" blue", 14],
  ] as [string, number][];
  const result = lines.reduce((sum, line) => {
    const [gameId, games] = line.split(":");
    const pulls = games.split(";").map((game) => game.split(", "));

    if (
      pulls.some((game) =>
        game.some((pull) =>
          maxes.some(([color, max]) => {
            return pull.includes(color) && Number(pull.split(color)[0]) > max;
          })
        )
      )
    ) {
      return sum;
    }
    return sum + Number(gameId.split(" ")[1]);
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
