import { describe, expect, it } from "vitest";
import {
  apiV1Base,
  raceByIdUrl,
  raceBySlugUrl,
  raceResultsUrl,
  racesCollectionUrl,
  runnerDetailUrl,
  searchRacesByRunnerUrl,
} from "./api";

describe("apiV1Base", () => {
  it("uses a relative /api/v1 when origin is empty", () => {
    expect(apiV1Base("")).toBe("/api/v1");
    expect(apiV1Base("   ")).toBe("/api/v1");
  });

  it("strips a trailing slash on the origin", () => {
    expect(apiV1Base("https://api.speedhare.io/")).toBe("https://api.speedhare.io/api/v1");
  });
});

describe("API URL builders", () => {
  const base = "https://api.speedhare.io/api/v1";

  it("builds collection and results query strings", () => {
    expect(racesCollectionUrl(2, 50, base)).toBe(
      "https://api.speedhare.io/api/v1/races?page=2&page_size=50",
    );
    expect(raceResultsUrl(9, 1, 25, "time", "desc", base)).toBe(
      "https://api.speedhare.io/api/v1/races/9/results?page=1&page_size=25&sort=time&order=desc",
    );
  });

  it("encodes slugs and search queries", () => {
    expect(raceBySlugUrl("foo/bar", base)).toBe(
      "https://api.speedhare.io/api/v1/races/by-slug/foo%2Fbar",
    );
    expect(raceByIdUrl(9, base)).toBe("https://api.speedhare.io/api/v1/races/9");
    expect(runnerDetailUrl(9, 3, base)).toBe("https://api.speedhare.io/api/v1/races/9/runners/3");
    expect(searchRacesByRunnerUrl("chan tai", base)).toBe(
      "https://api.speedhare.io/api/v1/search/races_by_runner?q=chan+tai",
    );
  });
});
