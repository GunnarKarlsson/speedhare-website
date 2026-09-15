import { fetchAllRacesForNewHome, type SiteAggregates } from "../new_home/newHomeData";
import { useEffect, useState } from "react";

export function useSiteCatalog() {
  const [site, setSite] = useState<SiteAggregates | null>(null);
  const [hasRaceCatalog, setHasRaceCatalog] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const { site: s, races: all } = await fetchAllRacesForNewHome();
        if (!cancelled) {
          setSite(s);
          setHasRaceCatalog(all.length > 0);
        }
      } catch {
        if (!cancelled) {
          setSite(null);
          setHasRaceCatalog(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { site, hasRaceCatalog };
}
