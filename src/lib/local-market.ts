/**
 * Local jeweler market layer.
 *
 * The global feed gives an international spot price. What a zakat payer needs is
 * the bare metal price inside their own country on the day the hawl completes —
 * as quoted by local jewellers, stripped of making charges, hallmark and tax,
 * and (for precise accounting) at the jeweller's buy-back price.
 *
 * This module only stores the visitor's own local-market settings; all zakat
 * math stays in `nisab.ts`.
 */

export type LocalMarket = {
  /** Jeweller buy-back discount against the quoted gram price, in percent. */
  spreadPct: number;
  /** Whether a real local jeweller quote was entered for this scope. */
  jeweler: boolean;
  updatedAt?: string;
};

export const DEFAULT_SPREAD_PCT = 0;
/** Sane bounds: a buy-back discount outside this range is almost certainly a typo. */
export const MAX_SPREAD_PCT = 15;

const LS_LOCAL = "nisab.localMarket";

export function readLocalMarkets(): Record<string, LocalMarket> {
  if (typeof window === "undefined") return {};
  try {
    const parsed = JSON.parse(localStorage.getItem(LS_LOCAL) ?? "{}") as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as Record<string, LocalMarket>;
  } catch {
    return {};
  }
}

export function readLocalMarket(key: string): LocalMarket {
  const stored = readLocalMarkets()[key];
  return {
    spreadPct: clampSpread(stored?.spreadPct ?? DEFAULT_SPREAD_PCT),
    jeweler: Boolean(stored?.jeweler),
    ...(stored?.updatedAt ? { updatedAt: stored.updatedAt } : {}),
  };
}

export function writeLocalMarket(key: string, value: Partial<LocalMarket>) {
  const all = readLocalMarkets();
  const current = readLocalMarket(key);
  all[key] = {
    ...current,
    ...value,
    spreadPct: clampSpread(value.spreadPct ?? current.spreadPct),
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(LS_LOCAL, JSON.stringify(all));
  window.dispatchEvent(new Event("nisab-overrides"));
}

export function clampSpread(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_SPREAD_PCT;
  return Math.min(MAX_SPREAD_PCT, Math.max(0, value));
}

/** Jeweller buy-back (liquidation) price for one gram. */
export function buyBack(gramPrice: number, spreadPct: number): number {
  return gramPrice * (1 - clampSpread(spreadPct) / 100);
}
