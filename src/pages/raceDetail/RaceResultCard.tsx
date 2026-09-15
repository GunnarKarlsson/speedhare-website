import { Box, Link as MuiLink, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { LabeledMetricBox } from "../../components/LabeledMetricBox";
import { formatEnglishRunnerName, formatSeconds } from "../../format";
import type { NewHomeTheme } from "../../new_home/newHomeTheme";
import type { RunnerResultRow } from "../../types";

export function RaceResultCard({
  raceId,
  row,
  nh,
}: {
  raceId: number;
  row: RunnerResultRow;
  nh: NewHomeTheme;
}) {
  return (
    <Box
      sx={{
        border: `1px solid ${nh.border}`,
        borderRadius: 2,
        bgcolor: nh.card,
        p: { xs: 1.5, sm: 2 },
      }}
    >
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, alignItems: "center", mb: 1 }}>
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
        to={`/races/${raceId}/runners/${row.id}`}
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
        <Typography sx={{ color: nh.muted, fontFamily: nh.sans, fontSize: "0.9rem", mb: 1 }}>
          {row.name_zh}
        </Typography>
      ) : null}

      <Typography sx={{ color: nh.muted, fontFamily: nh.mono, fontSize: "0.72rem", mb: 1.25 }}>
        {row.category || "—"}
      </Typography>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        <LabeledMetricBox
          nh={nh}
          label="OFFICIAL"
          value={formatSeconds(row.official_time_seconds)}
          color={nh.blue}
        />
        <LabeledMetricBox
          nh={nh}
          label="NET"
          value={row.net_time_seconds == null ? "N/A" : formatSeconds(row.net_time_seconds)}
          color={nh.muted}
        />
        <LabeledMetricBox
          nh={nh}
          label="O / G / CAT"
          value={`${row.rank_overall ?? row.result_status ?? "—"} / ${row.position_gender ?? "—"} / ${row.rank_category ?? "—"}`}
          color={nh.muted}
        />
      </Box>
    </Box>
  );
}
