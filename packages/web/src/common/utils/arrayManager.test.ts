import { describe, expect, test } from "vitest";
import { addItemIfNotExist, removeItemIfExists } from "./arrayManager";

interface Person {
  id: number;
  name: string;
  age: number;
}

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

  test("add item which is an object if it does not exist", () => {
    const people: Person[] = [
      { id: 1, name: "Alice", age: 25 },
      { id: 2, name: "Bob", age: 30 },
      { id: 3, name: "Charlie", age: 22 },
    ];
    const henk: Person = { id: 4, name: "Henk", age: 69 };
    expect(addItemIfNotExist(people, henk)).toStrictEqual([
      { id: 1, name: "Alice", age: 25 },
      { id: 2, name: "Bob", age: 30 },
      { id: 3, name: "Charlie", age: 22 },
      { id: 4, name: "Henk", age: 69 },
    ]);
  });

  test("add item which is an object if it does exist", () => {
    const people: Person[] = [
      { id: 1, name: "Alice", age: 25 },
      { id: 2, name: "Bob", age: 30 },
      { id: 3, name: "Charlie", age: 22 },
    ];
    const henk: Person = { id: 1, name: "henk", age: 69 };
    expect(addItemIfNotExist(people, henk, "id")).toStrictEqual([
      { id: 1, name: "Alice", age: 25 },
      { id: 2, name: "Bob", age: 30 },
      { id: 3, name: "Charlie", age: 22 },
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
