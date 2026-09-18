import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import SearchIcon from "@mui/icons-material/Search";
import { Box, IconButton, Link } from "@mui/material";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { createNewHomeTheme } from "./newHomeTheme";
import { useThemeMode } from "./themeMode";

export type NewHomeNavContext = "home" | "all-races" | "stats";

export type NavDistanceFilter = "all" | "5k" | "10k" | "half";

interface NewHomeNavProps {
  activeDistance: NavDistanceFilter;
  /** When `all-races`, the "All races" link is highlighted (you are on the table page). */
  navContext?: NewHomeNavContext;
}

function distanceToAllRacesHref(id: NavDistanceFilter): string {
  return id === "all" ? "/all-races" : `/all-races?distance=${id}`;
}

export function NewHomeNav({ activeDistance, navContext = "home" }: NewHomeNavProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { mode, toggleMode } = useThemeMode();
  const nh = createNewHomeTheme(mode);
  const bannerDividerColor = "#a7b7c9";
  const showCalculatorBanner = pathname !== "/speed-distance-time-calculator";

  const navItem = (id: NavDistanceFilter, label: string) => (
    <Link
      component={RouterLink}
      to={distanceToAllRacesHref(id)}
      sx={{
        textDecoration: "none",
        fontFamily: nh.sans,
        fontSize: "0.875rem",
        fontWeight: 500,
        "&:hover": { color: nh.white },
        display: "inline-block",
        color: navContext !== "stats" && activeDistance === id ? nh.white : nh.muted,
      }}
    >
      {label}
    </Link>
  );

  return (
    <Box
      component="header"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        bgcolor: nh.bg,
      }}
    >
      <Box
        sx={{
          borderBottom: `1px solid ${bannerDividerColor}`,
        }}
      >
        <Box
          sx={{
            maxWidth: 1200,
            mx: "auto",
            px: { xs: 2, sm: 3 },
            py: 1.5,
            display: "grid",
            gridTemplateColumns: { xs: "1fr auto", md: "auto 1fr auto" },
            gridTemplateAreas: {
              xs: `"logo search" "nav nav"`,
              md: `"logo nav search"`,
            },
            alignItems: "center",
            gap: { xs: 1, md: 2 },
            rowGap: 1.5,
          }}
        >
          <Link
            component={RouterLink}
            to="/"
            underline="none"
            sx={{
              gridArea: "logo",
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              fontFamily: nh.sans,
              fontWeight: 700,
              fontSize: "1.05rem",
              border: "none",
              outline: "none",
              boxShadow: "none",
              "&:focus, &:focus-visible": {
                outline: "none",
                boxShadow: "none",
              },
            }}
          >
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
            <Box component="span" sx={{ color: nh.white }}>
              speed
              <Box component="span" sx={{ color: nh.blue }}>
                hare
              </Box>
            </Box>
          </Link>

          <Box
            sx={{
              gridArea: "nav",
              display: "flex",
              justifyContent: "center",
              gap: { xs: 1.5, md: 3 },
              flexWrap: "wrap",
            }}
          >
            {navItem("all", "All")}
            {navItem("5k", "5K")}
            {navItem("10k", "10K")}
            {navItem("half", "Half-Marathon")}
            <Link
              component={RouterLink}
              to="/hong-kong-road-race-stats-5k-10k-half-marathon"
              sx={{
                textDecoration: "none",
                fontFamily: nh.sans,
                fontSize: "0.875rem",
                fontWeight: 500,
                "&:hover": { color: nh.white },
                display: "inline-block",
                color: navContext === "stats" ? nh.white : nh.muted,
              }}
            >
              Stats
            </Link>
          </Box>

          <Box
            sx={{
              gridArea: "search",
              justifySelf: "end",
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <IconButton
              aria-label="Search"
              onClick={() => navigate("/search")}
              sx={{ color: nh.white }}
            >
              <SearchIcon />
            </IconButton>
            <IconButton
              aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              onClick={toggleMode}
              sx={{ color: nh.white }}
            >
              {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Box>
        </Box>
      </Box>
      {showCalculatorBanner ? (
        <Box
          role="status"
          sx={{
            px: 2,
            height: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#cfdff2",
            borderBottom: `1px solid ${bannerDividerColor}`,
          }}
        >
          <Link
            component={RouterLink}
            to="/speed-distance-time-calculator"
            sx={{
              display: "block",
              color: "rgba(15, 23, 42, 0.72)",
              fontSize: "0.64rem",
              lineHeight: 1,
              letterSpacing: "0.02em",
              fontWeight: 400,
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            NEW: Speed Distance Time Calculator 🏃 
          </Link>
        </Box>
      ) : null}
    </Box>
  );
}
