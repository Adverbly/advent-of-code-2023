type RowCol = [number, number];
enum Orientation {
  Horizontal = 0,
  Vertical = 1,
}
enum Direction {
  Up = "U",
  Down = "D",
  Left = "L",
  Right = "R",
}
type Segment = {
  dir: Direction;
  orientation: Orientation;
  start: RowCol;
  end: RowCol;
  small: RowCol;
  big: RowCol;
};

export class Solver {
  rowBreaks: number[] = [];
  colBreaks: number[] = [];
  segments: Segment[] = [];

  constructor(lines: string[]) {
    this.parseLines(lines);
  }

  horizontalSegments() {
    return this.segments.filter(
      (segment) => segment.orientation === Orientation.Horizontal
    );
  }

  intersectingVerticalSegments(row: number) {
    return this.segments.filter(
      (segment) =>
        segment.orientation === Orientation.Vertical &&
        segment.small[0] < row &&
        segment.big[0] > row
    );
  }

  perimeter() {
    return this.segments.reduce((sum, segment) => {
      return (
        sum +
        segment.big[0] -
        segment.small[0] +
        segment.big[1] -
        segment.small[1]
      );
    }, 0);
  }

  solve() {
    const perimeterOffset = this.perimeter() / 2 + 1;

    const horizontalSegments = this.horizontalSegments();
    horizontalSegments.sort((a, b) => a.small[0] - b.small[0]);
    return (
      perimeterOffset +
      horizontalSegments.reduce((sum, topHorizontal, index) => {
        const botHorizontal = horizontalSegments[index + 1];
        if (botHorizontal === undefined) {
          return sum;
        }
        const mid = (topHorizontal.small[0] + botHorizontal.small[0]) / 2;
        const verticalSegments = this.intersectingVerticalSegments(mid);

        const height = botHorizontal.small[0] - topHorizontal.small[0];

        verticalSegments.sort((a, b) => a.small[1] - b.small[1]);
        let inside = false;
        return (
          sum +
          verticalSegments.reduce(
            (sliceSum, leftVerticalSegment, verticalSegmentIndex) => {
              const rightVerticalSegment =
                verticalSegments[verticalSegmentIndex + 1];
              if (!rightVerticalSegment) {
                return sliceSum;
              }
              inside = !inside;
              if (inside) {
                // console.log(
                //   `adding block top: ${topHorizontal.small[0]} bot: ${botHorizontal.small[0]} left: ${leftVerticalSegment.small[1]} right: ${rightVerticalSegment.small[1]}`
                // );
                const width =
                  rightVerticalSegment.small[1] - leftVerticalSegment.small[1];

                return sliceSum + width * height;
              }
              // console.log(
              //   `ignoring block top: ${topHorizontal.small[0]} bot: ${botHorizontal.small[0]} left: ${leftVerticalSegment.small[1]} right: ${rightVerticalSegment.small[1]}`
              // );
              return sliceSum;
            },
            0
          )
        );
      }, 0)
    );
  }

  parseLines(lines: string[]) {
    let rowCol = [0, 0];
    this.segments = lines.map((line) => {
      const [, , code] = line.split(" ");

      const tail = Number(code[code.length - 2]);
      const dir = tail === 0 ? "R" : tail === 1 ? "D" : tail === 2 ? "L" : "U";
      const length = parseInt(code.slice(2, code.length - 2), 16);

      const start = [...rowCol] as RowCol;
      rowCol =
        dir === "D"
          ? [rowCol[0] + length, rowCol[1]]
          : dir === "L"
          ? [rowCol[0], rowCol[1] - length]
          : dir === "R"
          ? [rowCol[0], rowCol[1] + length]
          : [rowCol[0] - length, rowCol[1]];
      const end = [...rowCol] as RowCol;

      return {
        dir: dir as Direction,
        start: start,
        end: end,
        small: start[0] < end[0] ? start : start[1] < end[1] ? start : end,
        big: start[0] > end[0] ? start : start[1] > end[1] ? start : end,
        orientation:
          dir === "D" || dir === "U"
            ? Orientation.Vertical
            : Orientation.Horizontal,
      };
    });
  }
}

if (import.meta.main) {
  const dir = import.meta.dir.split("/");
  const day = dir[dir.length - 2].split("-")[1];
  const part = dir[dir.length - 1].split("-")[1];
  Bun.env.AOC_DAY = day;
  Bun.env.AOC_PART = part;
  Bun.env.AOC_INPUT = "part-1/example.txt";
  import(`../../../index.ts`);
}
