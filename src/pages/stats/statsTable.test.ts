import { describe, expect, it } from "vitest";
import { compareStatsValues, mapFiveKRow, mapHalfMarathonRow, mapTenKRow } from "./statsTable";
import type { FiveKStatsRow, HalfMarathonStatsRow, TenKStatsRow } from "../../types";

const common = {
  id: 1,
  slug: "test-race",
  name: "Test Race",
  date: "2026-04-26",
  location: "Hong Kong",
  runner_count: 10,
  mean_seconds: 2400,
  median_seconds: 2300,
  fastest_seconds: 1800,
};

describe("stats row mappers", () => {
  it("maps 5K threshold columns and leaves other buckets null", () => {
    const row: FiveKStatsRow = {
      ...common,
      race_type: "5k",
      lt_15: 1,
      lt_18: 2,
      lt_20: 3,
      lt_25: 4,
    };
    const mapped = mapFiveKRow(row);
    expect(mapped.lt15).toBe(1);
    expect(mapped.lt25).toBe(4);
    expect(mapped.lt35).toBeNull();
    expect(mapped.lt70).toBeNull();
  });

  it("maps 10K and half-marathon buckets into the shared row shape", () => {
    const ten: TenKStatsRow = {
      ...common,
      race_type: "10k",
      lt_35: 5,
      lt_40: 6,
      lt_45: 7,
    };
    const half: HalfMarathonStatsRow = {
      ...common,
      race_type: "half_marathon",
      lt_1_10: 8,
      lt_1_15: 9,
      lt_1_20: 10,
      lt_1_25: 11,
      lt_1_30: 12,
      lt_1_40: 13,
    };
    expect(mapTenKRow(ten).lt40).toBe(6);
    expect(mapTenKRow(ten).lt15).toBeNull();
    expect(mapHalfMarathonRow(half).lt100).toBe(13);
    expect(mapHalfMarathonRow(half).lt35).toBeNull();
  });
});

describe("compareStatsValues", () => {
  it("sorts numbers and strings and keeps nulls last", () => {
    expect(compareStatsValues(1, 2, "asc")).toBeLessThan(0);
    expect(compareStatsValues(1, 2, "desc")).toBeGreaterThan(0);
    expect(compareStatsValues("b", "a", "asc")).toBeGreaterThan(0);
    expect(compareStatsValues(null, 1, "asc")).toBe(1);
    expect(compareStatsValues(1, null, "asc")).toBe(-1);
    expect(compareStatsValues(null, null, "desc")).toBe(0);
  });
});
