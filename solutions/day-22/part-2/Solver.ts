type Coord = [number, number, number];
type BrickId = string;
type Brick = {
  start: Coord;
  end: Coord;
  brickId: BrickId;
  supports: Set<BrickId>;
  supportedBy: Set<BrickId>;
};

const GROUND = "G" as BrickId;

export class Solver {
  bricks: Record<BrickId, Brick> = {};
  seen: Set<string> = new Set();
  map: Record<string, BrickId | null> = {};
  constructor(lines: string[]) {
    this.parseLines(lines);
  }

  mapGet(coord: Coord) {
    return this.map[JSON.stringify(coord)];
  }

  supportedBy(brick: Brick) {
    const supportedBy = [];
    const { start, end } = brick;
    for (let indexX = start[0]; indexX <= end[0]; indexX++) {
      for (let indexY = start[1]; indexY <= end[1]; indexY++) {
        const below = this.mapGet([indexX, indexY, start[2] - 1]);

        if (below === undefined) {
          return [GROUND];
        }

        if (below && below !== brick.brickId) {
          supportedBy.push(below);
        }
      }
    }
    return supportedBy;
  }

  fall() {
    Object.values(this.bricks)
      .sort((a, b) => a.start[2] - b.start[2])
      .forEach((brick) => {
        let supportedBy = this.supportedBy(brick);

        while (supportedBy.length === 0) {
          const { start, end, brickId } = brick;
          for (let indexX = start[0]; indexX <= end[0]; indexX++) {
            for (let indexY = start[1]; indexY <= end[1]; indexY++) {
              for (let indexZ = start[2]; indexZ <= end[2]; indexZ++) {
                this.map[JSON.stringify([indexX, indexY, indexZ])] = null;
              }
            }
          }
          end[2] -= 1;
          start[2] -= 1;
          for (let indexX = start[0]; indexX <= end[0]; indexX++) {
            for (let indexY = start[1]; indexY <= end[1]; indexY++) {
              for (let indexZ = start[2]; indexZ <= end[2]; indexZ++) {
                this.map[JSON.stringify([indexX, indexY, indexZ])] = brickId;
              }
            }
          }
          supportedBy = this.supportedBy(brick);
        }
        brick.supportedBy = new Set(supportedBy);
        supportedBy
          .filter((id) => id !== GROUND)
          .forEach((brickId) => {
            this.bricks[brickId].supports.add(brick.brickId);
          });
      });
  }

  fallCount(brick: Brick, otherFallers: Set<BrickId>): number {
    const count = [...brick.supports].reduce((sum, supBrickId) => {
      const supBrick = this.bricks[supBrickId];
      const remainingSupports = [...supBrick.supportedBy].filter(
        (supporterId) => !otherFallers.has(supporterId)
      );

      if (remainingSupports.length !== 0) {
        return sum;
      }

      otherFallers.add(supBrickId);

      return sum + 1 + this.fallCount(supBrick, otherFallers);
    }, 0);

    return count;
  }

  solve() {
    this.fall();

    const topplers = Object.values(this.bricks).filter((brick) => {
      return ![...brick.supports].every(
        (supBrickId) => this.bricks[supBrickId].supportedBy.size !== 1
      );
    });

    return topplers.reduce((sum, toppler) => {
      const count = this.fallCount(toppler, new Set([toppler.brickId]));

      return sum + count;
    }, 0);
  }

  parseLines(lines: string[]) {
    let idCounter = 0;
    let maxCoord = [
      Number.MIN_SAFE_INTEGER,
      Number.MIN_SAFE_INTEGER,
      Number.MIN_SAFE_INTEGER,
    ];
    let minCoord = [
      Number.MAX_SAFE_INTEGER,
      Number.MAX_SAFE_INTEGER,
      Number.MAX_SAFE_INTEGER,
    ];

    lines.forEach((line) => {
      const [startStr, endStr] = line.split("~");
      idCounter++;
      const brickId = idCounter.toString();

      const brick = {
        brickId,
        end: endStr.split(",").map(Number) as Coord,
        start: startStr.split(",").map(Number) as Coord,
        supports: new Set(),
        supportedBy: new Set(),
      } as Brick;
      this.bricks[brickId] = brick;
      minCoord = minCoord.map((current, index) =>
        Math.min(current, brick.start[index], brick.end[index])
      );
      maxCoord = maxCoord.map((current, index) =>
        Math.max(current, brick.start[index], brick.end[index])
      );
    });

    for (let indexX = minCoord[0]; indexX <= maxCoord[0]; indexX++) {
      for (let indexY = minCoord[1]; indexY <= maxCoord[1]; indexY++) {
        for (let indexZ = minCoord[2]; indexZ <= maxCoord[2]; indexZ++) {
          this.map[JSON.stringify([indexX, indexY, indexZ])] = null;
        }
      }
    }
    Object.values(this.bricks).forEach(({ brickId, start, end }) => {
      for (let indexX = start[0]; indexX <= end[0]; indexX++) {
        for (let indexY = start[1]; indexY <= end[1]; indexY++) {
          for (let indexZ = start[2]; indexZ <= end[2]; indexZ++) {
            this.map[JSON.stringify([indexX, indexY, indexZ])] = brickId;
          }
        }
      }
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
