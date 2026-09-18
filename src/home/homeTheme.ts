import {
  SITE_BACKGROUND,
  SITE_HIGHLIGHT_BLUE,
  SITE_HIGHLIGHT_BLUE_LIGHT_MODE,
  SITE_HIGHLIGHT_BLUE_BADGE_BG,
  SITE_HIGHLIGHT_BLUE_BADGE_BORDER,
  SITE_HIGHLIGHT_BLUE_MUTED,
  SITE_LABEL_10K,
  SITE_LABEL_10K_BG,
  SITE_LABEL_5K,
  SITE_LABEL_5K_BG,
  SITE_LABEL_HM,
  SITE_LABEL_HM_BG,
  SITE_TEXT_GREY,
  SITE_TEXT_GREY_FAINT,
} from "../colors";

import type { ThemeMode } from "./themeMode";

export interface HomeTheme {
  bg: string;
  card: string;
  cardHover: string;
  border: string;
  blue: string;
  blueMuted: string;
  blueBadgeBg: string;
  blueBadgeBorder: string;
  orangeBadge: string;
  orangeBadgeBg: string;
  purpleBadge: string;
  purpleBadgeBg: string;
  greenBadge: string;
  greenBadgeBg: string;
  muted: string;
  faint: string;
  white: string;
  sans: string;
  mono: string;
}

export function createHomeTheme(mode: ThemeMode): HomeTheme {
  if (mode === "dark") {
    return {
      bg: SITE_BACKGROUND,
      card: "#161616",
      cardHover: "#1a1a1a",
      border: "rgba(255,255,255,0.1)",
      blue: SITE_HIGHLIGHT_BLUE,
      blueMuted: SITE_HIGHLIGHT_BLUE_MUTED,
      blueBadgeBg: SITE_HIGHLIGHT_BLUE_BADGE_BG,
      blueBadgeBorder: SITE_HIGHLIGHT_BLUE_BADGE_BORDER,
      orangeBadge: SITE_LABEL_10K,
      orangeBadgeBg: SITE_LABEL_10K_BG,
      purpleBadge: SITE_LABEL_HM,
      purpleBadgeBg: SITE_LABEL_HM_BG,
      greenBadge: SITE_LABEL_5K,
      greenBadgeBg: SITE_LABEL_5K_BG,
      muted: SITE_TEXT_GREY,
      faint: SITE_TEXT_GREY_FAINT,
      white: "#ffffff",
      sans: '"Inter", system-ui, -apple-system, "Segoe UI", sans-serif',
      mono: 'ui-monospace, "SFMono-Regular", "Menlo", "Consolas", monospace',
    };
  }

  return {
    bg: "#f7f9fc",
    card: "#ffffff",
    cardHover: "#f0f5fb",
    border: "rgba(15, 23, 42, 0.14)",
    blue: SITE_HIGHLIGHT_BLUE_LIGHT_MODE,
    blueMuted: "rgba(59, 130, 246, 0.18)",
    blueBadgeBg: "rgba(59, 130, 246, 0.08)",
    blueBadgeBorder: "rgba(59, 130, 246, 0.38)",
    orangeBadge: SITE_LABEL_10K,
    orangeBadgeBg: "rgba(6, 182, 212, 0.12)",
    purpleBadge: SITE_LABEL_HM,
    purpleBadgeBg: "rgba(124, 58, 237, 0.12)",
    greenBadge: SITE_LABEL_5K,
    greenBadgeBg: "rgba(34, 197, 94, 0.12)",
    muted: "rgba(15, 23, 42, 0.68)",
    faint: "rgba(15, 23, 42, 0.45)",
    white: "#0f172a",
    sans: '"Inter", system-ui, -apple-system, "Segoe UI", sans-serif',
    mono: 'ui-monospace, "SFMono-Regular", "Menlo", "Consolas", monospace',
  };
}
