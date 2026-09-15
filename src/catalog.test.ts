import { describe, expect, it } from "vitest";
import { collectAllPages } from "./collectAllPages";

describe("collectAllPages", () => {
  it("walks pages until the reported total is reached", async () => {
    const byPage: Record<number, { items: number[]; total: number }> = {
      1: { items: [1, 2], total: 3 },
      2: { items: [3], total: 3 },
    };
    const items = await collectAllPages(async (page) => {
      const res = byPage[page];
      if (!res) throw new Error(`unexpected page ${page}`);
      return res;
    });
    expect(items).toEqual([1, 2, 3]);
  });

  it("stops when a page is empty", async () => {
    const items = await collectAllPages(async (page) =>
      page === 1 ? { items: [1], total: 99 } : { items: [], total: 99 },
    );
    expect(items).toEqual([1]);
  });

  it("throws when the signal is already aborted", async () => {
    const ac = new AbortController();
    ac.abort();
    await expect(
      collectAllPages(async () => ({ items: [1], total: 1 }), ac.signal),
    ).rejects.toMatchObject({ name: "AbortError" });
  });
});
