import { describe, expect, it } from "vitest";
import {
  absoluteUrl,
  buildSitemapXml,
  escapeXml,
  raceSitemapEntry,
  sitemapApiOrigin,
} from "./sitemap";

describe("sitemap helpers", () => {
  it("escapes XML and joins origin + path", () => {
    expect(escapeXml(`a&b<"'>`)).toBe("a&amp;b&lt;&quot;&apos;&gt;");
    expect(absoluteUrl("https://speedhare.io/", "/")).toBe("https://speedhare.io/");
    expect(absoluteUrl("https://speedhare.io/", "/about")).toBe("https://speedhare.io/about");
  });

  it("prefers an absolute VITE_API_ORIGIN, then SITEMAP_API_ORIGIN, then production", () => {
    expect(sitemapApiOrigin({ VITE_API_ORIGIN: "https://api.example/" })).toBe(
      "https://api.example",
    );
    expect(sitemapApiOrigin({ SITEMAP_API_ORIGIN: "https://local-api/" })).toBe(
      "https://local-api",
    );
    expect(sitemapApiOrigin({})).toBe("https://api.speedhare.io");
  });

  it("builds race URLs and XML", () => {
    const race = raceSitemapEntry("https://speedhare.io", {
      slug: "foo/bar",
      date: "2026-04-26",
    });
    expect(race.loc).toBe("https://speedhare.io/races/foo%2Fbar");
    expect(race.lastmod).toBe("2026-04-26");
    expect(buildSitemapXml([race])).toContain("<lastmod>2026-04-26</lastmod>");
    expect(buildSitemapXml([race])).toContain("<loc>https://speedhare.io/races/foo%2Fbar</loc>");
  });
});
