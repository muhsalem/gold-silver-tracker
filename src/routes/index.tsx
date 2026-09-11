import { createFileRoute, Link } from "@tanstack/react-router";

import { CountryPicker } from "@/components/site/Shell";
import { NisabAlert, StateNote, UpdateMeta, useNisab } from "@/components/site/Prices";
import { useI18n } from "@/lib/i18n";
import { GOLD_NISAB_G, KARATS, SILVER_NISAB_G, formatNumber } from "@/lib/nisab";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "نِصاب · قيمة نصاب الذهب والفضّة اليوم" },
      {
        name: "description",
        content:
          "احسب نصاب الزكاة اليوم بأسعار الذهب والفضّة الحيّة، بعملة بلدك، مع جدول العيارات.",
      },
      { property: "og:title", content: "نِصاب · قيمة نصاب الذهب والفضّة اليوم" },
      {
        property: "og:description",
        content: "نصاب الذهب ٨٥ جراماً والفضّة ٥٩٥ جراماً، محسوباً يومياً بعملة بلدك.",
      },
    ],
  }),
  component: Home,
});

const TYPES = ["cash", "gold", "trade", "crops", "livestock", "fitr"] as const;

function Home() {
  const { t } = useI18n();
  const { values, money, isLoading, isError, refetch, currency } = useNisab();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <NisabAlert value={values?.lower} />

      <section className="rise">
        <p className="eyebrow text-muted-foreground">{t("hero.eyebrow")}</p>
        <h1 className="mt-2 max-w-3xl text-3xl leading-tight text-foreground sm:text-5xl">
          {t("hero.title")}
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">{t("hero.sub")}</p>
        <div className="mt-5">
          <CountryPicker />
        </div>
      </section>

      {(isLoading || isError) && (
        <div className="mt-8">
          <StateNote isLoading={isLoading} isError={isError} refetch={refetch} />
        </div>
      )}

      {values && (
        <>
          <section className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              {
                label: t("nisab.gold"),
                metal: t("gold"),
                grams: GOLD_NISAB_G,
                total: values.gold,
                gram: values.goldGram,
                lower: values.gold <= values.silver,
              },
              {
                label: t("nisab.silver"),
                metal: t("silver"),
                grams: SILVER_NISAB_G,
                total: values.silver,
                gram: values.silverGram,
                lower: values.silver < values.gold,
              },
            ].map((c) => (
              <article key={c.label} className="card-surface rise p-6 sm:p-8">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="eyebrow text-muted-foreground">{c.label}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      <span className="num">{c.grams}</span> {t("grams")} · {c.metal}
                    </p>
                  </div>
                  {c.lower && (
                    <span className="rounded-full bg-accent/25 px-3 py-1 text-xs text-foreground">
                      {t("home.lower")}
                    </span>
                  )}
                </div>
                <p className="num mt-6 text-3xl text-foreground sm:text-4xl">{money(c.total)}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t("perGram")}: <span className="num">{money(c.gram)}</span>
                </p>
              </article>
            ))}
          </section>

          <section className="card-surface mt-4 p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-sm text-muted-foreground">{t("ratio.label")}</p>
              <p className="num text-xl text-foreground">{formatNumber(values.ratio, 1)}</p>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{t("ratio.note")}</p>
          </section>

          <section className="card-surface mt-4 overflow-x-auto p-6">
            <h2 className="text-xl text-foreground">{t("karat.title")}</h2>
            <table className="mt-4 w-full text-sm">
              <thead className="text-muted-foreground">
                <tr className="text-start">
                  <th className="py-2 text-start font-normal">{t("karat.title")}</th>
                  <th className="py-2 text-start font-normal">{t("karat.purity")}</th>
                  <th className="py-2 text-start font-normal">{t("karat.price")}</th>
                </tr>
              </thead>
              <tbody>
                {KARATS.map((k) => (
                  <tr key={k.k} className="border-t border-border">
                    <td className="num py-2.5 text-foreground">{k.k}K</td>
                    <td className="num py-2.5 text-muted-foreground">
                      {(k.purity * 100).toFixed(1)}%
                    </td>
                    <td className="num py-2.5 text-foreground">
                      {money(values.goldGram * k.purity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 text-xs text-muted-foreground">
              {t("common.source")} · {currency}
            </p>
          </section>

          <UpdateMeta />
        </>
      )}

      <section className="mt-8 flex flex-wrap gap-3">
        <Link
          to="/calculator"
          className="rounded-xl bg-primary px-5 py-3 text-sm text-primary-foreground transition-opacity hover:opacity-90"
        >
          {t("home.cta.calc")}
        </Link>
        <Link
          to="/history"
          className="rounded-xl border border-border px-5 py-3 text-sm text-foreground transition-colors hover:bg-secondary"
        >
          {t("home.cta.history")}
        </Link>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl text-foreground">{t("types.title")}</h2>
        <p className="mt-2 text-muted-foreground">{t("home.types.sub")}</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TYPES.map((k) => (
            <article key={k} className="card-surface p-5">
              <h3 className="text-lg text-foreground">{t(`types.${k}.t`)}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t(`types.${k}.d`)}</p>
            </article>
          ))}
        </div>
        <Link
          to="/types"
          className="mt-5 inline-block text-sm text-foreground underline underline-offset-4"
        >
          {t("types.all")}
        </Link>
      </section>
    </div>
  );
}
