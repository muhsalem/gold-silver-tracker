import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
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
import { CountryPicker } from "@/components/site/Shell";
import { useNisab } from "@/components/site/Prices";
import { Button } from "@/components/ui/button";
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

const RANGES: HistoryRange[] = ["1mo", "6mo", "1y", "1448", "5y", "10y"];

function History() {
  const { t, lang, currency } = useI18n();
  const { money } = useNisab();
  const [range, setRange] = useState<HistoryRange>("1y");
  const [metal, setMetal] = useState<"gold" | "silver">("gold");
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
          .filter((p) => p.currency === currency)
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
    [data, manualHistory, currency, metal, grams, range],
  );

  const stats = useMemo(() => {
    if (series.length === 0) return null;
    const vals = series.map((s) => s.value);
    const first = vals[0]!;
    const last = vals[vals.length - 1]!;
    return {
      high: Math.max(...vals),
      low: Math.min(...vals),
      change: ((last - first) / first) * 100,
      last,
    };
  }, [series]);

  const fmtTick = (v: number) =>
    new Intl.DateTimeFormat(lang === "ar" ? "en" : lang, {
      month: "short",
      year: "2-digit",
    }).format(new Date(v));

  return (
    <Page eyebrow="HISTORY" title={t("history.title")} sub={t("history.sub")}>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <CountryPicker />
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
        {range === "1448" && <span> · {t("history.from1448")}</span>}
      </div>

      {stats && (
        <div className="mb-4 grid gap-4 sm:grid-cols-3">
          {[
            { l: t("history.high"), v: money(stats.high) },
            { l: t("history.low"), v: money(stats.low) },
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
          <div dir="ltr" className="h-[380px] w-full">
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
                  labelFormatter={(v) => fmtTick(Number(v))}
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
          {manualHistory.some((p) => p.currency === currency) && (
            <p className="sm:col-span-2">{t("history.manualPoint")}</p>
          )}
        </div>
      </div>
    </Page>
  );
}
