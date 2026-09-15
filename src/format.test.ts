import { describe, expect, it } from "vitest";
import {
  formatEnglishRunnerName,
  formatEventTitle,
  formatRunnerNames,
  formatSeconds,
} from "./format";

describe("formatSeconds", () => {
  it("returns an em dash for missing values", () => {
    expect(formatSeconds(null)).toBe("—");
    expect(formatSeconds(undefined)).toBe("—");
  });

  it("formats minutes and seconds under an hour", () => {
    expect(formatSeconds(0)).toBe("0:00");
    expect(formatSeconds(45)).toBe("0:45");
    expect(formatSeconds(75)).toBe("1:15");
  });

  it("includes hours when needed", () => {
    expect(formatSeconds(3600)).toBe("1:00:00");
    expect(formatSeconds(3661)).toBe("1:01:01");
  });
});

describe("formatEventTitle", () => {
  it("title-cases words and keeps ordinal suffixes lowercase", () => {
    expect(formatEventTitle("  12TH HK 10K  ")).toBe("12th Hk 10K");
    expect(formatEventTitle("STANDARD CHARTERED HONG KONG MARATHON")).toBe(
      "Standard Chartered Hong Kong Marathon",
    );
  });
});

describe("formatEnglishRunnerName", () => {
  it("title-cases and trims", () => {
    expect(formatEnglishRunnerName("  CHAN TAI MAN  ")).toBe("Chan Tai Man");
  });
});

describe("formatRunnerNames", () => {
  it("joins English and Chinese when both exist", () => {
    expect(formatRunnerNames({ name_en: "chan tai man", name_zh: "陳大文" })).toBe(
      "Chan Tai Man · 陳大文",
    );
  });

  it("falls back to a single name or em dash", () => {
    expect(formatRunnerNames({ name_en: "", name_zh: "陳大文" })).toBe("陳大文");
    expect(formatRunnerNames({ name_en: "", name_zh: "  " })).toBe("—");
  });
});
