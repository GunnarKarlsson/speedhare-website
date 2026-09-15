import fs from "node:fs/promises";
import path from "node:path";
import type { Plugin } from "vite";
import { apiV1Base, racesCollectionUrl } from "./src/apiUrls";
import { collectAllPages } from "./src/collectAllPages";
import {
  STATIC_SITEMAP_PATHS,
  SITEMAP_SITE_ORIGIN,
  absoluteUrl,
  buildSitemapXml,
  raceSitemapEntry,
  sitemapApiOrigin,
  type SitemapUrlEntry,
} from "./src/sitemap";

const PAGE_SIZE = 100;

async function fetchRaceSitemapEntries(apiOrigin: string): Promise<SitemapUrlEntry[]> {
  const base = apiV1Base(apiOrigin);
  const races = await collectAllPages<{ slug: string; date: string }>(async (page) => {
    const res = await fetch(racesCollectionUrl(page, PAGE_SIZE, base), {
      signal: AbortSignal.timeout(20_000),
    });
    if (!res.ok) {
      throw new Error(
        `${res.status} ${res.statusText}: ${racesCollectionUrl(page, PAGE_SIZE, base)}`,
      );
    }
    const data = (await res.json()) as { items: { slug: string; date: string }[]; total: number };
    return { items: data.items ?? [], total: Number(data.total) };
  });
  return races
    .filter((race) => race.slug)
    .map((race) => raceSitemapEntry(SITEMAP_SITE_ORIGIN, race));
}

export function sitemapPlugin(env: Record<string, string>): Plugin {
  let outDir = "dist";

  return {
    name: "speedhare-sitemap",
    apply: "build",
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    async closeBundle() {
      const staticEntries: SitemapUrlEntry[] = STATIC_SITEMAP_PATHS.map((item) => ({
        loc: absoluteUrl(SITEMAP_SITE_ORIGIN, item.path),
        changefreq: item.changefreq,
        priority: item.priority,
      }));

      let raceEntries: SitemapUrlEntry[] = [];
      const apiOrigin = sitemapApiOrigin(env);
      try {
        raceEntries = await fetchRaceSitemapEntries(apiOrigin);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.warn(`[sitemap] race list unavailable from ${apiOrigin}; writing static URLs only`);
        console.warn(`[sitemap] ${message}`);
      }

      const xml = buildSitemapXml([...staticEntries, ...raceEntries]);
      const file = path.join(outDir, "sitemap.xml");
      await fs.writeFile(file, xml, "utf8");
      console.info(`[sitemap] wrote ${staticEntries.length + raceEntries.length} URLs to ${file}`);
    },
  };
}
