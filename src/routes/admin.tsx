import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Save, RotateCcw, LineChart } from "lucide-react";
import { Page, Field } from "@/components/site/Page";
import { StateNote, useNisab } from "@/components/site/Prices";
import { CityPicker, CountryPicker } from "@/components/site/Shell";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { citiesOf, cityName, scopeKey } from "@/lib/cities";
import {
  clearOverrides,
  readOverrides,
  recordManualPrice,
  writeScopeOverride,
} from "@/lib/overrides";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "إدارة أسعار الذهب والعملات · نِصاب" },
      {
        name: "description",
        content: "إدخال أسعار الذهب والفضة وسعر الصرف لكل دولة ومدينة لأغراض حساب النصاب.",
      },
      { property: "og:title", content: "إدارة أسعار نِصاب" },
      {
        property: "og:description",
        content: "تعديل يدوي لأسعار المعادن والعملات حسب الدولة والمدينة.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Admin,
});

function Admin() {
  const { t, lang, currency, country, city } = useI18n();
  const { data, market, values, money, isLoading, isError, refetch } = useNisab();
  const [gold, setGold] = useState("");
  const [silver, setSilver] = useState("");
  const [rate, setRate] = useState("");
  const [saved, setSaved] = useState(false);

  const key = scopeKey(country, city);
  const cityLabel =
    citiesOf(country).find((c) => c.id === city) ?? null;
  const scopeLabel = cityLabel ? cityName(cityLabel, lang) : t("city.all");

  useEffect(() => {
    if (!market) return;
    const scope = readOverrides().scopes?.[key];
    setGold(String(scope?.goldUsdOz ?? market.goldUsdOz));
    setSilver(String(scope?.silverUsdOz ?? market.silverUsdOz));
    setRate(String(scope?.rate ?? market.rates[currency] ?? 1));
    setSaved(false);
  }, [market, currency, key]);

  const save = () => {
    const goldValue = Number(gold);
    const silverValue = Number(silver);
    const rateValue = Number(rate);
    if (![goldValue, silverValue, rateValue].every((v) => Number.isFinite(v) && v > 0)) return;
    writeScopeOverride(key, {
      goldUsdOz: goldValue,
      silverUsdOz: silverValue,
      rate: rateValue,
      currency,
    });
    recordManualPrice({
      goldUsdOz: goldValue,
      silverUsdOz: silverValue,
      currency,
      rate: rateValue,
      city,
      country,
    });
    setSaved(true);
  };

  const restore = () => {
    writeScopeOverride(key, null);
    setSaved(false);
    refetch();
  };

  const resetAll = () => {
    clearOverrides();
    setSaved(false);
    refetch();
  };

  const diff = (manual: string, marketValue?: number) => {
    const m = Number(manual);
    if (!marketValue || !Number.isFinite(m) || m <= 0) return null;
    return ((m - marketValue) / marketValue) * 100;
  };

  const rows = [
    { label: t("admin.goldOz"), manual: gold, market: market?.goldUsdOz, unit: "USD/oz" },
    { label: t("admin.silverOz"), manual: silver, market: market?.silverUsdOz, unit: "USD/oz" },
    {
      label: `${t("admin.rate")} ${currency}`,
      manual: rate,
      market: market?.rates?.[currency],
      unit: currency,
    },
  ];

  return (
    <Page eyebrow="إدارة القيَم" title={t("admin.title")} sub={t("admin.sub")}>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <CountryPicker />
        <CityPicker />
      </div>
      {(isLoading || isError) && (
        <StateNote isLoading={isLoading} isError={isError} refetch={refetch} />
      )}
      {data && (
        <div className="grid gap-6 lg:grid-cols-[1.25fr_.75fr]">
          <section className="card-surface p-5 sm:p-8">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-5">
              <div>
                <p className="text-sm font-medium text-foreground">
                  {t("admin.scope")}: <span>{scopeLabel}</span> ·{" "}
                  <span className="num">{currency}</span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{t("admin.cityNote")}</p>
              </div>
              <span className="rounded-full bg-secondary px-3 py-1.5 text-xs text-muted-foreground">
                {t("admin.deviceOnly")}
              </span>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label={t("admin.goldOz")} value={gold} onChange={setGold} suffix="USD/oz" />
              <Field
                label={t("admin.silverOz")}
                value={silver}
                onChange={setSilver}
                suffix="USD/oz"
              />
              <Field
                label={`${t("admin.rate")} ${currency}`}
                value={rate}
                onChange={setRate}
                suffix={currency}
              />
            </div>

            <div className="mt-6 overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-secondary/60 text-start text-xs text-muted-foreground">
                    <th className="p-3 text-start font-normal">—</th>
                    <th className="p-3 text-start font-normal">{t("admin.market")}</th>
                    <th className="p-3 text-start font-normal">{t("admin.diff")}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => {
                    const d = diff(row.manual, row.market);
                    return (
                      <tr key={row.label} className="border-t border-border">
                        <td className="p-3 text-foreground">{row.label}</td>
                        <td className="num p-3 text-muted-foreground">
                          {row.market ? `${row.market.toLocaleString("en")} ${row.unit}` : "—"}
                        </td>
                        <td className="num p-3 text-foreground">
                          {d == null ? "—" : `${d >= 0 ? "+" : ""}${d.toFixed(2)}%`}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={save} size="lg">
                <Save />
                {t("admin.save")}
              </Button>
              <Button onClick={restore} variant="outline" size="lg">
                <RotateCcw />
                {t("admin.clear")}
              </Button>
              <Button onClick={resetAll} variant="ghost" size="lg">
                {t("admin.clear")} — {t("fiqh.allMadhahib")}
              </Button>
            </div>
            {saved && (
              <p role="status" className="mt-4 border-s-2 border-accent ps-3 text-sm text-primary">
                {t("admin.saved")}
              </p>
            )}
          </section>

          <aside className="brand-panel p-6 sm:p-8">
            <p className="text-sm opacity-70">{t("admin.preview")}</p>
            <dl className="mt-5 space-y-5">
              <div>
                <dt className="text-xs opacity-70">{t("nisab.gold")}</dt>
                <dd className="num mt-1 text-2xl">{values ? money(values.gold) : "—"}</dd>
              </div>
              <div>
                <dt className="text-xs opacity-70">{t("nisab.silver")}</dt>
                <dd className="num mt-1 text-2xl">{values ? money(values.silver) : "—"}</dd>
              </div>
            </dl>
            <Button asChild variant="secondary" className="mt-8">
              <Link to="/history">
                <LineChart />
                {t("home.cta.history")}
              </Link>
            </Button>
          </aside>
        </div>
      )}
      <p className="mt-5 text-xs leading-6 text-muted-foreground">{t("admin.localNote")}</p>
    </Page>
  );
}
