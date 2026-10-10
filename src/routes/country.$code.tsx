import { CountryVerificationSection } from "@/components/site/CountryVerificationSection";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { COUNTRIES, countryName, flagOf } from "@/lib/countries";
import { useI18n } from "@/lib/i18n";
import { usePrices } from "@/lib/use-prices";
import { StateNote, Disclaimer, LocalMarket, SourceQuality, PriceSourceLine, resolveGram } from "@/components/site/Prices";
import { useLocalQuote } from "@/lib/local-quotes";
import { scopeKey } from "@/lib/cities";
import { OfficialNisab } from "@/components/site/OfficialNisab";
import { ShareNisab } from "@/components/site/ShareNisab";
import {
  GOLD_NISAB_G,
  KARATS,
  SILVER_NISAB_G,
  TROY_OUNCE_G,
  formatMoney,
  formatNumber,
  perGram,
} from "@/lib/nisab";

export const Route = createFileRoute("/country/$code")({
  loader: ({ params }) => {
    const country = COUNTRIES.find((c) => c.code.toLowerCase() === params.code.toLowerCase());
    if (!country) throw notFound();
    return { country };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "دولة غير متاحة · نِصاب" }, { name: "robots", content: "noindex" }] };
    }
    const { country } = loaderData;
    const title = `نصاب الزكاة في ${country.ar} · ${country.currency}`;
    const description = `قيمة نصاب الذهب (٨٥غ) والفضّة (٥٩٥غ) في ${country.ar} بعملة ${country.currency}، محدّثة يومياً مع المصدر وطريقة الحساب.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  component: CountryPage,
});

function CountryPage() {
  const { country } = Route.useLoaderData();
  const { t, lang, setCountry } = useI18n();
  const { data, overrides, isLoading, isError, refetch } = usePrices();
  const { data: quote } = useLocalQuote(country.code, country.currency);

  const rate = data?.rates?.[country.currency];
  const ready = Boolean(data && Number.isFinite(rate));
  const r = rate ?? 1;
  const money = (v: number) => formatMoney(v, country.currency, lang);

  const manual = Boolean(data?.manual || overrides?.scopes?.[scopeKey(country.code, "")]);
  const spotGold = data ? perGram(data.goldUsdOz, r) : 0;
  const spotSilver = data ? perGram(data.silverUsdOz, r) : 0;
  const g = resolveGram(spotGold, manual, quote?.goldGram);
  const s = resolveGram(spotSilver, manual, quote?.silverGram);
  const goldGram = g.gram;
  const silverGram = s.gram;
  const gold = goldGram * GOLD_NISAB_G;
  const silver = silverGram * SILVER_NISAB_G;
  const priceSource = data
    ? { gold: g.origin, silver: s.origin, name: quote?.source ?? "", at: quote?.at ?? "" }
    : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <nav aria-label={t("countries.title")} className="text-sm">
        <Link to="/countries" className="text-muted-foreground underline underline-offset-4">
          {t("countries.title")}
        </Link>
      </nav>

      <header className="mt-4 flex flex-wrap items-center gap-3">
        <span aria-hidden="true" className="text-4xl">
          {flagOf(country.code)}
        </span>
        <div>
          <h1 className="text-3xl text-foreground sm:text-4xl">
            {t("country.title").replace("{name}", countryName(country, lang))}
          </h1>
          <p className="num mt-1 text-sm text-muted-foreground">
            {country.currency} · {country.code}
          </p>
          <PriceSourceLine source={priceSource} className="mt-1 font-medium" />
        </div>
      </header>

      {(isLoading || isError) && (
        <div className="mt-8">
          <StateNote isLoading={isLoading} isError={isError} refetch={refetch} />
        </div>
      )}

      {!isLoading && !isError && !ready && (
        <p className="card-surface mt-8 p-5 text-sm text-muted-foreground">
          {t("country.noRate").replace("{currency}", country.currency)}
        </p>
      )}

      {ready && data && (
        <>
          <section className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              {
                label: t("nisab.gold"),
                metal: t("gold"),
                grams: GOLD_NISAB_G,
                total: gold,
                gram: goldGram,
                oz: data.goldUsdOz,
                lower: gold <= silver,
              },
              {
                label: t("nisab.silver"),
                metal: t("silver"),
                grams: SILVER_NISAB_G,
                total: silver,
                gram: silverGram,
                oz: data.silverUsdOz,
                lower: silver < gold,
              },
            ].map((c) => (
              <article key={c.label} className="card-surface p-6 sm:p-8">
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
                <details className="mt-4 text-sm">
                  <summary className="cursor-pointer text-foreground">
                    {t("country.how")}
                  </summary>
                  <p className="num mt-2 text-muted-foreground">
                    ({formatNumber(c.oz, 2)} USD/oz ÷ {formatNumber(TROY_OUNCE_G, 4)}) ×{" "}
                    {formatNumber(r, 4)} {country.currency} × {c.grams} g ={" "}
                    {money(c.total)}
                  </p>
                </details>
              </article>
            ))}
          </section>

          <section className="card-surface mt-4 p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-sm text-muted-foreground">{t("ratio.label")}</p>
              <p className="num text-xl text-foreground">
                {formatNumber(data.goldUsdOz / data.silverUsdOz, 1)}
              </p>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{t("ratio.note")}</p>
          </section>

          <section className="card-surface mt-4 p-4 sm:p-6">
            <h2 className="text-xl text-foreground">{t("karat.title")}</h2>
            <div className="scroll-x -mx-4 mt-4 px-4 sm:mx-0 sm:px-0">
              <table className="w-full min-w-[22rem] text-sm">
                <thead className="text-muted-foreground">
                  <tr>
                    <th className="py-2 text-start font-normal">{t("karat.title")}</th>
                    <th className="py-2 text-start font-normal">{t("karat.purity")}</th>
                    <th className="py-2 text-start font-normal">{t("karat.price")}</th>
                  </tr>
                </thead>
                <tbody>
                  {KARATS.map((k) => (
                    <tr key={k.k} className="border-t border-border">
                      <td className="num whitespace-nowrap py-2.5 text-foreground">{k.k}K</td>
                      <td className="num whitespace-nowrap py-2.5 text-muted-foreground">
                        {(k.purity * 100).toFixed(1)}%
                      </td>
                      <td className="num whitespace-nowrap py-2.5 text-foreground">
                        {money(goldGram * k.purity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <LocalMarket currency={country.currency} goldGram={spotGold} silverGram={spotSilver} />
          <OfficialNisab country={country.code} locale={lang} />
          <SourceQuality currency={country.currency} />
          <CountryVerificationSection country={country} lang={lang} spotGoldGram={spotGold} spotSilverGram={spotSilver} spotGoldNisab={spotGold * GOLD_NISAB_G} spotSilverNisab={spotSilver * SILVER_NISAB_G} />
          <ShareNisab
            countryName={country.ar}
            goldText={money(gold)}
            silverText={money(silver)}
            url={`https://nissab-rates.lovable.app/country/${country.code.toLowerCase()}`}
          />
        </>
      )}

      <section className="mt-8 flex flex-wrap gap-3">
        <Link
          to="/history"
          onClick={() => setCountry(country.code)}
          className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          {t("country.history")}
        </Link>
        <Link
          to="/calculator"
          onClick={() => setCountry(country.code)}
          className="rounded-lg border border-border bg-card px-4 py-2 text-sm text-foreground"
        >
          {t("home.cta.calc")}
        </Link>
        <Link
          to="/compare"
          className="rounded-lg border border-border bg-card px-4 py-2 text-sm text-foreground"
        >
          {t("nav.compare")}
        </Link>
      </section>

      <Disclaimer className="mt-8" />
    </div>
  );
}
