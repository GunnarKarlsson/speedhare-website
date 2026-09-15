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
  raceBySlugUrl as buildRaceBySlugUrl,
  raceResultsUrl as buildRaceResultsUrl,
  racesCollectionUrl as buildRacesCollectionUrl,
  searchRacesByRunnerUrl as buildSearchRacesByRunnerUrl,
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

const API = apiV1Base();

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
  return fetchJson<RaceDetail>(`${API}/races/${id}`, signal).then(normalizeRaceDetail);
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
  return fetchJson<RunnerDetailResponse>(`${API}/races/${raceId}/runners/${resultId}`, signal);
}

export function getRoadRaceStats(signal?: AbortSignal) {
  return fetchJson<RoadRaceStatsResponse>(`${API}/stats/road-races`, signal).then((data) => ({
    five_k: data.five_k.map(normalizeRoadRaceStatsRow),
    ten_k: data.ten_k.map(normalizeRoadRaceStatsRow),
    half_marathon: data.half_marathon.map(normalizeRoadRaceStatsRow),
  }));
}

export function getSummaryStats(signal?: AbortSignal) {
  return fetchJson<SummaryStatsResponse>(`${API}/stats/summary`, signal).then(
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
