import { Box, Link as MuiLink, Typography } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { formatRaceType, formatRunnerNames, formatSeconds } from "../../format";
import { badgeSxForRaceType } from "../../home/badgeStyle";
import type { HomeTheme } from "../../home/homeTheme";
import { racePath } from "../../racePaths";
import type { SearchRaceItem, SearchRunnerItem } from "../../types";

export function SearchRaceResults({ races, nh }: { races: SearchRaceItem[]; nh: HomeTheme }) {
  const navigate = useNavigate();

  return (
    <>
      <Typography
        sx={{
          fontFamily: nh.mono,
          fontSize: "0.65rem",
          letterSpacing: "0.12em",
          color: nh.blue,
          mb: 1,
        }}
      >
        RACES
      </Typography>
      {races.length === 0 ? (
        <Typography sx={{ color: nh.muted, mb: 3 }}>No race name matches.</Typography>
      ) : (
        <Box sx={{ display: "grid", gap: 1.25, mb: 3 }}>
          {races.map((r) => {
            const badge = badgeSxForRaceType(r.race_type, nh);
            return (
              <Box
                key={r.race_id}
                onClick={() => navigate(racePath(r.race_slug))}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    navigate(racePath(r.race_slug));
                  }
                }}
                role="link"
                tabIndex={0}
                sx={{
                  border: `1px solid ${nh.border}`,
                  borderRadius: 2,
                  bgcolor: nh.card,
                  p: { xs: 1.5, sm: 2 },
                  cursor: "pointer",
                }}
              >
                <Box
                  sx={{ display: "flex", flexWrap: "wrap", gap: 1, alignItems: "center", mb: 1 }}
                >
                  <Typography
                    sx={{
                      fontFamily: nh.mono,
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      px: 1,
                      py: 0.35,
                      borderRadius: 1,
                      border: `1px solid ${badge.borderColor}`,
                      bgcolor: badge.bgcolor,
                      color: nh.white,
                    }}
                  >
                    {formatRaceType(r.race_type).toUpperCase()}
                  </Typography>
                  <Typography sx={{ fontFamily: nh.mono, fontSize: "0.72rem", color: nh.muted }}>
                    {r.race_date}
                  </Typography>
                </Box>
                <MuiLink
                  component={RouterLink}
                  to={racePath(r.race_slug)}
                  onClick={(event) => event.stopPropagation()}
                  underline="none"
                  sx={{
                    color: nh.white,
                    fontFamily: nh.sans,
                    fontWeight: 700,
                    fontSize: "1.05rem",
                    "&:hover": { color: nh.blue },
                  }}
                >
                  {r.race_name}
                </MuiLink>
              </Box>
            );
          })}
        </Box>
      )}
    </>
  );
}

export function SearchRunnerResults({
  runners,
  nh,
}: {
  runners: SearchRunnerItem[];
  nh: HomeTheme;
}) {
  const navigate = useNavigate();

  return (
    <>
      <Typography
        sx={{
          fontFamily: nh.mono,
          fontSize: "0.65rem",
          letterSpacing: "0.12em",
          color: nh.blue,
          mb: 1,
        }}
      >
        RUNNERS
      </Typography>
      {runners.length === 0 ? (
        <Typography sx={{ color: nh.muted }}>No runner name matches.</Typography>
      ) : (
        <Box sx={{ display: "grid", gap: 1.25 }}>
          {runners.map((r) => (
            <Box
              key={r.result_id}
              onClick={() => navigate(`/races/${r.race_id}/runners/${r.result_id}`)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  navigate(`/races/${r.race_id}/runners/${r.result_id}`);
                }
              }}
              role="link"
              tabIndex={0}
              sx={{
                border: `1px solid ${nh.border}`,
                borderRadius: 2,
                bgcolor: nh.card,
                p: { xs: 1.5, sm: 2 },
                cursor: "pointer",
              }}
            >
              <MuiLink
                component={RouterLink}
                to={`/races/${r.race_id}/runners/${r.result_id}`}
                onClick={(event) => event.stopPropagation()}
                underline="none"
                sx={{
                  color: nh.white,
                  fontFamily: nh.sans,
                  fontWeight: 700,
                  fontSize: "1.05rem",
                  "&:hover": { color: nh.blue },
                }}
              >
                {formatRunnerNames(r)}
              </MuiLink>
              <Box sx={{ mt: 0.5 }}>
                <MuiLink
                  component={RouterLink}
                  to={racePath(r.race_slug)}
                  onClick={(event) => event.stopPropagation()}
                  underline="hover"
                  sx={{ color: nh.muted, fontFamily: nh.sans }}
                >
                  {r.race_name}
                </MuiLink>
              </Box>
              <Typography
                sx={{
                  mt: 0.75,
                  color: nh.muted,
                  fontFamily: nh.mono,
                  fontSize: "0.72rem",
                }}
              >
                OFFICIAL {formatSeconds(r.official_time_seconds)} {"//"} NET{" "}
                {r.net_time_seconds == null ? "N/A" : formatSeconds(r.net_time_seconds)} {"//"} RANK{" "}
                {r.rank_overall ?? r.result_status ?? "—"}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </>
  );
}
