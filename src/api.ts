import type {
  CommonRoadRaceStatsRow,
  Paginated,
  RaceDetail,
  RaceListItem,
  ResultsSortKey,
  RoadRaceStatsResponse,
  RunnerDetailResponse,
  RunnerResultRow,
  SearchResponse,
  SiteAggregates,
  SortOrder,
  SummaryStatsResponse,
} from "./types";
import { formatEventTitle } from "./format";
import {
  apiV1Base as apiV1BaseFromOrigin,
  raceByIdUrl as buildRaceByIdUrl,
  raceBySlugUrl as buildRaceBySlugUrl,
  raceResultsUrl as buildRaceResultsUrl,
  racesCollectionUrl as buildRacesCollectionUrl,
  roadRaceStatsUrl as buildRoadRaceStatsUrl,
  runnerDetailUrl as buildRunnerDetailUrl,
  searchRacesByRunnerUrl as buildSearchRacesByRunnerUrl,
  summaryStatsUrl as buildSummaryStatsUrl,
} from "./apiUrls";

export function apiV1Base(origin: string | undefined = import.meta.env.VITE_API_ORIGIN): string {
  return apiV1BaseFromOrigin(origin);
}

export function racesCollectionUrl(page: number, pageSize: number, base = apiV1Base()): string {
  return buildRacesCollectionUrl(page, pageSize, base);
}

export function raceBySlugUrl(slug: string, base = apiV1Base()): string {
  return buildRaceBySlugUrl(slug, base);
}

export function raceByIdUrl(id: number, base = apiV1Base()): string {
  return buildRaceByIdUrl(id, base);
}

export function runnerDetailUrl(raceId: number, resultId: number, base = apiV1Base()): string {
  return buildRunnerDetailUrl(raceId, resultId, base);
}

export function summaryStatsUrl(base = apiV1Base()): string {
  return buildSummaryStatsUrl(base);
}

export function roadRaceStatsUrl(base = apiV1Base()): string {
  return buildRoadRaceStatsUrl(base);
}

export function raceResultsUrl(
  raceId: number,
  page: number,
  pageSize: number,
  sort: ResultsSortKey,
  order: SortOrder,
  base = apiV1Base(),
): string {
  return buildRaceResultsUrl(raceId, page, pageSize, sort, order, base);
}

export function searchRacesByRunnerUrl(q: string, base = apiV1Base()): string {
  return buildSearchRacesByRunnerUrl(q, base);
}

export function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === "AbortError";
}

async function fetchJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(path, signal ? { signal } : undefined);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${text}`);
  }
  return res.json() as Promise<T>;
}

function normalizeRace(item: RaceListItem): RaceListItem {
  return { ...item, name: formatEventTitle(item.name) };
}

function normalizeRaceDetail(item: RaceDetail): RaceDetail {
  return { ...item, name: formatEventTitle(item.name) };
}

function normalizeRoadRaceStatsRow<T extends CommonRoadRaceStatsRow>(item: T): T {
  return { ...item, name: formatEventTitle(item.name) };
}

export function getRaces(page: number, pageSize: number, signal?: AbortSignal) {
  return fetchJson<Paginated<RaceListItem>>(racesCollectionUrl(page, pageSize), signal).then(
    (data) => ({
      ...data,
      items: data.items.map(normalizeRace),
    }),
  );
}

export function getRace(id: number, signal?: AbortSignal) {
  return fetchJson<RaceDetail>(raceByIdUrl(id), signal).then(normalizeRaceDetail);
}

export function getRaceBySlug(slug: string, signal?: AbortSignal) {
  return fetchJson<RaceDetail>(raceBySlugUrl(slug), signal).then(normalizeRaceDetail);
}

export function getRaceResults(
  raceId: number,
  page: number,
  pageSize: number,
  sort: ResultsSortKey,
  order: SortOrder,
  signal?: AbortSignal,
) {
  return fetchJson<Paginated<RunnerResultRow>>(
    raceResultsUrl(raceId, page, pageSize, sort, order),
    signal,
  );
}

export function getRunnerDetail(raceId: number, resultId: number, signal?: AbortSignal) {
  return fetchJson<RunnerDetailResponse>(runnerDetailUrl(raceId, resultId), signal);
}

export function getRoadRaceStats(signal?: AbortSignal) {
  return fetchJson<RoadRaceStatsResponse>(roadRaceStatsUrl(), signal).then((data) => ({
    five_k: data.five_k.map(normalizeRoadRaceStatsRow),
    ten_k: data.ten_k.map(normalizeRoadRaceStatsRow),
    half_marathon: data.half_marathon.map(normalizeRoadRaceStatsRow),
  }));
}

export function getSummaryStats(signal?: AbortSignal) {
  return fetchJson<SummaryStatsResponse>(summaryStatsUrl(), signal).then(
    (data): SiteAggregates => ({
      totalRaces: data.total_races,
      totalResults: data.total_results,
      distinctRaceTypes: data.distinct_race_types,
    }),
  );
}

export function searchRacesByRunner(q: string, signal?: AbortSignal) {
  return fetchJson<SearchResponse>(searchRacesByRunnerUrl(q), signal).then((data) => ({
    races: data.races.map((item) => ({
      ...item,
      race_name: formatEventTitle(item.race_name),
    })),
    runners: data.runners.map((item) => ({
      ...item,
      race_name: formatEventTitle(item.race_name),
    })),
  }));
}
