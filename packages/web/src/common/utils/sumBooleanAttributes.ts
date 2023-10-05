export interface BooleanAttribute {
  [key: string]: boolean | undefined;
}

export function sumBooleanAttributes(
  arrayOfObjects: BooleanAttribute[],
  attributeName: string
): number {
  return arrayOfObjects.reduce((total, currentObject) => {
    if (typeof currentObject[attributeName] === "boolean") {
      return total + (currentObject[attributeName] ? 1 : 0);
    } else {
      return total;
    }
  }, 0);
}
