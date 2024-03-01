export function typeNarrowPush<T>(arg: T | T[], list: T[]): void {
  if (Array.isArray(arg)) {
    arg.forEach((item) => list.push(item));
  } else {
    list.push(arg);
  }
}

export function typeNarrowRemove<T>(
  indices: number | number[],
  list: T[],
): void {
  if (Array.isArray(indices)) {
    //We need to clone so no side effects to caller
    const indicesClone = [...indices];
    indicesClone.sort((a, b) => b - a);
    indicesClone.forEach((i) => {
      list.splice(i, 1);
    });
  } else {
    list.splice(indices, 1);
  }
}
