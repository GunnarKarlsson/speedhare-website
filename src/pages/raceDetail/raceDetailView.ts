import {
  metricValue,
  raceListExtras,
  raceMetadataVersion,
  type LabeledMetric,
} from "../../raceListExtras";
import { racePath } from "../../racePaths";
import type { RaceDetail, ResultsSortKey } from "../../types";

export const RESULTS_SORT_COLUMNS: { key: ResultsSortKey; label: string }[] = [
  { key: "position", label: "Position" },
  { key: "bib", label: "Bib" },
  { key: "name", label: "Runner" },
  { key: "gender", label: "Gender" },
  { key: "category", label: "Category" },
  { key: "time", label: "Official Time" },
];

const PERCENTILE_LABELS = ["Top 10%", "Top 25%", "Top 50%", "Top 75%"] as const;

const RACE_DETAIL_METADATA_CHIP_HIDE = new Set([
  "source",
  "output file name",
  "data version",
  "version",
]);

export interface RaceDetailView {
  extras: ReturnType<typeof raceListExtras>;
  metadataVersion: string | null;
  metadataChips: LabeledMetric[];
  showMetadataSection: boolean;
  topMetrics: LabeledMetric[];
  finishers: string;
  mean: string;
  median: string;
  title: string;
  description: string;
  canonicalPath: string;
}

export function buildRaceDetailView(race: RaceDetail): RaceDetailView {
  const extras = raceListExtras(race.aggregates, race.metadata);
  const metadataVersion = raceMetadataVersion(race.metadata);
  const metadataChips = extras.metadataMetrics.filter(
    (m) => !RACE_DETAIL_METADATA_CHIP_HIDE.has(m.label.toLowerCase()),
  );
  const showMetadataSection =
    (metadataVersion != null && metadataVersion.length > 0) || metadataChips.length > 0;
  const topMetrics = PERCENTILE_LABELS.map((label) =>
    extras.summaryMetrics.find((m) => m.label === label),
  ).filter((m): m is LabeledMetric => Boolean(m));

  return {
    extras,
    metadataVersion,
    metadataChips,
    showMetadataSection,
    topMetrics,
    finishers: metricValue(extras.summaryMetrics, "Finishers"),
    mean: metricValue(extras.summaryMetrics, "Mean"),
    median: metricValue(extras.summaryMetrics, "Median"),
    title: `${race.name} ${race.date} Results | Hong Kong Road Race | speedhare`,
    description: `${race.name} ${race.date}${race.location ? ` in ${race.location}` : ""}. Official road race results, rankings, and finisher times.`,
    canonicalPath: racePath(race.slug),
  };
}
