import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { RotateCcw } from "lucide-react";

import { Field, Page } from "@/components/site/Page";
import { CountryPicker } from "@/components/site/Shell";
import { StateNote, useNisab } from "@/components/site/Prices";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { KARATS, ZAKAT_RATE } from "@/lib/nisab";

export const Route = createFileRoute("/calculator")({
  head: () => ({
    meta: [
      { title: "حاسبة الزكاة · نِصاب" },
      {
        name: "description",
        content: "احسب زكاتك ٢٫٥٪ على النقد والذهب والفضّة وعروض التجارة بعملة بلدك.",
      },
      { property: "og:title", content: "حاسبة الزكاة · نِصاب" },
      {
        property: "og:description",
        content: "أدخل ما تملك واعرف زكاتك المستحقّة فوراً مقارنةً بالنصاب.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Calculator,
});

const num = (v: string) => (Number.isFinite(parseFloat(v)) ? parseFloat(v) : 0);

function Calculator() {
  const { t } = useI18n();
  const { values, money, isLoading, isError, refetch } = useNisab();

  const [cash, setCash] = useState("");
  const [business, setBusiness] = useState("");
  const [investments, setInvestments] = useState("");
  const [receivables, setReceivables] = useState("");
  const [debts, setDebts] = useState("");
  const [goldG, setGoldG] = useState("");
  const [karat, setKarat] = useState(21);
  const [silverG, setSilverG] = useState("");
  const [standard, setStandard] = useState<"silver" | "gold">("silver");

  const purity = KARATS.find((k) => k.k === karat)?.purity ?? 1;
  const goldValue = values ? num(goldG) * values.goldGram * purity : 0;
  const silverValue = values ? num(silverG) * values.silverGram : 0;
  const metals = goldValue + silverValue;
  const net =
    num(cash) + num(business) + num(investments) + num(receivables) + metals - num(debts);
  const nisab = values ? (standard === "silver" ? values.silver : values.gold) : 0;
  const due = net >= nisab ? net * ZAKAT_RATE : 0;
  const above = Boolean(values) && net >= nisab && net > 0;

  const reset = () => {
    setCash("");
    setBusiness("");
    setInvestments("");
    setReceivables("");
    setDebts("");
    setGoldG("");
    setSilverG("");
  };

  return (
    <Page eyebrow="CALCULATOR" title={t("calc.title")} sub={t("calc.sub")}>
      <div className="mb-6">
        <CountryPicker />
      </div>

      {(isLoading || isError) && (
        <div className="mb-6">
          <StateNote isLoading={isLoading} isError={isError} refetch={refetch} />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="card-surface grid gap-4 p-6 sm:grid-cols-2">
          <Field label={t("calc.cash")} value={cash} onChange={setCash} />
          <Field label={t("calc.business")} value={business} onChange={setBusiness} />
          <Field label={t("calc.investments")} value={investments} onChange={setInvestments} />
          <Field label={t("calc.receivables")} value={receivables} onChange={setReceivables} />
          <Field label={t("calc.debts")} value={debts} onChange={setDebts} />

          <div className="sm:col-span-2 grid gap-4 border-t border-border pt-4 sm:grid-cols-2">
            <Field
              label={t("calc.goldWeight")}
              value={goldG}
              onChange={setGoldG}
              suffix={t("grams")}
            />
            <label className="block">
              <span className="text-sm text-muted-foreground">{t("calc.karat")}</span>
              <select
                value={karat}
                onChange={(e) => setKarat(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-input bg-card px-3 py-2.5 text-foreground outline-none focus:ring-2 focus:ring-ring"
              >
                {KARATS.map((k) => (
                  <option key={k.k} value={k.k}>
                    {k.k}K
                  </option>
                ))}
              </select>
            </label>
            <Field
              label={t("calc.silverWeight")}
              value={silverG}
              onChange={setSilverG}
              suffix={t("grams")}
            />
            <label className="block">
              <span className="text-sm text-muted-foreground">{t("calc.standard")}</span>
              <select
                value={standard}
                onChange={(e) => setStandard(e.target.value as "silver" | "gold")}
                className="mt-1 w-full rounded-xl border border-input bg-card px-3 py-2.5 text-foreground outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="silver">{t("nisab.silver")}</option>
                <option value="gold">{t("nisab.gold")}</option>
              </select>
            </label>
          </div>

          <Button onClick={reset} variant="outline" className="justify-self-start">
            <RotateCcw aria-hidden="true" />{t("calc.reset")}
          </Button>
        </div>

        <aside className="card-surface h-fit p-6 lg:sticky lg:top-24">
          <p className="eyebrow text-muted-foreground">{t("calc.summary")}</p>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">{t("calc.metalValue")}</dt>
              <dd className="num text-foreground">{money(metals)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">{t("calc.netWealth")}</dt>
              <dd className="num text-foreground">{money(net)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">{t("calc.nisabValue")}</dt>
              <dd className="num text-foreground">{money(nisab)}</dd>
            </div>
          </dl>
          <div className="mt-5 rounded-xl bg-primary p-5 text-primary-foreground">
            <p className="text-xs opacity-80">
              {t("calc.due")} · {t("calc.rate")}
            </p>
            <p className="num mt-1 text-3xl">{money(due)}</p>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            {above ? t("calc.above") : t("calc.below")}
          </p>
        </aside>
      </div>
    </Page>
  );
}
