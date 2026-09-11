import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Save, RotateCcw, LineChart } from "lucide-react";
import { Page, Field } from "@/components/site/Page";
import { StateNote, useNisab } from "@/components/site/Prices";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { clearOverrides, readOverrides, recordManualPrice, writeOverrides } from "@/lib/overrides";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [
    { title: "إدارة أسعار الذهب والعملات · نِصاب" },
    { name: "description", content: "إدخال أسعار الذهب والفضة وسعر صرف العملة محلياً لأغراض حساب النصاب." },
    { property: "og:title", content: "إدارة أسعار نِصاب" },
    { property: "og:description", content: "تعديل يدوي لأسعار المعادن والعملات على هذا الجهاز." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ]}),
  component: Admin,
});

function Admin() {
  const { t, currency } = useI18n();
  const { data, values, money, isLoading, isError, refetch } = useNisab();
  const [gold, setGold] = useState("");
  const [silver, setSilver] = useState("");
  const [rate, setRate] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!data) return;
    const current = readOverrides();
    setGold(String(current.goldUsdOz ?? data.goldUsdOz));
    setSilver(String(current.silverUsdOz ?? data.silverUsdOz));
    setRate(String(current.rates?.[currency] ?? data.rates[currency] ?? 1));
  }, [data, currency]);

  const save = () => {
    const goldValue = Number(gold);
    const silverValue = Number(silver);
    const rateValue = Number(rate);
    if (![goldValue, silverValue, rateValue].every((v) => Number.isFinite(v) && v > 0)) return;
    const current = readOverrides();
    writeOverrides({ ...current, goldUsdOz: goldValue, silverUsdOz: silverValue, rates: { ...current.rates, [currency]: rateValue } });
    recordManualPrice({ goldUsdOz: goldValue, silverUsdOz: silverValue, currency, rate: rateValue });
    setSaved(true);
  };

  const restore = () => { clearOverrides(); setSaved(false); refetch(); };

  return <Page eyebrow="إدارة القيَم" title={t("admin.title")} sub={t("admin.sub")}>
    {(isLoading || isError) && <StateNote isLoading={isLoading} isError={isError} refetch={refetch} />}
    {data && <div className="grid gap-6 lg:grid-cols-[1.25fr_.75fr]">
      <section className="border border-border bg-card p-6 sm:p-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-5">
          <div>
            <p className="text-sm font-medium text-foreground">{t("admin.currency")}: <span className="num">{currency}</span></p>
            <p className="mt-1 text-xs text-muted-foreground">{t("admin.historyHint")}</p>
          </div>
          <span className="rounded-md bg-secondary px-3 py-1.5 text-xs text-muted-foreground">{t("admin.deviceOnly")}</span>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={t("admin.goldOz")} value={gold} onChange={setGold} suffix="USD/oz" />
          <Field label={t("admin.silverOz")} value={silver} onChange={setSilver} suffix="USD/oz" />
          <Field label={`${t("admin.rate")} ${currency}`} value={rate} onChange={setRate} suffix={currency} />
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={save} size="lg"><Save />{t("admin.save")}</Button>
          <Button onClick={restore} variant="outline" size="lg"><RotateCcw />{t("admin.clear")}</Button>
        </div>
        {saved && <p role="status" className="mt-4 border-s-2 border-accent ps-3 text-sm text-primary">{t("admin.saved")}</p>}
      </section>
      <aside className="bg-primary p-6 text-primary-foreground sm:p-8">
        <p className="text-sm opacity-70">{t("admin.preview")}</p>
        <dl className="mt-5 space-y-5">
          <div><dt className="text-xs opacity-70">نصاب الذهب</dt><dd className="num mt-1 text-2xl">{values ? money(values.gold) : "—"}</dd></div>
          <div><dt className="text-xs opacity-70">نصاب الفضة</dt><dd className="num mt-1 text-2xl">{values ? money(values.silver) : "—"}</dd></div>
        </dl>
        <Button asChild variant="secondary" className="mt-8"><Link to="/history"><LineChart />{t("home.cta.history")}</Link></Button>
      </aside>
    </div>}
    <p className="mt-5 text-xs leading-6 text-muted-foreground">{t("admin.localNote")}</p>
  </Page>;
}