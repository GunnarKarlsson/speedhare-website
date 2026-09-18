import type { HomeTheme } from "./homeTheme";

export function badgeSxForRaceType(
  raceType: string,
  nh: HomeTheme,
): { borderColor: string; bgcolor: string } {
  const t = raceType.toLowerCase();
  if (t.includes("half")) {
    return { borderColor: nh.purpleBadge, bgcolor: nh.purpleBadgeBg };
  }
  if (t === "10k" || t === "10km") {
    return { borderColor: nh.orangeBadge, bgcolor: nh.orangeBadgeBg };
  }
  if (t.includes("marathon") && !t.includes("half")) {
    return { borderColor: nh.blue, bgcolor: nh.blueBadgeBg };
  }
  if (t === "5k" || t === "5km") {
    return { borderColor: nh.greenBadge, bgcolor: nh.greenBadgeBg };
  }
  return { borderColor: nh.orangeBadge, bgcolor: nh.orangeBadgeBg };
}
