export function formatSeconds(seconds: number | null | undefined): string {
  if (seconds == null) return "—";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function formatRaceType(raceType: string | null | undefined): string {
  if (!raceType) return "—";
  if (raceType === "half_marathon") return "Half Marathon";
  return raceType;
}

/**
 * After title-casing, English ordinal suffixes must stay lowercase (12th not 12Th).
 * Matches 1st, 2nd, 3rd, 4th–20th, 21st, 22nd, 23rd, 24th, …
 */
function fixOrdinalSuffixesAfterDigits(s: string): string {
  return s.replace(/\b(\d+)(st|nd|rd|th)\b/gi, (_, digits: string, suf: string) => `${digits}${suf.toLowerCase()}`);
}

/** Normalize event titles to title case for UI display. */
export function formatEventTitle(title: string): string {
  const titleCased = title
    .trim()
    .replace(/[A-Za-z]+/g, (part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase());
  return fixOrdinalSuffixesAfterDigits(titleCased);
}

/** Normalize English runner names to title case for UI display. */
export function formatEnglishRunnerName(name: string): string {
  return name
    .trim()
    .replace(/[A-Za-z]+/g, (part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase());
}

/** Display runner names: shows both English and Chinese when present. */
export function formatRunnerNames(row: { name_en: string; name_zh: string }): string {
  const en = formatEnglishRunnerName(row.name_en);
  const zh = row.name_zh.trim();
  if (en && zh) return `${en} · ${zh}`;
  return en || zh || "—";
}
