import SearchIcon from "@mui/icons-material/Search";
import {
  Alert,
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { searchRacesByRunner } from "../api";
import { SeoHead } from "../components/SeoHead";
import { useSiteCatalog } from "../hooks/useSiteCatalog";
import { NewHomeFooter } from "../new_home/NewHomeFooter";
import { NewHomeNav } from "../new_home/NewHomeNav";
import { createNewHomeTheme } from "../new_home/newHomeTheme";
import { useThemeMode } from "../new_home/themeMode";
import type { SearchRaceItem, SearchRunnerItem } from "../types";
import { SearchRaceResults, SearchRunnerResults } from "./search/SearchResultLists";

export function SearchPage() {
  const { mode } = useThemeMode();
  const nh = createNewHomeTheme(mode);
  const [params, setSearchParams] = useSearchParams();
  const q = params.get("q")?.trim() ?? "";
  const [localQ, setLocalQ] = useState(q);
  const { site, hasRaceCatalog } = useSiteCatalog();

  const [raceRows, setRaceRows] = useState<SearchRaceItem[]>([]);
  const [runnerRows, setRunnerRows] = useState<SearchRunnerItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        <Typography
          sx={{
            fontFamily: nh.mono,
            fontSize: "0.7rem",
            letterSpacing: "0.14em",
            color: nh.blue,
            mb: 0.5,
          }}
        >
          SEARCH
        </Typography>
        <Typography
          component="h1"
          sx={{
            fontFamily: nh.sans,
            fontWeight: 800,
            fontSize: { xs: "1.75rem", sm: "2.25rem" },
            mb: 2,
          }}
        >
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
                  <IconButton
                    edge="end"
                    aria-label="search"
                    onClick={submitSearch}
                    sx={{ color: nh.muted }}
                  >
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
              <Alert
                severity="error"
                sx={{ mb: 2, bgcolor: "rgba(248,113,113,0.12)", color: "#fecaca" }}
              >
                {error}
              </Alert>
            ) : null}
            {loading ? <CircularProgress sx={{ color: nh.blue }} /> : null}

            {!loading ? (
              <>
                <SearchRaceResults races={raceRows} nh={nh} />
                <SearchRunnerResults runners={runnerRows} nh={nh} />
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
