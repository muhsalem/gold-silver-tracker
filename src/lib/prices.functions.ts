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

export type HistoryRange =
  | "1mo"
  | "6mo"
  | "1y"
  | "5y"
  | "10y"
  | "1448"
  | "20y"
  | "30y"
  | "40y"
  | "50y"
  | "100y";
export type HistoryPoint = { t: number; gold: number; silver: number; rate: number };
export type HistoryResponse = {
  points: HistoryPoint[];
  currency: string;
  fxAvailable: boolean;
  metalsSource: string;
  ratesSource: string;
  /** Long ranges use annual averages converted with today's exchange rate. */
  approx?: boolean;
};

export const LONG_RANGES: Record<string, number> = {
  "20y": 20,
  "30y": 30,
  "40y": 40,
  "50y": 50,
  "100y": 100,
};

const histCache = new Map<string, { data: HistoryPoint[]; at: number }>();


async function yahooSeries(symbol: string, range: HistoryRange) {
  const interval = range === "1mo" ? "1d" : range === "6mo" || range === "1y" ? "1d" : "1wk";
  const timeQuery = range === "1448"
    ? `period1=${Math.floor(new Date("2026-06-16T00:00:00Z").getTime() / 1000)}&period2=${Math.floor(Date.now() / 1000)}`
    : `range=${range}`;
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?${timeQuery}&interval=${interval}`;
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
  .inputValidator((data: { range: HistoryRange; currency: string }) => {
    const allowed: HistoryRange[] = [
      "1mo", "6mo", "1y", "5y", "10y", "1448", "20y", "30y", "40y", "50y", "100y",
    ];
    const range = allowed.includes(data?.range) ? data.range : "1y";
    const currency = /^[A-Z]{3}$/.test(data?.currency) ? data.currency : "USD";
    return { range, currency };
  })
  .handler(async ({ data }): Promise<HistoryResponse> => {
    const longYears = LONG_RANGES[data.range];
    if (longYears) {
      let rate = 1;
      if (data.currency !== "USD") {
        try {
          const live = await getLivePrices();
          rate = live.rates[data.currency] ?? 0;
        } catch {
          rate = 0;
        }
        if (!rate) {
          return {
            points: [],
            currency: data.currency,
            fxAvailable: false,
            metalsSource: "متوسطات سنوية تاريخية (USD/oz)",
            ratesSource: `سعر صرف غير متاح لـ ${data.currency}`,
            approx: true,
          };
        }
      }
      const points: HistoryPoint[] = annualSince(longYears).map((p) => ({
        t: Date.UTC(p.year, 6, 1),
        gold: p.gold,
        silver: p.silver,
        rate,
      }));
      return {
        points,
        currency: data.currency,
        fxAvailable: true,
        metalsSource: "متوسطات سنوية تاريخية للذهب والفضة (USD/oz)",
        ratesSource:
          data.currency === "USD" ? "USD base rate" : `سعر الصرف الحالي لـ ${data.currency}`,
        approx: true,
      };
    }

    const cacheKey = `${data.range}:${data.currency}`;
    const hit = histCache.get(cacheKey);
    if (hit && Date.now() - hit.at < TTL_MS) {
      return {

        points: hit.data,
        currency: data.currency,
        fxAvailable: true,
        metalsSource: "Yahoo Finance (GC=F, SI=F)",
        ratesSource: data.currency === "USD" ? "USD base rate" : `Yahoo Finance (${data.currency}=X)`,
      };
    }

    const [gold, silver, fx] = await Promise.all([
      yahooSeries("GC=F", data.range),
      yahooSeries("SI=F", data.range),
      data.currency === "USD"
        ? Promise.resolve(new Map<number, number>())
        : yahooSeries(`${data.currency}=X`, data.range).catch(() => new Map<number, number>()),
    ]);

    if (data.currency !== "USD" && fx.size === 0) {
      return {
        points: [],
        currency: data.currency,
        fxAvailable: false,
        metalsSource: "Yahoo Finance (GC=F, SI=F)",
        ratesSource: `Historical exchange rate unavailable for ${data.currency}`,
      };
    }

    const points: HistoryPoint[] = [];
    const fxEntries = [...fx.entries()].sort((a, b) => a[0] - b[0]);
    let fxIndex = 0;
    let lastRate = data.currency === "USD" ? 1 : undefined;
    for (const [t, g] of gold) {
      const s = silver.get(t);
      while (fxIndex < fxEntries.length) {
        const fxEntry = fxEntries[fxIndex];
        if (!fxEntry || fxEntry[0] > t + 36 * 60 * 60 * 1000) break;
        lastRate = fxEntry[1];
        fxIndex += 1;
      }
      if (typeof s === "number" && typeof lastRate === "number") {
        points.push({ t, gold: g, silver: s, rate: lastRate });
      }
    }
    points.sort((a, b) => a.t - b.t);
    histCache.set(cacheKey, { data: points, at: Date.now() });
    return {
      points,
      currency: data.currency,
      fxAvailable: true,
      metalsSource: "Yahoo Finance (GC=F, SI=F)",
      ratesSource: data.currency === "USD" ? "USD base rate" : `Yahoo Finance (${data.currency}=X)`,
    };
  });
