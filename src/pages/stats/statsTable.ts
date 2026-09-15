import { formatSeconds } from "../../format";
import type { FiveKStatsRow, HalfMarathonStatsRow, TenKStatsRow } from "../../types";

export type StatsRaceType = "5k" | "10k" | "half";
export type TableSortDirection = "asc" | "desc";
export type StatsColumnKey =
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

export interface StatsRow {
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

export interface StatsColumn {
  key: StatsColumnKey;
  label: string;
  align?: "left" | "right";
}

export const STATS_TABLES: ReadonlyArray<{
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

const emptyThresholds = {
  lt15: null,
  lt18: null,
  lt20: null,
  lt25: null,
  lt35: null,
  lt40: null,
  lt45: null,
  lt70: null,
  lt75: null,
  lt80: null,
  lt85: null,
  lt90: null,
  lt100: null,
} as const;

export function mapFiveKRow(row: FiveKStatsRow): StatsRow {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    date: row.date,
    runnerCount: row.runner_count,
    meanSeconds: row.mean_seconds,
    medianSeconds: row.median_seconds,
    fastestSeconds: row.fastest_seconds,
    ...emptyThresholds,
    lt15: row.lt_15,
    lt18: row.lt_18,
    lt20: row.lt_20,
    lt25: row.lt_25,
  };
}

export function mapTenKRow(row: TenKStatsRow): StatsRow {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    date: row.date,
    runnerCount: row.runner_count,
    meanSeconds: row.mean_seconds,
    medianSeconds: row.median_seconds,
    fastestSeconds: row.fastest_seconds,
    ...emptyThresholds,
    lt35: row.lt_35,
    lt40: row.lt_40,
    lt45: row.lt_45,
  };
}

export function mapHalfMarathonRow(row: HalfMarathonStatsRow): StatsRow {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    date: row.date,
    runnerCount: row.runner_count,
    meanSeconds: row.mean_seconds,
    medianSeconds: row.median_seconds,
    fastestSeconds: row.fastest_seconds,
    ...emptyThresholds,
    lt70: row.lt_1_10,
    lt75: row.lt_1_15,
    lt80: row.lt_1_20,
    lt85: row.lt_1_25,
    lt90: row.lt_1_30,
    lt100: row.lt_1_40,
  };
}

export function defaultStatsSorts(): Record<
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

export function compareStatsValues(
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

export function renderStatsCell(row: StatsRow, key: StatsColumnKey): string {
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
    case "medianSeconds":
    case "fastestSeconds":
      return formatWholeSeconds(row[key]);
  }
}
