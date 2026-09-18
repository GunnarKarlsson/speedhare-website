import SwapVertIcon from "@mui/icons-material/SwapVert";
import { Alert, Box, CircularProgress, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { SeoHead } from "../components/SeoHead";
import { HomeNav } from "../home/HomeNav";
import { createHomeTheme } from "../home/homeTheme";
import { useThemeMode } from "../home/themeMode";
import { RaceDetailSummary } from "./raceDetail/RaceDetailSummary";
import { RaceResultCard } from "./raceDetail/RaceResultCard";
import { RESULTS_SORT_COLUMNS, buildRaceDetailView } from "./raceDetail/raceDetailView";
import { ResultsPagination } from "./raceDetail/ResultsPagination";
import { useRaceDetail } from "./raceDetail/useRaceDetail";

export function RaceDetailPage() {
  const { mode } = useThemeMode();
  const nh = createHomeTheme(mode);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { idOrSlug } = useParams<{ idOrSlug: string }>();
  const detail = useRaceDetail(idOrSlug);
  const view = useMemo(
    () => (detail.race ? buildRaceDetailView(detail.race) : null),
    [detail.race],
  );
  const race = detail.race;

  if (!detail.raceLookup) return <Alert severity="error">Invalid race</Alert>;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: nh.bg, color: nh.white }}>
      <SeoHead
        title={view?.title ?? "Race Results | Hong Kong Road Race | speedhare"}
        description={
          view?.description ??
          "Race results, rankings, and finisher times for Hong Kong road races."
        }
        canonicalPath={view?.canonicalPath ?? "/races"}
      />
      <HomeNav activeDistance="all" navContext="all-races" />
      <Box sx={{ maxWidth: 800, mx: "auto", px: { xs: 2, sm: 3 }, py: 3 }}>
        {detail.error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {detail.error}
          </Alert>
        ) : null}

        {detail.raceLoading && !race ? (
          <CircularProgress sx={{ color: nh.blue }} />
        ) : race && view ? (
          <>
            <RaceDetailSummary race={race} view={view} nh={nh} />

            <Box sx={{ mb: 1.5, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1 }}>
              <Typography
                sx={{
                  fontFamily: nh.mono,
                  fontSize: "0.65rem",
                  letterSpacing: "0.12em",
                  color: nh.muted,
                  mr: 1,
                }}
              >
                RUNNER RESULTS
              </Typography>
              {RESULTS_SORT_COLUMNS.map((col) => {
                const active = detail.sortBy === col.key;
                return (
                  <Box
                    key={col.key}
                    component="button"
                    type="button"
                    onClick={() => detail.requestSort(col.key)}
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 0.5,
                      borderRadius: 1,
                      px: 1,
                      py: 0.45,
                      border: `1px solid ${active ? nh.blue : nh.border}`,
                      bgcolor: active ? "rgba(59,130,246,0.2)" : "rgba(255,255,255,0.03)",
                      color: active ? nh.white : nh.muted,
                      fontFamily: nh.mono,
                      fontSize: "0.68rem",
                      letterSpacing: "0.05em",
                      cursor: "pointer",
                    }}
                  >
                    <SwapVertIcon sx={{ fontSize: 14 }} />
                    {col.label}
                    {active ? (detail.sortOrder === "asc" ? "↑" : "↓") : ""}
                  </Box>
                );
              })}
            </Box>

            {detail.resultsLoading ? (
              <CircularProgress size={24} sx={{ color: nh.blue, mb: 1.5 }} />
            ) : null}

            <ResultsPagination
              count={detail.resultsTotal}
              page={detail.page}
              pageSize={detail.pageSize}
              onPageChange={detail.setPage}
              onPageSizeChange={detail.setPageSize}
              nh={nh}
              isMobile={isMobile}
              sx={{ mb: 1 }}
            />

            <Box sx={{ display: "grid", gap: 1.25 }}>
              {detail.results.map((row) => (
                <RaceResultCard key={row.id} raceId={race.id} row={row} nh={nh} />
              ))}
            </Box>

            <ResultsPagination
              count={detail.resultsTotal}
              page={detail.page}
              pageSize={detail.pageSize}
              onPageChange={detail.setPage}
              onPageSizeChange={detail.setPageSize}
              nh={nh}
              isMobile={isMobile}
              sx={{ mt: 1 }}
            />
          </>
        ) : null}
      </Box>
    </Box>
  );
}
