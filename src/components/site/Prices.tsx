import { TrendingDown, TrendingUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { useI18n } from "@/lib/i18n";
import { usePrices } from "@/lib/use-prices";
import { scopeKey } from "@/lib/cities";
import { BIG_CHANGE_PCT, clearOverrides, trackNisabChange } from "@/lib/overrides";
import {
  GOLD_NISAB_G,
  SILVER_NISAB_G,
  formatMoney,
  goldNisabValue,
  perGram,
  silverNisabValue,
} from "@/lib/nisab";

/** Live prices resolved into the current country's currency (and city, if set). */
export function useNisab() {
  const { currency, lang, country, city } = useI18n();
  const { data: base, overrides, isLoading, isError, refetch } = usePrices();

  const scope =
    overrides?.scopes?.[scopeKey(country, city)] ?? overrides?.scopes?.[scopeKey(country, "")];

  const data = useMemo(() => {
    if (!base) return undefined;
    const goldUsdOz = scope?.goldUsdOz ?? base.goldUsdOz;
    const silverUsdOz = scope?.silverUsdOz ?? base.silverUsdOz;
    const rates =
      scope?.rate != null ? { ...base.rates, [currency]: scope.rate } : base.rates;
    return {
      ...base,
      goldUsdOz,
      silverUsdOz,
      rates,
      manual: base.manual || Boolean(scope),
    };
  }, [base, scope, currency]);

  const rate = data?.rates?.[currency];
  const ready = Boolean(data && Number.isFinite(rate));
  const r = rate ?? 1;

  const money = (v: number) => formatMoney(v, currency, lang);

  const values = useMemo(() => {
    if (!data || !ready) return null;
    const goldGram = perGram(data.goldUsdOz, r);
    const silverGram = perGram(data.silverUsdOz, r);
    const gold = goldNisabValue(data.goldUsdOz, r);
    const silver = silverNisabValue(data.silverUsdOz, r);
    return {
      goldGram,
      silverGram,
      gold,
      silver,
      lower: Math.min(gold, silver),
      ratio: data.goldUsdOz / data.silverUsdOz,
    };
  }, [data, r, ready]);

  return {
    data,
    market: base,
    values,
    money,
    rate: r,
    isLoading,
    isError,
    refetch,
    currency,
    scoped: Boolean(scope),
  };
}


export function StateNote({
  isLoading,
  isError,
  refetch,
}: {
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}) {
  const { t } = useI18n();
  if (isLoading)
    return (
      <div className="card-surface p-6 text-sm text-muted-foreground">{t("common.loading")}</div>
    );
  if (isError)
    return (
      <div className="card-surface p-6 text-sm">
        <p className="text-foreground">{t("common.error")}</p>
        <button
          onClick={() => refetch()}
          className="mt-3 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          {t("common.retry")}
        </button>
      </div>
    );
  return null;
}

function fmtDate(value: string | undefined, lang: string) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  try {
    return new Intl.DateTimeFormat(lang === "ar" ? "ar-EG" : lang, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(d);
  } catch {
    return d.toISOString().slice(0, 16).replace("T", " ");
  }
}

/** Last-update / source panel shown under the live figures. */
export function UpdateMeta() {
  const { t, lang } = useI18n();
  const { data } = useNisab();
  if (!data) return null;
  return (
    <div className="card-surface mt-6 grid gap-3 p-5 text-sm sm:grid-cols-3">
      <div>
        <p className="eyebrow text-muted-foreground">{t("update.metals")}</p>
        <p className="mt-1 text-foreground">{fmtDate(data.metalsUpdatedAt, lang)}</p>
        <p className="text-xs text-muted-foreground">
          {t("update.source")}: {data.metalsSource}
        </p>
      </div>
      <div>
        <p className="eyebrow text-muted-foreground">{t("update.rates")}</p>
        <p className="mt-1 text-foreground">{fmtDate(data.ratesUpdatedAt, lang)}</p>
        <p className="text-xs text-muted-foreground">
          {t("update.source")}: {data.ratesSource}
        </p>
      </div>
      <div>
        <p className="eyebrow text-muted-foreground">{t("update.fetched")}</p>
        <p className="mt-1 text-foreground">{fmtDate(data.fetchedAt, lang)}</p>
        <p className="text-xs text-muted-foreground">
          {data.manual ? t("update.manual") : t("update.auto")}
        </p>
      </div>
    </div>
  );
}

/** Warns that the figures on screen come from a manual override saved on this device. */
export function ManualNotice() {
  const { t } = useI18n();
  const { data, scoped } = useNisab();
  if (!data?.manual && !scoped) return null;
  return (
    <div className="mb-6 rounded-xl border border-accent/50 bg-accent/10 p-4 text-sm" role="status">
      <p className="font-medium text-foreground">{t("trust.manual.title")}</p>
      <p className="mt-1 text-muted-foreground">{t("trust.manual.body")}</p>
      <button
        onClick={() => clearOverrides()}
        className="mt-3 rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-foreground"
      >
        {t("trust.manual.reset")}
      </button>
    </div>
  );
}

/** Short, always-visible note that the numbers are indicative and not a fatwa. */
export function Disclaimer({ className = "" }: { className?: string }) {
  const { t } = useI18n();
  return (
    <p className={`text-xs text-muted-foreground ${className}`}>{t("trust.disclaimer")}</p>
  );
}

/** Compact "data as of …" line for placing next to the headline figures. */
export function AsOf({ className = "" }: { className?: string }) {
  const { t, lang } = useI18n();
  const { data } = useNisab();
  if (!data) return null;
  return (
    <p className={`text-xs text-muted-foreground ${className}`}>
      {t("trust.asof")}: <span className="num">{fmtDate(data.metalsUpdatedAt, lang)}</span> ·{" "}
      {data.metalsSource}
    </p>
  );
}

/** Alerts the visitor when the nisab moved sharply since their last visit. */
export function NisabAlert({ value }: { value: number | null | undefined }) {
  const { t, currency } = useI18n();
  const [pct, setPct] = useState<number | null>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (!value) return;
    const change = trackNisabChange(currency, value);
    if (change != null && Math.abs(change) >= BIG_CHANGE_PCT) setPct(change);
    else setPct(null);
    setHidden(false);
  }, [value, currency]);

  if (pct == null || hidden) return null;
  const up = pct > 0;
  const key = up ? "alert.up" : "alert.down";
  return (
    <div
      role="status"
      className={`card-surface mb-6 flex flex-wrap items-center gap-3 p-4 text-sm ${
        up
          ? "border-positive/50 bg-positive/10"
          : "border-negative/50 bg-negative/10"
      }`}
    >
      {up ? (
        <TrendingUp aria-hidden="true" className="size-4 text-positive" />
      ) : (
        <TrendingDown aria-hidden="true" className="size-4 text-negative" />
      )}
      <span className="text-foreground">
        {t(key).replace("{pct}", Math.abs(pct).toFixed(1))}
      </span>
      <button
        onClick={() => setHidden(true)}
        className="ms-auto rounded-lg border border-border px-3 py-1 text-xs text-muted-foreground hover:text-foreground"
      >
        {t("alert.dismiss")}
      </button>
    </div>
  );
}

export { GOLD_NISAB_G, SILVER_NISAB_G };
