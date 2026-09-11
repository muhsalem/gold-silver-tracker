/** Manual (admin) price overrides, stored locally in the browser. */

export type Overrides = {
  goldUsdOz?: number;
  silverUsdOz?: number;
  rates?: Record<string, number>;
  updatedAt?: string;
};

const LS_OVERRIDES = "nisab.overrides";
const LS_LAST_NISAB = "nisab.lastNisab";

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

export function clearOverrides() {
  localStorage.removeItem(LS_OVERRIDES);
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
