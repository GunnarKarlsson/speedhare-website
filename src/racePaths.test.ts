import { describe, expect, it } from "vitest";
import { racePath } from "./racePaths";

describe("racePath", () => {
  it("prefixes /races and encodes the slug", () => {
    expect(racePath("hk-10k")).toBe("/races/hk-10k");
    expect(racePath("foo/bar")).toBe("/races/foo%2Fbar");
    expect(racePath("vitality run 2026")).toBe("/races/vitality%20run%202026");
  });
});
