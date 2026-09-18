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
import { getRoadRaceStats, isAbortError } from "../api";
import { loadSiteSummary } from "../catalog";
import { SeoHead } from "../components/SeoHead";
import { racePath } from "../racePaths";
import { HomeFooter } from "../home/HomeFooter";
import { HomeNav } from "../home/HomeNav";
import { createHomeTheme } from "../home/homeTheme";
import { useThemeMode } from "../home/themeMode";
import type { SiteAggregates } from "../types";
import {
  STATS_TABLES,
  compareStatsValues,
  defaultStatsSorts,
  mapFiveKRow,
  mapHalfMarathonRow,
  mapTenKRow,
  renderStatsCell,
  type StatsColumnKey,
  type StatsRaceType,
  type StatsRow,
  type TableSortDirection,
} from "./stats/statsTable";

export function StatsPage() {
  const navigate = useNavigate();
  const { mode } = useThemeMode();
  const nh = createHomeTheme(mode);
  const [site, setSite] = useState<SiteAggregates | null>(null);
  const [rowsByType, setRowsByType] = useState<Record<StatsRaceType, StatsRow[]>>({
    "5k": [],
    "10k": [],
    half: [],
  });
  const [sortByType, setSortByType] = useState(defaultStatsSorts);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ac = new AbortController();

    void (async () => {
      try {
        setLoading(true);
        setError(null);

        const [siteAggregates, stats] = await Promise.all([
          loadSiteSummary(ac.signal),
          getRoadRaceStats(ac.signal),
        ]);

        if (!ac.signal.aborted) {
          setSite(siteAggregates);
          setRowsByType({
            "5k": stats.five_k.map(mapFiveKRow),
            "10k": stats.ten_k.map(mapTenKRow),
            half: stats.half_marathon.map(mapHalfMarathonRow),
          });
        }
      } catch (e) {
        if (isAbortError(e) || ac.signal.aborted) return;
        setError(e instanceof Error ? e.message : "Failed to load stats");
        setSite(null);
        setRowsByType({
          "5k": [],
          "10k": [],
          half: [],
        });
      } finally {
        if (!ac.signal.aborted) setLoading(false);
      }
    })();

    return () => {
      ac.abort();
    };
  }, []);

  const sortedRowsByType = useMemo(() => {
    const next = {} as Record<StatsRaceType, StatsRow[]>;

    (["5k", "10k", "half"] as const).forEach((raceType) => {
      const sort = sortByType[raceType];
      next[raceType] = [...rowsByType[raceType]].sort((left, right) =>
        compareStatsValues(left[sort.key], right[sort.key], sort.direction),
      );
    });

    return next;
  }, [rowsByType, sortByType]);

  const toggleSort = (raceType: StatsRaceType, key: StatsColumnKey) => {
    setSortByType((current) => {
      const existing = current[raceType];
      const direction: TableSortDirection =
        existing.key === key && existing.direction === "asc" ? "desc" : "asc";
      return { ...current, [raceType]: { key, direction } };
    });
  };

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
      <HomeNav activeDistance="all" navContext="stats" />

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
            {STATS_TABLES.map((table) => {
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
                                  onClick={() => toggleSort(table.raceType, column.key)}
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
                                  {renderStatsCell(row, column.key)}
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
        <HomeFooter site={site} hasRaceData={site.totalRaces > 0} />
      ) : (
        <Box sx={{ py: 3, borderTop: `1px solid ${nh.border}` }} />
      )}
    </Box>
  );
}
