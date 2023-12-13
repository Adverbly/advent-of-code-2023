type Line = {
  line: string;
  comp: ["#" | "?", number][];
  chars: string[];
  raw: string;
  rawSeq: number[];
  seq: number[];
  seqWeight: number;
};

class PartialLine {
  raw: string;
  rawSeq: any;
  chars: string[];
  constructor(raw: string, rawSeq: number[]) {
    this.raw = raw;
    this.rawSeq = rawSeq;
    this.chars = raw.split("");
  }
  reverse() {
    this.chars.reverse();
    this.raw = this.chars.join("");
    this.rawSeq = this.rawSeq.reverse();
    return this;
  }
}

export class Solver {
  lines: PartialLine[] = [];

  constructor(lines: string[]) {
    this.parseLines(lines);
  }

  permutations(line: PartialLine): number {
    const chars = line.chars;
    if (chars.length === 0 && line.rawSeq.length === 0) {
      return 1;
    }
    if (chars[0] === "?") {
      const chippedHash = this.chip(
        new PartialLine(`#${line.raw.slice(1)}`, line.rawSeq)
      );
      const chippedDot = this.chip(
        new PartialLine(`${line.raw.slice(1)}`, line.rawSeq)
      );
      return (
        (chippedDot ? this.permutations(chippedDot) : 0) +
        (chippedHash ? this.permutations(chippedHash) : 0)
      );
    } else {
      // console.log(chars, line.rawSeq);
    }
    return 1;
  }

  solve() {
    return this.lines.reduce((sum, line, index) => {
      const permutations = this.permutations(line);
      // console.log(permutations);

      return sum + permutations;
    }, 0);
  }

  compressDots(line: string): string {
    let str = line;
    while (str.startsWith(".")) {
      str = str.replace(".", "");
    }
    while (str.endsWith(".")) {
      str = str.slice(0, -1);
    }
    while (str.includes("..")) {
      str = str.replaceAll("..", ".");
    }
    return str;
  }

  chip(line: PartialLine): PartialLine | undefined {
    let chipped = line.raw;
    chipped = this.compressDots(chipped);
    const split = chipped.split("");
    const nextSeq = line.rawSeq.slice(1);
    if (!chipped.startsWith("#")) {
      if (line.rawSeq.length > chipped.length) {
        return;
      }
      return new PartialLine(chipped, line.rawSeq);
    }
    let toSet = line.rawSeq[0];
    if (toSet > split.length) {
      return; // failed to chip because cannot set enough #
    }
    if (split[toSet] === "#") {
      return; // we would create a chain longer than intended
    }
    for (let index = 0; index < toSet; index++) {
      if (split[index] === ".") {
        return; // tried to change an outcome
      }
      split[index] = "#";
    }
    if (toSet === split.length - 1 && nextSeq.length !== 0) {
      return; // wont have enough for next # group
    }
    split[toSet] = ".";

    const nextString = this.compressDots(split.join("").slice(toSet + 1));

    if (
      nextSeq.reduce((sum: number, num: number) => sum + num, 0) +
        nextSeq.length -
        1 >
      nextString.length
    ) {
      return;
    }
    if (nextSeq.length === 0 && nextString.includes("#")) {
      return;
    }

    return this.chip(new PartialLine(nextString, nextSeq));
  }

  parseLines(lines: string[]) {
    this.lines = lines.map((rawLine) => {
      const [raw, rawLineSeq] = rawLine.split(" ");
      const rawSeq = rawLineSeq.split(",").map(Number);
      let partialLine = new PartialLine(raw, rawSeq);

      partialLine = this.chip(partialLine) as PartialLine;
      // console.log(partialLine);

      partialLine.reverse();
      // console.log(partialLine);

      partialLine = this.chip(partialLine) as PartialLine;
      // console.log(partialLine);

      partialLine.reverse();
      // console.log(partialLine);

      return partialLine;
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
  import(`../../../index.ts`).then(() => {
    console.log("complete");
  });
}
