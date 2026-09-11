import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { LANGS, useI18n } from "@/lib/i18n";
import { COUNTRIES, countryName, flagOf } from "@/lib/countries";

const NAV = [
  { to: "/", key: "nav.home" },
  { to: "/calculator", key: "nav.calculator" },
  { to: "/history", key: "nav.history" },
  { to: "/types", key: "nav.types" },
  { to: "/faq", key: "nav.faq" },
  { to: "/waqf", key: "nav.about" },
] as const;

export function CountryPicker({ compact = false }: { compact?: boolean }) {
  const { t, lang, country, setCountry } = useI18n();
  const muslim = COUNTRIES.filter((c) => c.muslim);
  const rest = COUNTRIES.filter((c) => !c.muslim);
  return (
    <label className="flex items-center gap-2 text-sm">
      {!compact && <span className="text-muted-foreground">{t("hero.country")}</span>}
      <select
        aria-label={t("hero.country")}
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
      >
        <optgroup label="—">
          {muslim.map((c) => (
            <option key={c.code} value={c.code}>
              {flagOf(c.code)} {countryName(c, lang)} · {c.currency}
            </option>
          ))}
        </optgroup>
        <optgroup label="—">
          {rest.map((c) => (
            <option key={c.code} value={c.code}>
              {flagOf(c.code)} {countryName(c, lang)} · {c.currency}
            </option>
          ))}
        </optgroup>
      </select>
    </label>
  );
}

function LangPicker() {
  const { lang, setLang } = useI18n();
  return (
    <select
      aria-label="Language"
      value={lang}
      onChange={(e) => setLang(e.target.value as typeof lang)}
      className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
    >
      {LANGS.map((l) => (
        <option key={l.code} value={l.code}>
          {l.label}
        </option>
      ))}
    </select>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const { t } = useI18n();
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground font-[family-name:var(--font-display)] text-lg">
              ن
            </span>
            <span className="leading-tight">
              <span className="block font-[family-name:var(--font-display)] text-lg text-foreground">
                {t("brand.name")}
              </span>
              <span className="eyebrow block text-[0.6rem] text-muted-foreground">
                {t("brand.tagline")}
              </span>
            </span>
          </Link>

          <nav className="order-last flex w-full flex-wrap items-center gap-1 md:order-none md:w-auto md:flex-1 md:justify-center">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{ className: "bg-secondary text-foreground" }}
                className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>

          <div className="ms-auto flex items-center gap-2">
            <LangPicker />
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-16 border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <p className="font-[family-name:var(--font-display)] text-lg text-foreground">
            {t("footer.waqf")}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">{t("footer.meta")}</p>
          <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {t(item.key)}
              </Link>
            ))}
            <Link
              to="/admin"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {t("nav.admin")}
            </Link>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">{t("footer.disclaimer")}</p>
        </div>
      </footer>
    </div>
  );
}
