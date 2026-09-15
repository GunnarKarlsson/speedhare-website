import { getRaces, getSummaryStats } from "../api";
import type { RaceListItem } from "../types";

const PAGE_SIZE = 100;

export interface SiteAggregates {
  totalRaces: number;
  totalResults: number;
  distinctRaceTypes: number;
}

export async function fetchAllRacesForNewHome(): Promise<{ races: RaceListItem[]; site: SiteAggregates }> {
  const races: RaceListItem[] = [];
  let page = 1;
  const sitePromise = getSummaryStats();

  for (;;) {
    const res = await getRaces(page, PAGE_SIZE);
    races.push(...res.items);
    if (races.length >= Number(res.total) || res.items.length === 0) break;
    page += 1;
  }

  const site = await sitePromise;

  return {
    races,
    site,
  };
}
