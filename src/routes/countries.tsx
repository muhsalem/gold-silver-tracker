import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { COUNTRIES, countryName, flagOf } from "@/lib/countries";
import { useI18n } from "@/lib/i18n";
import { Disclaimer } from "@/components/site/Prices";

export const Route = createFileRoute("/countries")({
  head: () => ({
    meta: [
      { title: "دليل الدول · نصاب الزكاة لكل دولة" },
      {
        name: "description",
        content:
          "تصفّح نصاب الذهب والفضّة لكل دولة بعملتها المحلية، مع صفحة مستقلة لكل دولة.",
      },
      { property: "og:title", content: "دليل الدول · نصاب الزكاة لكل دولة" },
      {
        property: "og:description",
        content: "صفحة نصاب مستقلة لكل دولة، بعملتها المحلية وبياناتها التاريخية.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CountriesPage,
});

function CountriesPage() {
  const { t, lang } = useI18n();
  const [q, setQ] = useState("");

  const groups = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const match = (code: string) => {
      const c = COUNTRIES.find((x) => x.code === code)!;
      if (!needle) return true;
      return (
        c.code.toLowerCase().includes(needle) ||
        c.currency.toLowerCase().includes(needle) ||
        c.en.toLowerCase().includes(needle) ||
        c.ar.includes(q.trim()) ||
        countryName(c, lang).toLowerCase().includes(needle)
      );
    };
    const list = COUNTRIES.filter((c) => match(c.code));
    return {
      muslim: list.filter((c) => c.muslim),
      rest: list.filter((c) => !c.muslim),
    };
  }, [q, lang]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="eyebrow text-muted-foreground">{t("countries.eyebrow")}</p>
      <h1 className="mt-2 text-3xl text-foreground sm:text-4xl">{t("countries.title")}</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{t("countries.sub")}</p>

      <label className="mt-6 block max-w-md text-sm">
        <span className="text-muted-foreground">{t("countries.search")}</span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("countries.searchHint")}
          className="mt-1 w-full rounded-lg border border-input bg-card px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-ring"
        />
      </label>

      {([
        ["country.group.muslim", groups.muslim],
        ["country.group.other", groups.rest],
      ] as const).map(([key, list]) =>
        list.length === 0 ? null : (
          <section key={key} className="mt-10">
            <h2 className="eyebrow text-muted-foreground">{t(key)}</h2>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((c) => (
                <li key={c.code}>
                  <Link
                    to="/country/$code"
                    params={{ code: c.code.toLowerCase() }}
                    className="card-surface flex items-center gap-3 p-4 transition-colors hover:bg-secondary"
                  >
                    <span aria-hidden="true" className="text-2xl">
                      {flagOf(c.code)}
                    </span>
                    <span className="leading-tight">
                      <span className="block text-foreground">{countryName(c, lang)}</span>
                      <span className="num block text-xs text-muted-foreground">
                        {c.currency} · {c.code}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ),
      )}

      {groups.muslim.length === 0 && groups.rest.length === 0 && (
        <p className="mt-8 text-sm text-muted-foreground">{t("countries.none")}</p>
      )}

      <Disclaimer className="mt-10" />
    </div>
  );
}
