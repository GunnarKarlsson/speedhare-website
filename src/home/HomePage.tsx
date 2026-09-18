import { Box, CircularProgress, Typography } from "@mui/material";
import { useMemo } from "react";
import { SeoHead } from "../components/SeoHead";
import { useRaceCatalog } from "../hooks/useSiteCatalog";
import { createHomeTheme } from "./homeTheme";
import { useThemeMode } from "./themeMode";
import { HomeFooter } from "./HomeFooter";
import { HomeHero } from "./HomeHero";
import { HomeNav } from "./HomeNav";
import { HomeRaceCard } from "./HomeRaceCard";

export function HomePage() {
  const { mode } = useThemeMode();
  const nh = createHomeTheme(mode);
  const { races, site, loading, error } = useRaceCatalog();
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
      <HomeNav activeDistance="all" />

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
          <HomeHero site={site} latestRaces={latestTwo} hasRaceData={races.length > 0} />

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
                <HomeRaceCard key={race.id} race={race} titleAccent={idx === 0} />
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

          <HomeFooter site={site} hasRaceData={races.length > 0} />
        </>
      ) : null}
    </Box>
  );
}
