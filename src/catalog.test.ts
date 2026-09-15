import { beforeEach, describe, expect, it, vi } from "vitest";
import { getRaces, getSummaryStats } from "./api";
import {
  loadRaceCatalog,
  loadSiteSummary,
  resetCatalogCacheForTests,
  siteHasRaces,
} from "./catalog";
import type { RaceListItem, SiteAggregates } from "./types";

vi.mock("./api", () => ({
  getSummaryStats: vi.fn(),
  getRaces: vi.fn(),
}));

const getSummaryStatsMock = vi.mocked(getSummaryStats);
const getRacesMock = vi.mocked(getRaces);

const site: SiteAggregates = {
  totalRaces: 2,
  totalResults: 40,
  distinctRaceTypes: 3,
};

const race: RaceListItem = {
  id: 1,
  slug: "hk-10k",
  name: "HK 10K",
  date: "2026-04-26",
  race_type: "10k",
  location: "Hong Kong",
  metadata: {},
  aggregates: {},
};

describe("siteHasRaces", () => {
  it("is true only when totalRaces is positive", () => {
    expect(siteHasRaces(null)).toBe(false);
    expect(siteHasRaces({ totalRaces: 0, totalResults: 0, distinctRaceTypes: 0 })).toBe(false);
    expect(siteHasRaces(site)).toBe(true);
  });
});

describe("loadSiteSummary", () => {
  beforeEach(() => {
    resetCatalogCacheForTests();
    getSummaryStatsMock.mockReset();
    getRacesMock.mockReset();
  });

  it("dedupes overlapping calls and then serves the cache", async () => {
    let resolveSite!: (value: SiteAggregates) => void;
    getSummaryStatsMock.mockReturnValue(
      new Promise((resolve) => {
        resolveSite = resolve;
      }),
    );

    const first = loadSiteSummary();
    const second = loadSiteSummary();
    expect(getSummaryStatsMock).toHaveBeenCalledTimes(1);

    resolveSite(site);
    await expect(Promise.all([first, second])).resolves.toEqual([site, site]);
    await expect(loadSiteSummary()).resolves.toEqual(site);
    expect(getSummaryStatsMock).toHaveBeenCalledTimes(1);
  });

  it("does not cancel the shared fetch when one waiter aborts", async () => {
    let resolveSite!: (value: SiteAggregates) => void;
    getSummaryStatsMock.mockReturnValue(
      new Promise((resolve) => {
        resolveSite = resolve;
      }),
    );

    const ac = new AbortController();
    const aborted = loadSiteSummary(ac.signal);
    ac.abort();
    await expect(aborted).rejects.toMatchObject({ name: "AbortError" });

    const waiting = loadSiteSummary();
    resolveSite(site);
    await expect(waiting).resolves.toEqual(site);
    expect(getSummaryStatsMock).toHaveBeenCalledTimes(1);
  });
});

describe("loadRaceCatalog", () => {
  beforeEach(() => {
    resetCatalogCacheForTests();
    getSummaryStatsMock.mockReset();
    getRacesMock.mockReset();
  });

  it("reuses the summary cache and only pages races once", async () => {
    getSummaryStatsMock.mockResolvedValue(site);
    getRacesMock.mockResolvedValue({
      items: [race],
      total: 1,
      page: 1,
      page_size: 100,
    });

    await loadSiteSummary();
    const catalog = await loadRaceCatalog();
    const again = await loadRaceCatalog();

    expect(catalog.races).toEqual([race]);
    expect(catalog.site).toEqual(site);
    expect(again).toBe(catalog);
    expect(getSummaryStatsMock).toHaveBeenCalledTimes(1);
    expect(getRacesMock).toHaveBeenCalledTimes(1);
  });
});
