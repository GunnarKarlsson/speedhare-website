import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PlaceIcon from "@mui/icons-material/Place";
import { Box, Link, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { formatRaceType } from "../format";
import { raceListExtras } from "../raceListExtras";
import { racePath } from "../racePaths";
import type { RaceListItem } from "../types";
import { formatShortRaceDate } from "./formatRaceDate";
import { createNewHomeTheme } from "./newHomeTheme";
import { badgeSxForRaceType } from "./badgeStyle";
import type { SiteAggregates } from "../types";
import { useThemeMode } from "./themeMode";

interface NewHomeHeroProps {
  site: SiteAggregates;
  latestRaces: RaceListItem[];
  /** When true, race list data was returned from the API (not only aggregate metadata). */
  hasRaceData: boolean;
}

function metricFromExtras(race: RaceListItem, label: "Finishers" | "Mean" | "Median"): string {
  const { summaryMetrics } = raceListExtras(race.aggregates, race.metadata);
  const m = summaryMetrics.find((x) => x.label === label);
  return m?.value ?? "—";
}

export function NewHomeHero({ site, latestRaces, hasRaceData }: NewHomeHeroProps) {
  const { mode } = useThemeMode();
  const nh = createNewHomeTheme(mode);
  const stat = (k: string, v: string) => (
    <Box>
      <Typography
        sx={{
          fontFamily: nh.mono,
          fontSize: "0.65rem",
          letterSpacing: "0.12em",
          color: nh.muted,
          mb: 0.5,
        }}
      >
        {k}
      </Typography>
      <Typography
        sx={{ fontFamily: nh.sans, fontWeight: 700, fontSize: { xs: "1.75rem", md: "2.25rem" } }}
      >
        {v}
      </Typography>
    </Box>
  );

  return (
    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
        px: { xs: 2, sm: 3 },
        py: { xs: 4, md: 6 },
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1.1fr 0.9fr" },
        gap: { xs: 4, md: 6 },
        alignItems: "start",
      }}
    >
      <Box>
        {hasRaceData ? (
          <Typography
            sx={{
              fontFamily: nh.mono,
              fontSize: "0.7rem",
              letterSpacing: "0.14em",
              color: nh.muted,
              mb: 2,
            }}
          >
            • HONG KONG RACE ANALYTICS
          </Typography>
        ) : null}
        <Typography
          component="h1"
          sx={{
            fontFamily: nh.sans,
            fontWeight: 800,
            fontSize: { xs: "2.5rem", sm: "3.25rem", md: "3.75rem" },
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            mb: 2,
          }}
        >
          <Box component="span" sx={{ color: nh.white, display: "block" }}>
            RACE
          </Box>
          <Box component="span" sx={{ color: nh.blue, display: "block" }}>
            RESULTS.
          </Box>
        </Typography>
        <Typography
          sx={{
            fontFamily: nh.sans,
            color: nh.muted,
            fontSize: "1rem",
            lineHeight: 1.6,
            maxWidth: 480,
            mb: 4,
          }}
        >
          Comprehensive race results and performance analytics for road races in Hong Kong.
        </Typography>
        <Box sx={{ display: "flex", gap: { xs: 3, sm: 5 }, flexWrap: "wrap", mb: 3 }}>
          {stat("TOTAL EVENTS", site.totalRaces.toLocaleString())}
          {stat("TOTAL RESULTS", site.totalResults.toLocaleString())}
          {stat("RACE TYPES", String(site.distinctRaceTypes))}
        </Box>
        <Typography
          sx={{ fontFamily: nh.mono, fontSize: "0.65rem", letterSpacing: "0.1em", color: nh.faint }}
        >
          ↓ SCROLL TO EXPLORE
        </Typography>
      </Box>

      <Box>
        <Typography
          sx={{
            fontFamily: nh.mono,
            fontSize: "0.7rem",
            letterSpacing: "0.14em",
            color: nh.muted,
            mb: 2,
          }}
        >
          • LATEST RACES
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {latestRaces.map((race, idx) => {
            const badge = badgeSxForRaceType(race.race_type, nh);
            const isLatest = idx === 0;
            return (
              <Box
                key={race.id}
                component={RouterLink}
                to={racePath(race.slug)}
                sx={{
                  textDecoration: "none",
                  color: "inherit",
                  borderRadius: 2,
                  p: 2,
                  bgcolor: nh.card,
                  border: `1px solid ${isLatest ? nh.blue : nh.border}`,
                  transition: "border-color 0.15s, background 0.15s",
                  "&:hover": { bgcolor: nh.cardHover, borderColor: nh.blue },
                }}
              >
                <Box
                  sx={{ display: "flex", flexWrap: "wrap", gap: 1, alignItems: "center", mb: 1.5 }}
                >
                  {isLatest ? (
                    <Typography
                      sx={{
                        fontFamily: nh.mono,
                        fontSize: "0.6rem",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        px: 1,
                        py: 0.25,
                        borderRadius: 1,
                        bgcolor: nh.blue,
                        color: nh.bg,
                      }}
                    >
                      LATEST
                    </Typography>
                  ) : null}
                  <Typography
                    sx={{
                      fontFamily: nh.mono,
                      fontSize: "0.65rem",
                      fontWeight: 600,
                      letterSpacing: "0.06em",
                      px: 1,
                      py: 0.25,
                      borderRadius: 1,
                      border: `1px solid ${badge.borderColor}`,
                      bgcolor: badge.bgcolor,
                      color: nh.white,
                    }}
                  >
                    {formatRaceType(race.race_type).toUpperCase()}
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    fontFamily: nh.sans,
                    fontWeight: 700,
                    fontSize: "1.05rem",
                    mb: 1.5,
                    color: isLatest ? nh.blue : nh.white,
                  }}
                >
                  {race.name}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                    color: nh.muted,
                    fontFamily: nh.sans,
                    fontSize: "0.8rem",
                    mb: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <CalendarMonthIcon sx={{ fontSize: 16 }} />
                    {formatShortRaceDate(race.date)}
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <PlaceIcon sx={{ fontSize: 16 }} />
                    {race.location ?? "Hong Kong"}
                  </Box>
                </Box>
                <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: nh.mono,
                        fontSize: "0.6rem",
                        color: nh.blue,
                        letterSpacing: "0.06em",
                      }}
                    >
                      RESULTS
                    </Typography>
                    <Typography sx={{ fontFamily: nh.sans, fontWeight: 700, color: nh.blue }}>
                      {metricFromExtras(race, "Finishers")}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: nh.mono,
                        fontSize: "0.6rem",
                        color: nh.muted,
                        letterSpacing: "0.06em",
                      }}
                    >
                      MEDIAN
                    </Typography>
                    <Typography sx={{ fontFamily: nh.sans, fontWeight: 700 }}>
                      {metricFromExtras(race, "Median")}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: nh.mono,
                        fontSize: "0.6rem",
                        color: nh.muted,
                        letterSpacing: "0.06em",
                      }}
                    >
                      MEAN
                    </Typography>
                    <Typography sx={{ fontFamily: nh.sans, fontWeight: 700 }}>
                      {metricFromExtras(race, "Mean")}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
        <Link
          component={RouterLink}
          to="/all-races"
          sx={{
            display: "inline-block",
            mt: 2,
            fontFamily: nh.mono,
            fontSize: "0.7rem",
            letterSpacing: "0.1em",
            color: nh.muted,
            textDecoration: "none",
            "&:hover": { color: nh.white },
          }}
        >
          VIEW ALL EVENTS →
        </Link>
      </Box>
    </Box>
  );
}
