/** Primitive values stored on race result-file metadata. */
export type RaceMetadataValue = string | number | boolean | null;

/**
 * Metadata from the race source file. Known keys are documented; extra keys may appear.
 * Version is `data-version` or `version`.
 */
export interface RaceMetadata {
  "data-version"?: string | number;
  version?: string | number;
  source?: string;
  source_pdf?: string;
  timing?: string;
  layout?: string;
  output_file_name?: string;
  [key: string]: RaceMetadataValue | undefined;
}

export interface RaceAggregatesCounts {
  finishers_with_time?: number;
}

export interface RaceAggregatesDistribution {
  mean_seconds?: number;
  median_seconds?: number;
  top_10pc?: number;
  top_25pc?: number;
  top_50pc?: number;
  top_75pc?: number;
}

export interface RaceAggregatesThreshold {
  label: string;
  count: number;
}

export interface RaceAggregates {
  counts?: RaceAggregatesCounts;
  distribution?: RaceAggregatesDistribution;
  thresholds?: RaceAggregatesThreshold[];
}

export interface RaceSummary {
  id: number;
  slug: string;
  name: string;
  date: string;
  race_type: string;
  location: string | null;
  metadata: RaceMetadata;
  aggregates: RaceAggregates;
}

export type RaceListItem = RaceSummary;
export type RaceDetail = RaceSummary;

export interface SiteAggregates {
  totalRaces: number;
  totalResults: number;
  distinctRaceTypes: number;
}

export interface Paginated<T> {
  items: T[];
  page: number;
  page_size: number;
  total: number;
}

export interface RunnerResultRow {
  id: number;
  race_id: number;
  bib: string;
  name_en: string;
  name_zh: string;
  gender: string;
  category: string;
  result_status: string | null;
  position_overall: number | null;
  /** Official gender position from race source (not time-derived). */
  position_gender: number | null;
  official_time_seconds: number | null;
  net_time_seconds: number | null;
  rank_overall: number | null;
  rank_category: number | null;
}

export interface RunnerStats {
  faster_than_pct_overall: number | null;
  faster_than_pct_gender: number | null;
  faster_than_pct_category: number | null;
  cohort_size_overall: number;
  cohort_size_gender: number;
  cohort_size_category: number;
}

export interface RunnerDetailResponse {
  runner: RunnerResultRow;
  stats: RunnerStats;
}

export interface SearchRaceItem {
  race_id: number;
  race_slug: string;
  race_name: string;
  race_date: string;
  race_type: string;
}

export interface SearchRunnerItem {
  race_id: number;
  race_slug: string;
  race_name: string;
  result_id: number;
  name_en: string;
  name_zh: string;
  official_time_seconds: number | null;
  net_time_seconds: number | null;
  result_status: string | null;
  rank_overall: number | null;
}

export interface SearchResponse {
  races: SearchRaceItem[];
  runners: SearchRunnerItem[];
}

export interface CommonRoadRaceStatsRow {
  id: number;
  slug: string;
  name: string;
  date: string;
  race_type: string;
  location: string | null;
  runner_count: number;
  mean_seconds: number | null;
  median_seconds: number | null;
  fastest_seconds: number | null;
}

export interface FiveKStatsRow extends CommonRoadRaceStatsRow {
  lt_15: number;
  lt_18: number;
  lt_20: number;
  lt_25: number;
}

export interface TenKStatsRow extends CommonRoadRaceStatsRow {
  lt_35: number;
  lt_40: number;
  lt_45: number;
}

export interface HalfMarathonStatsRow extends CommonRoadRaceStatsRow {
  lt_1_10: number;
  lt_1_15: number;
  lt_1_20: number;
  lt_1_25: number;
  lt_1_30: number;
  lt_1_40: number;
}

export interface RoadRaceStatsResponse {
  five_k: FiveKStatsRow[];
  ten_k: TenKStatsRow[];
  half_marathon: HalfMarathonStatsRow[];
}

export interface SummaryStatsResponse {
  total_races: number;
  total_results: number;
  distinct_race_types: number;
}

export type ResultsSortKey = "position" | "time" | "category" | "gender" | "bib" | "name";
export type SortOrder = "asc" | "desc";
