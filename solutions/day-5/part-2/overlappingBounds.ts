import { Bound } from "./DataMap";

export const overlappingBounds = (
  from: number,
  to: number,
  bounds: Bound[]
): Bound[] => {
  let cursor = from;
  const output: Bound[] = [];
  const notLate = bounds.filter((bound) => bound.destinationStart <= to);
  const notEarly = notLate
    .filter((bound) => bound.destinationStart + bound.size >= from)
    .map((bound) => clampBound(from, to, bound));
  let nextBound = notEarly.shift();
  while (nextBound) {
    if (nextBound.destinationStart > cursor) {
      // need to fill in a gap first
      output.push({
        destinationStart: cursor,
        sourceStart: cursor,
        size: (nextBound.destinationStart || to) - cursor,
      });
    }
    output.push(nextBound);
    cursor = nextBound.destinationStart + nextBound.size;
    nextBound = notEarly.shift();
  }
  if (to > cursor) {
    // need to fill in a gap first
    output.push({
      destinationStart: cursor,
      sourceStart: cursor,
      size: to - cursor,
    });
  }

  // TODO: add one more for end of range?
  return output;
};

const clampBound = (min: number, max: number, bound: Bound): Bound => {
  const destinationStart = Math.max(min, bound.destinationStart);
  const sourceStart =
    bound.sourceStart + (destinationStart - bound.destinationStart);
  return {
    destinationStart,
    size: Math.min(max, bound.size + bound.destinationStart) - destinationStart,
    sourceStart,
  };
};

export const withGapBounds = (bounds: Bound[]): Bound[] => {
  return overlappingBounds(0, (Number.MAX_SAFE_INTEGER - 1) / 2, bounds);
};
