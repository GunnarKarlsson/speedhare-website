function abortError(): DOMException {
  return new DOMException("Aborted", "AbortError");
}

export async function collectAllPages<T>(
  fetchPage: (
    page: number,
    signal?: AbortSignal,
  ) => Promise<{ items: readonly T[]; total: number }>,
  signal?: AbortSignal,
): Promise<T[]> {
  const items: T[] = [];
  let page = 1;

  for (;;) {
    if (signal?.aborted) throw abortError();
    const res = await fetchPage(page, signal);
    items.push(...res.items);
    if (items.length >= Number(res.total) || res.items.length === 0) break;
    page += 1;
  }

  return items;
}
