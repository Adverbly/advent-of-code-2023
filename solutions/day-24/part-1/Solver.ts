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

  solve() {
    let result = 0;

    for (let leftIndex = 0; leftIndex < this.rays.length; leftIndex++) {
      const left = this.rays[leftIndex];
      for (
        let rightIndex = leftIndex + 1;
        rightIndex < this.rays.length;
        rightIndex++
      ) {
        const right = this.rays[rightIndex];
        const intersectionPoint = this.intersectionPoint(left, right);
        console.log(intersectionPoint);

        if (intersectionPoint) {
          result++;
        }
        // if (
        //   this.crossesBetween(left, right, 0) &&
        //   this.crossesBetween(left, right, 1)
        // ) {
        //   result++;
        // }
        // if (this.isIntersectionBounded(left, right)) {
        //   result++;
        // }
      }
    }
    return result;
  }

  timeAtDistance(initialDistance: number, initialSpeed: number, value: number) {
    // x = d + v * t
    // t = (x - d) /v
    return (value - initialDistance) / initialSpeed;
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

  crossesBetween(left: Stone, right: Stone, dimension: 0 | 1) {
    const leftInitialDistance = left.position[dimension];
    const rightInitialDistance = right.position[dimension];
    const leftInitialSpeed = left.velocity[dimension];
    const rightInitialSpeed = right.velocity[dimension];
    const otherDimension = dimension === 1 ? 2 : 1;

    const leftInitialDistanceOther = left.position[otherDimension];
    const rightInitialDistanceOther = right.position[otherDimension];
    const leftInitialSpeedOther = left.velocity[otherDimension];
    const rightInitialSpeedOther = right.velocity[otherDimension];

    const [largerLeftBefore, largerLeftAfter] = this.minMax.map((value) => {
      const [leftOtherValue, rightOtherValue] = [left, right].map(
        ({ position, velocity }) => {
          const time = this.timeAtDistance(
            position[dimension],
            velocity[dimension],
            value
          );
          const otherValue = this.valueAtTime(
            position[otherDimension],
            velocity[otherDimension],
            time
          );
          return otherValue;
        }
      );
      console.log(leftOtherValue, rightOtherValue);

      return leftOtherValue >= rightOtherValue;
    });

    console.log(left, right, largerLeftBefore, largerLeftAfter);
    return largerLeftAfter !== largerLeftBefore;
  }

  isIntersectionBounded(left: Stone, right: Stone) {
    // y1 = t1 * vy1i + y1i
    // x1 = t1 * vx1i + x1i
    // t1 = (x1 - x1i) / vx1i
    // y2 = t2 * vy2i + y2i
    // x2 = t2 * vx2i + x2i
    // t2 = (x2 - x2i) / vx2i

    // y2 = y1 = y
    // t2 * vy2i + y2i = t1 * vy1i + y1i
    // (x2 - x2i) / vx2i * vy2i + y2i = (x1 - x1i) / vx1i * vy1i + y1i
    // x2 = x1 = x
    // (x - x2i) / vx2i * vy2i + y2i = (x - x1i) / vx1i * vy1i + y1i
    // (x - x2i) / vx2i * vy2i - (x - x1i) / vx1i * vy1i = y1i - y2i
    // solve for x:
    // x = (-x2i * vy2i * vx1i) + (vx2i * x1i * vy1i) + vx2i * vx2i * (y2i - y1i) ) / (vx2i * vy1i - vy2i * vx1i)
    const [x1i, y1i] = left.position;
    const [vx1i, vy1i] = left.velocity;
    const [x2i, y2i] = right.velocity;
    const [vx2i, vy2i] = right.velocity;
    const denominator = vx2i * vy1i - vy2i * vx1i;
    // console.log(left, right, x1i, vx1i, y1i, vy1i);

    if (denominator === 0) {
      console.log("zero denominator");
      return false;
    }
    const x =
      (-x2i * vy2i * vx1i + vx2i * x1i * vy1i + vx2i * vx2i * (y2i - y1i)) /
      denominator;
    // y1 = t1 * vy1i + y1i
    // x1 = t1 * vx1i + x1i
    // (y1 - y1i) / vy1i = t1
    // (y1 - y1i) / vy1i = (x1 - x1i) / vx1i
    const y = (vy1i * (x - x1i)) / vx1i + y1i;
    console.log(x, y, left, right);

    if (y < this.minMax[0] || y > this.minMax[1]) {
      console.log("y out of bounds", y, this.minMax);

      return false;
    }
    if (x < this.minMax[0] || x > this.minMax[1]) {
      console.log("x out of bounds", x, this.minMax);
      return false;
    }
    console.log("true");

    return true;

    // t = (y1i - y2i) / (vy2i - vy1i)
    // y = t * vy1i + yli
    // x = t * vx1i + xli

    //
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
