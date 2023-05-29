import { validateEmail } from "./validations";
import { describe, expect, test } from "vitest";

describe("validation utils", () => {
  test("valid email address", () => {
    expect(validateEmail("henk@henk.com")).toBe(true);
  });
  test("invalid email address", () => {
    expect(validateEmail("henk@henk.")).toBe(false);
  });
});
