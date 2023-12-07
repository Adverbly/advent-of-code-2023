const solve = (lines: string[]) => {
  const [timeLine, distanceLine] = lines;
  const times = [Number(timeLine.split(":")[1].replaceAll(" ", ""))];
  const distances = [Number(distanceLine.split(":")[1].replaceAll(" ", ""))];

  // distance d = chargetime c * (raceTime r - chargetime c)
  // dd/dc = 0 at maximum distance as charge time changes
  // 0 = r -2c
  // r / 2 = c

  // distance d = chargetime c * (raceTime r - chargetime c)
  // 0 = -c^2 + rc - d
  // c = (-r + (r ** 2 -4d) ** 0.5) / -2
  // difference between two roots(H) is:
  // H = (r ** 2 -4d) ** 0.5)

  const differences = times.map((time, index) => {
    const distance = distances[index];

    const charge = (-time + (time ** 2 - 4 * distance) ** 0.5) / -2;
    const chargeFloor = Math.floor(charge) * (time - Math.floor(charge));
    const isFloorable = chargeFloor > distance;
    const chargeFor =
      chargeFloor === distance
        ? charge + 1
        : isFloorable
        ? Math.floor(charge)
        : Math.ceil(charge);

    const chargeHigh = (-time - (time ** 2 - 4 * distance) ** 0.5) / -2;
    const chargeCeil = Math.ceil(chargeHigh) * (time - Math.ceil(chargeHigh));
    const isCeilable = chargeCeil > distance;
    const chargeForHigh =
      chargeCeil === distance
        ? chargeHigh - 1
        : isCeilable
        ? Math.ceil(chargeHigh)
        : Math.floor(chargeHigh);

    const winGap = chargeForHigh - chargeFor + 1;
    return winGap;
  });

  const product = differences.reduce((p, d) => p * d, 1);
  console.log(product);
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
