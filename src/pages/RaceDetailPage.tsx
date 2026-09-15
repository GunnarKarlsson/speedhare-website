import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PlaceIcon from "@mui/icons-material/Place";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import {
  Alert,
  Box,
  CircularProgress,
  Link as MuiLink,
  TablePagination,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getRace, getRaceBySlug, getRaceResults } from "../api";
import { SeoHead } from "../components/SeoHead";
import { formatEnglishRunnerName, formatRaceType, formatSeconds } from "../format";
import { badgeSxForRaceType } from "../new_home/badgeStyle";
import { NewHomeNav } from "../new_home/NewHomeNav";
import { createNewHomeTheme, type NewHomeTheme } from "../new_home/newHomeTheme";
import { raceListExtras } from "../raceListExtras";
import { racePath } from "../racePaths";
import { useThemeMode } from "../new_home/themeMode";
import type { RaceDetail, ResultsSortKey, RunnerResultRow, SortOrder } from "../types";

const SORT_COLUMNS: { key: ResultsSortKey; label: string }[] = [
  { key: "position", label: "Position" },
  { key: "bib", label: "Bib" },
  { key: "name", label: "Runner" },
  { key: "gender", label: "Gender" },
  { key: "category", label: "Category" },
  { key: "time", label: "Official Time" },
];

const PERCENTILE_LABELS = ["Top 10%", "Top 25%", "Top 50%", "Top 75%"] as const;

/** Keys surfaced as humanized labels by `raceListExtras`; hide these on the race detail metadata row. */
const RACE_DETAIL_METADATA_CHIP_HIDE = new Set([
  "source",
  "output file name",
  "data version",
  "version",
]);

function readMetadataVersion(metadata: unknown): string | null {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) return null;
  const o = metadata as Record<string, unknown>;
  const pick = (x: unknown): string | null => {
    if (typeof x === "number" && Number.isFinite(x)) return String(x);
    if (typeof x === "string" && x.trim().length > 0) return x.trim();
    return null;
  };
  return pick(o["data-version"]) ?? pick(o["version"]);
}

function DetailMetric({
  label,
  value,
  nh,
  color,
}: {
  label: string;
  value: string;
  nh: NewHomeTheme;
  color?: string;
}) {
  const resolvedColor = color ?? nh.blue;
  return (
    <Box
      sx={{
        px: 1.25,
        py: 1,
        borderRadius: 1.25,
        bgcolor: "rgba(255,255,255,0.06)",
        border: `1px solid ${nh.border}`,
      }}
    >
      <Typography
        sx={{
          fontFamily: nh.mono,
          fontSize: "0.65rem",
          color: resolvedColor,
          letterSpacing: "0.06em",
        }}
      >
        {label}
      </Typography>
      <Typography sx={{ fontFamily: nh.sans, fontWeight: 700, color: nh.white }}>
        {value}
      </Typography>
    </Box>
  );
}

export function RaceDetailPage() {
  const { mode } = useThemeMode();
  const nh = createNewHomeTheme(mode);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const { idOrSlug } = useParams<{ idOrSlug: string }>();
  const raceLookup = idOrSlug?.trim() ?? "";
  const isLegacyIdRoute = /^\d+$/.test(raceLookup);
  const legacyRaceId = isLegacyIdRoute ? parseInt(raceLookup, 10) : NaN;

  const [race, setRace] = useState<RaceDetail | null>(null);
  const [results, setResults] = useState<RunnerResultRow[]>([]);
  const [resultsTotal, setResultsTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [sortBy, setSortBy] = useState<ResultsSortKey>("position");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [raceLoading, setRaceLoading] = useState(true);
  const [resultsLoading, setResultsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!raceLookup) {
      setError("Invalid race");
      setRaceLoading(false);
      return;
    }
    let cancelled = false;
    setRaceLoading(true);
    setRace(null);
    setResults([]);
    setResultsTotal(0);
    setError(null);
    void (async () => {
      try {
        const r =
          isLegacyIdRoute && Number.isFinite(legacyRaceId)
            ? await getRace(legacyRaceId)
            : await getRaceBySlug(raceLookup);
        if (!cancelled) {
          setRace(r);
          if (isLegacyIdRoute) {
            navigate(racePath(r.slug), { replace: true });
          }
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load race");
      } finally {
        if (!cancelled) setRaceLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isLegacyIdRoute, legacyRaceId, navigate, raceLookup]);

  useEffect(() => {
    if (!race) return;
    let cancelled = false;
    setResultsLoading(true);
    void (async () => {
      try {
        const data = await getRaceResults(race.id, page + 1, pageSize, sortBy, sortOrder);
        if (!cancelled) {
          setResults(data.items);
          setResultsTotal(data.total);
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load results");
      } finally {
        if (!cancelled) setResultsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [page, pageSize, race, sortBy, sortOrder]);

  const requestSort = (key: ResultsSortKey) => {
    if (sortBy === key) setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    else {
      setSortBy(key);
      setSortOrder("asc");
    }
    setPage(0);
  };

  if (!raceLookup) return <Alert severity="error">Invalid race</Alert>;

  const extras = race ? raceListExtras(race.aggregates, race.metadata) : null;
  const metadataVersionStr = race ? readMetadataVersion(race.metadata) : null;
  const metadataChips =
    extras?.metadataMetrics.filter(
      (m) => !RACE_DETAIL_METADATA_CHIP_HIDE.has(m.label.toLowerCase()),
    ) ?? [];
  const showMetadataSection =
    (metadataVersionStr != null && metadataVersionStr.length > 0) || metadataChips.length > 0;
  const typeBadge = race ? badgeSxForRaceType(race.race_type, nh) : null;
  const topMetrics = extras
    ? (PERCENTILE_LABELS.map((label) =>
        extras.summaryMetrics.find((m) => m.label === label),
      ).filter(Boolean) as {
        label: string;
        value: string;
      }[])
    : [];

  const title = race
    ? `${race.name} ${race.date} Results | Hong Kong Road Race | speedhare`
    : "Race Results | Hong Kong Road Race | speedhare";
  const description = race
    ? `${race.name} ${race.date}${race.location ? ` in ${race.location}` : ""}. Official road race results, rankings, and finisher times.`
    : "Race results, rankings, and finisher times for Hong Kong road races.";
  const canonicalPath = race ? racePath(race.slug) : "/races";

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: nh.bg, color: nh.white }}>
      <SeoHead title={title} description={description} canonicalPath={canonicalPath} />
      <NewHomeNav activeDistance="all" navContext="all-races" />
      <Box sx={{ maxWidth: 800, mx: "auto", px: { xs: 2, sm: 3 }, py: 3 }}>
        {error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : null}

        {raceLoading && !race ? (
          <CircularProgress sx={{ color: nh.blue }} />
        ) : race ? (
          <>
            <Box
              sx={{
                mb: 3,
                p: { xs: 2, md: 2.5 },
                border: `1px solid ${nh.border}`,
                bgcolor: nh.card,
                borderRadius: 2,
              }}
            >
              <Box
                sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, alignItems: "center", mb: 1.5 }}
              >
                <Typography
                  sx={{
                    fontFamily: nh.mono,
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    px: 1,
                    py: 0.35,
                    borderRadius: 1,
                    border: `1px solid ${typeBadge?.borderColor ?? nh.blue}`,
                    bgcolor: typeBadge?.bgcolor ?? nh.blueBadgeBg,
                    color: nh.white,
                  }}
                >
                  {formatRaceType(race.race_type).toUpperCase()}
                </Typography>
                <Box
                  sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, color: nh.muted }}
                >
                  <CalendarMonthIcon sx={{ fontSize: 16 }} />
                  <Typography sx={{ fontFamily: nh.sans, fontSize: "0.85rem" }}>
                    {race.date}
                  </Typography>
                </Box>
                <Box
                  sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, color: nh.muted }}
                >
                  <PlaceIcon sx={{ fontSize: 16 }} />
                  <Typography sx={{ fontFamily: nh.sans, fontSize: "0.85rem" }}>
                    {race.location ?? "Hong Kong"}
                  </Typography>
                </Box>
              </Box>

              <Typography
                component="h1"
                sx={{
                  fontFamily: nh.sans,
                  fontWeight: 800,
                  fontSize: { xs: "1.4rem", md: "2rem" },
                  mb: 2,
                }}
              >
                {race.name}
              </Typography>

              {extras ? (
                <>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
                      gap: 1,
                      mb: 1.5,
                    }}
                  >
                    <DetailMetric
                      nh={nh}
                      label="RESULTS"
                      value={
                        extras.summaryMetrics.find((m) => m.label === "Finishers")?.value ?? "—"
                      }
                      color={nh.blue}
                    />
                    <DetailMetric
                      nh={nh}
                      label="MEAN"
                      value={extras.summaryMetrics.find((m) => m.label === "Mean")?.value ?? "—"}
                      color={nh.muted}
                    />
                    <DetailMetric
                      nh={nh}
                      label="MEDIAN"
                      value={extras.summaryMetrics.find((m) => m.label === "Median")?.value ?? "—"}
                      color={nh.muted}
                    />
                  </Box>

                  {topMetrics.length > 0 ? (
                    <Box sx={{ mb: 1.5 }}>
                      <Typography
                        sx={{
                          fontFamily: nh.mono,
                          fontSize: "0.65rem",
                          letterSpacing: "0.1em",
                          color: nh.muted,
                          mb: 1,
                        }}
                      >
                        PERCENTILE CUTOFFS
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {topMetrics.map((m) => (
                          <DetailMetric
                            nh={nh}
                            key={m.label}
                            label={m.label}
                            value={m.value}
                            color={nh.blue}
                          />
                        ))}
                      </Box>
                    </Box>
                  ) : null}

                  {extras.thresholdMetrics.length > 0 ? (
                    <Box sx={{ mb: showMetadataSection ? 1.5 : 0 }}>
                      <Typography
                        sx={{
                          fontFamily: nh.mono,
                          fontSize: "0.65rem",
                          letterSpacing: "0.1em",
                          color: nh.muted,
                          mb: 1,
                        }}
                      >
                        SUB-TIME BREAKDOWN
                      </Typography>
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
                          gap: 1,
                        }}
                      >
                        {extras.thresholdMetrics.map((m) => (
                          <DetailMetric
                            nh={nh}
                            key={m.label}
                            label={m.label.replace(/^Sub /, "sub ")}
                            value={m.value}
                            color={nh.muted}
                          />
                        ))}
                      </Box>
                    </Box>
                  ) : null}

                  {showMetadataSection ? (
                    <Box>
                      <Typography
                        sx={{
                          fontFamily: nh.mono,
                          fontSize: "0.65rem",
                          letterSpacing: "0.1em",
                          color: nh.muted,
                          mb: 1,
                        }}
                      >
                        {metadataVersionStr != null && metadataVersionStr.length > 0
                          ? `METADATA // v // ${metadataVersionStr}`
                          : "METADATA"}
                      </Typography>
                      {metadataChips.length > 0 ? (
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                          {metadataChips.map((m) => (
                            <DetailMetric
                              nh={nh}
                              key={m.label}
                              label={m.label}
                              value={m.value}
                              color="#d946ef"
                            />
                          ))}
                        </Box>
                      ) : null}
                    </Box>
                  ) : null}
                </>
              ) : null}
            </Box>

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
              {SORT_COLUMNS.map((col) => {
                const active = sortBy === col.key;
                return (
                  <Box
                    key={col.key}
                    component="button"
                    type="button"
                    onClick={() => requestSort(col.key)}
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
                    {active ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                  </Box>
                );
              })}
            </Box>

            {resultsLoading ? (
              <CircularProgress size={24} sx={{ color: nh.blue, mb: 1.5 }} />
            ) : null}

            <TablePagination
              component="div"
              count={resultsTotal}
              page={page}
              showFirstButton
              showLastButton
              onPageChange={(_, p) => setPage(p)}
              rowsPerPage={pageSize}
              onRowsPerPageChange={(e) => {
                setPageSize(parseInt(e.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[10, 25, 50, 100]}
              sx={{
                border: "0 !important",
                bgcolor: "transparent",
                mb: 1,
                color: nh.muted,
                "& .MuiIconButton-root": { color: nh.white },
                "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                  color: nh.muted,
                },
                "& .MuiSelect-select, & .MuiInputBase-input": { color: nh.white },
                "& .MuiOutlinedInput-notchedOutline": { borderColor: nh.border },
                "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255,255,255,0.35)",
                },
                "& .MuiTablePagination-toolbar": {
                  minHeight: isMobile ? 72 : 44,
                  px: 0,
                },
              }}
            />

            <Box sx={{ display: "grid", gap: 1.25 }}>
              {results.map((row) => (
                <Box
                  key={row.id}
                  sx={{
                    border: `1px solid ${nh.border}`,
                    borderRadius: 2,
                    bgcolor: nh.card,
                    p: { xs: 1.5, sm: 2 },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1.5,
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Typography sx={{ fontFamily: nh.mono, fontSize: "0.7rem", color: nh.blue }}>
                      POS {row.position_overall ?? row.result_status ?? "—"}
                    </Typography>
                    <Typography sx={{ fontFamily: nh.mono, fontSize: "0.7rem", color: nh.muted }}>
                      BIB {row.bib}
                    </Typography>
                    <Typography sx={{ fontFamily: nh.mono, fontSize: "0.7rem", color: nh.muted }}>
                      {row.gender || "—"}
                    </Typography>
                  </Box>

                  <MuiLink
                    component={RouterLink}
                    to={`/races/${race.id}/runners/${row.id}`}
                    underline="none"
                    sx={{
                      display: "inline-block",
                      color: nh.white,
                      fontFamily: nh.sans,
                      fontSize: { xs: "1rem", sm: "1.1rem" },
                      fontWeight: 700,
                      mb: 0.5,
                      "&:hover": { color: nh.blue },
                    }}
                  >
                    {formatEnglishRunnerName(row.name_en) || "—"}
                  </MuiLink>

                  {row.name_zh.trim() ? (
                    <Typography
                      sx={{ color: nh.muted, fontFamily: nh.sans, fontSize: "0.9rem", mb: 1 }}
                    >
                      {row.name_zh}
                    </Typography>
                  ) : null}

                  <Typography
                    sx={{ color: nh.muted, fontFamily: nh.mono, fontSize: "0.72rem", mb: 1.25 }}
                  >
                    {row.category || "—"}
                  </Typography>

                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    <DetailMetric
                      nh={nh}
                      label="OFFICIAL"
                      value={formatSeconds(row.official_time_seconds)}
                      color={nh.blue}
                    />
                    <DetailMetric
                      nh={nh}
                      label="NET"
                      value={
                        row.net_time_seconds == null ? "N/A" : formatSeconds(row.net_time_seconds)
                      }
                      color={nh.muted}
                    />
                    <Box
                      sx={{
                        px: 1.25,
                        py: 1,
                        borderRadius: 1.25,
                        bgcolor: "rgba(255,255,255,0.06)",
                        border: `1px solid ${nh.border}`,
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: nh.mono,
                          fontSize: "0.65rem",
                          color: nh.muted,
                          letterSpacing: "0.06em",
                        }}
                      >
                        O / G / CAT
                      </Typography>
                      <Typography sx={{ fontFamily: nh.sans, fontWeight: 700, color: nh.white }}>
                        {row.rank_overall ?? row.result_status ?? "—"} /{" "}
                        {row.position_gender ?? "—"} / {row.rank_category ?? "—"}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>

            <TablePagination
              component="div"
              count={resultsTotal}
              page={page}
              showFirstButton
              showLastButton
              onPageChange={(_, p) => setPage(p)}
              rowsPerPage={pageSize}
              onRowsPerPageChange={(e) => {
                setPageSize(parseInt(e.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[10, 25, 50, 100]}
              sx={{
                border: "0 !important",
                bgcolor: "transparent",
                mt: 1,
                color: nh.muted,
                "& .MuiIconButton-root": { color: nh.white },
                "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                  color: nh.muted,
                },
                "& .MuiSelect-select, & .MuiInputBase-input": { color: nh.white },
                "& .MuiOutlinedInput-notchedOutline": { borderColor: nh.border },
                "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255,255,255,0.35)",
                },
                "& .MuiTablePagination-toolbar": {
                  minHeight: isMobile ? 72 : 44,
                  px: 0,
                },
              }}
            />
          </>
        ) : null}
      </Box>
    </Box>
  );
}
