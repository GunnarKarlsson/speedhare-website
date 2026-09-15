import { formatSeconds } from "./format";
import type { RaceAggregates, RaceMetadata, RaceMetadataValue } from "./types";

export interface LabeledMetric {
  label: string;
  value: string;
}

export interface RaceListExtras {
  summaryMetrics: LabeledMetric[];
  thresholdMetrics: LabeledMetric[];
  metadataMetrics: LabeledMetric[];
}

export interface RaceListExtrasOptions {
  includeHiddenMetadataKeys?: boolean;
}

function asFiniteNumber(value: number | undefined): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function metadataValueToString(value: RaceMetadataValue | undefined): string | null {
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value === "string" && value.trim().length > 0) return value.trim();
  return null;
}

export function raceMetadataVersion(metadata: RaceMetadata | null | undefined): string | null {
  if (!metadata) return null;
  return metadataValueToString(metadata["data-version"]) ?? metadataValueToString(metadata.version);
}

export function metricValue(
  metrics: readonly LabeledMetric[],
  label: string,
  fallback = "—",
): string {
  return metrics.find((m) => m.label === label)?.value ?? fallback;
}

/** Structured race list data for responsive UI rendering. */
export function raceListExtras(
  aggregates: RaceAggregates | null | undefined,
  metadata: RaceMetadata | null | undefined,
  options?: RaceListExtrasOptions,
): RaceListExtras {
  return {
    summaryMetrics: formatSummaryMetrics(aggregates),
    thresholdMetrics: formatThresholdMetrics(aggregates),
    metadataMetrics: formatMetadataMetrics(metadata, options),
  };
}

function formatSummaryMetrics(aggregates: RaceAggregates | null | undefined): LabeledMetric[] {
  if (!aggregates) return [];
  const counts = aggregates.counts;
  const dist = aggregates.distribution;
  if (!counts && !dist) return [];

  const parts: LabeledMetric[] = [];
  const finishers = asFiniteNumber(counts?.finishers_with_time);
  if (finishers != null) {
    parts.push({ label: "Finishers", value: finishers.toLocaleString() });
  }
  if (dist) {
    const mean = asFiniteNumber(dist.mean_seconds);
    if (mean != null) {
      parts.push({ label: "Mean", value: formatSeconds(Math.round(mean)) });
    }
    const median = asFiniteNumber(dist.median_seconds);
    if (median != null) {
      parts.push({ label: "Median", value: formatSeconds(Math.round(median)) });
    }
    const t10 = asFiniteNumber(dist.top_10pc);
    if (t10 != null) parts.push({ label: "Top 10%", value: t10.toLocaleString() });
    const t25 = asFiniteNumber(dist.top_25pc);
    if (t25 != null) parts.push({ label: "Top 25%", value: t25.toLocaleString() });
    const t50 = asFiniteNumber(dist.top_50pc);
    if (t50 != null) parts.push({ label: "Top 50%", value: t50.toLocaleString() });
    const t75 = asFiniteNumber(dist.top_75pc);
    if (t75 != null) parts.push({ label: "Top 75%", value: t75.toLocaleString() });
  }
  return parts;
}

function formatThresholdMetrics(aggregates: RaceAggregates | null | undefined): LabeledMetric[] {
  const raw = aggregates?.thresholds;
  if (!raw?.length) return [];
  const finishers = asFiniteNumber(aggregates?.counts?.finishers_with_time);
  const parts: LabeledMetric[] = [];
  for (const item of raw) {
    if (!item.label || !Number.isFinite(item.count)) continue;
    const pct =
      finishers && finishers > 0 ? ` (${((item.count / finishers) * 100).toFixed(1)}%)` : "";
    parts.push({
      label: humanizeThresholdLabel(item.label),
      value: `${item.count.toLocaleString()}${pct}`,
    });
  }
  return parts;
}

function humanizeThresholdLabel(label: string): string {
  const m = /^sub_(\d+)_min$/i.exec(label);
  if (m) return `Sub ${m[1]}`;
  return label.replace(/_/g, " ");
}

const METADATA_KEYS_HIDDEN_ON_RACE_LIST = new Set(["source_pdf", "timing", "layout"]);

function formatMetadataMetrics(
  metadata: RaceMetadata | null | undefined,
  options?: RaceListExtrasOptions,
): LabeledMetric[] {
  if (!metadata) return [];
  const parts: LabeledMetric[] = [];
  for (const [k, v] of Object.entries(metadata)) {
    if (!options?.includeHiddenMetadataKeys && METADATA_KEYS_HIDDEN_ON_RACE_LIST.has(k)) continue;
    if (v == null) continue;
    if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") {
      parts.push({ label: humanizeMetadataKey(k), value: String(v) });
    }
  }
  parts.sort((a, b) => {
    if (a.label === "data version") return -1;
    if (b.label === "data version") return 1;
    return a.label.localeCompare(b.label);
  });
  return parts;
}

function humanizeMetadataKey(key: string): string {
  return key.replace(/[_-]/g, " ").toLowerCase();
}
