const coordDiffs = [
  [-1, 1],
  [-1, 0],
  [-1, -1],
  [0, 1],
  [0, -1],
  [1, 1],
  [1, 0],
  [1, -1],
];

const getScore = (
  lines: string[],
  rowIndex: number,
  colIndex: number,
  trailingNum: string
) => {
  if (
    coordDiffs.some(([rowDelta, colDelta]) => {
      const char = lines[rowIndex + rowDelta]?.[colIndex + colDelta];
      // console.log("looking at char", char);
      // console.log(
      //   "looking at [",
      //   rowIndex + rowDelta,
      //   ",",
      //   colIndex + colDelta,
      //   "]",
      //   trailingNum
      // );
      if (char && char !== "." && isNaN(Number(char))) {
        // its a symbol so number is a keeper
        console.log("found a symbol", trailingNum, rowIndex, colIndex, char);
        return true;
      }
      return false;
    }) ||
    coordDiffs.some(([rowDelta, colDelta]) => {
      const char =
        lines[rowIndex + rowDelta]?.[
          colIndex + colDelta - (trailingNum.length - 1)
        ];
      // console.log(
      //   "char: ",
      //   char,
      //   "looking at [",
      //   rowIndex + rowDelta,
      //   ",",
      //   colIndex + colDelta - (trailingNum.length - 1),
      //   "]",
      //   trailingNum
      // );
      // console.log("looking at char", char);
      if (char && char !== "." && isNaN(Number(char))) {
        // console.log("found a symbol", trailingNum, rowIndex, colIndex, char);
        // its a symbol so number is a keeper
        return true;
      }
      return false;
    })
  ) {
    return Number(trailingNum);
  } else {
    // console.log("did not find a symbol for", trailingNum, rowIndex, colIndex);
  }
  return 0;
};

const solve = (lines: string[]) => {
  let sum = 0;
  lines.forEach((line, rowIndex) => {
    let trailingNum = "";
    line.split("").forEach((char, colIndex) => {
      if (isNaN(Number(char))) {
        if (trailingNum) {
          sum += getScore(lines, rowIndex, colIndex - 1, trailingNum);
          trailingNum = "";
        }
      } else {
        trailingNum += char;
      }
    });

    if (trailingNum) {
      sum += getScore(lines, rowIndex, line.length - 1, trailingNum);
      trailingNum = "";
    }
  });

  console.log(sum);
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
