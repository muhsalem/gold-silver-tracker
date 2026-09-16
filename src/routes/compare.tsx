import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Page } from "@/components/site/Page";
import { StateNote, useNisab } from "@/components/site/Prices";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { COUNTRIES, countryName, flagOf } from "@/lib/countries";
import {
  GOLD_NISAB_G,
  SILVER_NISAB_G,
  formatMoney,
  formatNumber,
  goldNisabValue,
  silverNisabValue,
} from "@/lib/nisab";

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: "مقارنة النصاب بين الدول · نِصاب" },
      {
        name: "description",
        content: "رسم بياني يقارن قيمة نصاب الذهب والفضّة بين الدول، ونسبة الذهب إلى الفضّة.",
      },
      { property: "og:title", content: "مقارنة النصاب بين الدول · نِصاب" },
      {
        property: "og:description",
        content: "قارن نصاب الذهب والفضّة بعملات الدول المختلفة وبالدولار الأمريكي.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Compare,
});

const DEFAULTS = ["SA", "EG", "AE", "TR", "ID", "PK"];

function Compare() {
  const { t, lang, country } = useI18n();
  const { data, values, money, isLoading, isError, refetch } = useNisab();
  const [picked, setPicked] = useState<string[]>(() =>
    Array.from(new Set([country, ...DEFAULTS])).slice(0, 8),
  );
  const [unit, setUnit] = useState<"local" | "usd">("usd");

  const toggle = (code: string) =>
    setPicked((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code].slice(0, 10),
    );

  const rows = useMemo(() => {
    if (!data) return [];
    return picked
      .map((code) => {
        const c = COUNTRIES.find((x) => x.code === code);
        const rate = c ? data.rates[c.currency] : undefined;
        if (!c || !rate) return null;
        const gold = goldNisabValue(data.goldUsdOz, rate);
        const silver = silverNisabValue(data.silverUsdOz, rate);
        return {
          code,
          name: `${flagOf(code)} ${countryName(c, lang)}`,
          currency: c.currency,
          gold,
          silver,
          goldUsd: goldNisabValue(data.goldUsdOz, 1),
          silverUsd: silverNisabValue(data.silverUsdOz, 1),
          local: formatMoney(Math.min(gold, silver), c.currency, lang),
        };
      })
      .filter((r): r is NonNullable<typeof r> => r !== null);
  }, [data, picked, lang]);

  const chart = rows.map((r) => ({
    name: r.name,
    gold: Number((unit === "usd" ? r.goldUsd : r.gold).toFixed(2)),
    silver: Number((unit === "usd" ? r.silverUsd : r.silver).toFixed(2)),
  }));

  return (
    <Page eyebrow="COMPARE" title={t("compare.title")} sub={t("compare.sub")}>
      {(isLoading || isError) && (
        <StateNote isLoading={isLoading} isError={isError} refetch={refetch} />
      )}

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-y border-border py-4">
        <p className="text-sm text-muted-foreground">{t("compare.selected")}: <span className="num text-foreground">{picked.length}/10</span></p>
        <div className="inline-flex rounded-md border border-border bg-card p-1" aria-label={t("compare.currencyMode")}>
          {(["usd", "local"] as const).map((key) => <Button key={key} size="sm" variant={unit === key ? "default" : "ghost"} onClick={() => setUnit(key)}>{t(`compare.${key}`)}</Button>)}
        </div>
      </div>
      <div className="mb-6 flex max-h-48 flex-wrap gap-2 overflow-y-auto pe-2">
        {COUNTRIES.map((c) => (
          <Button
            key={c.code}
            size="sm"
            variant={picked.includes(c.code) ? "default" : "outline"}
            onClick={() => toggle(c.code)}
          >
            <span aria-hidden>{flagOf(c.code)}</span>
            {countryName(c, lang)}
          </Button>
        ))}
      </div>

      {values && (
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="card-surface p-5">
            <p className="eyebrow text-muted-foreground">{t("ratio.label")}</p>
            <p className="num mt-1 text-2xl text-foreground">{formatNumber(values.ratio, 1)}</p>
          </div>
          <div className="card-surface p-5">
            <p className="eyebrow text-muted-foreground">{t("nisab.gold")}</p>
            <p className="num mt-1 text-2xl text-foreground">{money(values.gold)}</p>
          </div>
          <div className="card-surface p-5">
            <p className="eyebrow text-muted-foreground">{t("nisab.silver")}</p>
            <p className="num mt-1 text-2xl text-foreground">{money(values.silver)}</p>
          </div>
        </div>
      )}

      <section className="card-surface p-4 sm:p-6">
        <h2 className="text-lg text-foreground">{t("compare.chart")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{unit === "usd" ? t("compare.usd") : t("compare.localNote")}</p>
        {chart.length > 0 && (
          <div dir="ltr" className="mt-5 h-[420px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chart} margin={{ top: 10, right: 8, bottom: 60, left: 0 }}>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis
                  dataKey="name"
                  interval={0}
                  angle={-35}
                  textAnchor="end"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                />
                <YAxis
                  width={70}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                  tickFormatter={(v: number) =>
                    Intl.NumberFormat("en", { notation: "compact" }).format(v)
                  }
                />
                <Tooltip
                  cursor={{ fill: "var(--color-secondary)" }}
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                    color: "var(--color-foreground)",
                  }}
                />
                <Legend wrapperStyle={{ color: "var(--color-muted-foreground)", fontSize: 12 }} />
                <Bar
                  dataKey="gold"
                  name={t("nisab.gold")}
                  fill="var(--color-chart-1)"
                  radius={[6, 6, 0, 0]}
                >
                  {chart.map((entry) => (
                    <Cell key={entry.name} />
                  ))}
                </Bar>
                <Bar
                  dataKey="silver"
                  name={t("nisab.silver")}
                  fill="var(--color-chart-2)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      <section className="card-surface mt-6 overflow-x-auto p-4 sm:p-6">
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground">
            <tr>
              <th className="p-3 text-start font-normal">{t("compare.country")}</th>
              <th className="p-3 text-start font-normal">{t("nisab.gold")}</th>
              <th className="p-3 text-start font-normal">{t("nisab.silver")}</th>
              <th className="p-3 text-start font-normal">{t("compare.lower")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.code} className="border-t border-border">
                <td className="p-3 text-foreground">{r.name}</td>
                <td className="num p-3 text-muted-foreground">
                  {formatMoney(r.gold, r.currency, lang)}
                </td>
                <td className="num p-3 text-muted-foreground">
                  {formatMoney(r.silver, r.currency, lang)}
                </td>
                <td className="num p-3 text-foreground">{r.local}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-4 text-xs leading-6 text-muted-foreground">
          {t("compare.note")} · {GOLD_NISAB_G}g / {SILVER_NISAB_G}g
        </p>
      </section>
    </Page>
  );
}
