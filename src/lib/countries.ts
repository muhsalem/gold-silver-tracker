export type Country = {
  /** ISO 3166-1 alpha-2 */
  code: string;
  /** ISO 4217 currency */
  currency: string;
  /** Arabic name (fallback for locales Intl.DisplayNames cannot resolve) */
  ar: string;
  /** English name */
  en: string;
  /** Muslim-majority country — surfaced first in the picker */
  muslim?: boolean;
};

export const COUNTRIES: Country[] = [
  { code: "SA", currency: "SAR", ar: "السعودية", en: "Saudi Arabia", muslim: true },
  { code: "EG", currency: "EGP", ar: "مصر", en: "Egypt", muslim: true },
  { code: "AE", currency: "AED", ar: "الإمارات", en: "United Arab Emirates", muslim: true },
  { code: "KW", currency: "KWD", ar: "الكويت", en: "Kuwait", muslim: true },
  { code: "QA", currency: "QAR", ar: "قطر", en: "Qatar", muslim: true },
  { code: "BH", currency: "BHD", ar: "البحرين", en: "Bahrain", muslim: true },
  { code: "OM", currency: "OMR", ar: "عُمان", en: "Oman", muslim: true },
  { code: "JO", currency: "JOD", ar: "الأردن", en: "Jordan", muslim: true },
  { code: "IQ", currency: "IQD", ar: "العراق", en: "Iraq", muslim: true },
  { code: "SY", currency: "SYP", ar: "سوريا", en: "Syria", muslim: true },
  { code: "LB", currency: "LBP", ar: "لبنان", en: "Lebanon", muslim: true },
  { code: "PS", currency: "ILS", ar: "فلسطين", en: "Palestine", muslim: true },
  { code: "YE", currency: "YER", ar: "اليمن", en: "Yemen", muslim: true },
  { code: "SD", currency: "SDG", ar: "السودان", en: "Sudan", muslim: true },
  { code: "LY", currency: "LYD", ar: "ليبيا", en: "Libya", muslim: true },
  { code: "TN", currency: "TND", ar: "تونس", en: "Tunisia", muslim: true },
  { code: "DZ", currency: "DZD", ar: "الجزائر", en: "Algeria", muslim: true },
  { code: "MA", currency: "MAD", ar: "المغرب", en: "Morocco", muslim: true },
  { code: "MR", currency: "MRU", ar: "موريتانيا", en: "Mauritania", muslim: true },
  { code: "SO", currency: "SOS", ar: "الصومال", en: "Somalia", muslim: true },
  { code: "DJ", currency: "DJF", ar: "جيبوتي", en: "Djibouti", muslim: true },
  { code: "KM", currency: "KMF", ar: "جزر القمر", en: "Comoros", muslim: true },
  { code: "TR", currency: "TRY", ar: "تركيا", en: "Türkiye", muslim: true },
  { code: "IR", currency: "IRR", ar: "إيران", en: "Iran", muslim: true },
  { code: "PK", currency: "PKR", ar: "باكستان", en: "Pakistan", muslim: true },
  { code: "AF", currency: "AFN", ar: "أفغانستان", en: "Afghanistan", muslim: true },
  { code: "BD", currency: "BDT", ar: "بنغلاديش", en: "Bangladesh", muslim: true },
  { code: "ID", currency: "IDR", ar: "إندونيسيا", en: "Indonesia", muslim: true },
  { code: "MY", currency: "MYR", ar: "ماليزيا", en: "Malaysia", muslim: true },
  { code: "BN", currency: "BND", ar: "بروناي", en: "Brunei", muslim: true },
  { code: "MV", currency: "MVR", ar: "المالديف", en: "Maldives", muslim: true },
  { code: "UZ", currency: "UZS", ar: "أوزبكستان", en: "Uzbekistan", muslim: true },
  { code: "KZ", currency: "KZT", ar: "كازاخستان", en: "Kazakhstan", muslim: true },
  { code: "KG", currency: "KGS", ar: "قيرغيزستان", en: "Kyrgyzstan", muslim: true },
  { code: "TJ", currency: "TJS", ar: "طاجيكستان", en: "Tajikistan", muslim: true },
  { code: "TM", currency: "TMT", ar: "تركمانستان", en: "Turkmenistan", muslim: true },
  { code: "AZ", currency: "AZN", ar: "أذربيجان", en: "Azerbaijan", muslim: true },
  { code: "AL", currency: "ALL", ar: "ألبانيا", en: "Albania", muslim: true },
  { code: "NG", currency: "NGN", ar: "نيجيريا", en: "Nigeria", muslim: true },
  { code: "SN", currency: "XOF", ar: "السنغال", en: "Senegal", muslim: true },
  { code: "ML", currency: "XOF", ar: "مالي", en: "Mali", muslim: true },
  { code: "NE", currency: "XOF", ar: "النيجر", en: "Niger", muslim: true },
  { code: "BF", currency: "XOF", ar: "بوركينا فاسو", en: "Burkina Faso", muslim: true },
  { code: "GN", currency: "GNF", ar: "غينيا", en: "Guinea", muslim: true },
  { code: "TD", currency: "XAF", ar: "تشاد", en: "Chad", muslim: true },
  { code: "GM", currency: "GMD", ar: "غامبيا", en: "Gambia", muslim: true },
  { code: "SL", currency: "SLE", ar: "سيراليون", en: "Sierra Leone", muslim: true },

  { code: "US", currency: "USD", ar: "الولايات المتحدة", en: "United States" },
  { code: "GB", currency: "GBP", ar: "المملكة المتحدة", en: "United Kingdom" },
  { code: "CA", currency: "CAD", ar: "كندا", en: "Canada" },
  { code: "AU", currency: "AUD", ar: "أستراليا", en: "Australia" },
  { code: "NZ", currency: "NZD", ar: "نيوزيلندا", en: "New Zealand" },
  { code: "FR", currency: "EUR", ar: "فرنسا", en: "France" },
  { code: "DE", currency: "EUR", ar: "ألمانيا", en: "Germany" },
  { code: "NL", currency: "EUR", ar: "هولندا", en: "Netherlands" },
  { code: "BE", currency: "EUR", ar: "بلجيكا", en: "Belgium" },
  { code: "ES", currency: "EUR", ar: "إسبانيا", en: "Spain" },
  { code: "IT", currency: "EUR", ar: "إيطاليا", en: "Italy" },
  { code: "SE", currency: "SEK", ar: "السويد", en: "Sweden" },
  { code: "NO", currency: "NOK", ar: "النرويج", en: "Norway" },
  { code: "DK", currency: "DKK", ar: "الدنمارك", en: "Denmark" },
  { code: "CH", currency: "CHF", ar: "سويسرا", en: "Switzerland" },
  { code: "RU", currency: "RUB", ar: "روسيا", en: "Russia" },
  { code: "IN", currency: "INR", ar: "الهند", en: "India" },
  { code: "CN", currency: "CNY", ar: "الصين", en: "China" },
  { code: "JP", currency: "JPY", ar: "اليابان", en: "Japan" },
  { code: "KR", currency: "KRW", ar: "كوريا الجنوبية", en: "South Korea" },
  { code: "SG", currency: "SGD", ar: "سنغافورة", en: "Singapore" },
  { code: "ZA", currency: "ZAR", ar: "جنوب أفريقيا", en: "South Africa" },
  { code: "KE", currency: "KES", ar: "كينيا", en: "Kenya" },
  { code: "TZ", currency: "TZS", ar: "تنزانيا", en: "Tanzania" },
  { code: "ET", currency: "ETB", ar: "إثيوبيا", en: "Ethiopia" },
  { code: "BR", currency: "BRL", ar: "البرازيل", en: "Brazil" },
  { code: "MX", currency: "MXN", ar: "المكسيك", en: "Mexico" },
  { code: "AR", currency: "ARS", ar: "الأرجنتين", en: "Argentina" },
  { code: "TH", currency: "THB", ar: "تايلاند", en: "Thailand" },
  { code: "PH", currency: "PHP", ar: "الفلبين", en: "Philippines" },
];

export const DEFAULT_COUNTRY = "SA";

export function findCountry(code: string): Country {
  return COUNTRIES.find((c) => c.code === code) ?? COUNTRIES[0]!;
}

/** Regional-indicator flag emoji from an ISO country code. */
export function flagOf(code: string): string {
  return code
    .toUpperCase()
    .split("")
    .map((ch) => String.fromCodePoint(0x1f1e6 + ch.charCodeAt(0) - 65))
    .join("");
}

export function countryName(country: Country, locale: string): string {
  if (locale.startsWith("ar")) return country.ar;
  try {
    const dn = new Intl.DisplayNames([locale], { type: "region" });
    return dn.of(country.code) ?? country.en;
  } catch {
    return country.en;
  }
}
