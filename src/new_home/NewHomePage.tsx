import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { SeoHead } from "../components/SeoHead";
import type { RaceListItem } from "../types";
import { fetchAllRacesForNewHome } from "./newHomeData";
import { createNewHomeTheme } from "./newHomeTheme";
import { useThemeMode } from "./themeMode";
import { NewHomeFooter } from "./NewHomeFooter";
import { NewHomeHero } from "./NewHomeHero";
import { NewHomeNav } from "./NewHomeNav";
import { NewHomeRaceCard } from "./NewHomeRaceCard";

export function NewHomePage() {
  const { mode } = useThemeMode();
  const nh = createNewHomeTheme(mode);
  const [races, setRaces] = useState<RaceListItem[]>([]);
  const [site, setSite] = useState<{
    totalRaces: number;
    totalResults: number;
    distinctRaceTypes: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    void (async () => {
      try {
        const { races: all, site: s } = await fetchAllRacesForNewHome();
        if (!cancelled) {
          setRaces(all);
          setSite(s);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load races");
          setRaces([]);
          setSite(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const latestTwo = useMemo(() => races.slice(0, 2), [races]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: nh.bg,
        color: nh.white,
        fontFamily: nh.sans,
        "& .MuiTypography-root": { fontFamily: "inherit" },
      }}
    >
      <SeoHead
        title="speedhare | Hong Kong race analytics"
        description="Comprehensive race results and performance analytics for road races in Hong Kong."
        canonicalPath="/"
      />
      <NewHomeNav activeDistance="all" />

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 12 }}>
          <CircularProgress sx={{ color: nh.blue }} />
        </Box>
      ) : error ? (
        <Box sx={{ maxWidth: 1200, mx: "auto", px: 3, py: 8 }}>
          <Typography sx={{ color: "#f87171", fontFamily: nh.sans }}>{error}</Typography>
        </Box>
      ) : site ? (
        <>
          <NewHomeHero site={site} latestRaces={latestTwo} hasRaceData={races.length > 0} />

          <Box sx={{ maxWidth: 800, mx: "auto", px: { xs: 2, sm: 3 }, pb: 2 }}>
            <Typography
              sx={{
                fontFamily: nh.mono,
                fontSize: "0.7rem",
                letterSpacing: "0.14em",
                color: nh.blue,
                mb: 0.5,
              }}
            >
              HONG KONG
            </Typography>
            <Typography
              component="h2"
              sx={{
                fontFamily: nh.sans,
                fontWeight: 800,
                fontSize: { xs: "1.75rem", sm: "2.25rem" },
                mb: 3,
              }}
            >
              Events
            </Typography>

            {races.length === 0 ? (
              <Typography sx={{ color: nh.muted }}>No races available.</Typography>
            ) : (
              races.map((race, idx) => (
                <NewHomeRaceCard key={race.id} race={race} titleAccent={idx === 0} />
              ))
            )}
          </Box>

          <Box
            sx={{
              maxWidth: 800,
              mx: "auto",
              px: { xs: 2, sm: 3 },
              display: "flex",
              alignItems: "center",
              gap: 2,
              my: 4,
            }}
          >
            <Box sx={{ flex: 1, height: "1px", bgcolor: nh.border }} />
            <Typography
              sx={{
                fontFamily: nh.mono,
                fontSize: "0.75rem",
                color: nh.muted,
                whiteSpace: "nowrap",
              }}
            >
              {site.totalRaces} EVENTS
            </Typography>
            <Box sx={{ flex: 1, height: "1px", bgcolor: nh.border }} />
          </Box>

          <NewHomeFooter site={site} hasRaceData={races.length > 0} />
        </>
      ) : null}
    </Box>
  );
}
