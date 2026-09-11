import { createServerFn } from "@tanstack/react-start";

export type LivePrices = {
  goldUsdOz: number;
  silverUsdOz: number;
  rates: Record<string, number>;
  metalsUpdatedAt: string;
  ratesUpdatedAt: string;
  fetchedAt: string;
  metalsSource: string;
  ratesSource: string;
};

type Cache = { data: LivePrices; at: number } | null;
let cache: Cache = null;
/** Prices refresh at most once an hour on the server; the client polls daily. */
const TTL_MS = 60 * 60 * 1000;

async function fetchJson(url: string) {
  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (!res.ok) throw new Error(`Request failed: ${url} (${res.status})`);
  return res.json() as Promise<any>;
}

export const getLivePrices = createServerFn({ method: "GET" }).handler(
  async (): Promise<LivePrices> => {
    if (cache && Date.now() - cache.at < TTL_MS) return cache.data;

    const [gold, silver, fx] = await Promise.all([
      fetchJson("https://api.gold-api.com/price/XAU"),
      fetchJson("https://api.gold-api.com/price/XAG"),
      fetchJson("https://open.er-api.com/v6/latest/USD"),
    ]);

    const data: LivePrices = {
      goldUsdOz: Number(gold.price),
      silverUsdOz: Number(silver.price),
      rates: { USD: 1, ...(fx.rates ?? {}) },
      metalsUpdatedAt: String(gold.updatedAt ?? new Date().toISOString()),
      ratesUpdatedAt: String(fx.time_last_update_utc ?? new Date().toISOString()),
      fetchedAt: new Date().toISOString(),
      metalsSource: "gold-api.com (spot XAU/XAG)",
      ratesSource: "exchangerate-api.com (open access)",
    };

    if (!Number.isFinite(data.goldUsdOz) || !Number.isFinite(data.silverUsdOz)) {
      throw new Error("Invalid metal prices received");
    }

    cache = { data, at: Date.now() };
    return data;
  },
);

export type HistoryRange = "1mo" | "6mo" | "1y" | "5y" | "10y";
export type HistoryPoint = { t: number; gold: number; silver: number };

const histCache = new Map<string, { data: HistoryPoint[]; at: number }>();

async function yahooSeries(symbol: string, range: HistoryRange) {
  const interval = range === "1mo" ? "1d" : range === "6mo" || range === "1y" ? "1d" : "1wk";
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
    symbol,
  )}?range=${range}&interval=${interval}`;
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`History request failed (${res.status})`);
  const json = (await res.json()) as any;
  const result = json?.chart?.result?.[0];
  const stamps: number[] = result?.timestamp ?? [];
  const closes: (number | null)[] = result?.indicators?.quote?.[0]?.close ?? [];
  const out = new Map<number, number>();
  stamps.forEach((s, i) => {
    const c = closes[i];
    if (typeof c === "number" && Number.isFinite(c)) out.set(s * 1000, c);
  });
  return out;
}

export const getHistory = createServerFn({ method: "GET" })
  .inputValidator((data: { range: HistoryRange }) => {
    const allowed: HistoryRange[] = ["1mo", "6mo", "1y", "5y", "10y"];
    const range = allowed.includes(data?.range) ? data.range : "1y";
    return { range };
  })
  .handler(async ({ data }): Promise<HistoryPoint[]> => {
    const hit = histCache.get(data.range);
    if (hit && Date.now() - hit.at < TTL_MS) return hit.data;

    const [gold, silver] = await Promise.all([
      yahooSeries("GC=F", data.range),
      yahooSeries("SI=F", data.range),
    ]);

    const points: HistoryPoint[] = [];
    for (const [t, g] of gold) {
      const s = silver.get(t);
      if (typeof s === "number") points.push({ t, gold: g, silver: s });
    }
    points.sort((a, b) => a.t - b.t);
    histCache.set(data.range, { data: points, at: Date.now() });
    return points;
  });
