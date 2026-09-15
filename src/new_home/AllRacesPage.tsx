import { Box, CircularProgress, TablePagination, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SeoHead } from "../components/SeoHead";
import type { RaceListItem } from "../types";
import type { SiteAggregates } from "./newHomeData";
import { fetchAllRacesForNewHome } from "./newHomeData";
import { NewHomeFooter } from "./NewHomeFooter";
import type { NavDistanceFilter } from "./NewHomeNav";
import { NewHomeNav } from "./NewHomeNav";
import { NewHomeRaceCard } from "./NewHomeRaceCard";
import { createNewHomeTheme } from "./newHomeTheme";
import { raceMatchesDistance } from "./raceMatchesDistance";
import { useThemeMode } from "./themeMode";

function distanceFromSearchParam(raw: string | null): NavDistanceFilter {
  if (raw === "10k") return "10k";
  if (raw === "5k") return "5k";
  if (raw === "half") return "half";
  return "all";
}

export function AllRacesPage() {
  const { mode } = useThemeMode();
  const nh = createNewHomeTheme(mode);
  const [searchParams] = useSearchParams();
  const activeDistance = distanceFromSearchParam(searchParams.get("distance"));
  const [site, setSite] = useState<SiteAggregates | null>(null);
  const [races, setRaces] = useState<RaceListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        setLoading(true);
        setError(null);
        const { site: s, races: all } = await fetchAllRacesForNewHome();
        if (!cancelled) {
          setSite(s);
          setRaces(all);
        }
      } catch (e) {
        if (!cancelled) {
          setSite(null);
          setRaces([]);
          setError(e instanceof Error ? e.message : "Failed to load races");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(
    () => races.filter((r) => raceMatchesDistance(r, activeDistance)),
    [races, activeDistance],
  );
  const paged = useMemo(
    () => filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filtered, page, rowsPerPage],
  );

  useEffect(() => {
    setPage(0);
  }, [activeDistance]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: nh.bg,
        color: nh.white,
        fontFamily: nh.sans,
        "& .MuiTypography-root": { fontFamily: "inherit" },
        display: "flex",
        flexDirection: "column",
      }}
    >
      <SeoHead
        title="All Races | speedhare"
        description="Browse Hong Kong road race results across 5K, 10K, half marathon, and marathon events."
        canonicalPath="/all-races"
      />
      <NewHomeNav navContext="all-races" activeDistance={activeDistance} />
      <Box sx={{ flex: 1, maxWidth: 800, width: "100%", mx: "auto", px: { xs: 2, sm: 3 }, py: 3 }}>
        <Typography
          sx={{
            fontFamily: nh.mono,
            fontSize: "0.7rem",
            letterSpacing: "0.14em",
            color: nh.blue,
            mb: 0.5,
          }}
        >
          EVENTS
        </Typography>
        <Typography
          component="h1"
          sx={{
            fontFamily: nh.sans,
            fontWeight: 800,
            fontSize: { xs: "1.75rem", sm: "2.25rem" },
            mb: 3,
          }}
        >
          {activeDistance === "all"
            ? "All Races"
            : activeDistance === "half"
              ? "Half Marathon Races"
              : `${activeDistance.toUpperCase()} Races`}
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress sx={{ color: nh.blue }} />
          </Box>
        ) : error ? (
          <Typography sx={{ color: "#f87171", fontFamily: nh.sans }}>{error}</Typography>
        ) : filtered.length === 0 ? (
          <Typography sx={{ color: nh.muted }}>No races available.</Typography>
        ) : (
          <>
            {paged.map((race, idx) => (
              <NewHomeRaceCard key={race.id} race={race} titleAccent={idx === 0 && page === 0} />
            ))}
            <TablePagination
              component="div"
              count={filtered.length}
              page={page}
              onPageChange={(_, next) => setPage(next)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[10, 20, 50]}
              sx={{
                border: "0 !important",
                color: nh.muted,
                "& .MuiIconButton-root": { color: nh.white },
                "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                  color: nh.muted,
                },
                "& .MuiSelect-select, & .MuiInputBase-input": { color: nh.white },
                "& .MuiOutlinedInput-notchedOutline": { borderColor: nh.border },
                "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255,255,255,0.35)",
                },
              }}
            />
          </>
        )}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            my: 4,
          }}
        >
          <Box sx={{ flex: 1, height: "1px", bgcolor: nh.border }} />
          <Typography
            sx={{ fontFamily: nh.mono, fontSize: "0.75rem", color: nh.muted, whiteSpace: "nowrap" }}
          >
            {filtered.length} EVENTS
          </Typography>
          <Box sx={{ flex: 1, height: "1px", bgcolor: nh.border }} />
        </Box>
      </Box>
      {site ? (
        <NewHomeFooter site={site} hasRaceData={races.length > 0} />
      ) : (
        <Box sx={{ py: 3, borderTop: `1px solid ${nh.border}` }} />
      )}
    </Box>
  );
}
