import { getRaces, getSummaryStats } from "./api";
import { collectAllPages } from "./collectAllPages";
import type { RaceListItem, SiteAggregates } from "./types";

const PAGE_SIZE = 100;

export type RaceCatalog = {
  races: RaceListItem[];
  site: SiteAggregates;
};

let summaryCache: SiteAggregates | undefined;
let summaryInFlight: Promise<SiteAggregates> | undefined;
let catalogCache: RaceCatalog | undefined;
let catalogInFlight: Promise<RaceCatalog> | undefined;

export function siteHasRaces(site: SiteAggregates | null | undefined): boolean {
  return (site?.totalRaces ?? 0) > 0;
}

function abortError(): DOMException {
  return new DOMException("Aborted", "AbortError");
}

function waitUnlessAborted<T>(promise: Promise<T>, signal?: AbortSignal): Promise<T> {
  if (!signal) return promise;
  if (signal.aborted) return Promise.reject(abortError());

  return new Promise<T>((resolve, reject) => {
    const onAbort = () => reject(abortError());
    signal.addEventListener("abort", onAbort, { once: true });
    promise.then(
      (value) => {
        signal.removeEventListener("abort", onAbort);
        if (signal.aborted) {
          reject(abortError());
          return;
        }
        resolve(value);
      },
      (error) => {
        signal.removeEventListener("abort", onAbort);
        reject(error);
      },
    );
  });
}

export function loadSiteSummary(signal?: AbortSignal): Promise<SiteAggregates> {
  if (summaryCache) {
    if (signal?.aborted) return Promise.reject(abortError());
    return Promise.resolve(summaryCache);
  }

  if (!summaryInFlight) {
    summaryInFlight = getSummaryStats()
      .then((site) => {
        summaryCache = site;
        return site;
      })
      .finally(() => {
        summaryInFlight = undefined;
      });
  }

  return waitUnlessAborted(summaryInFlight, signal);
}

export function loadRaceCatalog(signal?: AbortSignal): Promise<RaceCatalog> {
  if (catalogCache) {
    if (signal?.aborted) return Promise.reject(abortError());
    return Promise.resolve(catalogCache);
  }

  if (!catalogInFlight) {
    catalogInFlight = (async () => {
      const sitePromise = loadSiteSummary();
      const races = await collectAllPages((page) => getRaces(page, PAGE_SIZE));
      const site = await sitePromise;
      const result = { races, site };
      catalogCache = result;
      return result;
    })().finally(() => {
      catalogInFlight = undefined;
    });
  }

  return waitUnlessAborted(catalogInFlight, signal);
}
