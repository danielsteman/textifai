import { describe, expect, it } from "vitest";
import { getInitials } from "./getInitials";

describe("getInitials", () => {
  it("should return 'JD' for 'John Doe'", () => {
    expect(getInitials("John Doe")).toBe("JD");
  });

  it("should return 'AJ' for 'Alice Johnson'", () => {
    expect(getInitials("Alice Johnson")).toBe("AJ");
  });

  it("should return 'M' for ' Mary '", () => {
    expect(getInitials(" Mary ")).toBe("M");
  });

  it("should return 'B' for 'Bob123'", () => {
    expect(getInitials("Bob123")).toBe("B");
  });

  it("should return an empty string for an empty input", () => {
    expect(getInitials("")).toBe("");
  });

  it("should return an empty string for a name with no letters", () => {
    expect(getInitials("1234")).toBe("");
  });
});
