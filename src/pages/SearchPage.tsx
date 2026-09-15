import SearchIcon from "@mui/icons-material/Search";
import {
  Alert,
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  Link as MuiLink,
  TextField,
  Typography,
} from "@mui/material";
import { Link as RouterLink, useNavigate, useSearchParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { searchRacesByRunner } from "../api";
import { SeoHead } from "../components/SeoHead";
import { formatRaceType, formatRunnerNames, formatSeconds } from "../format";
import { badgeSxForRaceType } from "../new_home/badgeStyle";
import { NewHomeFooter } from "../new_home/NewHomeFooter";
import { fetchAllRacesForNewHome, type SiteAggregates } from "../new_home/newHomeData";
import { NewHomeNav } from "../new_home/NewHomeNav";
import { createNewHomeTheme } from "../new_home/newHomeTheme";
import { racePath } from "../racePaths";
import { useThemeMode } from "../new_home/themeMode";
import type { SearchRaceItem, SearchRunnerItem } from "../types";

export function SearchPage() {
  const { mode } = useThemeMode();
  const nh = createNewHomeTheme(mode);
  const [params, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const q = params.get("q")?.trim() ?? "";
  const [localQ, setLocalQ] = useState(q);

  const [raceRows, setRaceRows] = useState<SearchRaceItem[]>([]);
  const [runnerRows, setRunnerRows] = useState<SearchRunnerItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [site, setSite] = useState<SiteAggregates | null>(null);
  const [hasRaceCatalog, setHasRaceCatalog] = useState(false);

  useEffect(() => {
    setLocalQ(q);
  }, [q]);

  const submitSearch = () => {
    const trimmed = localQ.trim();
    if (!trimmed) setSearchParams({});
    else setSearchParams({ q: trimmed });
  };

  const load = useCallback(async () => {
    if (!q) {
      setRaceRows([]);
      setRunnerRows([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await searchRacesByRunner(q);
      setRaceRows(data.races);
      setRunnerRows(data.runners);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Search failed");
    } finally {
      setLoading(false);
    }
  }, [q]);

  useEffect(() => {
    void load();
  }, [load]);

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

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: nh.bg,
        color: nh.white,
        fontFamily: nh.sans,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <SeoHead
        title={q ? `Search results for ${q} | speedhare` : "Search race results | speedhare"}
        description="Search Hong Kong road race results by race or runner name."
        canonicalPath="/search"
        robots="noindex,follow"
      />
      <NewHomeNav activeDistance="all" navContext="all-races" />

      <Box sx={{ flex: 1, maxWidth: 800, width: "100%", mx: "auto", px: { xs: 2, sm: 3 }, py: 3 }}>
        <Typography sx={{ fontFamily: nh.mono, fontSize: "0.7rem", letterSpacing: "0.14em", color: nh.blue, mb: 0.5 }}>
          SEARCH
        </Typography>
        <Typography component="h1" sx={{ fontFamily: nh.sans, fontWeight: 800, fontSize: { xs: "1.75rem", sm: "2.25rem" }, mb: 2 }}>
          Search results
        </Typography>

        <TextField
          fullWidth
          size="small"
          placeholder="Search race or runner name"
          value={localQ}
          onChange={(e) => setLocalQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submitSearch()}
          sx={{
            mb: 3,
            maxWidth: 520,
            "& .MuiOutlinedInput-root": {
              bgcolor: "rgba(255,255,255,0.06)",
              color: nh.white,
              borderRadius: "999px",
              "& fieldset": { borderColor: nh.border },
              "&:hover fieldset": { borderColor: "rgba(255,255,255,0.35)" },
              "&.Mui-focused fieldset": { borderColor: nh.blue },
            },
            "& .MuiInputBase-input::placeholder": { color: nh.faint, opacity: 1 },
          }}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" aria-label="search" onClick={submitSearch} sx={{ color: nh.muted }}>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        {!q ? (
          <Typography sx={{ color: nh.muted, fontFamily: nh.sans }}>
            Enter a race or runner name in the search box above.
          </Typography>
        ) : (
          <>
            <Typography sx={{ color: nh.muted, fontFamily: nh.mono, fontSize: "0.75rem", mb: 2 }}>
              Query: “{q}”
            </Typography>
            {error ? (
              <Alert severity="error" sx={{ mb: 2, bgcolor: "rgba(248,113,113,0.12)", color: "#fecaca" }}>
                {error}
              </Alert>
            ) : null}
            {loading ? <CircularProgress sx={{ color: nh.blue }} /> : null}

            {!loading ? (
              <>
                <Typography sx={{ fontFamily: nh.mono, fontSize: "0.65rem", letterSpacing: "0.12em", color: nh.blue, mb: 1 }}>
                  RACES
                </Typography>
                {raceRows.length === 0 ? (
                  <Typography sx={{ color: nh.muted, mb: 3 }}>No race name matches.</Typography>
                ) : (
                  <Box sx={{ display: "grid", gap: 1.25, mb: 3 }}>
                    {raceRows.map((r) => {
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
                          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, alignItems: "center", mb: 1 }}>
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
                            <Typography sx={{ fontFamily: nh.mono, fontSize: "0.72rem", color: nh.muted }}>{r.race_date}</Typography>
                          </Box>
                          <MuiLink
                            component={RouterLink}
                            to={racePath(r.race_slug)}
                            onClick={(event) => event.stopPropagation()}
                            underline="none"
                            sx={{ color: nh.white, fontFamily: nh.sans, fontWeight: 700, fontSize: "1.05rem", "&:hover": { color: nh.blue } }}
                          >
                            {r.race_name}
                          </MuiLink>
                        </Box>
                      );
                    })}
                  </Box>
                )}

                <Typography sx={{ fontFamily: nh.mono, fontSize: "0.65rem", letterSpacing: "0.12em", color: nh.blue, mb: 1 }}>
                  RUNNERS
                </Typography>
                {runnerRows.length === 0 ? (
                  <Typography sx={{ color: nh.muted }}>No runner name matches.</Typography>
                ) : (
                  <Box sx={{ display: "grid", gap: 1.25 }}>
                    {runnerRows.map((r) => (
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
                          sx={{ color: nh.white, fontFamily: nh.sans, fontWeight: 700, fontSize: "1.05rem", "&:hover": { color: nh.blue } }}
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
                        <Typography sx={{ mt: 0.75, color: nh.muted, fontFamily: nh.mono, fontSize: "0.72rem" }}>
                          OFFICIAL {formatSeconds(r.official_time_seconds)} // NET{" "}
                          {r.net_time_seconds == null ? "N/A" : formatSeconds(r.net_time_seconds)} // RANK{" "}
                          {r.rank_overall ?? r.result_status ?? "—"}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </>
            ) : null}
          </>
        )}
      </Box>
      {site ? (
        <NewHomeFooter site={site} hasRaceData={hasRaceCatalog} />
      ) : (
        <Box sx={{ py: 3, borderTop: `1px solid ${nh.border}` }} />
      )}
    </Box>
  );
}
