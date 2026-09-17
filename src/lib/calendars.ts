export type HijriDate = {
  year: number;
  month: number;
  day: number;
};

const ISLAMIC_EPOCH = 1948439.5;

export const HIJRI_MONTHS_AR = [
  "محرّم",
  "صفر",
  "ربيع الأول",
  "ربيع الآخر",
  "جمادى الأولى",
  "جمادى الآخرة",
  "رجب",
  "شعبان",
  "رمضان",
  "شوّال",
  "ذو القعدة",
  "ذو الحجة",
] as const;

export const HIJRI_MONTHS_EN = [
  "Muharram",
  "Safar",
  "Rabi I",
  "Rabi II",
  "Jumada I",
  "Jumada II",
  "Rajab",
  "Sha'ban",
  "Ramadan",
  "Shawwal",
  "Dhu al-Qidah",
  "Dhu al-Hijjah",
] as const;

function gregorianToJulianDay(year: number, month: number, day: number) {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

function julianDayToGregorian(julianDay: number) {
  const a = julianDay + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor((146097 * b) / 4);
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);
  const day = e - Math.floor((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * Math.floor(m / 10);
  const year = 100 * b + d - 4800 + Math.floor(m / 10);
  return { year, month, day };
}

function hijriToJulianDay({ year, month, day }: HijriDate) {
  return (
    day +
    Math.ceil(29.5 * (month - 1)) +
    (year - 1) * 354 +
    Math.floor((3 + 11 * year) / 30) +
    ISLAMIC_EPOCH -
    1
  );
}

export function gregorianToHijri(date: Date): HijriDate {
  const julianDay = gregorianToJulianDay(
    date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    date.getUTCDate(),
  );
  const normalized = Math.floor(julianDay) + 0.5;
  const year = Math.floor((30 * (normalized - ISLAMIC_EPOCH) + 10646) / 10631);
  const month = Math.min(
    12,
    Math.ceil((normalized - (29 + hijriToJulianDay({ year, month: 1, day: 1 }))) / 29.5) + 1,
  );
  const day = Math.floor(normalized - hijriToJulianDay({ year, month, day: 1 }) + 1);
  return { year, month, day };
}

export function hijriToGregorian(hijri: HijriDate) {
  const gregorian = julianDayToGregorian(Math.floor(hijriToJulianDay(hijri) + 0.5));
  return new Date(Date.UTC(gregorian.year, gregorian.month - 1, gregorian.day));
}

export function isHijriLeapYear(year: number) {
  return ((11 * year + 14) % 30) < 11;
}

export function hijriMonthDays(year: number, month: number) {
  if (month === 12) return isHijriLeapYear(year) ? 30 : 29;
  return month % 2 === 1 ? 30 : 29;
}

export function formatGregorianIso(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function formatHijri(date: Date, language: string) {
  const hijri = gregorianToHijri(date);
  const months = language === "ar" || language === "ur" ? HIJRI_MONTHS_AR : HIJRI_MONTHS_EN;
  const suffix = language === "ar" || language === "ur" ? "هـ" : "AH";
  return `${hijri.day} ${months[hijri.month - 1]} ${hijri.year} ${suffix}`;
}