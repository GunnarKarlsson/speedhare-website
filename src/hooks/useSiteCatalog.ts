import { useEffect, useState } from "react";
import { isAbortError } from "../api";
import { loadRaceCatalog, loadSiteSummary, siteHasRaces } from "../catalog";
import type { RaceListItem, SiteAggregates } from "../types";

export function useSiteCatalog() {
  const [site, setSite] = useState<SiteAggregates | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ac = new AbortController();
    setLoading(true);
    void loadSiteSummary(ac.signal)
      .then((next) => {
        setSite(next);
      })
      .catch((error) => {
        if (isAbortError(error)) return;
        setSite(null);
      })
      .finally(() => {
        if (!ac.signal.aborted) setLoading(false);
      });
    return () => ac.abort();
  }, []);

  return { site, hasRaceCatalog: siteHasRaces(site), loading };
}

export function useRaceCatalog() {
  const [races, setRaces] = useState<RaceListItem[]>([]);
  const [site, setSite] = useState<SiteAggregates | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ac = new AbortController();
    setLoading(true);
    setError(null);
    void loadRaceCatalog(ac.signal)
      .then((catalog) => {
        setRaces(catalog.races);
        setSite(catalog.site);
      })
      .catch((err) => {
        if (isAbortError(err)) return;
        setError(err instanceof Error ? err.message : "Failed to load races");
        setRaces([]);
        setSite(null);
      })
      .finally(() => {
        if (!ac.signal.aborted) setLoading(false);
      });
    return () => ac.abort();
  }, []);

  return { races, site, loading, error };
}
