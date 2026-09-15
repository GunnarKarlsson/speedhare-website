import {
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRoadRaceStats, getSummaryStats } from "../api";
import { SeoHead } from "../components/SeoHead";
import { formatSeconds } from "../format";
import { racePath } from "../racePaths";
import type { FiveKStatsRow, HalfMarathonStatsRow, TenKStatsRow } from "../types";
import { NewHomeFooter } from "../new_home/NewHomeFooter";
import type { SiteAggregates } from "../new_home/newHomeData";
import { NewHomeNav } from "../new_home/NewHomeNav";
import { createNewHomeTheme } from "../new_home/newHomeTheme";
import { useThemeMode } from "../new_home/themeMode";

type StatsRaceType = "5k" | "10k" | "half";
type TableSortDirection = "asc" | "desc";
type StatsColumnKey =
  | "name"
  | "date"
  | "runnerCount"
  | "meanSeconds"
  | "medianSeconds"
  | "fastestSeconds"
  | "lt15"
  | "lt18"
  | "lt20"
  | "lt25"
  | "lt35"
  | "lt40"
  | "lt45"
  | "lt70"
  | "lt75"
  | "lt80"
  | "lt85"
  | "lt90"
  | "lt100";

interface StatsRow {
  id: number;
  slug: string;
  name: string;
  date: string;
  runnerCount: number | null;
  meanSeconds: number | null;
  medianSeconds: number | null;
  fastestSeconds: number | null;
  lt15: number | null;
  lt18: number | null;
  lt20: number | null;
  lt25: number | null;
  lt35: number | null;
  lt40: number | null;
  lt45: number | null;
  lt70: number | null;
  lt75: number | null;
  lt80: number | null;
  lt85: number | null;
  lt90: number | null;
  lt100: number | null;
}

interface StatsColumn {
  key: StatsColumnKey;
  label: string;
  align?: "left" | "right";
}

const TABLES: ReadonlyArray<{
  raceType: StatsRaceType;
  title: string;
  columns: readonly StatsColumn[];
}> = [
  {
    raceType: "5k",
    title: "5K",
    columns: [
      { key: "name", label: "Name" },
      { key: "date", label: "Date" },
      { key: "runnerCount", label: "Runner Count", align: "right" },
      { key: "meanSeconds", label: "Mean", align: "right" },
      { key: "medianSeconds", label: "Median", align: "right" },
      { key: "fastestSeconds", label: "Fastest", align: "right" },
      { key: "lt15", label: "< 15", align: "right" },
      { key: "lt18", label: "< 18", align: "right" },
      { key: "lt20", label: "< 20", align: "right" },
      { key: "lt25", label: "< 25", align: "right" },
    ],
  },
  {
    raceType: "10k",
    title: "10K",
    columns: [
      { key: "name", label: "Name" },
      { key: "date", label: "Date" },
      { key: "runnerCount", label: "Runner Count", align: "right" },
      { key: "meanSeconds", label: "Mean", align: "right" },
      { key: "medianSeconds", label: "Median", align: "right" },
      { key: "fastestSeconds", label: "Fastest", align: "right" },
      { key: "lt35", label: "< 35", align: "right" },
      { key: "lt40", label: "< 40", align: "right" },
      { key: "lt45", label: "< 45", align: "right" },
    ],
  },
  {
    raceType: "half",
    title: "Half Marathon",
    columns: [
      { key: "name", label: "Name" },
      { key: "date", label: "Date" },
      { key: "runnerCount", label: "Runner Count", align: "right" },
      { key: "meanSeconds", label: "Mean", align: "right" },
      { key: "medianSeconds", label: "Median", align: "right" },
      { key: "fastestSeconds", label: "Fastest", align: "right" },
      { key: "lt70", label: "< 1.10", align: "right" },
      { key: "lt75", label: "< 1.15", align: "right" },
      { key: "lt80", label: "< 1.20", align: "right" },
      { key: "lt85", label: "< 1.25", align: "right" },
      { key: "lt90", label: "< 1.30", align: "right" },
      { key: "lt100", label: "< 1.40", align: "right" },
    ],
  },
];

function mapFiveKRow(row: FiveKStatsRow): StatsRow {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    date: row.date,
    runnerCount: row.runner_count,
    meanSeconds: row.mean_seconds,
    medianSeconds: row.median_seconds,
    fastestSeconds: row.fastest_seconds,
    lt15: row.lt_15,
    lt18: row.lt_18,
    lt20: row.lt_20,
    lt25: row.lt_25,
    lt35: null,
    lt40: null,
    lt45: null,
    lt70: null,
    lt75: null,
    lt80: null,
    lt85: null,
    lt90: null,
    lt100: null,
  };
}

function mapTenKRow(row: TenKStatsRow): StatsRow {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    date: row.date,
    runnerCount: row.runner_count,
    meanSeconds: row.mean_seconds,
    medianSeconds: row.median_seconds,
    fastestSeconds: row.fastest_seconds,
    lt15: null,
    lt18: null,
    lt20: null,
    lt25: null,
    lt35: row.lt_35,
    lt40: row.lt_40,
    lt45: row.lt_45,
    lt70: null,
    lt75: null,
    lt80: null,
    lt85: null,
    lt90: null,
    lt100: null,
  };
}

function mapHalfMarathonRow(row: HalfMarathonStatsRow): StatsRow {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    date: row.date,
    runnerCount: row.runner_count,
    meanSeconds: row.mean_seconds,
    medianSeconds: row.median_seconds,
    fastestSeconds: row.fastest_seconds,
    lt15: null,
    lt18: null,
    lt20: null,
    lt25: null,
    lt35: null,
    lt40: null,
    lt45: null,
    lt70: row.lt_1_10,
    lt75: row.lt_1_15,
    lt80: row.lt_1_20,
    lt85: row.lt_1_25,
    lt90: row.lt_1_30,
    lt100: row.lt_1_40,
  };
}

function defaultSorts(): Record<
  StatsRaceType,
  { key: StatsColumnKey; direction: TableSortDirection }
> {
  return {
    "5k": { key: "date", direction: "desc" },
    "10k": { key: "date", direction: "desc" },
    half: { key: "date", direction: "desc" },
  };
}

function formatCount(value: number | null): string {
  return value == null ? "—" : value.toLocaleString();
}

function formatWholeSeconds(value: number | null): string {
  return value == null ? "—" : formatSeconds(Math.round(value));
}

function getSortValue(row: StatsRow, key: StatsColumnKey): string | number | null {
  return row[key];
}

function compareValues(
  left: string | number | null,
  right: string | number | null,
  direction: TableSortDirection,
): number {
  if (left == null && right == null) return 0;
  if (left == null) return 1;
  if (right == null) return -1;

  const factor = direction === "asc" ? 1 : -1;
  if (typeof left === "string" && typeof right === "string") {
    return left.localeCompare(right) * factor;
  }
  return ((left as number) - (right as number)) * factor;
}

function renderCell(row: StatsRow, key: StatsColumnKey): string {
  switch (key) {
    case "name":
    case "date":
      return String(row[key]);
    case "runnerCount":
    case "lt15":
    case "lt18":
    case "lt20":
    case "lt25":
    case "lt35":
    case "lt40":
    case "lt45":
    case "lt70":
    case "lt75":
    case "lt80":
    case "lt85":
    case "lt90":
    case "lt100":
      return formatCount(row[key]);
    case "meanSeconds":
      return formatWholeSeconds(row[key]);
    case "medianSeconds":
    case "fastestSeconds":
      return formatWholeSeconds(row[key]);
  }
}

export function StatsPage() {
  const navigate = useNavigate();
  const { mode } = useThemeMode();
  const nh = createNewHomeTheme(mode);
  const [site, setSite] = useState<SiteAggregates | null>(null);
  const [rowsByType, setRowsByType] = useState<Record<StatsRaceType, StatsRow[]>>({
    "5k": [],
    "10k": [],
    half: [],
  });
  const [sortByType, setSortByType] = useState(defaultSorts);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        setLoading(true);
        setError(null);

        const [siteAggregates, stats] = await Promise.all([getSummaryStats(), getRoadRaceStats()]);

        if (!cancelled) {
          setSite(siteAggregates);
          setRowsByType({
            "5k": stats.five_k.map(mapFiveKRow),
            "10k": stats.ten_k.map(mapTenKRow),
            half: stats.half_marathon.map(mapHalfMarathonRow),
          });
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load stats");
          setSite(null);
          setRowsByType({
            "5k": [],
            "10k": [],
            half: [],
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const sortedRowsByType = useMemo(() => {
    const next = {} as Record<StatsRaceType, StatsRow[]>;

    (["5k", "10k", "half"] as const).forEach((raceType) => {
      const sort = sortByType[raceType];
      next[raceType] = [...rowsByType[raceType]].sort((left, right) =>
        compareValues(getSortValue(left, sort.key), getSortValue(right, sort.key), sort.direction),
      );
    });

    return next;
  }, [rowsByType, sortByType]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: nh.bg,
        color: nh.white,
        fontFamily: nh.sans,
        "& .MuiTypography-root": { fontFamily: "inherit" },
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden",
      }}
    >
      <SeoHead
        title="Stats | speedhare"
        description="Sortable race statistics tables for 5K, 10K, and half marathon events on Speedhare."
        canonicalPath="/hong-kong-road-race-stats-5k-10k-half-marathon"
      />
      <NewHomeNav activeDistance="all" navContext="stats" />

      <Box
        sx={{
          flex: 1,
          maxWidth: 1280,
          width: "100%",
          minWidth: 0,
          mx: "auto",
          px: { xs: 2, sm: 3 },
          py: { xs: 3, sm: 4 },
          overflowX: "hidden",
        }}
      >
        <Typography
          sx={{
            fontFamily: nh.mono,
            fontSize: "0.72rem",
            letterSpacing: "0.14em",
            color: nh.blue,
            mb: 0.75,
          }}
        >
          STATS
        </Typography>
        <Typography
          component="h1"
          sx={{ fontWeight: 800, fontSize: { xs: "2rem", sm: "2.75rem" }, mb: 1.5 }}
        >
          Race Stats
        </Typography>
        <Typography sx={{ color: nh.muted, lineHeight: 1.8, maxWidth: 900, mb: 4 }}>
          Top line data from alll races. Click a table column header to sort
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
            <CircularProgress sx={{ color: nh.blue }} />
          </Box>
        ) : error ? (
          <Typography sx={{ color: "#f87171" }}>{error}</Typography>
        ) : (
          <Box sx={{ display: "grid", gap: 4, minWidth: 0 }}>
            {TABLES.map((table) => {
              const sort = sortByType[table.raceType];
              const rows = sortedRowsByType[table.raceType];

              return (
                <Box key={table.raceType} sx={{ minWidth: 0 }}>
                  <Typography
                    component="h2"
                    sx={{ fontWeight: 800, fontSize: { xs: "1.35rem", sm: "1.65rem" }, mb: 1.5 }}
                  >
                    {table.title}
                  </Typography>
                  <Paper
                    elevation={0}
                    sx={{
                      width: "100%",
                      maxWidth: "100%",
                      minWidth: 0,
                      bgcolor: nh.card,
                      border: `1px solid ${nh.border}`,
                      borderRadius: 2,
                      overflow: "hidden",
                    }}
                  >
                    <TableContainer
                      sx={{
                        width: "100%",
                        maxWidth: "100%",
                        minWidth: 0,
                        overflowX: "auto",
                        overflowY: "hidden",
                        WebkitOverflowScrolling: "touch",
                      }}
                    >
                      <Table
                        size="small"
                        sx={{
                          minWidth: { xs: 860, sm: 980 },
                          tableLayout: "auto",
                        }}
                      >
                        <TableHead>
                          <TableRow>
                            {table.columns.map((column) => (
                              <TableCell
                                key={column.key}
                                align={column.align ?? "left"}
                                sx={{
                                  bgcolor: nh.card,
                                  borderBottom: `1px solid ${nh.border}`,
                                  color: nh.muted,
                                  fontFamily: nh.mono,
                                  fontSize: { xs: "0.64rem", sm: "0.72rem" },
                                  letterSpacing: "0.08em",
                                  whiteSpace: "nowrap",
                                  px: { xs: 1, sm: 2 },
                                }}
                              >
                                <TableSortLabel
                                  active={sort.key === column.key}
                                  direction={sort.key === column.key ? sort.direction : "asc"}
                                  onClick={() => {
                                    setSortByType((current) => {
                                      const existing = current[table.raceType];
                                      return {
                                        ...current,
                                        [table.raceType]: {
                                          key: column.key,
                                          direction:
                                            existing.key === column.key &&
                                            existing.direction === "asc"
                                              ? "desc"
                                              : "asc",
                                        },
                                      };
                                    });
                                  }}
                                  sx={{
                                    color: `${sort.key === column.key ? nh.white : nh.muted} !important`,
                                    "& .MuiTableSortLabel-icon": {
                                      color: `${nh.white} !important`,
                                    },
                                    "& .MuiTableSortLabel-iconDirectionAsc, & .MuiTableSortLabel-iconDirectionDesc":
                                      {
                                        ml: 0.25,
                                      },
                                  }}
                                >
                                  {column.label}
                                </TableSortLabel>
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {rows.map((row) => (
                            <TableRow
                              key={row.id}
                              hover
                              onClick={() => navigate(racePath(row.slug))}
                              sx={{
                                cursor: "pointer",
                                "&:hover": { bgcolor: "rgba(255,255,255,0.03)" },
                                "& td": {
                                  borderBottom: `1px solid ${nh.border}`,
                                },
                              }}
                            >
                              {table.columns.map((column) => (
                                <TableCell
                                  key={column.key}
                                  align={column.align ?? "left"}
                                  sx={{
                                    color: nh.white,
                                    whiteSpace: column.key === "name" ? "normal" : "nowrap",
                                    fontSize: { xs: "0.78rem", sm: "0.875rem" },
                                    lineHeight: 1.35,
                                    px: { xs: 1, sm: 2 },
                                    minWidth: column.key === "name" ? 220 : undefined,
                                  }}
                                >
                                  {renderCell(row, column.key)}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                          {rows.length === 0 ? (
                            <TableRow>
                              <TableCell
                                colSpan={table.columns.length}
                                sx={{ color: nh.muted, py: 3 }}
                              >
                                No races available.
                              </TableCell>
                            </TableRow>
                          ) : null}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>

      {site ? (
        <NewHomeFooter site={site} hasRaceData={site.totalRaces > 0} />
      ) : (
        <Box sx={{ py: 3, borderTop: `1px solid ${nh.border}` }} />
      )}
    </Box>
  );
}
