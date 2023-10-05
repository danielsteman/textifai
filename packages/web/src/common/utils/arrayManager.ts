function doesObjectExistByKey<T>(
  array: T[],
  key: keyof T,
  value: any
): boolean {
  const index = array.findIndex((item) => item[key] === value[key]);
  return index !== -1;
}

export function addItemIfNotExists<T>(
  array: T[],
  item: T,
  primaryKey?: keyof T
): T[] {
  if (!primaryKey && !array.includes(item)) {
    return [...array, item];
  } else if (primaryKey) {
    const newItemExists = doesObjectExistByKey(array, primaryKey, item);
    if (!newItemExists) {
      return [...array, item];
    }
  }
  return array;
}

export function removeItemIfExists<T>(array: T[], item: T): T[] {
  if (array.includes(item)) {
    return array.filter((existingItem) => existingItem !== item);
  }
  return array;
}
