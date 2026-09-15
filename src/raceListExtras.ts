import { formatSeconds } from "./format";

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

function isRecord(x: unknown): x is Record<string, unknown> {
  return x !== null && typeof x === "object" && !Array.isArray(x);
}

function num(x: unknown): number | null {
  if (typeof x === "number" && Number.isFinite(x)) return x;
  return null;
}

/** Structured race list data for responsive UI rendering. */
export function raceListExtras(
  aggregates: unknown,
  metadata: unknown,
  options?: RaceListExtrasOptions,
): RaceListExtras {
  return {
    summaryMetrics: formatSummaryMetrics(aggregates),
    thresholdMetrics: formatThresholdMetrics(aggregates),
    metadataMetrics: formatMetadataMetrics(metadata, options),
  };
}

function formatSummaryMetrics(aggregates: unknown): LabeledMetric[] {
  if (!isRecord(aggregates)) return [];
  const counts = isRecord(aggregates.counts) ? aggregates.counts : null;
  const dist = isRecord(aggregates.distribution) ? aggregates.distribution : null;
  if (!counts && !dist) return [];

  const parts: LabeledMetric[] = [];
  const finishers = counts ? num(counts.finishers_with_time) : null;
  if (finishers != null) {
    parts.push({ label: "Finishers", value: finishers.toLocaleString() });
  }
  if (dist) {
    const mean = num(dist.mean_seconds);
    if (mean != null) {
      parts.push({ label: "Mean", value: formatSeconds(Math.round(mean)) });
    }
    const median = num(dist.median_seconds);
    if (median != null) {
      parts.push({ label: "Median", value: formatSeconds(Math.round(median)) });
    }
    const t10 = num(dist.top_10pc);
    if (t10 != null) parts.push({ label: "Top 10%", value: t10.toLocaleString() });
    const t25 = num(dist.top_25pc);
    if (t25 != null) parts.push({ label: "Top 25%", value: t25.toLocaleString() });
    const t50 = num(dist.top_50pc);
    if (t50 != null) parts.push({ label: "Top 50%", value: t50.toLocaleString() });
    const t75 = num(dist.top_75pc);
    if (t75 != null) parts.push({ label: "Top 75%", value: t75.toLocaleString() });
  }
  return parts;
}

function formatThresholdMetrics(aggregates: unknown): LabeledMetric[] {
  if (!isRecord(aggregates)) return [];
  const raw = aggregates.thresholds;
  const counts = isRecord(aggregates.counts) ? aggregates.counts : null;
  const finishers = counts ? num(counts.finishers_with_time) : null;
  if (!Array.isArray(raw) || raw.length === 0) return [];
  const parts: LabeledMetric[] = [];
  for (const item of raw) {
    if (!isRecord(item)) continue;
    const label = item.label;
    const count = num(item.count);
    if (typeof label !== "string" || count == null) continue;
    const pct =
      finishers && finishers > 0
        ? ` (${((count / finishers) * 100).toFixed(1)}%)`
        : "";
    parts.push({
      label: humanizeThresholdLabel(label),
      value: `${count.toLocaleString()}${pct}`,
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
  metadata: unknown,
  options?: RaceListExtrasOptions,
): LabeledMetric[] {
  if (!isRecord(metadata) || Object.keys(metadata).length === 0) return [];
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
