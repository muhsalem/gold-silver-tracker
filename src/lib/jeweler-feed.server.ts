/**
 * Daily local jeweller price feed. Reads public price boards of local jeweller
 * platforms and stores the bare 24K gram price (and buy-back where published).
 */
const OZ = 31.1034768;
const UA = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36" };

export type FeedRow = {
  country: string;
  currency: string;
  source: string;
  source_url: string;
  gold_gram: number | null;
  buyback_gram: number | null;
  silver_gram: number | null;
  /** Karat the source quotes; every current source quotes 24K (verified Oct 2026). */
  karat?: number;
};

async function text(url: string) {
  const res = await fetch(url, { headers: UA });
  if (!res.ok) throw new Error(`${url} ${res.status}`);
  return (await res.text())
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ");
}

const num = (s: string | undefined) => {
  const v = Number((s ?? "").replace(/,/g, ""));
  return Number.isFinite(v) && v > 0 ? v : null;
};

async function egypt(): Promise<FeedRow> {
  const url = "https://edahabapp.com/";
  const t = await text(url);
  const m = /عيار 24:\s*بيع:\s*([\d.,]+)\s*جنيه\s*شراء:\s*([\d.,]+)/.exec(t);
  if (!m) throw new Error("eDahab: pattern not found");
  return { country: "EG", currency: "EGP", source: "eDahab (مصر)", source_url: url, gold_gram: num(m[1]), buyback_gram: num(m[2]), silver_gram: null };
}

async function saudi(): Promise<FeedRow> {
  const url = "https://saudigoldprice.com/";
  const t = await text(url);
  const m = /سعر جرام الذهب عيار 24\s*([\d.,]+)/.exec(t);
  if (!m) throw new Error("saudigoldprice: pattern not found");
  return { country: "SA", currency: "SAR", source: "Saudi Gold Price (السعودية)", source_url: url, gold_gram: num(m[1]), buyback_gram: null, silver_gram: null };
}

async function uae(): Promise<FeedRow> {
  const url = "https://www.dubaicityofgold.com/";
  const t = await text(url);
  const m = /24K Gold\s*AED\s*([\d.,]+)/.exec(t);
  if (!m) throw new Error("Dubai City of Gold: pattern not found");
  return { country: "AE", currency: "AED", source: "Dubai City of Gold (DGJG)", source_url: url, gold_gram: num(m[1]), buyback_gram: null, silver_gram: null };
}

async function kitcoBidGramUsd(): Promise<number> {
  const t = await text("https://www.kitco.com/charts/gold");
  const m = /24K Gold 99\.99%[^$]*\$([\d,]+\.\d+)/.exec(t);
  const oz = num(m?.[1]);
  if (!oz) throw new Error("Kitco: pattern not found");
  return oz / OZ;
}

async function northAmerica(): Promise<FeedRow[]> {
  const url = "https://www.kitco.com/charts/gold";
  const usd = await kitcoBidGramUsd();
  const rows: FeedRow[] = [
    { country: "US", currency: "USD", source: "Kitco (dealer bid)", source_url: url, gold_gram: usd, buyback_gram: usd, silver_gram: null },
  ];
  try {
    const fx = (await (await fetch("https://open.er-api.com/v6/latest/USD")).json()) as { rates?: Record<string, number> };
    const cad = Number(fx.rates?.["CAD"]);
    if (cad > 0) rows.push({ country: "CA", currency: "CAD", source: "Kitco Montreal (dealer bid)", source_url: url, gold_gram: usd * cad, buyback_gram: usd * cad, silver_gram: null });
  } catch {
    /* CAD skipped when the rate is unavailable */
  }
  return rows;
}

export async function collectFeed(): Promise<{ rows: FeedRow[]; errors: string[] }> {
  const jobs: Promise<FeedRow | FeedRow[]>[] = [egypt(), saudi(), uae(), northAmerica()];
  const settled = await Promise.allSettled(jobs);
  const rows: FeedRow[] = [];
  const errors: string[] = [];
  for (const s of settled) {
    if (s.status === "fulfilled") rows.push(...(Array.isArray(s.value) ? s.value : [s.value]));
    else errors.push(String(s.reason instanceof Error ? s.reason.message : s.reason));
  }
  // Normalize any non-24K quote to pure 24K (gram / purity) before use.
  for (const r of rows) {
    const k = r.karat ?? 24;
    if (k !== 24 && r.gold_gram) {
      r.gold_gram = r.gold_gram / (k / 24);
      if (r.buyback_gram) r.buyback_gram = r.buyback_gram / (k / 24);
    }
    r.karat = 24;
  }
  return { rows: rows.filter((r) => r.gold_gram), errors };
}

export const BIG_CHANGE_PCT = 3;
/** Feed rows deviating more than this from the spot conversion are skipped. */
export const MAX_SPOT_DEVIATION_PCT = 15;
