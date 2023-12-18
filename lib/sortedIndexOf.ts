export const sortedIndexOf = <T>(
  array: T[],
  getWeight: (t: T) => number,
  newValue: T
) => {
  let upper = array.length - 1;
  let lower = 0;
  let mid = 0;
  const weight = getWeight(newValue);
  if (array.length === 0) {
    return 0;
  }
  while (lower < upper) {
    mid = Math.floor((upper + lower) / 2);
    const midValue = getWeight(array[mid]);

    if (midValue === weight) {
      return mid;
    }
    if (midValue > weight) {
      upper = mid;
    } else {
      lower = mid + 1;
    }
  }
  mid = Math.floor((upper + lower) / 2);

  return getWeight(array[mid]) < weight ? mid + 1 : mid;
};
