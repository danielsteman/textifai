import { describe, expect, test } from "vitest";
import { addItemIfNotExist, removeItemIfExists } from "./arrayManager";

describe("array utils", () => {
  test("add item if it does not exist", () => {
    expect(addItemIfNotExist(["a", "b", "c"], "d")).toStrictEqual([
      "a",
      "b",
      "c",
      "d",
    ]);
  });

  test("add item if it does exist", () => {
    expect(addItemIfNotExist(["a", "b", "c"], "c")).toStrictEqual([
      "a",
      "b",
      "c",
    ]);
  });

  test("remove item if it does exist", () => {
    expect(removeItemIfExists(["a", "b", "c"], "c")).toStrictEqual(["a", "b"]);
  });

  test("remove item if it does not exist", () => {
    expect(removeItemIfExists(["a", "b", "c"], "d")).toStrictEqual([
      "a",
      "b",
      "c",
    ]);
  });
});
