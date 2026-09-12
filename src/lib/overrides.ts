/** Manual (admin) price overrides, stored locally in the browser. */

export type ScopeOverride = {
  goldUsdOz?: number;
  silverUsdOz?: number;
  rate?: number;
  currency?: string;
  updatedAt?: string;
};

export type Overrides = {
  goldUsdOz?: number;
  silverUsdOz?: number;
  rates?: Record<string, number>;
  /** Per country/city overrides, keyed by `${country}:${city|*}`. */
  scopes?: Record<string, ScopeOverride>;
  updatedAt?: string;
};

export type ManualPricePoint = {
  t: number;
  goldUsdOz: number;
  silverUsdOz: number;
  currency: string;
  rate: number;
  /** Empty string = country-wide entry. */
  city?: string;
  country?: string;
};

const LS_OVERRIDES = "nisab.overrides";
const LS_LAST_NISAB = "nisab.lastNisab";
const LS_MANUAL_HISTORY = "nisab.manualHistory";

export function readOverrides(): Overrides {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(LS_OVERRIDES) ?? "{}") as Overrides;
  } catch {
    return {};
  }
}

export function writeOverrides(next: Overrides) {
  localStorage.setItem(
    LS_OVERRIDES,
    JSON.stringify({ ...next, updatedAt: new Date().toISOString() }),
  );
  window.dispatchEvent(new Event("nisab-overrides"));
}

/** Saves (or clears) the manual prices for one country/city scope. */
export function writeScopeOverride(key: string, value: ScopeOverride | null) {
  const current = readOverrides();
  const scopes = { ...(current.scopes ?? {}) };
  if (value) scopes[key] = { ...value, updatedAt: new Date().toISOString() };
  else delete scopes[key];
  writeOverrides({ ...current, scopes });
}

export function clearOverrides() {
  localStorage.removeItem(LS_OVERRIDES);
  window.dispatchEvent(new Event("nisab-overrides"));
}

export function readManualHistory(): ManualPricePoint[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(LS_MANUAL_HISTORY) ?? "[]") as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((point): point is ManualPricePoint => {
      if (!point || typeof point !== "object") return false;
      const value = point as Partial<ManualPricePoint>;
      return (
        typeof value.t === "number" &&
        typeof value.goldUsdOz === "number" &&
        typeof value.silverUsdOz === "number" &&
        typeof value.currency === "string" &&
        typeof value.rate === "number"
      );
    });
  } catch {
    return [];
  }
}

/** Keeps the latest manual snapshot for each local calendar day, currency and city. */
export function recordManualPrice(point: Omit<ManualPricePoint, "t">) {
  const history = readManualHistory();
  const now = new Date();
  const day = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const next = history.filter((item) => {
    const itemDate = new Date(item.t);
    const itemDay = new Date(
      itemDate.getFullYear(),
      itemDate.getMonth(),
      itemDate.getDate(),
    ).getTime();
    return !(
      item.currency === point.currency &&
      (item.city ?? "") === (point.city ?? "") &&
      itemDay === day
    );
  });
  next.push({ ...point, t: Date.now() });
  localStorage.setItem(LS_MANUAL_HISTORY, JSON.stringify(next.slice(-1000)));
  window.dispatchEvent(new Event("nisab-overrides"));
}

/** Percentage move of the nisab value since the previously seen value. */
export function trackNisabChange(currency: string, value: number): number | null {
  if (typeof window === "undefined" || !Number.isFinite(value) || value <= 0) return null;
  let store: Record<string, number> = {};
  try {
    store = JSON.parse(localStorage.getItem(LS_LAST_NISAB) ?? "{}");
  } catch {
    store = {};
  }
  const prev = store[currency];
  store[currency] = value;
  localStorage.setItem(LS_LAST_NISAB, JSON.stringify(store));
  if (!prev || !Number.isFinite(prev)) return null;
  return ((value - prev) / prev) * 100;
}

/** Threshold (percent) above which a nisab move is worth alerting about. */
export const BIG_CHANGE_PCT = 3;
