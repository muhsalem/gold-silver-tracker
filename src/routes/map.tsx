import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import worldGeography from "world-atlas/countries-110m.json";

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

function WorldMapPage() {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useNisab();
  const [metal, setMetal] = useState<"gold" | "silver">("gold");
  const [query, setQuery] = useState("");
  const [hoveredCode, setHoveredCode] = useState<string | null>(null);

  const countryByNumeric = useMemo(
    () => new Map(COUNTRIES.map((country) => [country.numericCode, country])),
    [],
  );
  const hoveredCountry = hoveredCode
    ? COUNTRIES.find((country) => country.code === hoveredCode)
    : undefined;

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

      <section className="relative hidden overflow-hidden rounded-lg border border-border bg-secondary md:block" aria-label={t("map.title")}>
        <ComposableMap
          projectionConfig={{ scale: 145 }}
          className="h-auto w-full"
          aria-label={t("map.title")}
        >
          <ZoomableGroup center={[8, 5]} zoom={1} minZoom={1} maxZoom={5}>
            <Geographies geography={worldGeography}>
              {({ geographies }) => geographies.map((geography) => {
                const numericCode = String(geography.id).padStart(3, "0");
                const country = countryByNumeric.get(numericCode);
                const isHovered = country?.code === hoveredCode;
                return (
                  <Geography
                    key={geography.rsmKey}
                    geography={geography}
                    tabIndex={country ? 0 : -1}
                    role={country ? "link" : undefined}
                    aria-label={country ? `${countryName(country, lang)} — ${valueOf(country.code) ?? "—"}` : undefined}
                    onMouseEnter={() => setHoveredCode(country?.code ?? null)}
                    onMouseLeave={() => setHoveredCode(null)}
                    onFocus={() => setHoveredCode(country?.code ?? null)}
                    onBlur={() => setHoveredCode(null)}
                    onClick={() => {
                      if (country) void navigate({ to: "/country/$code", params: { code: country.code.toLowerCase() } });
                    }}
                    onKeyDown={(event) => {
                      if (country && (event.key === "Enter" || event.key === " ")) {
                        event.preventDefault();
                        void navigate({ to: "/country/$code", params: { code: country.code.toLowerCase() } });
                      }
                    }}
                    fill={isHovered ? "var(--color-accent)" : country ? "var(--color-primary)" : "var(--color-muted)"}
                    stroke="var(--color-card)"
                    strokeWidth={0.45}
                    className={country ? "cursor-pointer outline-none transition-colors focus:fill-accent" : "outline-none"}
                  />
                );
              })}
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
        <div className="pointer-events-none absolute start-4 top-4 min-h-16 min-w-52 rounded-md border border-border bg-card/95 px-4 py-3 text-sm shadow-sm backdrop-blur-sm" aria-live="polite">
          {hoveredCountry ? (
            <>
              <strong className="block font-medium text-foreground">{flagOf(hoveredCountry.code)} {countryName(hoveredCountry, lang)}</strong>
              <span className="num mt-1 block text-muted-foreground">{valueOf(hoveredCountry.code) ?? "—"}</span>
            </>
          ) : (
            <span className="text-muted-foreground">{t("map.sub")}</span>
          )}
        </div>
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