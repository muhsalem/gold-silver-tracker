import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Calculator, LineChart, Table2 } from "lucide-react";

import { Page } from "@/components/site/Page";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { MADHAHIB, ZAKAT_GUIDE, type Madhhab } from "@/lib/fiqh";

export const Route = createFileRoute("/fiqh")({
  head: () => ({
    meta: [
      { title: "موسوعة الزكاة الفقهية · نِصاب" },
      {
        name: "description",
        content:
          "صفحة جامعة لأنواع الزكاة: الأنعام والزروع وعروض التجارة وزكاة الفطر والرِّكاز مع مقارنة المذاهب الأربعة.",
      },
      { property: "og:title", content: "موسوعة الزكاة الفقهية · نِصاب" },
      {
        property: "og:description",
        content: "مقارنة المذاهب الأربعة في أنواع الزكاة وأنصبتها ومقاديرها.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Fiqh,
});

function Fiqh() {
  const { t } = useI18n();
  const [madhhab, setMadhhab] = useState<Madhhab | "all">("all");

  return (
    <Page eyebrow="FIQH" title={t("fiqh.title")} sub={t("fiqh.sub")}>
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">{t("fiqh.compare")}:</span>
        <Button
          size="sm"
          variant={madhhab === "all" ? "default" : "outline"}
          onClick={() => setMadhhab("all")}
        >
          {t("fiqh.allMadhahib")}
        </Button>
        {MADHAHIB.map((m) => (
          <Button
            key={m.id}
            size="sm"
            variant={madhhab === m.id ? "default" : "outline"}
            onClick={() => setMadhhab(m.id)}
          >
            {m.ar}
          </Button>
        ))}
      </div>

      <nav className="mb-8 flex flex-wrap gap-2">
        {ZAKAT_GUIDE.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:border-accent hover:text-foreground"
          >
            {s.title}
          </a>
        ))}
      </nav>

      <div className="grid gap-6">
        {ZAKAT_GUIDE.map((section) => (
          <article
            key={section.id}
            id={section.id}
            className="card-surface scroll-mt-24 overflow-hidden"
          >
            <header className="border-b border-border bg-secondary/60 p-6">
              <h2 className="text-xl text-foreground">{section.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {section.summary}
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {section.facts.map((f) => (
                  <li
                    key={f}
                    className="num rounded-lg bg-card px-3 py-1.5 text-xs text-foreground"
                  >
                    {f}
                  </li>
                ))}
              </ul>
            </header>
            <div className="grid gap-px bg-border sm:grid-cols-2">
              {MADHAHIB.filter((m) => madhhab === "all" || m.id === madhhab).map((m) => (
                <div key={m.id} className="bg-card p-6">
                  <p className="text-sm font-medium text-primary">{m.ar}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {section.schools[m.id]}
                  </p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>

      <section className="mt-8 grid gap-3 sm:grid-cols-3">
        <Button asChild variant="outline" size="lg">
          <Link to="/calculator">
            <Calculator />
            {t("fiqh.linkCalc")}
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/types">
            <Table2 />
            {t("fiqh.linkTypes")}
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/history">
            <LineChart />
            {t("fiqh.linkHistory")}
          </Link>
        </Button>
      </section>

      <p className="mt-6 text-xs leading-6 text-muted-foreground">{t("fiqh.note")}</p>
    </Page>
  );
}
