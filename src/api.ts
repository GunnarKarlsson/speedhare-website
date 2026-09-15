import type {
  CommonRoadRaceStatsRow,
  RoadRaceStatsResponse,
  RaceDetail,
  RaceListItem,
  RunnerDetailResponse,
  RunnerResultRow,
  ResultsSortKey,
  Paginated,
  SearchResponse,
  SummaryStatsResponse,
  SortOrder,
} from "./types";
import { formatEventTitle } from "./format";
import type { SiteAggregates } from "./new_home/newHomeData";

export function apiV1Base(origin: string | undefined = import.meta.env.VITE_API_ORIGIN): string {
  const raw = origin?.trim() ?? "";
  const trimmed = raw.replace(/\/$/, "");
  return trimmed ? `${trimmed}/api/v1` : "/api/v1";
}

export function racesCollectionUrl(page: number, pageSize: number, base = apiV1Base()): string {
  const q = new URLSearchParams({ page: String(page), page_size: String(pageSize) });
  return `${base}/races?${q}`;
}

export function raceBySlugUrl(slug: string, base = apiV1Base()): string {
  return `${base}/races/by-slug/${encodeURIComponent(slug)}`;
}

export function raceResultsUrl(
  raceId: number,
  page: number,
  pageSize: number,
  sort: ResultsSortKey,
  order: SortOrder,
  base = apiV1Base(),
): string {
  const q = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
    sort,
    order,
  });
  return `${base}/races/${raceId}/results?${q}`;
}

export function searchRacesByRunnerUrl(q: string, base = apiV1Base()): string {
  return `${base}/search/races_by_runner?${new URLSearchParams({ q })}`;
}

const API = apiV1Base();

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(path);
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

export function getRaces(page: number, pageSize: number) {
  return fetchJson<Paginated<RaceListItem>>(racesCollectionUrl(page, pageSize)).then((data) => ({
    ...data,
    items: data.items.map(normalizeRace),
  }));
}

export function getRace(id: number) {
  return fetchJson<RaceDetail>(`${API}/races/${id}`).then(normalizeRaceDetail);
}

export function getRaceBySlug(slug: string) {
  return fetchJson<RaceDetail>(raceBySlugUrl(slug)).then(normalizeRaceDetail);
}

export function getRaceResults(
  raceId: number,
  page: number,
  pageSize: number,
  sort: ResultsSortKey,
  order: SortOrder,
) {
  return fetchJson<Paginated<RunnerResultRow>>(raceResultsUrl(raceId, page, pageSize, sort, order));
}

export function getRunnerDetail(raceId: number, resultId: number) {
  return fetchJson<RunnerDetailResponse>(`${API}/races/${raceId}/runners/${resultId}`);
}

export function getRoadRaceStats() {
  return fetchJson<RoadRaceStatsResponse>(`${API}/stats/road-races`).then((data) => ({
    five_k: data.five_k.map(normalizeRoadRaceStatsRow),
    ten_k: data.ten_k.map(normalizeRoadRaceStatsRow),
    half_marathon: data.half_marathon.map(normalizeRoadRaceStatsRow),
  }));
}

export function getSummaryStats() {
  return fetchJson<SummaryStatsResponse>(`${API}/stats/summary`).then((data): SiteAggregates => ({
    totalRaces: data.total_races,
    totalResults: data.total_results,
    distinctRaceTypes: data.distinct_race_types,
  }));
}

export function searchRacesByRunner(q: string) {
  return fetchJson<SearchResponse>(searchRacesByRunnerUrl(q)).then((data) => ({
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
