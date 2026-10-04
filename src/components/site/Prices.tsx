import { TrendingDown, TrendingUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { useI18n } from "@/lib/i18n";
import { usePrices } from "@/lib/use-prices";
import { scopeKey } from "@/lib/cities";
import { useLocalQuote } from "@/lib/local-quotes";

const LQ = {
  ar: {
    live: "سعر صاغة محلي معتمد (وسيط آخر ٧٢ ساعة)",
    count: "عدد الأسعار:",
    warnTitle: "تنبيه: لا يوجد سعر صاغة محلي معتمد حاليًا.",
    warn: "المعروض هو السعر العالمي المجرّد للجرام محوّلًا بسعر الصرف، من مصدرين موثوقين (gold-api.com، واحتياطيًا Yahoo Finance/COMEX). قد يختلف عن سعر الصاغة في بلدك؛ تحقّق منه قبل إخراج الزكاة.",
  },
  en: {
    live: "Approved local jeweller price (median of last 72h)",
    count: "Quotes:",
    warnTitle: "Warning: no approved local jeweller price right now.",
    warn: "Showing the bare global gram price converted at the exchange rate, from two trusted sources (gold-api.com, with Yahoo Finance/COMEX as fallback). It may differ from jewellers in your country; verify before paying zakat.",
  },
  fr: {
    live: "Prix local approuvé des bijoutiers (médiane 72 h)",
    count: "Cotations :",
    warnTitle: "Attention : aucun prix local approuvé pour le moment.",
    warn: "Prix mondial brut du gramme converti au taux de change, issu de deux sources fiables (gold-api.com, repli Yahoo Finance/COMEX). Il peut différer des bijoutiers locaux ; vérifiez avant de payer la zakat.",
  },
  tr: {
    live: "Onaylı yerel kuyumcu fiyatı (son 72 saat medyanı)",
    count: "Fiyat sayısı:",
    warnTitle: "Uyarı: şu anda onaylı yerel kuyumcu fiyatı yok.",
    warn: "Gösterilen, iki güvenilir kaynaktan (gold-api.com, yedek Yahoo Finance/COMEX) döviz kuruyla çevrilmiş saf küresel gram fiyatıdır. Yerel kuyumculardan farklı olabilir; zekât öncesi doğrulayın.",
  },
  id: {
    live: "Harga toko emas lokal disetujui (median 72 jam)",
    count: "Jumlah harga:",
    warnTitle: "Peringatan: belum ada harga toko emas lokal yang disetujui.",
    warn: "Ditampilkan harga gram global murni yang dikonversi kurs, dari dua sumber tepercaya (gold-api.com, cadangan Yahoo Finance/COMEX). Bisa berbeda dari toko emas setempat; periksa sebelum membayar zakat.",
  },
  ur: {
    live: "منظور شدہ مقامی سنار کی قیمت (آخری ۷۲ گھنٹے کا وسطانیہ)",
    count: "قیمتوں کی تعداد:",
    warnTitle: "انتباہ: ابھی کوئی منظور شدہ مقامی سنار کی قیمت موجود نہیں۔",
    warn: "دکھائی گئی قیمت دو معتبر ذرائع (gold-api.com، متبادل Yahoo Finance/COMEX) سے عالمی خالص فی گرام قیمت ہے جو شرحِ مبادلہ سے تبدیل کی گئی۔ مقامی سناروں سے مختلف ہو سکتی ہے؛ زکوٰۃ سے پہلے تصدیق کریں۔",
  },
};
import { notify, readHawl } from "@/lib/reminders";
import {
  BIG_CHANGE_PCT,
  clearOverrides,
  recordManualPrice,
  trackNisabChange,
  writeScopeOverride,
} from "@/lib/overrides";
import {
  buyBack,
  clampSpread,
  readLocalMarket,
  writeLocalMarket,
  type LocalMarket as LocalMarketSettings,
} from "@/lib/local-market";
import {
  GOLD_NISAB_G,
  SILVER_NISAB_G,
  TROY_OUNCE_G,
  formatMoney,
  goldNisabValue,
  perGram,
  silverNisabValue,
} from "@/lib/nisab";

export type PriceOrigin = "manual" | "local" | "global";
export type PricePreference = "local" | "global";

const PS = {
  ar: { local: "سعر صاغة محلي", global: "سعر عالمي محوَّل", manual: "سعر أدخلته بنفسك", gold: "الذهب", silver: "الفضة", toggleLocal: "سعر السوق المحلي", toggleGlobal: "السعر العالمي" },
  en: { local: "Local jeweller price", global: "Converted global price", manual: "Your own price", gold: "Gold", silver: "Silver", toggleLocal: "Local market price", toggleGlobal: "Global price" },
  fr: { local: "Prix local des bijoutiers", global: "Prix mondial converti", manual: "Votre propre prix", gold: "Or", silver: "Argent", toggleLocal: "Prix du marché local", toggleGlobal: "Prix mondial" },
  tr: { local: "Yerel kuyumcu fiyatı", global: "Çevrilmiş küresel fiyat", manual: "Kendi girdiğiniz fiyat", gold: "Altın", silver: "Gümüş", toggleLocal: "Yerel piyasa fiyatı", toggleGlobal: "Küresel fiyat" },
  id: { local: "Harga toko emas lokal", global: "Harga global dikonversi", manual: "Harga Anda sendiri", gold: "Emas", silver: "Perak", toggleLocal: "Harga pasar lokal", toggleGlobal: "Harga global" },
  ur: { local: "مقامی سنار کی قیمت", global: "تبدیل شدہ عالمی قیمت", manual: "آپ کی درج کردہ قیمت", gold: "سونا", silver: "چاندی", toggleLocal: "مقامی مارکیٹ قیمت", toggleGlobal: "عالمی قیمت" },
};
export function priceStrings(lang: string) {
  return PS[lang as keyof typeof PS] ?? PS.en;
}

/**
 * Resolves the gram price per metal. Precedence:
 * visitor's own device override > approved local quote > global spot.
 */
export function resolveGram(
  spot: number,
  manual: boolean,
  local: number | null | undefined,
  prefer: PricePreference = "local",
): { gram: number; origin: PriceOrigin } {
  if (manual) return { gram: spot, origin: "manual" };
  if (prefer === "local" && local != null && local > 0) return { gram: local, origin: "local" };
  return { gram: spot, origin: "global" };
}

/** Live prices resolved into the current country's currency (and city, if set). */
export function useNisab(prefer: PricePreference = "local") {
  const { currency, lang, country, city } = useI18n();
  const { data: base, overrides, isLoading, isError, refetch } = usePrices();
  const { data: quote } = useLocalQuote(country, currency);

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

  const resolved = useMemo(() => {
    if (!data || !ready) return null;
    const manual = Boolean(data.manual);
    const g = resolveGram(perGram(data.goldUsdOz, r), manual, quote?.goldGram, prefer);
    const s = resolveGram(perGram(data.silverUsdOz, r), manual, quote?.silverGram, prefer);
    return { g, s };
  }, [data, r, ready, quote, prefer]);

  const values = useMemo(() => {
    if (!resolved) return null;
    const goldGram = resolved.g.gram;
    const silverGram = resolved.s.gram;
    const gold = goldGram * GOLD_NISAB_G;
    const silver = silverGram * SILVER_NISAB_G;
    return {
      goldGram,
      silverGram,
      gold,
      silver,
      lower: Math.min(gold, silver),
      ratio: goldGram / silverGram,
    };
  }, [resolved]);

  const priceSource = resolved
    ? {
        gold: resolved.g.origin,
        silver: resolved.s.origin,
        name: quote?.source ?? "",
        at: quote?.at ?? "",
      }
    : null;

  return {
    data,
    market: base,
    values,
    priceSource,
    money,
    rate: r,
    isLoading,
    isError,
    refetch,
    currency,
    scoped: Boolean(scope),
  };
}

/** "Local jeweller price: eDahab · 3 Oct" / "Converted global price", per metal. */
export function PriceSourceLine({
  source,
  className = "",
}: {
  source: { gold: PriceOrigin; silver: PriceOrigin; name: string; at: string } | null;
  className?: string;
}) {
  const { lang } = useI18n();
  if (!source) return null;
  const s = priceStrings(lang);
  const day = source.at
    ? new Intl.DateTimeFormat(lang === "ar" ? "ar-EG" : lang, { day: "numeric", month: "long" }).format(new Date(source.at))
    : "";
  const label = (o: PriceOrigin) =>
    o === "local" ? `${s.local}: ${source.name}${day ? ` · ${day}` : ""}` : o === "manual" ? s.manual : s.global;
  const same = source.gold === source.silver;
  return (
    <p className={`text-xs text-muted-foreground ${className}`} data-testid="price-source">
      {same ? label(source.gold) : `${s.gold}: ${label(source.gold)} — ${s.silver}: ${label(source.silver)}`}
    </p>
  );
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

const LS_CONFIRMED = "nisab.priceConfirmed";

function readConfirmed(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(LS_CONFIRMED) ?? "{}") as Record<string, string>;
  } catch {
    return {};
  }
}

/**
 * Lets the visitor verify the gold/silver gram price against their own city
 * and correct it when the local market differs from the global feed.
 */
export function CityPriceCheck() {
  const { t, lang, country, city, currency } = useI18n();
  const { data, values, money, rate } = useNisab();
  const key = scopeKey(country, city);
  const [open, setOpen] = useState(false);
  const [gold, setGold] = useState("");
  const [silver, setSilver] = useState("");
  const [confirmedAt, setConfirmedAt] = useState<string | undefined>(undefined);

  useEffect(() => {
    setConfirmedAt(readConfirmed()[key]);
    setOpen(false);
    setGold("");
    setSilver("");
  }, [key]);

  if (!values || !data) return null;

  const confirm = () => {
    const store = { ...readConfirmed(), [key]: new Date().toISOString() };
    localStorage.setItem(LS_CONFIRMED, JSON.stringify(store));
    setConfirmedAt(store[key]);
    setOpen(false);
  };

  const save = () => {
    const g = parseFloat(gold);
    const s = parseFloat(silver);
    const goldUsdOz =
      Number.isFinite(g) && g > 0 ? (g / rate) * TROY_OUNCE_G : data.goldUsdOz;
    const silverUsdOz =
      Number.isFinite(s) && s > 0 ? (s / rate) * TROY_OUNCE_G : data.silverUsdOz;
    writeScopeOverride(key, { goldUsdOz, silverUsdOz, rate, currency });
    recordManualPrice({ goldUsdOz, silverUsdOz, currency, rate, country, city });
    confirm();
  };

  return (
    <section className="card-surface mt-6 p-5">
      <h2 className="text-base text-foreground">{t("verify.title")}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{t("verify.sub")}</p>
      <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
        <div className="flex items-baseline justify-between gap-2 rounded-lg bg-secondary px-3 py-2">
          <dt className="text-muted-foreground">
            {t("gold")} · {t("perGram")}
          </dt>
          <dd className="num text-foreground">{money(values.goldGram)}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-2 rounded-lg bg-secondary px-3 py-2">
          <dt className="text-muted-foreground">
            {t("silver")} · {t("perGram")}
          </dt>
          <dd className="num text-foreground">{money(values.silverGram)}</dd>
        </div>
      </dl>

      {!open && (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={confirm}
            className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground"
          >
            {t("verify.match")}
          </button>
          <button
            onClick={() => setOpen(true)}
            className="rounded-lg border border-border bg-card px-4 py-2 text-sm text-foreground"
          >
            {t("verify.differs")}
          </button>
        </div>
      )}

      {open && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="text-muted-foreground">
              {t("verify.goldInput")} ({currency})
            </span>
            <input
              inputMode="decimal"
              value={gold}
              onChange={(e) => setGold(e.target.value)}
              className="num mt-1 w-full rounded-lg border border-input bg-card px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
          <label className="block text-sm">
            <span className="text-muted-foreground">
              {t("verify.silverInput")} ({currency})
            </span>
            <input
              inputMode="decimal"
              value={silver}
              onChange={(e) => setSilver(e.target.value)}
              className="num mt-1 w-full rounded-lg border border-input bg-card px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
          <div className="flex flex-wrap gap-2 sm:col-span-2">
            <button
              onClick={save}
              className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground"
            >
              {t("verify.save")}
            </button>
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg border border-border bg-card px-4 py-2 text-sm text-foreground"
            >
              {t("verify.cancel")}
            </button>
          </div>
        </div>
      )}

      {confirmedAt && !open && (
        <p className="mt-3 text-xs text-muted-foreground" role="status">
          {t("verify.confirmed")}: <span className="num">{fmtDate(confirmedAt, lang)}</span>
        </p>
      )}
      <p className="mt-2 text-xs text-muted-foreground">{t("verify.note")}</p>
    </section>
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
    if (change != null && Math.abs(change) >= BIG_CHANGE_PCT) {
      setPct(change);
      if (readHawl().nisabAlerts) {
        notify(
          t("hawl.notifyTitle"),
          t(change > 0 ? "alert.up" : "alert.down").replace(
            "{pct}",
            Math.abs(change).toFixed(1),
          ),
        );
      }
    } else setPct(null);
    setHidden(false);
  }, [value, currency, t]);

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

/**
 * Per-country data-reliability panel: which feed produced each number,
 * its market, refresh frequency and an explicit quality grade.
 */
export function SourceQuality({ currency }: { currency?: string }) {
  const { t, lang, currency: active } = useI18n();
  const { data, market } = useNisab();
  const code = currency ?? active;
  if (!data) return null;

  const meta = market as typeof data | undefined;
  const metals = meta?.metals;
  const fx = meta?.fx;
  const rateOk = Number.isFinite(data.rates?.[code]);

  const badge = (quality: string) => {
    const tone =
      quality === "live"
        ? "bg-positive/15 text-positive"
        : quality === "delayed"
          ? "bg-accent/20 text-foreground"
          : "bg-negative/15 text-negative";
    return (
      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${tone}`}>
        {t(`quality.${quality}`)}
      </span>
    );
  };

  const rows = [
    {
      label: t("update.metals"),
      source: data.metalsSource,
      market: metals?.market ?? "—",
      frequency: metals?.frequency ?? "—",
      quality: data.manual ? "manual" : (metals?.quality ?? "delayed"),
      at: fmtDate(data.metalsUpdatedAt, lang),
      url: metals?.url,
      fallback: (metals?.fallbackDepth ?? 0) > 0,
    },
    {
      label: t("update.rates"),
      source: data.ratesSource,
      market: fx?.market ?? "—",
      frequency: fx?.frequency ?? "—",
      quality: rateOk ? (fx?.quality ?? "delayed") : "stale",
      at: fmtDate(data.ratesUpdatedAt, lang),
      url: fx?.url,
      fallback: (fx?.fallbackDepth ?? 0) > 0,
    },
  ];

  return (
    <section className="card-surface mt-4 overflow-hidden">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-4">
        <h2 className="text-base text-foreground">{t("quality.title")}</h2>
        <span className="num text-xs text-muted-foreground">{code}</span>
      </header>
      <div className="grid gap-4 p-5 sm:grid-cols-2">
        {rows.map((row) => (
          <article key={row.label} className="rounded-xl border border-border p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="eyebrow text-muted-foreground">{row.label}</p>
              {badge(row.quality)}
            </div>
            <p className="mt-2 text-sm text-foreground">{row.source}</p>
            <dl className="mt-3 grid gap-1 text-xs text-muted-foreground">
              <div className="flex justify-between gap-3">
                <dt>{t("quality.market")}</dt>
                <dd className="text-end text-foreground">{row.market}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>{t("quality.frequency")}</dt>
                <dd className="text-end text-foreground">{row.frequency}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>{t("quality.updated")}</dt>
                <dd className="num text-end text-foreground">{row.at}</dd>
              </div>
            </dl>
            {row.fallback && <p className="mt-2 text-xs text-accent">{t("quality.fallback")}</p>}
            {row.url && (
              <a
                href={row.url}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-xs text-primary underline underline-offset-4"
              >
                {t("quality.viewSource")}
              </a>
            )}
          </article>
        ))}
      </div>
      {!rateOk && (
        <p className="border-t border-border px-5 py-3 text-xs text-negative">
          {t("quality.noRate").replace("{currency}", code)}
        </p>
      )}
      <p className="border-t border-border px-5 py-3 text-xs text-muted-foreground">
        {t("quality.note")}
      </p>
    </section>
  );
}

/**
 * Local jeweller market layer: the bare 24K gram price inside the visitor's own
 * country, stripped of making charges, and the jeweller buy-back (liquidation)
 * price used in precise zakat accounting.
 */
export function LocalMarket({
  currency: currencyProp,
  rate: rateProp,
  goldGram: goldGramProp,
  silverGram: silverGramProp,
}: {
  currency?: string;
  rate?: number;
  goldGram?: number;
  silverGram?: number;
}) {
  const { t, lang, country, city, currency: activeCurrency } = useI18n();
  const { values, data, scoped } = useNisab();
  const key = scopeKey(country, city);
  const [local, setLocal] = useState<LocalMarketSettings>({ spreadPct: 0, jeweler: false });
  const [draft, setDraft] = useState("0");

  useEffect(() => {
    const sync = () => {
      const next = readLocalMarket(key);
      setLocal(next);
      setDraft(String(next.spreadPct));
    };
    sync();
    window.addEventListener("nisab-overrides", sync);
    return () => window.removeEventListener("nisab-overrides", sync);
  }, [key]);

  const currency = currencyProp ?? activeCurrency;
  const quote = useLocalQuote(country, currency).data ?? null;
  const spotGold = goldGramProp ?? values?.goldGram;
  const spotSilver = silverGramProp ?? values?.silverGram;
  if (!data || spotGold == null || spotSilver == null) return null;

  const L = LQ[lang as keyof typeof LQ] ?? LQ.en;
  const money = (v: number) => formatMoney(v, currency, lang);
  const goldGram = quote?.goldGram ?? spotGold;
  const silverGram = quote?.silverGram ?? spotSilver;
  const goldBuy = quote?.buybackGram ?? buyBack(goldGram, local.spreadPct);
  const silverBuy = buyBack(silverGram, local.spreadPct);
  const jeweler = Boolean(quote) || scoped || local.jeweler;
  void rateProp;

  const apply = () => {
    const parsed = parseFloat(draft);
    writeLocalMarket(key, { spreadPct: clampSpread(parsed) });
  };

  return (
    <section className="card-surface mt-4 p-5">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base text-foreground">{t("local.title")}</h2>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            jeweler ? "bg-positive/15 text-positive" : "bg-accent/20 text-foreground"
          }`}
        >
          {t(jeweler ? "local.badge.jeweler" : "local.badge.derived")}
        </span>
      </header>
      <p className="mt-1 text-sm text-muted-foreground">{t("local.sub")}</p>

      {quote ? (
        <p className="mt-3 rounded-lg bg-positive/10 px-3 py-2 text-xs leading-6 text-foreground">
          {L.live} · {quote.city || "—"} · {quote.source || "—"} ·{" "}
          <span className="num">{fmtDate(quote.at, lang)}</span> · {L.count}{" "}
          <span className="num">{quote.count}</span>
        </p>
      ) : (
        <p
          role="alert"
          className="mt-3 rounded-lg border border-accent bg-accent/15 px-3 py-2 text-xs leading-6 text-foreground"
        >
          <strong>{L.warnTitle}</strong> {L.warn}
          <span className="block text-muted-foreground">{data.metals.source}</span>
        </p>
      )}

      <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
        {[
          { label: t("local.goldQuote"), value: money(goldGram) },
          { label: t("local.silverQuote"), value: money(silverGram) },
          { label: t("local.goldBuy"), value: money(goldBuy) },
          { label: t("local.silverBuy"), value: money(silverBuy) },
          { label: t("local.goldNisab"), value: money(goldBuy * GOLD_NISAB_G) },
          { label: t("local.silverNisab"), value: money(silverBuy * SILVER_NISAB_G) },
        ].map((row) => (
          <div
            key={row.label}
            className="flex items-baseline justify-between gap-2 rounded-lg bg-secondary px-3 py-2"
          >
            <dt className="text-muted-foreground">{row.label}</dt>
            <dd className="num text-foreground">{row.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-4 flex flex-wrap items-end gap-3">
        <label className="block text-sm">
          <span className="text-muted-foreground">{t("local.spread")}</span>
          <input
            inputMode="decimal"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="num mt-1 w-32 rounded-lg border border-input bg-card px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-ring"
          />
        </label>
        <button
          onClick={apply}
          className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          {t("local.apply")}
        </button>
        {local.updatedAt && (
          <span className="text-xs text-muted-foreground">
            {t("verify.confirmed")}: <span className="num">{fmtDate(local.updatedAt, lang)}</span>
          </span>
        )}
      </div>

      <ul className="mt-4 space-y-1 text-xs leading-6 text-muted-foreground">
        <li>{t("local.rule.pure")}</li>
        <li>{t("local.rule.nomaking")}</li>
        <li>{t("local.rule.hawlday")}</li>
        <li>{t("local.rule.buyback")}</li>
      </ul>
      <p className="mt-2 text-xs text-muted-foreground">{t("local.note")}</p>
    </section>
  );
}

export { GOLD_NISAB_G, SILVER_NISAB_G };
