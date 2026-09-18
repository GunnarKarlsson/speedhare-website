import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PlaceIcon from "@mui/icons-material/Place";
import { Box, Typography } from "@mui/material";
import { LabeledMetricBox } from "../../components/LabeledMetricBox";
import { formatRaceType } from "../../format";
import { badgeSxForRaceType } from "../../home/badgeStyle";
import type { HomeTheme } from "../../home/homeTheme";
import type { RaceDetail } from "../../types";
import type { RaceDetailView } from "./raceDetailView";

export function RaceDetailSummary({
  race,
  view,
  nh,
}: {
  race: RaceDetail;
  view: RaceDetailView;
  nh: HomeTheme;
}) {
  const typeBadge = badgeSxForRaceType(race.race_type, nh);
  const { extras, metadataVersion, metadataChips, showMetadataSection, topMetrics } = view;

  return (
    <Box
      sx={{
        mb: 3,
        p: { xs: 2, md: 2.5 },
        border: `1px solid ${nh.border}`,
        bgcolor: nh.card,
        borderRadius: 2,
      }}
    >
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, alignItems: "center", mb: 1.5 }}>
        <Typography
          sx={{
            fontFamily: nh.mono,
            fontSize: "0.65rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            px: 1,
            py: 0.35,
            borderRadius: 1,
            border: `1px solid ${typeBadge.borderColor}`,
            bgcolor: typeBadge.bgcolor,
            color: nh.white,
          }}
        >
          {formatRaceType(race.race_type).toUpperCase()}
        </Typography>
        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, color: nh.muted }}>
          <CalendarMonthIcon sx={{ fontSize: 16 }} />
          <Typography sx={{ fontFamily: nh.sans, fontSize: "0.85rem" }}>{race.date}</Typography>
        </Box>
        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, color: nh.muted }}>
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

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
          gap: 1,
          mb: 1.5,
        }}
      >
        <LabeledMetricBox nh={nh} label="RESULTS" value={view.finishers} color={nh.blue} />
        <LabeledMetricBox nh={nh} label="MEAN" value={view.mean} color={nh.muted} />
        <LabeledMetricBox nh={nh} label="MEDIAN" value={view.median} color={nh.muted} />
      </Box>

      {topMetrics.length > 0 ? (
        <Box sx={{ mb: 1.5 }}>
          <SectionLabel nh={nh}>PERCENTILE CUTOFFS</SectionLabel>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {topMetrics.map((m) => (
              <LabeledMetricBox
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
          <SectionLabel nh={nh}>SUB-TIME BREAKDOWN</SectionLabel>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
              gap: 1,
            }}
          >
            {extras.thresholdMetrics.map((m) => (
              <LabeledMetricBox
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
          <SectionLabel nh={nh}>
            {metadataVersion != null && metadataVersion.length > 0
              ? `METADATA // v // ${metadataVersion}`
              : "METADATA"}
          </SectionLabel>
          {metadataChips.length > 0 ? (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {metadataChips.map((m) => (
                <LabeledMetricBox
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
    </Box>
  );
}

function SectionLabel({ nh, children }: { nh: HomeTheme; children: string }) {
  return (
    <Typography
      sx={{
        fontFamily: nh.mono,
        fontSize: "0.65rem",
        letterSpacing: "0.1em",
        color: nh.muted,
        mb: 1,
      }}
    >
      {children}
    </Typography>
  );
}
