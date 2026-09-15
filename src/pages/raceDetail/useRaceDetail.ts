import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRace, getRaceBySlug, getRaceResults } from "../../api";
import { racePath } from "../../racePaths";
import type { RaceDetail, ResultsSortKey, RunnerResultRow, SortOrder } from "../../types";

export function useRaceDetail(idOrSlug: string | undefined) {
  const navigate = useNavigate();
  const raceLookup = idOrSlug?.trim() ?? "";
  const isLegacyIdRoute = /^\d+$/.test(raceLookup);
  const legacyRaceId = isLegacyIdRoute ? parseInt(raceLookup, 10) : NaN;

  const [race, setRace] = useState<RaceDetail | null>(null);
  const [results, setResults] = useState<RunnerResultRow[]>([]);
  const [resultsTotal, setResultsTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [sortBy, setSortBy] = useState<ResultsSortKey>("position");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [raceLoading, setRaceLoading] = useState(true);
  const [resultsLoading, setResultsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!raceLookup) {
      setError("Invalid race");
      setRaceLoading(false);
      return;
    }
    let cancelled = false;
    setRaceLoading(true);
    setRace(null);
    setResults([]);
    setResultsTotal(0);
    setError(null);
    void (async () => {
      try {
        const r =
          isLegacyIdRoute && Number.isFinite(legacyRaceId)
            ? await getRace(legacyRaceId)
            : await getRaceBySlug(raceLookup);
        if (!cancelled) {
          setRace(r);
          if (isLegacyIdRoute) {
            navigate(racePath(r.slug), { replace: true });
          }
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load race");
      } finally {
        if (!cancelled) setRaceLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isLegacyIdRoute, legacyRaceId, navigate, raceLookup]);

  useEffect(() => {
    if (!race) return;
    let cancelled = false;
    setResultsLoading(true);
    void (async () => {
      try {
        const data = await getRaceResults(race.id, page + 1, pageSize, sortBy, sortOrder);
        if (!cancelled) {
          setResults(data.items);
          setResultsTotal(data.total);
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load results");
      } finally {
        if (!cancelled) setResultsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [page, pageSize, race, sortBy, sortOrder]);

  const requestSort = (key: ResultsSortKey) => {
    if (sortBy === key) setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    else {
      setSortBy(key);
      setSortOrder("asc");
    }
    setPage(0);
  };

  return {
    raceLookup,
    race,
    results,
    resultsTotal,
    page,
    setPage,
    pageSize,
    setPageSize,
    sortBy,
    sortOrder,
    requestSort,
    raceLoading,
    resultsLoading,
    error,
  };
}
