function addItemIfNotExist<T>(array: T[], item: T): T[] {
  if (!array.includes(item)) {
    return [...array, item];
  }
  return array;
}

function removeItemIfExists<T>(array: T[], item: T): T[] {
  if (array.includes(item)) {
    return array.filter((existingItem) => existingItem !== item);
  }
  return array;
}
