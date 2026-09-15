import { Alert, Box, CircularProgress, Link as MuiLink, Typography } from "@mui/material";
import { Link as RouterLink, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getRace, getRunnerDetail, isAbortError, searchRacesByRunner } from "../api";
import { LabeledMetricBox } from "../components/LabeledMetricBox";
import { SeoHead } from "../components/SeoHead";
import { formatEnglishRunnerName, formatRunnerNames, formatSeconds } from "../format";
import { useSiteCatalog } from "../hooks/useSiteCatalog";
import { NewHomeFooter } from "../new_home/NewHomeFooter";
import { NewHomeNav } from "../new_home/NewHomeNav";
import { createNewHomeTheme } from "../new_home/newHomeTheme";
import { racePath } from "../racePaths";
import { useThemeMode } from "../new_home/themeMode";
import type { RaceDetail, RunnerDetailResponse, SearchRunnerItem } from "../types";

export function RunnerPage() {
  const { mode } = useThemeMode();
  const nh = createNewHomeTheme(mode);
  const { raceId, resultId } = useParams<{ raceId: string; resultId: string }>();
  const rId = raceId ? parseInt(raceId, 10) : NaN;
  const resId = resultId ? parseInt(resultId, 10) : NaN;

  const [data, setData] = useState<RunnerDetailResponse | null>(null);
  const [race, setRace] = useState<RaceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [otherRaceRows, setOtherRaceRows] = useState<SearchRunnerItem[]>([]);
  const [otherRacesLoading, setOtherRacesLoading] = useState(false);
  const { site, hasRaceCatalog } = useSiteCatalog();

  useEffect(() => {
    if (!Number.isFinite(rId) || !Number.isFinite(resId)) {
      setError("Invalid URL");
      setLoading(false);
      return;
    }
    const ac = new AbortController();
    void (async () => {
      setLoading(true);
      setError(null);
      setRace(null);
      try {
        const [d, r] = await Promise.all([
          getRunnerDetail(rId, resId, ac.signal),
          getRace(rId, ac.signal),
        ]);
        if (ac.signal.aborted) return;
        setData(d);
        setRace(r);
      } catch (e) {
        if (isAbortError(e)) return;
        setError(e instanceof Error ? e.message : "Failed to load runner");
      } finally {
        if (!ac.signal.aborted) setLoading(false);
      }
    })();
    return () => {
      ac.abort();
    };
  }, [rId, resId]);

  useEffect(() => {
    if (!data) return;
    const ac = new AbortController();
    void (async () => {
      setOtherRacesLoading(true);
      try {
        const q = data.runner.name_en.trim() || data.runner.name_zh.trim();
        const search = await searchRacesByRunner(q, ac.signal);
        if (ac.signal.aborted) return;
        setOtherRaceRows(
          search.runners.filter((row) => !(row.race_id === rId && row.result_id === resId)),
        );
      } catch (e) {
        if (isAbortError(e)) return;
        setOtherRaceRows([]);
      } finally {
        if (!ac.signal.aborted) setOtherRacesLoading(false);
      }
    })();
    return () => {
      ac.abort();
    };
  }, [data, rId, resId]);

  const invalidIds = !Number.isFinite(rId) || !Number.isFinite(resId);
  const displayName = data ? formatRunnerNames(data.runner) : "";
  const seoTitle = invalidIds
    ? "Runner | speedhare"
    : loading || !data
      ? "Runner result | speedhare"
      : `${displayName} result | speedhare`;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: nh.bg,
        color: nh.white,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <SeoHead
        title={seoTitle}
        description="Individual runner result details for a Hong Kong road race."
        canonicalPath={invalidIds ? undefined : `/races/${rId}/runners/${resId}`}
        robots="noindex,follow"
      />
      <NewHomeNav activeDistance="all" navContext="all-races" />
      <Box sx={{ flex: 1, maxWidth: 800, width: "100%", mx: "auto", px: { xs: 2, sm: 3 }, py: 3 }}>
        {invalidIds ? (
          <Alert severity="error">Invalid race or runner id</Alert>
        ) : loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : !data ? null : (
          <RunnerDetailBody
            nh={nh}
            data={data}
            race={race}
            otherRaceRows={otherRaceRows}
            otherRacesLoading={otherRacesLoading}
          />
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

function RunnerDetailBody({
  nh,
  data,
  race,
  otherRaceRows,
  otherRacesLoading,
}: {
  nh: ReturnType<typeof createNewHomeTheme>;
  data: RunnerDetailResponse;
  race: RaceDetail | null;
  otherRaceRows: SearchRunnerItem[];
  otherRacesLoading: boolean;
}) {
  const { runner, stats } = data;
  const displayEnglishName = formatEnglishRunnerName(runner.name_en);
  const pct = (n: number | null) => (n == null ? "—" : `${n}%`);
  const topPct = (n: number | null) => (n == null ? "—" : `${(100 - n).toFixed(2)}%`);
  const rankWithCohort = (rank: number | null, cohort: number | null) =>
    rank == null || cohort == null ? "—" : `${rank}/${cohort}`;
  const statRowSx = {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 1,
    width: "100%",
  } as const;

  return (
    <>
      <MuiLink
        component={RouterLink}
        to={race ? racePath(race.slug) : `/races/${runner.race_id}`}
        underline="none"
        sx={{
          display: "inline-flex",
          alignItems: "center",
          mb: 2,
          color: nh.muted,
          fontFamily: nh.mono,
          fontSize: "0.72rem",
          letterSpacing: "0.08em",
          "&:hover": { color: nh.white },
        }}
      >
        ← BACK TO RACE
      </MuiLink>

      <Box
        sx={{
          border: `1px solid ${nh.border}`,
          borderRadius: 2,
          bgcolor: nh.card,
          p: { xs: 2, sm: 2.5 },
          mb: 2,
        }}
      >
        <Typography
          sx={{
            fontFamily: nh.mono,
            fontSize: "0.65rem",
            color: nh.blue,
            letterSpacing: "0.08em",
            mb: 0.75,
          }}
        >
          RUNNER DETAILS
        </Typography>
        <Typography
          component="h1"
          sx={{
            fontFamily: nh.sans,
            fontWeight: 800,
            fontSize: { xs: "1.3rem", sm: "1.8rem" },
            mb: 0.5,
          }}
        >
          {displayEnglishName || runner.name_zh.trim() || "—"}
        </Typography>
        {runner.name_zh.trim() ? (
          <Typography sx={{ fontFamily: nh.sans, color: nh.muted, fontSize: "1.05rem", mb: 1 }}>
            {runner.name_zh}
          </Typography>
        ) : null}
        <Typography sx={{ fontFamily: nh.mono, color: nh.muted, fontSize: "0.72rem", mb: 1.25 }}>
          BIB {runner.bib}
          {runner.gender ? ` // ${runner.gender}` : ""} {"//"} {runner.category}
        </Typography>
        {race ? (
          <MuiLink
            component={RouterLink}
            to={racePath(race.slug)}
            underline="hover"
            sx={{ color: nh.muted, fontFamily: nh.sans }}
          >
            {race.name}
          </MuiLink>
        ) : null}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
            gap: 1,
            mt: 2,
          }}
        >
          <LabeledMetricBox
            nh={nh}
            label="POSITION"
            value={String(runner.position_overall ?? runner.result_status ?? "—")}
          />
          <LabeledMetricBox
            nh={nh}
            label="OFFICIAL"
            value={formatSeconds(runner.official_time_seconds)}
          />
          <LabeledMetricBox
            nh={nh}
            label="NET"
            value={runner.net_time_seconds == null ? "N/A" : formatSeconds(runner.net_time_seconds)}
          />
        </Box>

        <Box sx={{ mt: 1.5 }}>
          <Typography
            sx={{
              fontFamily: nh.mono,
              fontSize: "0.65rem",
              color: nh.muted,
              letterSpacing: "0.08em",
              mb: 0.75,
            }}
          >
            RANKS
          </Typography>
          <Box sx={statRowSx}>
            <LabeledMetricBox
              nh={nh}
              label="OVERALL"
              value={rankWithCohort(runner.rank_overall, stats.cohort_size_overall)}
            />
            <LabeledMetricBox
              nh={nh}
              label="GENDER"
              value={rankWithCohort(runner.position_gender, stats.cohort_size_gender)}
            />
            <LabeledMetricBox
              nh={nh}
              label="CATEGORY"
              value={rankWithCohort(runner.rank_category, stats.cohort_size_category)}
            />
          </Box>
        </Box>

        <Box sx={{ mt: 1.5 }}>
          <Typography
            sx={{
              fontFamily: nh.mono,
              fontSize: "0.65rem",
              color: nh.muted,
              letterSpacing: "0.08em",
              mb: 0.75,
            }}
          >
            TOP
          </Typography>
          <Box sx={statRowSx}>
            <LabeledMetricBox
              nh={nh}
              label="OVERALL"
              value={topPct(stats.faster_than_pct_overall)}
              color={nh.muted}
            />
            <LabeledMetricBox
              nh={nh}
              label="GENDER"
              value={topPct(stats.faster_than_pct_gender)}
              color={nh.muted}
            />
            <LabeledMetricBox
              nh={nh}
              label="CATEGORY"
              value={topPct(stats.faster_than_pct_category)}
              color={nh.muted}
            />
          </Box>
        </Box>

        <Box sx={{ mt: 1.5 }}>
          <Typography
            sx={{
              fontFamily: nh.mono,
              fontSize: "0.65rem",
              color: nh.muted,
              letterSpacing: "0.08em",
              mb: 0.75,
            }}
          >
            FASTER THAN
          </Typography>
          <Box sx={statRowSx}>
            <LabeledMetricBox
              nh={nh}
              label="OVERALL"
              value={pct(stats.faster_than_pct_overall)}
              color={nh.muted}
            />
            <LabeledMetricBox
              nh={nh}
              label="GENDER"
              value={pct(stats.faster_than_pct_gender)}
              color={nh.muted}
            />
            <LabeledMetricBox
              nh={nh}
              label="CATEGORY"
              value={pct(stats.faster_than_pct_category)}
              color={nh.muted}
            />
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          border: `1px solid ${nh.border}`,
          borderRadius: 2,
          bgcolor: nh.card,
          p: { xs: 2, sm: 2.5 },
        }}
      >
        <Typography
          sx={{
            fontFamily: nh.mono,
            fontSize: "0.65rem",
            color: nh.blue,
            letterSpacing: "0.08em",
            mb: 1,
          }}
        >
          OTHER RACES
        </Typography>
        {otherRacesLoading ? (
          <CircularProgress size={20} sx={{ color: nh.blue }} />
        ) : otherRaceRows.length === 0 ? (
          <Typography sx={{ color: nh.muted }}>
            No other race results found for this runner.
          </Typography>
        ) : (
          <Box sx={{ display: "grid", gap: 1 }}>
            {otherRaceRows.map((row) => (
              <Box
                key={row.result_id}
                sx={{
                  border: `1px solid ${nh.border}`,
                  borderRadius: 1.5,
                  p: 1.25,
                  bgcolor: "rgba(255,255,255,0.03)",
                }}
              >
                <MuiLink
                  component={RouterLink}
                  to={`/races/${row.race_id}/runners/${row.result_id}`}
                  underline="none"
                  sx={{
                    color: nh.white,
                    fontFamily: nh.sans,
                    fontWeight: 700,
                    "&:hover": { color: nh.blue },
                  }}
                >
                  {formatRunnerNames(row)}
                </MuiLink>
                <Box sx={{ mt: 0.5 }}>
                  <MuiLink
                    component={RouterLink}
                    to={racePath(row.race_slug)}
                    underline="hover"
                    sx={{ color: nh.muted, fontFamily: nh.sans }}
                  >
                    {row.race_name}
                  </MuiLink>
                </Box>
                <Typography
                  sx={{ mt: 0.6, color: nh.muted, fontFamily: nh.mono, fontSize: "0.7rem" }}
                >
                  OFFICIAL {formatSeconds(row.official_time_seconds)} {"//"} NET{" "}
                  {row.net_time_seconds == null ? "N/A" : formatSeconds(row.net_time_seconds)}{" "}
                  {"//"} RANK {row.rank_overall ?? row.result_status ?? "—"}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </>
  );
}
