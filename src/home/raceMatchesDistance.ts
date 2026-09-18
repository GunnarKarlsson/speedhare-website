import type { RaceListItem } from "../types";
import type { NavDistanceFilter } from "./HomeNav";

export function raceMatchesDistance(race: RaceListItem, filter: NavDistanceFilter): boolean {
  if (filter === "all") return true;
  const t = race.race_type.toLowerCase();
  switch (filter) {
    case "10k":
      return t === "10k" || t === "10km";
    case "5k":
      return t === "5k" || t === "5km";
    case "half":
      return t.includes("half");
    default:
      return true;
  }
}
