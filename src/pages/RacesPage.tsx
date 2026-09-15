import {
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Fragment, useCallback, useEffect, useState } from "react";
import { getRaces } from "../api";
import { formatRaceType } from "../format";
import { raceListExtras } from "../raceListExtras";
import { racePath } from "../racePaths";
import { SeoHead } from "../components/SeoHead";
import { createNewHomeTheme, type NewHomeTheme } from "../new_home/newHomeTheme";
import { useThemeMode } from "../new_home/themeMode";
import type { RaceListItem } from "../types";

function tablePaginationSx(
  nh: NewHomeTheme,
  isDark: boolean,
  isMobile: boolean,
  options?: { marginBottom?: number },
): object {
  const bg = isDark ? nh.bg : "#fff";
  const cellBorder = isDark ? `${nh.bg} !important` : "#fff !important";
  return {
    border: "0 !important",
    borderTop: "0 !important",
    borderBottom: "0 !important",
    bgcolor: bg,
    ...(options?.marginBottom != null ? { mb: options.marginBottom } : {}),
    boxShadow: "none",
    color: isDark ? nh.muted : undefined,
    "&::before, &::after": { display: "none" },
    "&.MuiTablePagination-root": {
      border: "0 !important",
      borderTop: "0 !important",
      borderBottom: "0 !important",
    },
    "&.MuiTableCell-root": {
      borderColor: cellBorder,
      borderBottom: "0 !important",
      backgroundColor: `${bg} !important`,
    },
    "& .MuiToolbar-root": { border: "0 !important" },
    ...(isDark
      ? {
          "& .MuiIconButton-root": { color: nh.white },
          "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": { color: `${nh.muted}` },
          "& .MuiSelect-select, & .MuiNativeSelect-select, & .MuiInputBase-input": { color: nh.white },
          "& .MuiOutlinedInput-notchedOutline": { borderColor: nh.border },
          "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(255,255,255,0.35)",
          },
        }
      : {}),
    "& .MuiTablePagination-toolbar": {
      minHeight: isMobile ? 72 : 44,
      px: 0,
      ...(isMobile
        ? {
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gridTemplateRows: "auto auto",
            alignItems: "center",
            rowGap: 0.5,
          }
        : {
            display: "flex",
            flexWrap: "nowrap",
          }),
    },
    "& .MuiTablePagination-spacer": {
      display: isMobile ? "none" : "block",
    },
    "& .MuiTablePagination-selectLabel": {
      margin: isMobile ? "0 8px 0 0" : undefined,
      ...(isMobile ? { gridColumn: "1", gridRow: "1" } : {}),
    },
    "& .MuiTablePagination-input": {
      marginRight: isMobile ? 0 : undefined,
      ...(isMobile ? { gridColumn: "2", gridRow: "1", justifySelf: "end" } : {}),
    },
    "& .MuiTablePagination-displayedRows": {
      width: "auto",
      margin: isMobile ? "0" : undefined,
      border: "0 !important",
      ...(isMobile ? { gridColumn: "1", gridRow: "2" } : {}),
    },
    "& .MuiTablePagination-actions": {
      width: "auto",
      display: "flex",
      justifyContent: "flex-start",
      marginLeft: isMobile ? 0 : undefined,
      ...(isMobile ? { gridColumn: "2", gridRow: "2", justifySelf: "end" } : {}),
    },
  };
}

function MetricTag({
  label,
  value,
  color,
  darkTextColor,
  isDark,
}: {
  label: string;
  value: string;
  color: string;
  darkTextColor: string;
  isDark?: boolean;
}) {
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "stretch",
        border: "1px solid",
        borderColor: color,
        borderRadius: 1,
        overflow: "hidden",
        bgcolor: isDark ? "rgba(0,0,0,0.2)" : "#fff",
      }}
    >
      <Box
        sx={{
          px: 1,
          py: 0.25,
          bgcolor: color,
          color: "#fff",
          fontSize: "0.75rem",
          fontWeight: 600,
          lineHeight: 1.6,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </Box>
      <Box
        sx={{
          px: 1,
          py: 0.25,
          borderLeft: "1px solid",
          borderColor: color,
          color: isDark ? darkTextColor : "#000",
          fontSize: "0.75rem",
          lineHeight: 1.6,
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </Box>
    </Box>
  );
}

export interface RacesPageProps {
  /** Dark shell (new home look) when used on `/all-races` outside Layout. */
  visualVariant?: "light" | "dark";
}

export function RacesPage({ visualVariant = "light" }: RacesPageProps) {
  const { mode } = useThemeMode();
  const nh = createNewHomeTheme(mode);
  const isDark = visualVariant === "dark";
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const gridLine = isDark ? "rgba(255,255,255,0.14)" : "#000";
  const extraRowBg = isDark ? nh.card : "#fff";
  const [rows, setRows] = useState<RaceListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getRaces(page + 1, pageSize);
      setRows(data.items);
      setTotal(data.total);
    } catch {
      setRows([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <>
      <SeoHead
        title="All Races | speedhare"
        description="Browse Hong Kong road race results across 5K, 10K, half marathon, and marathon events."
        canonicalPath="/all-races"
      />
      <Typography
        variant="h5"
        component="h1"
        sx={{
          mb: 1,
          fontWeight: 700,
          fontFamily: isDark ? nh.sans : undefined,
          color: isDark ? nh.white : undefined,
        }}
      >
        All Races
      </Typography>
      {isDark ? (
        <Typography
          sx={{
            fontFamily: nh.mono,
            fontSize: "0.7rem",
            letterSpacing: "0.14em",
            color: nh.blue,
            mb: 0.5,
          }}
        >
          EVENTS
        </Typography>
      ) : null}
      <Typography
        color="text.secondary"
        sx={{
          mb: 2,
          fontFamily: isDark ? nh.sans : undefined,
          color: isDark ? nh.muted : undefined,
        }}
      >
        Results across 5K, 10K, half marathon, and marathon road races in Hong Kong.
      </Typography>
      {loading ? (
        <CircularProgress sx={isDark ? { color: nh.blue } : undefined} />
      ) : rows.length === 0 ? (
        <Typography sx={{ color: isDark ? nh.muted : "text.secondary" }}>No races available</Typography>
      ) : (
        <>
          <TablePagination
            component="div"
            count={total}
            page={page}
            showFirstButton
            showLastButton
            onPageChange={(_, p) => setPage(p)}
            rowsPerPage={pageSize}
            onRowsPerPageChange={(e) => {
              setPageSize(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[10, 20, 50]}
            sx={tablePaginationSx(nh, isDark, isMobile, { marginBottom: 1 })}
          />
          <Paper elevation={0} sx={{ boxShadow: "none", border: 0, bgcolor: "transparent" }}>
          <TableContainer sx={{ border: 0, bgcolor: "transparent" }}>
            <Table
              size="small"
              sx={{ borderCollapse: "separate", borderSpacing: 0, width: "100%", tableLayout: "fixed" }}
            >
              <TableHead sx={{ bgcolor: "transparent" }}>
                <TableRow>
                  <TableCell
                    sx={{
                      bgcolor: "transparent",
                      borderBottom: 0,
                      ...(isDark
                        ? {
                            color: nh.muted,
                            fontFamily: nh.mono,
                            fontSize: "0.7rem",
                            letterSpacing: "0.08em",
                          }
                        : {}),
                    }}
                  >
                    Date
                  </TableCell>
                  <TableCell
                    sx={{
                      bgcolor: "transparent",
                      borderBottom: 0,
                      ...(isDark
                        ? {
                            color: nh.muted,
                            fontFamily: nh.mono,
                            fontSize: "0.7rem",
                            letterSpacing: "0.08em",
                          }
                        : {}),
                    }}
                  >
                    Name
                  </TableCell>
                  <TableCell
                    sx={{
                      bgcolor: "transparent",
                      borderBottom: 0,
                      ...(isDark
                        ? {
                            color: nh.muted,
                            fontFamily: nh.mono,
                            fontSize: "0.7rem",
                            letterSpacing: "0.08em",
                          }
                        : {}),
                    }}
                  >
                    Type
                  </TableCell>
                  {!isMobile ? (
                    <TableCell
                      sx={{
                        bgcolor: "transparent",
                        borderBottom: 0,
                        ...(isDark
                          ? {
                              color: nh.muted,
                              fontFamily: nh.mono,
                              fontSize: "0.7rem",
                              letterSpacing: "0.08em",
                            }
                          : {}),
                      }}
                    >
                      Location
                    </TableCell>
                  ) : null}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((r, idx) => {
                  const extra = raceListExtras(r.aggregates, r.metadata);
                  const hasExtra =
                    extra.summaryMetrics.length > 0 ||
                    extra.thresholdMetrics.length > 0 ||
                    extra.metadataMetrics.length > 0;
                  return (
                    <Fragment key={r.id}>
                      <TableRow
                        hover
                        onClick={() => navigate(racePath(r.slug))}
                        sx={{
                          cursor: "pointer",
                          ...(isDark ? { "&:hover": { bgcolor: "rgba(255,255,255,0.04)" } } : {}),
                        }}
                      >
                        <TableCell
                          sx={{
                            borderTop: "1px solid",
                            borderLeft: "1px solid",
                            borderColor: gridLine,
                            borderTopLeftRadius: 6,
                            borderBottom: hasExtra ? "none" : `1px solid ${gridLine}`,
                            ...(hasExtra ? {} : { borderBottomLeftRadius: 6 }),
                            color: isDark ? nh.white : undefined,
                            fontFamily: isDark ? nh.sans : undefined,
                          }}
                        >
                          {r.date}
                        </TableCell>
                        <TableCell
                          sx={{
                            borderTop: "1px solid",
                            borderColor: gridLine,
                            borderBottom: hasExtra ? "none" : `1px solid ${gridLine}`,
                            wordBreak: "break-word",
                            color: isDark ? nh.white : undefined,
                            fontFamily: isDark ? nh.sans : undefined,
                          }}
                        >
                          {r.name}
                        </TableCell>
                        <TableCell
                          sx={{
                            borderTop: "1px solid",
                            borderColor: gridLine,
                            borderBottom: hasExtra ? "none" : `1px solid ${gridLine}`,
                            ...(isMobile ? { borderRight: "1px solid", borderTopRightRadius: 6 } : {}),
                            ...(!hasExtra && isMobile ? { borderBottomRightRadius: 6 } : {}),
                            whiteSpace: "normal",
                            overflowWrap: "anywhere",
                            wordBreak: "break-word",
                            color: isDark ? nh.white : undefined,
                            fontFamily: isDark ? nh.sans : undefined,
                          }}
                        >
                          {formatRaceType(r.race_type)}
                        </TableCell>
                        {!isMobile ? (
                          <TableCell
                            sx={{
                              borderTop: "1px solid",
                              borderRight: "1px solid",
                              borderColor: gridLine,
                              borderTopRightRadius: 6,
                              borderBottom: hasExtra ? "none" : `1px solid ${gridLine}`,
                              wordBreak: "break-word",
                              ...(hasExtra ? {} : { borderBottomRightRadius: 6 }),
                              color: isDark ? nh.muted : undefined,
                              fontFamily: isDark ? nh.sans : undefined,
                            }}
                          >
                            {r.location ?? "—"}
                          </TableCell>
                        ) : null}
                      </TableRow>
                      {hasExtra ? (
                        <TableRow
                          onClick={() => navigate(racePath(r.slug))}
                          sx={{
                            cursor: "pointer",
                            ...(isDark ? { "&:hover": { bgcolor: "rgba(255,255,255,0.04)" } } : {}),
                          }}
                        >
                          <TableCell
                            colSpan={isMobile ? 3 : 4}
                            sx={{
                              borderLeft: "1px solid",
                              borderRight: "1px solid",
                              borderBottom: "1px solid",
                              borderColor: gridLine,
                              borderBottomLeftRadius: 6,
                              borderBottomRightRadius: 6,
                              py: 1,
                              bgcolor: extraRowBg,
                            }}
                          >
                            {extra.summaryMetrics.length > 0 ? (
                              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                                {extra.summaryMetrics.map((m) => (
                                  <MetricTag
                                    key={`summary-${m.label}`}
                                    label={m.label}
                                    value={m.value}
                                    darkTextColor={nh.white}
                                    isDark={isDark}
                                    color={
                                      m.label.startsWith("Top ")
                                        ? isDark
                                          ? nh.blue
                                          : "#007FFF"
                                        : m.label === "Finishers" ||
                                            m.label === "Mean" ||
                                            m.label === "Median"
                                          ? isDark
                                            ? "#22c55e"
                                            : "#2E7D32"
                                          : "#9E9E9E"
                                    }
                                  />
                                ))}
                              </Box>
                            ) : null}
                            {extra.thresholdMetrics.length > 0 ? (
                              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mt: 0.75 }}>
                                {extra.thresholdMetrics.map((m) => (
                                  <MetricTag
                                    key={`threshold-${m.label}`}
                                    label={m.label}
                                    value={m.value}
                                    darkTextColor={nh.white}
                                    isDark={isDark}
                                    color="#9E9E9E"
                                  />
                                ))}
                              </Box>
                            ) : null}
                            {extra.metadataMetrics.length > 0 ? (
                              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mt: 0.75 }}>
                                {extra.metadataMetrics.map((m) => (
                                  <Box
                                    key={`meta-${m.label}`}
                                    sx={{
                                      display: "inline-flex",
                                      alignItems: "stretch",
                                      border: "1px solid",
                                      borderColor: "#9C27B0",
                                      borderRadius: 1,
                                      overflow: "hidden",
                                      bgcolor: isDark ? nh.card : "#fff",
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        px: 1,
                                        py: 0.25,
                                        bgcolor: "#9C27B0",
                                        color: "#fff",
                                        fontSize: "0.75rem",
                                        fontWeight: 600,
                                        lineHeight: 1.6,
                                      }}
                                    >
                                      {m.label}
                                    </Box>
                                    <Box
                                      sx={{
                                        px: 1,
                                        py: 0.25,
                                        borderLeft: "1px solid",
                                        borderColor: "#9C27B0",
                                        color: isDark ? nh.white : "#000",
                                        fontSize: "0.75rem",
                                        lineHeight: 1.6,
                                      }}
                                    >
                                      {m.value}
                                    </Box>
                                  </Box>
                                ))}
                              </Box>
                            ) : null}
                          </TableCell>
                        </TableRow>
                      ) : null}
                      {idx < rows.length - 1 ? (
                        <TableRow>
                          <TableCell colSpan={isMobile ? 3 : 4} sx={{ border: 0, p: 0, height: 10 }} />
                        </TableRow>
                      ) : null}
                    </Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={total}
            page={page}
            showFirstButton
            showLastButton
            onPageChange={(_, p) => setPage(p)}
            rowsPerPage={pageSize}
            onRowsPerPageChange={(e) => {
              setPageSize(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[10, 20, 50]}
            sx={tablePaginationSx(nh, isDark, isMobile)}
          />
          </Paper>
        </>
      )}
    </>
  );
}
