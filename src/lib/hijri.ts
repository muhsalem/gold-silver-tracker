/** Hijri (Umm al-Qura) calendar helpers for the zakat year (ḥawl). Pure, no I/O. */

export const DAY_MS = 24 * 60 * 60 * 1000;

/** Zakat rate for a solar-year ḥawl: 2.5% scaled by 365.2425 / 354.367 days. */
export const ZAKAT_RATE_SOLAR = 0.02577;

export type HijriDate = { y: number; m: number; d: number };

const partsFormatter = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  timeZone: "UTC",
});

/** Hijri date of a UTC-midnight timestamp. */
export function toHijri(t: number): HijriDate {
  const parts = partsFormatter.formatToParts(new Date(t));
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  return { y: get("year"), m: get("month"), d: get("day") };
}

/** Human-readable Hijri date, e.g. "١٤ ربيع الآخر ١٤٤٨ هـ". */
export function formatHijri(t: number, lang: string): string {
  const locale = lang === "ar" ? "ar-SA" : lang;
  try {
    return new Intl.DateTimeFormat(`${locale}-u-ca-islamic-umalqura`, {
      dateStyle: "long",
      timeZone: "UTC",
    }).format(new Date(t));
  } catch {
    return "";
  }
}

/** UTC midnight of a local "YYYY-MM-DD" date string, or null if invalid. */
export function parseDay(value: string): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!m) return null;
  const t = Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isFinite(t) ? t : null;
}

/** Today's date as UTC midnight (by the visitor's local calendar day). */
export function today(now = new Date()): number {
  return Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
}

/**
 * The `years`-th Hijri anniversary of `start`: the same Hijri month and day,
 * `years` later — or the month's last day when that month is shorter.
 */
export function hijriAnniversary(start: number, years: number): number {
  const s = toHijri(start);
  const target = s.y + years;
  // A lunar year is 354–355 days; scan a small window around the estimate.
  let lastInMonth: number | null = null;
  for (let off = -5; off <= 5; off++) {
    const t = start + (years * 354 + Math.floor(years * 0.367) + off) * DAY_MS;
    const h = toHijri(t);
    if (h.y !== target || h.m !== s.m) continue;
    if (h.d === s.d) return t;
    lastInMonth = t;
  }
  return lastInMonth ?? start + years * 354.367 * DAY_MS;
}

/** Next ḥawl due date on or after `now` for a ḥawl that started on `start`. */
export function nextHawl(start: number, now: number, solar = false): number {
  for (let years = 1; years < 200; years++) {
    const due = solar
      ? Date.UTC(
          new Date(start).getUTCFullYear() + years,
          new Date(start).getUTCMonth(),
          new Date(start).getUTCDate(),
        )
      : hijriAnniversary(start, years);
    if (due >= now) return due;
  }
  return now;
}

/** A day count for "{n}" placeholders; Arabic gets the full counted phrase. */
export function formatDays(n: number, lang: string): string {
  if (lang !== "ar") return String(n);
  switch (new Intl.PluralRules("ar").select(n)) {
    case "one":
      return "يوم واحد";
    case "two":
      return "يومان";
    case "few":
      return `${n} أيام`;
    case "many":
      return `${n} يوماً`;
    default:
      return `${n} يوم`;
  }
}
