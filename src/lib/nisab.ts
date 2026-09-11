/** Shared zakat / nisab math. Pure, no I/O. */

export const TROY_OUNCE_G = 31.1034768;

/** Nisab of gold: 85 g of pure (24K) gold — 20 mithqāl. */
export const GOLD_NISAB_G = 85;
/** Nisab of silver: 595 g of silver — 200 dirham. */
export const SILVER_NISAB_G = 595;
/** Zakat rate on monetary wealth. */
export const ZAKAT_RATE = 0.025;

export const KARATS = [
  { k: 24, purity: 0.999 },
  { k: 22, purity: 0.9167 },
  { k: 21, purity: 0.875 },
  { k: 18, purity: 0.75 },
  { k: 14, purity: 0.5833 },
  { k: 12, purity: 0.5 },
] as const;

export function perGram(usdPerOunce: number, rate: number): number {
  return (usdPerOunce / TROY_OUNCE_G) * rate;
}

export function goldNisabValue(goldUsdOz: number, rate: number): number {
  return perGram(goldUsdOz, rate) * GOLD_NISAB_G;
}

export function silverNisabValue(silverUsdOz: number, rate: number): number {
  return perGram(silverUsdOz, rate) * SILVER_NISAB_G;
}

export function formatMoney(value: number, currency: string, locale: string): string {
  try {
    return new Intl.NumberFormat(locale === "ar" ? "en" : locale, {
      style: "currency",
      currency,
      maximumFractionDigits: value >= 1000 ? 0 : 2,
    }).format(value);
  } catch {
    return `${value.toFixed(2)} ${currency}`;
  }
}

export function formatNumber(value: number, digits = 2): string {
  return new Intl.NumberFormat("en", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

/** Livestock nisab tables (Hanafi/Jumhūr consensus tiers). */
export const CAMEL_TIERS = [
  { from: 5, to: 9, ar: "شاة واحدة", en: "1 sheep/goat" },
  { from: 10, to: 14, ar: "شاتان", en: "2 sheep/goats" },
  { from: 15, to: 19, ar: "ثلاث شياه", en: "3 sheep/goats" },
  { from: 20, to: 24, ar: "أربع شياه", en: "4 sheep/goats" },
  { from: 25, to: 35, ar: "بنت مخاض (ناقة سنة)", en: "1 bint makhāḍ (1-yr she-camel)" },
  { from: 36, to: 45, ar: "بنت لبون (ناقة سنتين)", en: "1 bint labūn (2-yr she-camel)" },
  { from: 46, to: 60, ar: "حِقّة (ناقة ثلاث سنوات)", en: "1 ḥiqqa (3-yr she-camel)" },
  { from: 61, to: 75, ar: "جَذَعة (ناقة أربع سنوات)", en: "1 jadhaʿa (4-yr she-camel)" },
  { from: 76, to: 90, ar: "بنتا لبون", en: "2 bint labūn" },
  { from: 91, to: 120, ar: "حِقّتان", en: "2 ḥiqqa" },
];

export const COW_TIERS = [
  { from: 30, to: 39, ar: "تبيع أو تبيعة (سنة)", en: "1 tabīʿ (1-yr calf)" },
  { from: 40, to: 59, ar: "مُسِنّة (سنتان)", en: "1 musinna (2-yr cow)" },
  { from: 60, to: 69, ar: "تبيعان", en: "2 tabīʿ" },
  { from: 70, to: 79, ar: "مسنة وتبيع", en: "1 musinna + 1 tabīʿ" },
  { from: 80, to: 89, ar: "مسنتان", en: "2 musinna" },
];

export const SHEEP_TIERS = [
  { from: 40, to: 120, ar: "شاة واحدة", en: "1 sheep/goat" },
  { from: 121, to: 200, ar: "شاتان", en: "2 sheep/goats" },
  { from: 201, to: 399, ar: "ثلاث شياه", en: "3 sheep/goats" },
  { from: 400, to: 499, ar: "أربع شياه", en: "4 sheep/goats" },
];

/** Nisab of crops: 5 wasq ≈ 653 kg of staple grain. */
export const CROP_NISAB_KG = 653;
/** Zakat al-Fitr: one ṣāʿ ≈ 2.5 kg of staple food per person. */
export const FITR_SAA_KG = 2.5;
