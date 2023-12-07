import { DataMap } from "./DataMap";

export const mapSource = (
  source: number,
  map: DataMap,
  from: number,
  to: number
): number => {
  const { bounds } = map;
  const bound = bounds.find(
    (bound) =>
      source >= bound.sourceStart &&
      source <= bound.sourceStart + bound.size - 1
  );
  const result = bound
    ? bound.destinationStart + source - bound.sourceStart
    : source;
  return result;
};
