export function racePath(slug: string): string {
  return `/races/${encodeURIComponent(slug)}`;
}
