export class Solver {
  seqs: number[][] = [];

  constructor(lines: string[]) {
    this.parseLines(lines);
  }

  prevNum(seq: number[]): number {
    const diffs = [] as number[];
    for (let index = 0; index < seq.length - 1; index++) {
      const num = seq[index];
      const nextNum = seq[index + 1];
      const diff = nextNum - num;
      diffs.push(diff);
    }
    const lastDiff = diffs[diffs.length - 1];
    const firstSeq = seq[0];
    if (lastDiff === 0) {
      return firstSeq;
    }
    return firstSeq - this.prevNum(diffs);
  }

  solve() {
    const nextNums = this.seqs.map(this.prevNum.bind(this));
    return nextNums.reduce((sum, num) => sum + num, 0);
  }

  parseLines(lines: string[]) {
    this.seqs = lines.map((line) => line.split(" ").map(Number));
  }
}
