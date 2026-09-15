export interface RaceListItem {
  id: number;
  slug: string;
  name: string;
  date: string;
  race_type: string;
  location: string | null;
  metadata: unknown;
  aggregates: unknown;
}

export interface Paginated<T> {
  items: T[];
  page: number;
  page_size: number;
  total: number;
}

export interface RaceDetail {
  id: number;
  slug: string;
  name: string;
  date: string;
  race_type: string;
  location: string | null;
  metadata: unknown;
  aggregates: unknown;
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
