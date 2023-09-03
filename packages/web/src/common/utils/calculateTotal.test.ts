import { describe, expect, test } from "vitest";
import { calculateTotal } from "./calculateTotal";

describe("calculate total", () => {
  test("combine numbers and booleans", () => {
    expect(calculateTotal([1], [true, false])).toStrictEqual(2);
  });
});
