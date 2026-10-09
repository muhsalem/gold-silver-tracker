import { ANNUAL_METALS } from "./long-history";
import { GOLD_NISAB_G, SILVER_NISAB_G, TROY_OUNCE_G } from "./nisab";
import { getAnyHijriYearDetails } from "./islamic-chronology";

export type PastYearItem = {
  id: string;
  yearNumber: number;
  yearType: "hijri" | "gregorian";
  yearLabel: string;
  wealth: number;
  nisabStandard: "silver" | "gold";
  goldNisab: number;
  silverNisab: number;
  selectedNisab: number;
  reachedNisab: boolean;
  rate: number; // 0.025 or 0.02577
  zakatDue: number;
};

// All Hijri years from year 2 AH (Institution of Zakat) to current year 1448 AH
export const ALL_HIJRI_YEARS: number[] = Array.from({ length: 1447 }, (_, i) => 1448 - i);

// Recent Hijri years for quick selector (1400 AH to 1448 AH)
export const AVAILABLE_HIJRI_YEARS: number[] = Array.from({ length: 49 }, (_, i) => 1448 - i);

export const AVAILABLE_GREGORIAN_YEARS: number[] = ANNUAL_METALS.map((m) => m.year)
  .filter((y) => y >= 1970)
  .sort((a, b) => b - a);

export function calculateYearNisab(
  year: number,
  isHijri: boolean,
  exchangeRate: number,
  countryCode = "SA",
) {
  if (isHijri) {
    const details = getAnyHijriYearDetails(year, countryCode, exchangeRate);
    return {
      gregorianYear: details.gregorianYear,
      goldUsdOz: details.goldPriceUsdOz,
      silverUsdOz: details.silverPriceUsdOz,
      goldPerGram: (details.goldPriceUsdOz / TROY_OUNCE_G) * exchangeRate,
      silverPerGram: (details.silverPriceUsdOz / TROY_OUNCE_G) * exchangeRate,
      goldNisab: details.goldNisabLocal,
      silverNisab: details.silverNisabLocal,
      ratio: details.goldToSilverRatio,
      eraNameAr: details.eraNameAr,
      historicalContextAr: details.historicalEventAr,
      currencyName: details.regionalCurrencyAr,
    };
  }

  // Gregorian calculation
  const match = ANNUAL_METALS.find((m) => m.year === year) ?? ANNUAL_METALS[0]!;
  const goldPerGram = (match.gold / TROY_OUNCE_G) * exchangeRate;
  const silverPerGram = (match.silver / TROY_OUNCE_G) * exchangeRate;
  const goldNisab = goldPerGram * GOLD_NISAB_G;
  const silverNisab = silverPerGram * SILVER_NISAB_G;

  return {
    gregorianYear: year,
    goldUsdOz: match.gold,
    silverUsdOz: match.silver,
    goldPerGram,
    silverPerGram,
    goldNisab,
    silverNisab,
    ratio: match.gold / match.silver,
    eraNameAr: "التقويم الميلادي المعاصر",
    historicalContextAr: `أسعار الذهب والفضة لعام ${year} م`,
    currencyName: "العملة المحلية المحددة",
  };
}
