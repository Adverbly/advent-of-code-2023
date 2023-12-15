type BaseCmd = {
  label: string;
  box: number;
};
type Push = BaseCmd & {
  type: "push";
  value: number;
};
type Remove = BaseCmd & {
  type: "remove";
};
type Box = Push[];
type Cmd = Push | Remove;
export class Solver {
  sequence: Cmd[] = [];
  boxes: Box[] = new Array(256).fill(0).map(() => []);

  constructor(lines: string[]) {
    this.parseLines(lines);
  }

  solve() {
    this.sequence.forEach((cmd) => {
      cmd.type === "push" ? this.push(cmd) : this.remove(cmd);
    });

    return this.boxes.reduce((sum, box, boxIndex) => {
      return (
        sum +
        box.reduce((boxSum, cmd, cmdIndex) => {
          const cmdSum = (boxIndex + 1) * (cmdIndex + 1) * cmd.value;
          return boxSum + cmdSum;
        }, 0)
      );
    }, 0);
  }

  parseLines(lines: string[]) {
    this.sequence = lines[0].split(",").map((cmd): Cmd => {
      return cmd.includes("-")
        ? {
            label: cmd.split("-")[0],
            type: "remove",
            box: this.hash(cmd.split("-")[0]),
          }
        : {
            type: "push",
            label: cmd.split("=")[0],
            value: Number(cmd.split("=")[1]),
            box: this.hash(cmd.split("=")[0]),
          };
    });
  }

  remove(cmd: Remove) {
    this.boxes[cmd.box] = this.boxes[cmd.box].filter(
      (boxCmd) => cmd.label !== boxCmd.label
    );
  }

  push(cmd: Push) {
    let foundMatch = false;
    this.boxes[cmd.box] = this.boxes[cmd.box].map((boxCmd) => {
      if (boxCmd.label !== cmd.label) return boxCmd;

      foundMatch = true;

      return cmd;
    });
    if (!foundMatch) this.boxes[cmd.box].push(cmd);
  }

  hash(string: string) {
    return string
      .split("=")[0]
      .split("")
      .reduce((currentValue, char) => {
        return ((currentValue + char.charCodeAt(0)) * 17) % 256;
      }, 0);
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
