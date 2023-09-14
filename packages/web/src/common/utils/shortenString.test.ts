import { describe, expect, test } from "vitest";
import { shortenString } from "./shortenString";

describe("shorten string", () => {
  test("shorten long string", () => {
    expect(shortenString("hoihoihoihoihoihoihoi")).toBe("hoihoihoihoihoiho...");
  });
  test("shorten short string", () => {
    expect(shortenString("hoi")).toBe("hoi");
  });
});
