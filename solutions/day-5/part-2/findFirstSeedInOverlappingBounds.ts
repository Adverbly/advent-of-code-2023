import { Bound, Maps } from "./DataMap";
import { overlappingBounds } from "./overlappingBounds";

const firstOverlap = (a: Bound, b: Bound): number | null => {
  const { sourceStart: aStart, size: aSize } = a;
  const { destinationStart: bStart, size: bSize } = b;
  if (aStart + aSize >= bStart && bStart + bSize >= aStart) {
    return Math.max(aStart, bStart);
  }
  return null;
};

export const findFirstSeedInOverlappingBounds = (
  maps: Maps,
  type: string,
  bounds: Bound[]
): number | undefined => {
  const from = maps[type].from;
  if (from === "seed") {
    for (const seedRangeBound of maps.seedRanges.bounds) {
      for (const bound of bounds) {
        const result = firstOverlap(bound, seedRangeBound);
        if (result) {
          return result;
        }
      }
    }
    return;
  }
  const targetBounds = maps[from].bounds;
  for (const bound of bounds) {
    const overlaps = overlappingBounds(
      bound.sourceStart,
      bound.sourceStart + bound.size,
      targetBounds
    );
    if (overlaps.length === 0) {
      continue;
    }
    const result = findFirstSeedInOverlappingBounds(maps, from, overlaps);
    if (result) {
      return result;
    }
    continue;
  }
};
