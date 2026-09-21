import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, Search } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";

import { LANGS, useI18n } from "@/lib/i18n";
import { COUNTRIES, countryName, flagOf } from "@/lib/countries";
import { citiesOf, cityName } from "@/lib/cities";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const NAV_GROUPS = [
  {
    key: "nav.group.live",
    items: [
      { to: "/today", key: "nav.today" },
      { to: "/countries", key: "nav.countries" },
      { to: "/history", key: "nav.history" },
      { to: "/compare", key: "nav.compare" },
      { to: "/map", key: "nav.map" },
    ],
  },
  {
    key: "nav.group.reference",
    items: [
      { to: "/types", key: "nav.types" },
      { to: "/methodology", key: "nav.methodology" },
      { to: "/fiqh", key: "nav.fiqh" },
      { to: "/calculator", key: "nav.calculator" },
      { to: "/faq", key: "nav.faq" },
    ],
  },
  {
    key: "nav.group.about",
    items: [{ to: "/waqf", key: "nav.about" }],
  },
] as const;

const NAV = [
  ...NAV_GROUPS[0].items,
  ...NAV_GROUPS[1].items,
  ...NAV_GROUPS[2].items,
];

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
        <optgroup label={t("country.group.muslim")}>
          {muslim.map((c) => (
            <option key={c.code} value={c.code}>
              {flagOf(c.code)} {countryName(c, lang)} · {c.currency}
            </option>
          ))}
        </optgroup>
        <optgroup label={t("country.group.other")}>
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

export function CityPicker() {
  const { t, lang, country, city, setCity } = useI18n();
  const cities = citiesOf(country);
  if (cities.length === 0) return null;
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-muted-foreground">{t("city.label")}</span>
      <select
        aria-label={t("city.label")}
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="">{t("city.all")}</option>
        {cities.map((c) => (
          <option key={c.id} value={c.id}>
            {cityName(c, lang)}
          </option>
        ))}
      </select>
    </label>
  );
}

/** Header search: jumps to a country page by name, code or currency. */
function GlobalSearch() {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return [];
    return COUNTRIES.filter(
      (c) =>
        c.code.toLowerCase().includes(needle) ||
        c.currency.toLowerCase().includes(needle) ||
        c.en.toLowerCase().includes(needle) ||
        c.ar.includes(q.trim()) ||
        countryName(c, lang).toLowerCase().includes(needle),
    ).slice(0, 6);
  }, [q, lang]);

  const go = (code: string) => {
    setQ("");
    setOpen(false);
    navigate({ to: "/country/$code", params: { code: code.toLowerCase() } });
  };

  return (
    <div className="relative hidden lg:block">
      <label className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
        <Search aria-hidden="true" className="size-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => window.setTimeout(() => setOpen(false), 150)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && results[0]) go(results[0].code);
          }}
          aria-label={t("search.label")}
          placeholder={t("search.placeholder")}
          className="w-44 bg-transparent text-sm text-foreground outline-none"
        />
      </label>
      {open && results.length > 0 && (
        <ul className="absolute z-40 mt-1 w-64 overflow-hidden rounded-lg border border-border bg-card shadow-lg">
          {results.map((c) => (
            <li key={c.code}>
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => go(c.code)}
                className="flex w-full items-center gap-2 px-3 py-2 text-start text-sm text-foreground hover:bg-secondary"
              >
                <span aria-hidden="true">{flagOf(c.code)}</span>
                <span>{countryName(c, lang)}</span>
                <span className="num ms-auto text-xs text-muted-foreground">{c.currency}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
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

function MobileNav() {
  const { t, rtl } = useI18n();
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label={t("nav.menu")}
        className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground md:hidden"
      >
        <Menu aria-hidden="true" className="size-4" />
        {t("nav.menu")}
      </SheetTrigger>
      <SheetContent
        side={rtl ? "right" : "left"}
        dir={rtl ? "rtl" : "ltr"}
        className="w-[85vw] max-w-[20rem] overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle>{t("brand.name")}</SheetTitle>
        </SheetHeader>
        <nav aria-label={t("nav.menu")} className="mt-2 flex flex-col gap-5 px-4 pb-8">
          {NAV_GROUPS.map((group) => (
            <div key={group.key}>
              <p className="eyebrow text-muted-foreground">{t(group.key)}</p>
              <div className="mt-2 flex flex-col">
                {group.items.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    activeOptions={{ exact: true }}
                    activeProps={{ className: "text-foreground font-medium" }}
                    className="rounded-lg px-2 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
                  >
                    {t(item.key)}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const { t } = useI18n();
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
          <Link to="/" aria-label={`${t("brand.name")} · NISAB`} className="flex min-w-0 items-center gap-2">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[image:var(--gradient-brand)] font-[family-name:var(--font-display)] text-lg text-primary-foreground shadow-sm">
              ن
            </span>
            <span className="hidden min-w-0 leading-tight sm:block">
              <span className="block truncate font-[family-name:var(--font-display)] text-lg text-foreground">
                {t("brand.name")}
              </span>
              <span className="brand-latin block text-[0.62rem] font-semibold text-muted-foreground">
                NISAB · {t("brand.tagline")}
              </span>
            </span>
          </Link>

          <nav
            aria-label={t("nav.group.live")}
            className="hidden flex-1 flex-wrap items-center justify-center gap-1 md:flex"
          >
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: true }}
                activeProps={{ className: "bg-secondary text-foreground" }}
                className="rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>

          <div className="ms-auto flex items-center gap-2">
            <GlobalSearch />
            <LangPicker />
            <MobileNav />
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-16 border-t border-border bg-[image:var(--gradient-paper)]">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <p className="font-[family-name:var(--font-display)] text-lg text-foreground">
            {t("footer.waqf")}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">{t("footer.meta")}</p>
          <nav
            aria-label={t("nav.group.about")}
            className="mt-6 grid gap-6 text-sm sm:grid-cols-3"
          >
            {NAV_GROUPS.map((group) => (
              <div key={group.key}>
                <p className="eyebrow text-muted-foreground">{t(group.key)}</p>
                <div className="mt-2 flex flex-col gap-1">
                  {group.items.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {t(item.key)}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>
          <p className="mt-6 text-xs text-muted-foreground">{t("footer.disclaimer")}</p>
          <p className="mt-2 text-xs">
            <Link to="/admin" className="text-muted-foreground underline underline-offset-4">
              {t("nav.admin")} · {t("admin.deviceOnly")}
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
