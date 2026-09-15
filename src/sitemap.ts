import { racePath } from "./racePaths";

export const SITEMAP_SITE_ORIGIN = "https://speedhare.io";

export const STATIC_SITEMAP_PATHS = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/all-races", changefreq: "daily", priority: "0.8" },
  { path: "/hong-kong-10k-5k-half-marathon-race", changefreq: "weekly", priority: "0.8" },
  { path: "/about", changefreq: "monthly", priority: "0.4" },
  { path: "/terms", changefreq: "yearly", priority: "0.3" },
  { path: "/data-policy", changefreq: "yearly", priority: "0.3" },
  { path: "/hong-kong-road-race-stats-5k-10k-half-marathon", changefreq: "daily", priority: "0.7" },
  { path: "/speed-distance-time-calculator", changefreq: "monthly", priority: "0.5" },
  { path: "/vo2max-calculator", changefreq: "monthly", priority: "0.5" },
] as const;

export interface SitemapUrlEntry {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
}

export function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function absoluteUrl(siteOrigin: string, path: string): string {
  const origin = siteOrigin.replace(/\/$/, "");
  if (path === "/") return `${origin}/`;
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}

export function sitemapApiOrigin(env: Record<string, string | undefined>): string {
  const vite = env.VITE_API_ORIGIN?.trim();
  if (vite && /^https?:\/\//i.test(vite)) return vite.replace(/\/$/, "");
  const explicit = env.SITEMAP_API_ORIGIN?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  return "https://api.speedhare.io";
}

export function raceSitemapEntry(
  siteOrigin: string,
  race: { slug: string; date: string },
): SitemapUrlEntry {
  const entry: SitemapUrlEntry = {
    loc: absoluteUrl(siteOrigin, racePath(race.slug)),
    changefreq: "weekly",
    priority: "0.6",
  };
  if (/^\d{4}-\d{2}-\d{2}$/.test(race.date)) {
    entry.lastmod = race.date;
  }
  return entry;
}

export function buildSitemapXml(entries: readonly SitemapUrlEntry[]): string {
  const urls = entries
    .map((entry) => {
      const lines = [`    <loc>${escapeXml(entry.loc)}</loc>`];
      if (entry.lastmod) lines.push(`    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`);
      if (entry.changefreq) lines.push(`    <changefreq>${entry.changefreq}</changefreq>`);
      if (entry.priority) lines.push(`    <priority>${entry.priority}</priority>`);
      return `  <url>\n${lines.join("\n")}\n  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}
