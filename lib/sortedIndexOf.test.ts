import { describe, expect, test } from "bun:test";
import { sortedIndexOf } from "./sortedIndexOf";

describe("sortedIndexOf", () => {
  test("start", () => {
    expect(sortedIndexOf([1, 2, 3], (x) => x, 0)).toEqual(0);
    expect(sortedIndexOf([1, 2, 3], (x) => x, 1)).toEqual(0);
    expect(sortedIndexOf([1, 2, 3], (x) => x, 0.5)).toEqual(0);
    expect(sortedIndexOf([1, 2, 3], (x) => x, 2)).toEqual(1);
    expect(sortedIndexOf([1, 2, 3], (x) => x, 1.5)).toEqual(1);
    expect(sortedIndexOf([1, 2, 3], (x) => x, 3)).toEqual(2);
    expect(sortedIndexOf([1, 2, 3], (x) => x, 4)).toEqual(3);
  });
});
