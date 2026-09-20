import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Globe2, Search } from "lucide-react";

import { Page } from "@/components/site/Page";
import { StateNote, useNisab } from "@/components/site/Prices";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { COUNTRIES, countryName, flagOf } from "@/lib/countries";
import { formatMoney, goldNisabValue, silverNisabValue } from "@/lib/nisab";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "خريطة النصاب حول العالم · نِصاب" },
      { name: "description", content: "استكشف قيمة نصاب الذهب والفضة في دول العالم بعملاتها المحلية وانتقل إلى صفحة كل دولة." },
      { property: "og:title", content: "خريطة النصاب حول العالم · نِصاب" },
      { property: "og:description", content: "خريطة تفاعلية لقيم النصاب اليومية حسب الدولة والعملة." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: WorldMapPage,
});

const MAP_POINTS = [
  ["US", 13, 39], ["CA", 16, 25], ["BR", 30, 70], ["GB", 45, 26], ["FR", 47, 35],
  ["MA", 45, 48], ["DZ", 49, 49], ["EG", 57, 49], ["NG", 50, 65], ["ZA", 56, 86],
  ["SA", 62, 55], ["TR", 58, 39], ["PK", 70, 49], ["IN", 74, 55], ["BD", 78, 57],
  ["ID", 84, 70], ["MY", 82, 65], ["CN", 80, 41], ["JP", 92, 42], ["AU", 89, 83],
] as const;

function WorldMapPage() {
  const { t, lang } = useI18n();
  const { data, isLoading, isError, refetch } = useNisab();
  const [metal, setMetal] = useState<"gold" | "silver">("gold");
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return COUNTRIES.filter((country) => !needle || country.code.toLowerCase().includes(needle) || country.currency.toLowerCase().includes(needle) || country.ar.includes(query.trim()) || country.en.toLowerCase().includes(needle));
  }, [query]);

  const valueOf = (code: string) => {
    const country = COUNTRIES.find((item) => item.code === code);
    const rate = country && data?.rates[country.currency];
    if (!country || !data || !rate) return null;
    const value = metal === "gold" ? goldNisabValue(data.goldUsdOz, rate) : silverNisabValue(data.silverUsdOz, rate);
    return formatMoney(value, country.currency, lang);
  };

  return (
    <Page eyebrow={t("map.eyebrow")} title={t("map.title")} sub={t("map.sub")}>
      {(isLoading || isError) && <StateNote isLoading={isLoading} isError={isError} refetch={refetch} />}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="inline-flex w-full rounded-md border border-border bg-card p-1 sm:w-auto">
          {(["gold", "silver"] as const).map((key) => <Button key={key} size="sm" className="flex-1 sm:flex-none" variant={metal === key ? "default" : "ghost"} onClick={() => setMetal(key)}>{t(key)}</Button>)}
        </div>
        <label className="flex w-full items-center gap-2 rounded-md border border-border bg-card px-3 py-2 sm:w-64">
          <Search aria-hidden="true" className="size-4 text-muted-foreground" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("countries.searchHint")} className="w-full bg-transparent text-sm text-foreground outline-none" />
        </label>
      </div>

      <section className="relative hidden aspect-[2/1] overflow-hidden rounded-lg border border-border bg-secondary md:block" aria-label={t("map.title")}>
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)", backgroundSize: "5% 10%" }} />
        <Globe2 aria-hidden="true" className="absolute start-6 top-6 size-10 text-primary/25" />
        {MAP_POINTS.map(([code, x, y]) => {
          const country = COUNTRIES.find((item) => item.code === code);
          if (!country) return null;
          return <Link key={code} to="/country/$code" params={{ code: code.toLowerCase() }} className="group absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${x}%`, top: `${y}%` }}>
            <span className="block size-3 rounded-full border-2 border-card bg-primary shadow-sm transition-transform group-hover:scale-150" />
            <span className="pointer-events-none absolute bottom-full start-1/2 z-10 mb-2 hidden min-w-max -translate-x-1/2 rounded-md border border-border bg-card px-3 py-2 text-xs text-foreground shadow-lg group-hover:block">
              {flagOf(code)} {countryName(country, lang)}<strong className="num ms-2 font-medium">{valueOf(code) ?? "—"}</strong>
            </span>
          </Link>;
        })}
      </section>

      <section className="mt-5 overflow-hidden rounded-lg border border-border bg-card">
        <header className="flex items-center justify-between border-b border-border px-5 py-4"><h2 className="text-lg text-foreground">{t("map.directory")}</h2><span className="num text-xs text-muted-foreground">{results.length}</span></header>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3">
          {results.map((country) => <Link key={country.code} to="/country/$code" params={{ code: country.code.toLowerCase() }} className="flex items-center gap-3 border-b border-border p-4 transition-colors hover:bg-secondary sm:border-e">
            <span className="text-xl" aria-hidden="true">{flagOf(country.code)}</span>
            <span><strong className="block text-sm font-medium text-foreground">{countryName(country, lang)}</strong><small className="num text-muted-foreground">{country.currency}</small></span>
            <span className="num ms-auto text-xs text-foreground">{valueOf(country.code) ?? "—"}</span>
          </Link>)}
        </div>
      </section>
    </Page>
  );
}