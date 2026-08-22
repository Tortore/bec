type Entry = { count: number; until: number };

export class MemoryRateLimiter {
  private readonly entries = new Map<string, Entry>();
  private checks = 0;

  constructor(
    private readonly limit: number,
    private readonly windowMs: number,
    private readonly maxEntries = 10_000,
  ) {}

  isLimited(key: string) {
    const now = Date.now();
    this.checks += 1;
    if (this.checks % 100 === 0 || this.entries.size >= this.maxEntries) {
      for (const [entryKey, entry] of this.entries) {
        if (entry.until <= now) this.entries.delete(entryKey);
      }
    }
    if (this.entries.size >= this.maxEntries && !this.entries.has(key)) return true;

    const current = this.entries.get(key);
    if (!current || current.until <= now) {
      this.entries.set(key, { count: 1, until: now + this.windowMs });
      return false;
    }
    if (current.count >= this.limit) return true;
    current.count += 1;
    return false;
  }
}

export function requestClientKey(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  ).slice(0, 100);
}
