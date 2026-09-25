import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { Page } from "@/components/site/Page";
import { Button } from "@/components/ui/button";
import { MADHAHIB, ZAKAT_GUIDE, type Madhhab } from "@/lib/fiqh";
import { useI18n } from "@/lib/i18n";
import {
  CAMEL_TIERS,
  COW_TIERS,
  CROP_NISAB_KG,
  FITR_SAA_KG,
  SHEEP_TIERS,
  livestockDue,
} from "@/lib/nisab";

export const Route = createFileRoute("/types")({
  head: () => ({
    meta: [
      { title: "أنواع الزكاة وأنصبتها · نِصاب" },
      {
        name: "description",
        content: "زكاة النقد والذهب وعروض التجارة والزروع وبهيمة الأنعام والرِّكاز وزكاة الفطر.",
      },
      { property: "og:title", content: "أنواع الزكاة وأنصبتها · نِصاب" },
      {
        property: "og:description",
        content: "جداول أنصبة الإبل والبقر والغنم، ونصاب الزروع، ومقدار زكاة الفطر.",
      },
    ],
  }),
  component: Types,
});

const CARDS = ["cash", "gold", "trade", "crops", "livestock", "rikaz", "fitr"] as const;

function Types() {
  const { t, lang } = useI18n();
  const [count, setCount] = useState("40");
  const [kind, setKind] = useState<"camels" | "cows" | "sheep">("sheep");
  const [madhhab, setMadhhab] = useState<Madhhab>("hanafi");

  const tiers = kind === "camels" ? CAMEL_TIERS : kind === "cows" ? COW_TIERS : SHEEP_TIERS;
  const n = parseInt(count || "0", 10) || 0;
  const due = livestockDue(kind, n);
  const label = due ? (lang === "ar" ? due.ar : due.en) : "—";

  return (
    <Page eyebrow="REFERENCE" title={t("types.title")} sub={t("home.types.sub")}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((k) => (
          <article key={k} className="card-surface p-6">
            <h2 className="text-lg text-foreground">{t(`types.${k}.t`)}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {t(`types.${k}.d`)}
            </p>
          </article>
        ))}
      </div>

      <section className="card-surface mt-6 p-6">
        <h2 className="text-xl text-foreground">{t("types.livestock.t")}</h2>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <label className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">{t("history.pick")}</span>
            <select
              value={kind}
              onChange={(e) => setKind(e.target.value as typeof kind)}
              className="rounded-lg border border-border bg-card px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="camels">{t("types.camels")}</option>
              <option value="cows">{t("types.cows")}</option>
              <option value="sheep">{t("types.sheep")}</option>
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">{t("types.count")}</span>
            <input
              inputMode="numeric"
              value={count}
              onChange={(e) => setCount(e.target.value.replace(/\D/g, ""))}
              className="num w-28 rounded-lg border border-input bg-card px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
          <p className="rounded-xl bg-primary px-4 py-2 text-sm text-primary-foreground">
            {t("types.due")}: {label}
          </p>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-sm">
            <tbody>
              {tiers.map((tier) => (
                <tr key={tier.from} className="border-t border-border">
                  <td className="num py-2.5 text-foreground">
                    {tier.from}–{tier.to}
                  </td>
                  <td className="py-2.5 text-muted-foreground">
                    {lang === "ar" ? tier.ar : tier.en}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="card-surface p-6">
          <h2 className="text-lg text-foreground">{t("types.crops.t")}</h2>
          <p className="num mt-2 text-2xl text-foreground">{CROP_NISAB_KG} kg</p>
          <p className="mt-2 text-sm text-muted-foreground">{t("types.crops.d")}</p>
        </div>
        <div className="card-surface p-6">
          <h2 className="text-lg text-foreground">{t("types.fitr.t")}</h2>
          <p className="num mt-2 text-2xl text-foreground">{FITR_SAA_KG} kg</p>
          <p className="mt-2 text-sm text-muted-foreground">{t("types.fitr.d")}</p>
        </div>
      </section>

      <section className="card-surface mt-6 p-6">
        <h2 className="text-xl text-foreground">{t("types.madhhab.title")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("types.madhhab.note")}</p>
        <div
          className="mt-4 flex flex-wrap gap-1"
          role="group"
          aria-label={t("types.madhhab.title")}
        >
          {MADHAHIB.map((m) => (
            <Button
              key={m.id}
              size="sm"
              variant={m.id === madhhab ? "default" : "outline"}
              aria-pressed={m.id === madhhab}
              onClick={() => setMadhhab(m.id)}
            >
              {lang === "ar" ? m.ar : m.en}
            </Button>
          ))}
        </div>
        <div lang="ar" dir="rtl" className="mt-5 grid gap-4 md:grid-cols-2">
          {ZAKAT_GUIDE.map((g) => (
            <article key={g.id} className="rounded-xl border border-border p-5">
              <h3 className="text-lg text-foreground">{g.title}</h3>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{g.summary}</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {g.facts.map((f) => (
                  <li
                    key={f}
                    className="rounded-full bg-secondary px-3 py-1 text-xs text-foreground"
                  >
                    {f}
                  </li>
                ))}
              </ul>
              <p className="mt-4 border-s-2 border-accent ps-3 text-sm leading-7 text-foreground">
                {g.schools[madhhab]}
              </p>
            </article>
          ))}
        </div>
      </section>
    </Page>
  );
}
