import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import { CalendarSearch, Download } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Page } from "@/components/site/Page";
import { CityPicker, CountryPicker } from "@/components/site/Shell";
import {
  CityPriceCheck,
  Disclaimer,
  ManualNotice,
  useNisab,
} from "@/components/site/Prices";
import { Button } from "@/components/ui/button";
import {
  formatGregorianIso,
  formatHijri,
  gregorianToHijri,
  hijriMonthDays,
  hijriToGregorian,
  HIJRI_MONTHS_AR,
  HIJRI_MONTHS_EN,
} from "@/lib/calendars";
import { useI18n } from "@/lib/i18n";
import { GOLD_NISAB_G, SILVER_NISAB_G, TROY_OUNCE_G } from "@/lib/nisab";
import { readManualHistory, type ManualPricePoint } from "@/lib/overrides";
import { getHistory, type HistoryRange, type HistoryResponse } from "@/lib/prices.functions";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "الأسعار التاريخية للنصاب · نِصاب" },
      {
        name: "description",
        content: "تتبّع قيمة نصاب الذهب والفضّة خلال شهر أو سنة أو عشر سنوات بعملة بلدك.",
      },
      { property: "og:title", content: "الأسعار التاريخية للنصاب · نِصاب" },
      {
        property: "og:description",
        content: "رسوم بيانية لقيمة نصاب الذهب والفضّة عبر الزمن.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: History,
});

const RANGES: HistoryRange[] = [
  "1mo", "6mo", "1y", "5y", "10y", "20y", "30y", "40y", "50y", "100y",
];

function History() {
  const { t, lang, currency, city } = useI18n();
  const { money } = useNisab();
  const [range, setRange] = useState<HistoryRange>("1y");
  const [metal, setMetal] = useState<"gold" | "silver">("gold");
  const [calendar, setCalendar] = useState<"gregorian" | "hijri">("gregorian");
  const [lookupDate, setLookupDate] = useState("");
  const currentHijri = useMemo(() => gregorianToHijri(new Date()), []);
  const [hijriYear, setHijriYear] = useState(currentHijri.year);
  const [hijriMonth, setHijriMonth] = useState(currentHijri.month);
  const [hijriDay, setHijriDay] = useState(currentHijri.day);
  const [manualHistory, setManualHistory] = useState<ManualPricePoint[]>([]);

  useEffect(() => {
    const sync = () => setManualHistory(readManualHistory());
    sync();
    window.addEventListener("nisab-overrides", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("nisab-overrides", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const fetchHistory = useServerFn(getHistory);
  const { data, isLoading, isError, refetch } = useQuery<HistoryResponse>({
    queryKey: ["history", range, currency],
    queryFn: () => fetchHistory({ data: { range, currency } }),
    staleTime: 60 * 60 * 1000,
  });

  const grams = metal === "gold" ? GOLD_NISAB_G : SILVER_NISAB_G;

  const series = useMemo(
    () =>
      [
        ...(data?.points ?? []).map((p) => ({
          t: p.t,
          value: ((metal === "gold" ? p.gold : p.silver) / TROY_OUNCE_G) * p.rate * grams,
          manual: false,
        })),
        ...manualHistory
          .filter((p) => p.currency === currency && (p.city ?? "") === city)
          .map((p) => ({
            t: p.t,
            value:
              ((metal === "gold" ? p.goldUsdOz : p.silverUsdOz) / TROY_OUNCE_G) *
              p.rate *
              grams,
            manual: true,
          })),
      ]
        .filter((p) => range !== "1448" || p.t >= new Date("2026-06-16T00:00:00Z").getTime())
        .sort((a, b) => a.t - b.t),
    [data, manualHistory, currency, city, metal, grams, range],
  );

  const stats = useMemo(() => {
    if (series.length === 0) return null;
    const vals = series.map((s) => s.value);
    const first = vals[0];
    const last = vals[vals.length - 1];
    if (first == null || last == null) return null;
    return {
      high: Math.max(...vals),
      low: Math.min(...vals),
      average: vals.reduce((sum, value) => sum + value, 0) / vals.length,
      change: ((last - first) / first) * 100,
      last,
    };
  }, [series]);

  const selectedDate = useMemo(() => {
    if (calendar === "gregorian") {
      if (!lookupDate) return null;
      const date = new Date(`${lookupDate}T12:00:00Z`);
      return Number.isNaN(date.getTime()) ? null : date;
    }
    if (hijriYear < 1 || hijriMonth < 1 || hijriMonth > 12) return null;
    const safeDay = Math.min(Math.max(1, hijriDay), hijriMonthDays(hijriYear, hijriMonth));
    return hijriToGregorian({ year: hijriYear, month: hijriMonth, day: safeDay });
  }, [calendar, lookupDate, hijriYear, hijriMonth, hijriDay]);

  const nearest = useMemo(() => {
    if (!selectedDate || series.length === 0) return null;
    const target = selectedDate.getTime();
    return series.reduce((best, point) => Math.abs(point.t - target) < Math.abs(best.t - target) ? point : best);
  }, [selectedDate, series]);

  const exportCsv = () => {
    const rows = [
      [t("history.gregorianDate"), t("history.hijriDate"), t("history.price"), currency],
      ...series.map((point) => {
        const date = new Date(point.t);
        return [formatGregorianIso(date), formatHijri(date, lang), point.value.toFixed(2), currency];
      }),
    ];
    const blob = new Blob([rows.map((row) => row.join(",")).join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `nisab-${metal}-${currency}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const fmtTick = (v: number) =>
    new Intl.DateTimeFormat(lang === "ar" ? "en" : lang, {
      month: "short",
      year: "2-digit",
    }).format(new Date(v));

  return (
    <Page eyebrow="HISTORY" title={t("history.title")} sub={t("history.sub")}>
      <ManualNotice />
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <CountryPicker />
        <CityPicker />
        <label className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">{t("history.pick")}</span>
          <select
            value={metal}
            onChange={(e) => setMetal(e.target.value as "gold" | "silver")}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="gold">{t("gold")}</option>
            <option value="silver">{t("silver")}</option>
          </select>
        </label>
        <div className="flex flex-wrap gap-1" aria-label={t("history.period") }>
          {RANGES.map((r) => (
            <Button
              key={r}
              onClick={() => setRange(r)}
              size="sm"
              variant={r === range ? "default" : "outline"}
            >
              {t(`history.range.${r}`)}
            </Button>
          ))}
        </div>
      </div>

      <div className="mb-4 border-s-2 border-accent bg-card px-4 py-3 text-sm text-muted-foreground">
        <strong className="text-foreground">{currency}</strong> · {t("history.countrySeries")}
        
        {data?.approx && <span> · {t("history.approx")}</span>}
        <Disclaimer className="mt-2" />
      </div>

      {stats && (
        <div className="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { l: t("history.high"), v: money(stats.high) },
            { l: t("history.low"), v: money(stats.low) },
            { l: t("history.average"), v: money(stats.average) },
            {
              l: t("history.change"),
              v: `${stats.change >= 0 ? "+" : ""}${stats.change.toFixed(1)}%`,
            },
          ].map((s) => (
            <div key={s.l} className="card-surface p-5">
              <p className="eyebrow text-muted-foreground">{s.l}</p>
              <p className="num mt-1 text-xl text-foreground">{s.v}</p>
            </div>
          ))}
        </div>
      )}

      <section className="mb-6 grid gap-4 border-y border-border py-6 lg:grid-cols-[1fr_1fr]">
        <div>
          <div className="flex items-center gap-2"><CalendarSearch aria-hidden="true" className="size-5 text-primary" /><h2 className="text-xl text-foreground">{t("history.lookup")}</h2></div>
          <p className="mt-2 text-sm text-muted-foreground">{t("history.lookupSub")}</p>
        </div>
        <div>
          <div className="mb-3 flex gap-1" aria-label={t("history.calendarType")}>
            <Button type="button" size="sm" variant={calendar === "gregorian" ? "default" : "outline"} onClick={() => setCalendar("gregorian")}>{t("history.gregorian")}</Button>
            <Button type="button" size="sm" variant={calendar === "hijri" ? "default" : "outline"} onClick={() => setCalendar("hijri")}>{t("history.hijri")}</Button>
          </div>
          {calendar === "gregorian" ? (
            <label className="block text-sm text-muted-foreground">
              <span className="mb-1 block">{t("history.gregorianDate")}</span>
              <input type="date" value={lookupDate} onChange={(event) => setLookupDate(event.target.value)} className="num w-full rounded-md border border-input bg-card px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-ring" />
            </label>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-[0.8fr_1.5fr_1fr]" dir={lang === "ar" || lang === "ur" ? "rtl" : "ltr"}>
              <label className="text-sm text-muted-foreground"><span className="mb-1 block">{t("history.hijriDay")}</span><input aria-label={t("history.hijriDay")} type="number" min={1} max={hijriMonthDays(hijriYear, hijriMonth)} value={hijriDay} onChange={(event) => setHijriDay(Number(event.target.value))} className="num w-full rounded-md border border-input bg-card px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-ring" /></label>
              <label className="text-sm text-muted-foreground"><span className="mb-1 block">{t("history.hijriMonth")}</span><select aria-label={t("history.hijriMonth")} value={hijriMonth} onChange={(event) => setHijriMonth(Number(event.target.value))} className="w-full rounded-md border border-input bg-card px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-ring">{(lang === "ar" || lang === "ur" ? HIJRI_MONTHS_AR : HIJRI_MONTHS_EN).map((month, index) => <option key={month} value={index + 1}>{month}</option>)}</select></label>
              <label className="text-sm text-muted-foreground"><span className="mb-1 block">{t("history.hijriYear")}</span><input aria-label={t("history.hijriYear")} type="number" min={1200} max={1700} value={hijriYear} onChange={(event) => setHijriYear(Number(event.target.value))} className="num w-full rounded-md border border-input bg-card px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-ring" /></label>
            </div>
          )}
          {selectedDate && (
            <div className="mt-3 grid gap-2 rounded-md border border-border bg-secondary p-4 text-sm sm:grid-cols-2">
              <p><span className="text-muted-foreground">{t("history.gregorianDate")}</span><strong className="num mt-1 block text-foreground">{formatGregorianIso(selectedDate)}</strong></p>
              <p><span className="text-muted-foreground">{t("history.hijriDate")}</span><strong className="mt-1 block text-foreground">{formatHijri(selectedDate, lang)}</strong></p>
            </div>
          )}
          {nearest && <div className="mt-3 flex flex-wrap items-end justify-between gap-4 rounded-md bg-primary p-4 text-sm text-primary-foreground"><span>{t("history.nearest")}<span className="mt-1 block"><span className="num">{formatGregorianIso(new Date(nearest.t))}</span> · {formatHijri(new Date(nearest.t), lang)}</span></span><strong className="num text-lg">{money(nearest.value)}</strong></div>}
        </div>
      </section>

      <aside className="mb-6 border-s-2 border-accent bg-secondary px-4 py-4 text-sm">
        <h2 className="font-semibold text-foreground">{t("history.conversionTitle")}</h2>
        <p className="mt-1 leading-7 text-muted-foreground">{t("history.conversionBody")}</p>
      </aside>

      <div className="card-surface p-4 sm:p-6">
        {isLoading && <p className="py-20 text-center text-muted-foreground">{t("common.loading")}</p>}
        {isError && (
          <div className="py-20 text-center">
            <p className="text-muted-foreground">{t("common.error")}</p>
            <Button onClick={() => refetch()} className="mt-3">{t("common.retry")}</Button>
          </div>
        )}
        {!isLoading && !isError && data && !data.fxAvailable && (
          <div className="py-20 text-center">
            <p className="text-foreground">{t("history.fxUnavailable")}</p>
            <p className="mt-2 text-sm text-muted-foreground">{currency}</p>
          </div>
        )}
        {!isLoading && !isError && data?.fxAvailable && series.length === 0 && (
          <p className="py-20 text-center text-muted-foreground">{t("history.empty")}</p>
        )}
        {!isLoading && !isError && data?.fxAvailable && series.length > 0 && (
          <div dir="ltr" className="h-[260px] w-full sm:h-[380px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="nisabFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis
                  dataKey="t"
                  tickFormatter={fmtTick}
                  tickLine={false}
                  axisLine={false}
                  minTickGap={40}
                  tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                />
                <YAxis
                  width={80}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                  tickFormatter={(v: number) => Intl.NumberFormat("en", { notation: "compact" }).format(v)}
                />
                <Tooltip
                  labelFormatter={(v) => `${fmtTick(Number(v))} · ${formatHijri(new Date(Number(v)), lang)}`}
                   formatter={(v: number) => [money(v), t("history.sub")]}
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                    color: "var(--color-foreground)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="var(--color-chart-1)"
                  strokeWidth={2}
                  fill="url(#nisabFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
        <div className="mt-4 grid gap-1 border-t border-border pt-3 text-xs text-muted-foreground sm:grid-cols-2">
          <p>{t("history.note")}</p>
          {data && <p>{t("update.source")}: {data.metalsSource} · {data.ratesSource}</p>}
          {manualHistory.some((p) => p.currency === currency && (p.city ?? "") === city) && (
            <p className="sm:col-span-2">{t("history.manualPoint")}</p>
          )}
        </div>
      </div>

      {series.length > 0 && (
        <section className="card-surface mt-6 overflow-hidden">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
            <div><h2 className="text-lg text-foreground">{t("history.table")}</h2><p className="text-xs text-muted-foreground">{t("history.showTable")}</p></div>
            <Button variant="outline" size="sm" onClick={exportCsv}><Download />{t("history.export")}</Button>
          </header>
          <div className="scroll-x"><table className="w-full min-w-[34rem] text-sm"><thead className="bg-secondary text-muted-foreground"><tr><th className="p-3 text-start font-normal">{t("history.gregorianDate")}</th><th className="p-3 text-start font-normal">{t("history.hijriDate")}</th><th className="p-3 text-start font-normal">{t("history.price")}</th><th className="p-3 text-start font-normal">{t("history.pick")}</th></tr></thead><tbody>{series.slice(-12).reverse().map((point) => <tr key={`${point.t}-${point.manual}`} className="border-t border-border"><td className="num whitespace-nowrap p-3 text-foreground">{formatGregorianIso(new Date(point.t))}</td><td className="whitespace-nowrap p-3 text-foreground">{formatHijri(new Date(point.t), lang)}</td><td className="num whitespace-nowrap p-3 text-foreground">{money(point.value)}</td><td className="p-3 text-muted-foreground">{t(metal)}</td></tr>)}</tbody></table></div>
        </section>
      )}

      <CityPriceCheck />
    </Page>
  );
}
