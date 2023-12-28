type Ray =
  | {
      m: number;
      b: number;
    } & ({ minX: null; maxX: number } | { maxX: null; minX: number });
type Stone = {
  position: [number, number, number];
  velocity: [number, number, number];
};

export class Solver {
  stones: Stone[] = [];
  minMax: [number, number];
  rays: Ray[] = [];

  constructor(lines: string[]) {
    this.parseLines(lines);
    this.minMax =
      this.stones.length < 10 ? [7, 27] : [200000000000000, 400000000000000];
  }

  valueAtTime(initialDistance: number, initialSpeed: number, time: number) {
    return initialDistance + time * initialSpeed;
  }

  toLineSegment({ position, velocity }: Stone): Ray {
    //m = dy / dx
    const [x0, x1, y0, y1] = [
      this.valueAtTime(position[0], velocity[0], 0),
      this.valueAtTime(position[0], velocity[0], 1),
      this.valueAtTime(position[1], velocity[1], 0),
      this.valueAtTime(position[1], velocity[1], 1),
    ];
    const m = (y1 - y0) / (x1 - x0);

    // y = mx + b
    // b = y - mx
    const b = position[1] - m * position[0];

    const args = x1 > x0 ? { maxX: null, minX: x0 } : { minX: null, maxX: x0 };
    // console.log(position, velocity, m, b, args);
    return {
      m,
      b,
      ...args,
    };
  }

  solve() {
    // x = px + t *vx
    // y = py + t *vy
    // z = pz + t *vz
    // x0 = px0 + t *vx0
    // y0 = py0 + t *vy0
    // z0 = pz0 + t *vz0
    // x1 = px1 + t *vx1
    // y1 = py1 + t *vy1
    // z1 = pz1 + t *vz1
    // x = x0
    // px + t*vx = px0 + t * vx0
    //
    // px + tvx = px0 + tvx0
    // py + tvy = py0 + tvy0
    // t = (px0 - px) / (vx - vx0)
    // t = (py0 - py) / (vy - vy0)
    // (py0 - py)/(vy - vy0) = (px0 - px)/(vx - vx0)
    // 1) vx = vx0 + (px0 - px) * (vy - vy0) / (py0 - py)
    // 2) vy = vy1 + (py1 - py) * (vx - vx1) / (px1 - px)
    //sub 1 into 2) vy = vy1 + (py1 - py) * ((vx0 + (px0 - px) * (vy - vy0) / (py0 - py)) - vx1) / (px1 - px)
    // 3) (py0 - py) / (vy - vy0) = (px0 - px) / (vx - vx0)
    // 3b) py = py0 + (vy0 - vy) * (px0 - px) / (vx - vx0)
    // TODO: just print an output for each equation that I can throw into wolfram alpha...
    // 339708138568903
    // 183946143494745
    // 129012368412302
    this.stones.forEach((stone) => {
      const [px1, py1, pz1] = stone.position;
      const [vx1, vy1, vz1] = stone.velocity;

      console.log(
        `d = ${vy1} + (${py1} - c) * (b ${
          vx1 > 0 ? `- ${vx1}` : `+ ${-1 * vx1}`
        })/(${px1} - a)`
      );

      console.log(
        `f = ${vz1} + (${pz1} - e) * (b ${
          vx1 > 0 ? `- ${vx1}` : `+ ${-1 * vx1}`
        })/(${px1} - a)`
      );
    });

    console.log(
      "paste some of your equations into this crap and then type out the results from the image... TODO: import some sort of linear equation solver to automate this."
    );

    return [0, 0, 0];
  }

  intersectionPoint(left: Ray, right: Ray): [number, number] | null {
    // m1x + b1 = m2x + b2
    // x = (b2 - b1) / (m1 - m2)
    // y = m1 * x + b1
    const denominator = left.m - right.m;
    if (denominator === 0) {
      console.log("parallel lines!");
      return null;
    }

    const x = (left.b - right.b) / (right.m - left.m);
    const y = left.m * x + left.b;
    // console.log("interset at: ", x, y, left, right);

    if (right.maxX !== null && x > right.maxX) {
      return null;
    }
    if (right.minX !== null && x < right.minX) {
      return null;
    }
    if (left.maxX !== null && x > left.maxX) {
      return null;
    }
    if (left.minX !== null && x < left.minX) {
      return null;
    }

    return this.validIntersectionPoint([x, y]);
  }

  validIntersectionPoint([x, y]: [number, number]): null | [number, number] {
    if (y < this.minMax[0] || y > this.minMax[1]) {
      console.log("y out of bounds", y, this.minMax);

      return null;
    }
    if (x < this.minMax[0] || x > this.minMax[1]) {
      console.log("x out of bounds", x, this.minMax);
      return null;
    }
    return [x, y];
  }

  parseLines(lines: string[]) {
    lines.forEach((line) => {
      const [positionStr, velocityStr] = line.split(" @ ");
      const position = positionStr.split(", ").map(Number);
      const velocity = velocityStr.split(", ").map(Number);
      const stone = {
        position,
        velocity,
      } as Stone;
      this.stones.push(stone);
      this.rays.push(this.toLineSegment(stone));
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
