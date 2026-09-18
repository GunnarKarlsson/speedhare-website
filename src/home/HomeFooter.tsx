import { Box, Link, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import type { SiteAggregates } from "../types";
import { createHomeTheme } from "./homeTheme";
import { useThemeMode } from "./themeMode";

interface HomeFooterProps {
  site: SiteAggregates;
  /** Race list API returned at least one event (same semantics as home hero “LIVE”). */
  hasRaceData: boolean;
}

export function HomeFooter({ site, hasRaceData }: HomeFooterProps) {
  const { mode } = useThemeMode();
  const nh = createHomeTheme(mode);
  const colTitle = (t: string) => (
    <Typography
      sx={{
        fontFamily: nh.mono,
        fontSize: "0.65rem",
        letterSpacing: "0.14em",
        color: nh.muted,
        mb: 2,
      }}
    >
      {t}
    </Typography>
  );

  const footLink = (to: string, label: string) => (
    <Link
      component={RouterLink}
      to={to}
      sx={{
        display: "block",
        fontFamily: nh.sans,
        fontSize: "0.9rem",
        color: nh.white,
        textDecoration: "none",
        py: 0.5,
        "&:hover": { color: nh.blue },
      }}
    >
      {label}
    </Link>
  );

  const resultsLabel =
    site.totalResults >= 1000
      ? `${Math.floor(site.totalResults / 1000)}K+`
      : site.totalResults.toLocaleString();

  return (
    <Box component="footer" sx={{ bgcolor: nh.bg, borderTop: `1px solid ${nh.border}`, mt: 6 }}>
      <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, sm: 3 }, py: 5 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1.2fr 0.8fr 0.8fr" },
            gap: 4,
          }}
        >
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 1,
                  border: `2px solid ${nh.blue}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {/* Font Awesome Free v7.2.0 — https://fontawesome.com/license/free */}
                <Box
                  component="svg"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  aria-hidden
                  sx={{
                    display: "block",
                    height: 20,
                    width: (20 * 448) / 512,
                  }}
                >
                  <path
                    fill={nh.blue}
                    d="M338.8-9.9c11.9 8.6 16.3 24.2 10.9 37.8L271.3 224 416 224c13.5 0 25.5 8.4 30.1 21.1s.7 26.9-9.6 35.5l-288 240c-11.3 9.4-27.4 9.9-39.3 1.3s-16.3-24.2-10.9-37.8L176.7 288 32 288c-13.5 0-25.5-8.4-30.1-21.1s-.7-26.9 9.6-35.5l288-240c11.3-9.4 27.4-9.9 39.3-1.3z"
                  />
                </Box>
              </Box>
              <Typography sx={{ fontFamily: nh.sans, fontWeight: 700, fontSize: "1.05rem" }}>
                <Box component="span" sx={{ color: nh.white }}>
                  speed
                  <Box component="span" sx={{ color: nh.blue }}>
                    hare
                  </Box>
                </Box>
              </Typography>
            </Box>
            <Typography
              sx={{
                fontFamily: nh.sans,
                color: nh.muted,
                fontSize: "0.9rem",
                lineHeight: 1.6,
                mb: 3,
              }}
            >
              Comprehensive race results and performance analytics for road races in Hong Kong.
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
              <Box>
                <Typography sx={{ fontFamily: nh.mono, fontSize: "0.6rem", color: nh.muted }}>
                  EVENTS
                </Typography>
                <Typography sx={{ fontFamily: nh.sans, fontWeight: 700, fontSize: "1.25rem" }}>
                  {site.totalRaces.toLocaleString()}
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ fontFamily: nh.mono, fontSize: "0.6rem", color: nh.muted }}>
                  RESULTS
                </Typography>
                <Typography sx={{ fontFamily: nh.sans, fontWeight: 700, fontSize: "1.25rem" }}>
                  {resultsLabel}
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ fontFamily: nh.mono, fontSize: "0.6rem", color: nh.muted }}>
                  LOCATION
                </Typography>
                <Typography sx={{ fontFamily: nh.sans, fontWeight: 700, fontSize: "1.25rem" }}>
                  HK
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box>
            {colTitle("RACE TYPES")}
            {footLink("/all-races", "All Races")}
            {footLink("/all-races?distance=5k", "5K Races")}
            {footLink("/all-races?distance=10k", "10K Races")}
            {footLink("/all-races?distance=half", "Half-Marathon Races")}
          </Box>

          <Box>
            {colTitle("PLATFORM")}
            {footLink("/search", "Search")}
            {footLink("/hong-kong-road-race-stats-5k-10k-half-marathon", "Stats")}
            {footLink("/speed-distance-time-calculator", "Speed Distance Time Calculator")}
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          borderTop: `1px solid ${nh.border}`,
          px: { xs: 2, sm: 3 },
          py: 1.5,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: 2,
          alignItems: "center",
          maxWidth: 1200,
          mx: "auto",
        }}
      >
        <Typography sx={{ fontFamily: nh.mono, fontSize: "0.65rem", color: nh.muted }}>
          © {new Date().getFullYear()} BAHN LABS LTD — HONG KONG RACE ANALYTICS
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Link
              component={RouterLink}
              to="/about"
              sx={{
                fontFamily: nh.mono,
                fontSize: "0.65rem",
                color: nh.muted,
                textDecoration: "none",
                "&:hover": { color: nh.blue },
              }}
            >
              About
            </Link>
            <Link
              component={RouterLink}
              to="/terms"
              sx={{
                fontFamily: nh.mono,
                fontSize: "0.65rem",
                color: nh.muted,
                textDecoration: "none",
                "&:hover": { color: nh.blue },
              }}
            >
              T&C
            </Link>
            <Link
              component={RouterLink}
              to="/data-policy"
              sx={{
                fontFamily: nh.mono,
                fontSize: "0.65rem",
                color: nh.muted,
                textDecoration: "none",
                "&:hover": { color: nh.blue },
              }}
            >
              Data Policy
            </Link>
          </Box>
          {hasRaceData ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#22c55e" }} />
              <Typography sx={{ fontFamily: nh.mono, fontSize: "0.65rem", color: nh.muted }}>
                SYSTEM ONLINE
              </Typography>
            </Box>
          ) : null}
        </Box>
      </Box>
    </Box>
  );
}
