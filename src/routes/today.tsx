import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CircleCheck, Database, Scale, ShieldCheck } from "lucide-react";

import { CityPicker, CountryPicker } from "@/components/site/Shell";
import { AsOf, Disclaimer, ManualNotice, SourceQuality, StateNote, UpdateMeta, useNisab } from "@/components/site/Prices";
import { HawlReminder } from "@/components/site/Reminders";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { GOLD_NISAB_G, SILVER_NISAB_G, TROY_OUNCE_G, formatNumber } from "@/lib/nisab";

export const Route = createFileRoute("/today")({
  head: () => ({
    meta: [
      { title: "نصاب الزكاة اليوم عالميًا · نِصاب" },
      { name: "description", content: "قيمة نصاب الذهب والفضة اليوم بعملة بلدك، مع سعر الجرام والمعادلة والمصدر ووقت التحديث." },
      { property: "og:title", content: "نصاب الزكاة اليوم عالميًا · نِصاب" },
      { property: "og:description", content: "نصاب الذهب ٨٥غ والفضة ٥٩٥غ يوميًا بعملتك المحلية وبمصدر قابل للتتبع." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TodayPage,
});

function TodayPage() {
  const { t, currency } = useI18n();
  const { values, data, rate, money, isLoading, isError, refetch } = useNisab();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <ManualNotice />
      <header className="grid items-end gap-7 border-b border-border pb-8 lg:grid-cols-[1fr_auto]">
        <div className="max-w-3xl">
          <p className="eyebrow text-accent">{t("today.eyebrow")}</p>
          <h1 className="mt-3 text-4xl leading-tight text-foreground sm:text-5xl">{t("today.title")}</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">{t("today.sub")}</p>
          <AsOf className="mt-4" />
        </div>
        <div className="flex flex-wrap gap-3 rounded-lg border border-border bg-card p-3 shadow-sm">
          <CountryPicker compact />
          <CityPicker />
        </div>
      </header>

      {(isLoading || isError) && <div className="mt-8"><StateNote isLoading={isLoading} isError={isError} refetch={refetch} /></div>}

      {values && data && (
        <>
          <section className="mt-8 grid overflow-hidden rounded-lg border border-border bg-card lg:grid-cols-2">
            {[
              { key: "gold", title: t("nisab.gold"), grams: GOLD_NISAB_G, gram: values.goldGram, total: values.gold, oz: data.goldUsdOz },
              { key: "silver", title: t("nisab.silver"), grams: SILVER_NISAB_G, gram: values.silverGram, total: values.silver, oz: data.silverUsdOz },
            ].map((item, index) => (
              <article key={item.key} className={`p-6 sm:p-8 ${index === 1 ? "border-t border-border lg:border-s lg:border-t-0" : ""}`}>
                <div className="flex items-center justify-between gap-4">
                  <p className="eyebrow text-muted-foreground">{item.title}</p>
                  <span className="num rounded-md bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">{item.grams}g</span>
                </div>
                <p className="num mt-8 text-4xl text-foreground sm:text-5xl">{money(item.total)}</p>
                <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-5 text-sm">
                  <div><p className="text-muted-foreground">{t("perGram")}</p><p className="num mt-1 text-foreground">{money(item.gram)}</p></div>
                  <div><p className="text-muted-foreground">{t("today.weight")}</p><p className="num mt-1 text-foreground">{item.grams} g</p></div>
                </div>
                <details className="mt-5 border-t border-border pt-4 text-sm">
                  <summary className="cursor-pointer font-medium text-foreground">{t("country.how")}</summary>
                  <p className="num mt-3 leading-7 text-muted-foreground">({formatNumber(item.oz, 2)} USD/oz ÷ {formatNumber(TROY_OUNCE_G, 4)}) × {formatNumber(rate, 4)} {currency} × {item.grams}g = {money(item.total)}</p>
                </details>
              </article>
            ))}
          </section>

          <section className="mt-6 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3">
            {[
              { icon: Database, title: t("today.trace.source"), body: data.metalsSource },
              { icon: CircleCheck, title: t("today.trace.status"), body: data.manual ? t("update.manual") : t("update.auto") },
              { icon: ShieldCheck, title: t("today.trace.method"), body: t("today.trace.methodBody") },
            ].map((item) => (
              <div key={item.title} className="bg-card p-5">
                <item.icon aria-hidden="true" className="size-5 text-primary" />
                <p className="mt-4 text-sm font-medium text-foreground">{item.title}</p>
                <p className="mt-1 text-xs leading-6 text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </section>
          <UpdateMeta />
        </>
      )}

      <section className="brand-panel mt-8 flex flex-col justify-between gap-5 p-6 sm:flex-row sm:items-center">
        <div className="flex gap-4">
          <Scale aria-hidden="true" className="mt-1 size-6 shrink-0 text-goldlight" />
          <div><h2 className="text-xl">{t("today.notZakat")}</h2><p className="mt-1 max-w-2xl text-sm opacity-80">{t("today.notZakatBody")}</p></div>
        </div>
        <Button asChild variant="secondary"><Link to="/methodology">{t("nav.methodology")}<ArrowLeft /></Link></Button>
      </section>
      <Disclaimer className="mt-5" />
    </div>
  );
}