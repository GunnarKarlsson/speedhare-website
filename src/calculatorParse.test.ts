import { describe, expect, it } from "vitest";
import {
  formatDuration,
  formatPace,
  parsePositiveNumber,
  parseTimeToSeconds,
} from "./calculatorParse";

describe("parsePositiveNumber", () => {
  it("accepts finite positives and rejects the rest", () => {
    expect(parsePositiveNumber("10")).toBe(10);
    expect(parsePositiveNumber(" 2.5 ")).toBe(2.5);
    expect(parsePositiveNumber("")).toBeNull();
    expect(parsePositiveNumber("0")).toBeNull();
    expect(parsePositiveNumber("-1")).toBeNull();
    expect(parsePositiveNumber("nope")).toBeNull();
  });
});

describe("parseTimeToSeconds", () => {
  it("parses seconds, mm:ss, and hh:mm:ss", () => {
    expect(parseTimeToSeconds("90")).toBe(90);
    expect(parseTimeToSeconds("1:01")).toBe(61);
    expect(parseTimeToSeconds("1:01:01")).toBe(3661);
  });

  it("rejects empty, invalid, and out-of-range parts", () => {
    expect(parseTimeToSeconds("")).toBeNull();
    expect(parseTimeToSeconds("1:61")).toBeNull();
    expect(parseTimeToSeconds("1:01:61")).toBeNull();
    expect(parseTimeToSeconds("1:01:01:01")).toBeNull();
    expect(parseTimeToSeconds("abc")).toBeNull();
  });
});

describe("calculator duration formatters", () => {
  it("formats clock and pace strings", () => {
    expect(formatDuration(3661)).toBe("01:01:01");
    expect(formatPace(305)).toBe("5:05");
    expect(formatPace(3661)).toBe("1:01:01");
  });
});
