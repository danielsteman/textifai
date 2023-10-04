import { describe, expect, test } from "vitest";
import { sumBooleanAttributes, BooleanAttribute } from "./sumBooleanAttributes";

describe("sumBooleanAttributes", () => {
  test("should return 0 for an empty array", () => {
    const result = sumBooleanAttributes([], "booleanAttribute");
    expect(result).toBe(0);
  });

  test("should correctly sum boolean attributes", () => {
    const arrayOfObjects: BooleanAttribute[] = [
      { booleanAttribute: true },
      { booleanAttribute: false },
      { booleanAttribute: true },
    ];

    const result = sumBooleanAttributes(arrayOfObjects, "booleanAttribute");
    expect(result).toBe(2);
  });

  test("should handle undefined attributes gracefully", () => {
    const arrayOfObjects: BooleanAttribute[] = [
      { booleanAttribute: true },
      { booleanAttribute: undefined },
      { booleanAttribute: false },
    ];

    const result = sumBooleanAttributes(arrayOfObjects, "booleanAttribute");
    expect(result).toBe(1);
  });
});
