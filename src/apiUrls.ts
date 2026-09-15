export function apiV1Base(origin: string | undefined): string {
  const raw = origin?.trim() ?? "";
  const trimmed = raw.replace(/\/$/, "");
  return trimmed ? `${trimmed}/api/v1` : "/api/v1";
}

export function racesCollectionUrl(page: number, pageSize: number, base: string): string {
  const q = new URLSearchParams({ page: String(page), page_size: String(pageSize) });
  return `${base}/races?${q}`;
}

export function raceBySlugUrl(slug: string, base: string): string {
  return `${base}/races/by-slug/${encodeURIComponent(slug)}`;
}

export function raceResultsUrl(
  raceId: number,
  page: number,
  pageSize: number,
  sort: string,
  order: string,
  base: string,
): string {
  const q = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
    sort,
    order,
  });
  return `${base}/races/${raceId}/results?${q}`;
}

export function searchRacesByRunnerUrl(q: string, base: string): string {
  return `${base}/search/races_by_runner?${new URLSearchParams({ q })}`;
}
