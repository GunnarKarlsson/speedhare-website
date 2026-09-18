import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PlaceIcon from "@mui/icons-material/Place";
import { Box, Collapse, Link, Typography } from "@mui/material";
import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { formatRaceType } from "../format";
import { raceListExtras } from "../raceListExtras";
import { racePath } from "../racePaths";
import type { RaceListItem } from "../types";
import { badgeSxForRaceType } from "./badgeStyle";
import { createHomeTheme } from "./homeTheme";
import { useThemeMode } from "./themeMode";

const PERCENTILE_LABELS = ["Top 10%", "Top 25%", "Top 50%", "Top 75%"] as const;

interface HomeRaceCardProps {
  race: RaceListItem;
  titleAccent?: boolean;
}

function summaryValue(
  extras: ReturnType<typeof raceListExtras>,
  label: "Finishers" | "Mean" | "Median",
): string {
  return extras.summaryMetrics.find((m) => m.label === label)?.value ?? "—";
}

export function HomeRaceCard({ race, titleAccent }: HomeRaceCardProps) {
  const { mode } = useThemeMode();
  const nh = createHomeTheme(mode);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const extras = raceListExtras(race.aggregates, race.metadata);
  const badge = badgeSxForRaceType(race.race_type, nh);
  const percentileMetrics = PERCENTILE_LABELS.map((label) =>
    extras.summaryMetrics.find((m) => m.label === label),
  ).filter(Boolean) as { label: string; value: string }[];

  const loc = race.location ?? "Hong Kong";
  const typeLabel = formatRaceType(race.race_type);

  return (
    <Box
      onClick={() => navigate(racePath(race.slug))}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          navigate(racePath(race.slug));
        }
      }}
      role="link"
      tabIndex={0}
      sx={{
        bgcolor: nh.card,
        borderRadius: 2,
        border: `1px solid ${nh.border}`,
        p: { xs: 2, sm: 2.5 },
        mb: 2,
        cursor: "pointer",
      }}
    >
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, alignItems: "center", mb: 2 }}>
        <Typography
          sx={{
            fontFamily: nh.mono,
            fontSize: "0.65rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            px: 1,
            py: 0.35,
            borderRadius: 1,
            border: `1px solid ${badge.borderColor}`,
            bgcolor: badge.bgcolor,
            color: nh.white,
          }}
        >
          {typeLabel.toUpperCase()}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            color: nh.muted,
            fontFamily: nh.sans,
            fontSize: "0.8rem",
          }}
        >
          <CalendarMonthIcon sx={{ fontSize: 18 }} />
          {race.date}
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            color: nh.muted,
            fontFamily: nh.sans,
            fontSize: "0.8rem",
          }}
        >
          <PlaceIcon sx={{ fontSize: 18 }} />
          {loc}
        </Box>
      </Box>

      <Typography
        sx={{
          fontFamily: nh.sans,
          fontWeight: 700,
          fontSize: { xs: "1.15rem", sm: "1.35rem" },
          lineHeight: 1.3,
          mb: 2,
          color: titleAccent ? nh.blue : nh.white,
        }}
      >
        {race.name}
      </Typography>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: { xs: 2, sm: 4 }, mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <PersonOutlineIcon sx={{ color: nh.blue, fontSize: 22 }} />
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
              {summaryValue(extras, "Finishers")}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AccessTimeIcon sx={{ color: nh.muted, fontSize: 22 }} />
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
            <Typography sx={{ fontFamily: nh.sans, fontWeight: 700, color: nh.white }}>
              {summaryValue(extras, "Mean")}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AccessTimeIcon sx={{ color: nh.muted, fontSize: 22 }} />
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
            <Typography sx={{ fontFamily: nh.sans, fontWeight: 700, color: nh.white }}>
              {summaryValue(extras, "Median")}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box
        component="button"
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          setOpen((v) => !v);
        }}
        onKeyDown={(event) => event.stopPropagation()}
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 0.75,
          background: "none",
          border: "none",
          cursor: "pointer",
          color: nh.muted,
          fontFamily: nh.mono,
          fontSize: "0.7rem",
          letterSpacing: "0.08em",
          padding: 0,
          mb: open ? 2 : 0,
          "&:hover": { color: nh.white },
        }}
      >
        {open ? (
          <KeyboardArrowUpIcon sx={{ fontSize: 18 }} />
        ) : (
          <ExpandMoreIcon sx={{ fontSize: 18 }} />
        )}
        {open ? "COLLAPSE" : "SHOW DETAILS"}
      </Box>

      <Collapse in={open} unmountOnExit>
        {percentileMetrics.length > 0 ? (
          <Box sx={{ mb: 3 }}>
            <Typography
              sx={{
                fontFamily: nh.mono,
                fontSize: "0.65rem",
                letterSpacing: "0.12em",
                color: nh.muted,
                mb: 1.5,
              }}
            >
              PERCENTILE CUTOFFS
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {percentileMetrics.map((m) => (
                <Box
                  key={m.label}
                  sx={{
                    px: 1.5,
                    py: 1,
                    borderRadius: 1.5,
                    bgcolor: nh.blueMuted,
                    border: `1px solid ${nh.blueBadgeBorder}`,
                  }}
                >
                  <Typography
                    sx={{ fontFamily: nh.mono, fontSize: "0.65rem", color: nh.blue, opacity: 0.95 }}
                  >
                    {m.label}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: nh.sans,
                      fontWeight: 700,
                      color: nh.blue,
                      fontSize: "1.1rem",
                    }}
                  >
                    {m.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        ) : null}

        {extras.thresholdMetrics.length > 0 ? (
          <Box sx={{ mb: 2 }}>
            <Typography
              sx={{
                fontFamily: nh.mono,
                fontSize: "0.65rem",
                letterSpacing: "0.12em",
                color: nh.muted,
                mb: 1.5,
              }}
            >
              SUB-TIME BREAKDOWN
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(2, 1fr)",
                  sm: "repeat(3, 1fr)",
                  md: "repeat(4, 1fr)",
                },
                gap: 1,
              }}
            >
              {extras.thresholdMetrics.map((m) => (
                <Box
                  key={m.label}
                  sx={{
                    px: 1.25,
                    py: 1,
                    borderRadius: 1.5,
                    bgcolor: "rgba(255,255,255,0.06)",
                    border: `1px solid ${nh.border}`,
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: nh.mono,
                      fontSize: "0.65rem",
                      color: nh.muted,
                      textTransform: "lowercase",
                    }}
                  >
                    {m.label.replace(/^Sub /, "sub ")}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: nh.sans,
                      fontWeight: 700,
                      color: nh.white,
                      fontSize: "0.95rem",
                    }}
                  >
                    {m.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        ) : null}
      </Collapse>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          pt: 2,
          mt: 1,
          borderTop: `1px solid ${nh.border}`,
        }}
      >
        <Typography sx={{ fontFamily: nh.mono, fontSize: "0.7rem", color: nh.muted }}>
          ID:{race.id} {"//"} {typeLabel} {"//"} {loc}
        </Typography>
        <Link
          component={RouterLink}
          to={racePath(race.slug)}
          onClick={(event) => event.stopPropagation()}
          sx={{
            fontFamily: nh.mono,
            fontSize: "0.7rem",
            fontWeight: 600,
            letterSpacing: "0.1em",
            color: nh.blue,
            textDecoration: "none",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          FULL REPORT →
        </Link>
      </Box>
    </Box>
  );
}
