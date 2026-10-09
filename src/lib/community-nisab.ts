import { COUNTRIES } from "./countries";

export type SourceType =
  "gold_souq" | "dar_alifta" | "central_bank" | "jeweler_receipt" | "local_merchant" | "other";

export interface PriceVerification {
  id: string;
  countryCode: string;
  countryName: string;
  currency: string;
  city?: string | undefined;
  goldGram24k: number;
  goldGram21k?: number | undefined;
  silverGramPure: number;
  goldNisab: number;
  silverNisab: number;
  sourceType: SourceType;
  sourceLabel: string;
  contributorName: string;
  contributorRole: string;
  confirmations: number;
  disputes: number;
  status: "verified" | "trending" | "under_review";
  date: string;
  timestamp: string;
  notes?: string;
  userConfirmed?: boolean;
}

export const SOURCE_TYPE_LABELS: Record<SourceType, { ar: string; en: string }> = {
  gold_souq: { ar: "سوق الصاغة وتجار الذهب المعتمدين", en: "Local Gold Souq & Licensed Jewelers" },
  dar_alifta: {
    ar: "دار الإفتاء / الهيئة الشرعية الرسمية",
    en: "Official Fatwa Board / Sharia Council",
  },
  central_bank: { ar: "البشرة الرسمية للبنك المركزي", en: "Central Bank Official Bulletin" },
  jeweler_receipt: { ar: "فاتورة شراء حديثة وموثقة", en: "Recent Verified Jeweler Invoice" },
  local_merchant: { ar: "تاجر معادن ثمينة محلي", en: "Local Bullion & Precious Metals Trader" },
  other: { ar: "مصادر ميدانية أخرى", en: "Other Field Sources" },
};

const SEED_VERIFICATIONS: PriceVerification[] = [
  {
    id: "ver-sa-01",
    countryCode: "SA",
    countryName: "السعودية",
    currency: "SAR",
    city: "الرياض (سوق البطحاء للذهب)",
    goldGram24k: 338.5,
    goldGram21k: 296.2,
    silverGramPure: 4.15,
    goldNisab: 338.5 * 85, // 28,772.50 SAR
    silverNisab: 4.15 * 595, // 2,469.25 SAR
    sourceType: "gold_souq",
    sourceLabel: "سوق الذهب المركزي بالبطحاء وجمعية المعادن الثمينة",
    contributorName: "الشيخ صالح بن عبد الله العتيبي",
    contributorRole: "تاجر مجوهرات وعضو لجنة الصاغة",
    confirmations: 248,
    disputes: 1,
    status: "verified",
    date: "2026-10-08",
    timestamp: "2026-10-08T06:30:00Z",
    notes:
      "تمت المعاينة صباح اليوم في أسواق الذهب بالرياض، السعر صافي دون مصنعية للسبائك 24 قيراط نقاء 999.9.",
  },
  {
    id: "ver-eg-01",
    countryCode: "EG",
    countryName: "مصر",
    currency: "EGP",
    city: "القاهرة (الصاغة - الحسين)",
    goldGram24k: 4120,
    goldGram21k: 3605,
    silverGramPure: 52.8,
    goldNisab: 4120 * 85, // 350,200 EGP
    silverNisab: 52.8 * 595, // 31,416 EGP
    sourceType: "gold_souq",
    sourceLabel: "شعبة الذهب بالاتحاد العام للغرف التجارية المصرية",
    contributorName: "م. أحمد عبد الرحمن",
    contributorRole: "باحث اقتصادي ومهتم بالمعاملات المالية",
    confirmations: 384,
    disputes: 3,
    status: "verified",
    date: "2026-10-08",
    timestamp: "2026-10-08T07:15:00Z",
    notes:
      "سعر جرام الذهب عيار 24 بدون مصنعية أو ضريبة دمغة، متطابق مع تسعيرة الصاغة الرسمية لليوم.",
  },
  {
    id: "ver-ae-01",
    countryCode: "AE",
    countryName: "الإمارات",
    currency: "AED",
    city: "دبي (سوق ديرة التاريخي للذهب)",
    goldGram24k: 332.0,
    goldGram21k: 290.5,
    silverGramPure: 4.08,
    goldNisab: 332.0 * 85, // 28,220 AED
    silverNisab: 4.08 * 595, // 2,427.60 AED
    sourceType: "gold_souq",
    sourceLabel: "مجموعة دبي للذهب والمجوهرات (Dubai Jewellery Group)",
    contributorName: "محمد الشامسي",
    contributorRole: "خبير معادن ثمينة معتمد",
    confirmations: 176,
    disputes: 0,
    status: "verified",
    date: "2026-10-08",
    timestamp: "2026-10-08T05:45:00Z",
    notes:
      "التسعيرة الصباحية الصادرة عن مجمع دبي للذهب للمعدن الصافي عيار 24 والفضة السويسرية الخالصة.",
  },
  {
    id: "ver-kw-01",
    countryCode: "KW",
    countryName: "الكويت",
    currency: "KWD",
    city: "مدينة الكويت (سوق المباركية)",
    goldGram24k: 27.8,
    goldGram21k: 24.3,
    silverGramPure: 0.345,
    goldNisab: 27.8 * 85, // 2,363 KWD
    silverNisab: 0.345 * 595, // 205.28 KWD
    sourceType: "central_bank",
    sourceLabel: "نشرة وزارة التجارة والصناعة وسوق المباركية",
    contributorName: "فيصل الكندري",
    contributorRole: "متابع شرعي ومالي",
    confirmations: 142,
    disputes: 0,
    status: "verified",
    date: "2026-10-08",
    timestamp: "2026-10-08T04:30:00Z",
    notes: "الأسعار متوافقة مع مؤشر بيت الزكاة الكويتي لنصاب الفضة والذهب لليوم.",
  },
  {
    id: "ver-jo-01",
    countryCode: "JO",
    countryName: "الأردن",
    currency: "JOD",
    city: "عمان (وسط البلد - شارع الصاغة)",
    goldGram24k: 64.2,
    goldGram21k: 56.1,
    silverGramPure: 0.79,
    goldNisab: 64.2 * 85, // 5,457 JOD
    silverNisab: 0.79 * 595, // 470.05 JOD
    sourceType: "gold_souq",
    sourceLabel: "نقابة أصحاب محلات تجارة وصياغة الحلي والمجوهرات",
    contributorName: "د. عمر المجالي",
    contributorRole: "أكاديمي وباحث في الفقه المالي",
    confirmations: 119,
    disputes: 1,
    status: "verified",
    date: "2026-10-08",
    timestamp: "2026-10-08T06:00:00Z",
    notes: "التسعيرة اليومية المعتمدة رسمياً للنقابة العامة في المملكة الأردنية الهاشمية.",
  },
  {
    id: "ver-ma-01",
    countryCode: "MA",
    countryName: "المغرب",
    currency: "MAD",
    city: "الدار البيضاء (قيسارية الحفاري)",
    goldGram24k: 890,
    goldGram21k: 778,
    silverGramPure: 10.9,
    goldNisab: 890 * 85, // 75,650 MAD
    silverNisab: 10.9 * 595, // 6,485.50 MAD
    sourceType: "gold_souq",
    sourceLabel: "فيدرالية تجار وصاغة المجوهرات بالمغرب",
    contributorName: "حمزة التازي",
    contributorRole: "تاجر صاغة بالدار البيضاء",
    confirmations: 95,
    disputes: 0,
    status: "verified",
    date: "2026-10-08",
    timestamp: "2026-10-08T03:30:00Z",
    notes: "سعر السبائك الخالصة عيار 24 بدون مصنعية، وتأكيد نصاب الفضة المتداول.",
  },
  {
    id: "ver-dz-01",
    countryCode: "DZ",
    countryName: "الجزائر",
    currency: "DZD",
    city: "الجزائر العاصمة (ساحة الشهداء والقصبة)",
    goldGram24k: 12100,
    goldGram21k: 10580,
    silverGramPure: 148,
    goldNisab: 12100 * 85, // 1,028,500 DZD
    silverNisab: 148 * 595, // 88,060 DZD
    sourceType: "dar_alifta",
    sourceLabel: "بيان وزارة الشؤون الدينية والأوقاف وسوق الصاغة المحلي",
    contributorName: "كريم بلحاج",
    contributorRole: "باحث ومهتم بأوقاف الزكاة",
    confirmations: 82,
    disputes: 2,
    status: "verified",
    date: "2026-10-08",
    timestamp: "2026-10-08T05:10:00Z",
    notes: "مطابق للنصاب الشرعي المحتسب رسمياً بالجزائر استناداً لنصاب الذهب عيار 18/24.",
  },
  {
    id: "ver-qa-01",
    countryCode: "QA",
    countryName: "قطر",
    currency: "QAR",
    city: "الدوحة (سوق الذهب - سوق واقف)",
    goldGram24k: 329.5,
    goldGram21k: 288.3,
    silverGramPure: 4.05,
    goldNisab: 329.5 * 85, // 28,007.50 QAR
    silverNisab: 4.05 * 595, // 2,409.75 QAR
    sourceType: "gold_souq",
    sourceLabel: "محلات سوق الذهب المركزي بالدوحة",
    contributorName: "عبد الله الهاجري",
    contributorRole: "زائر وموثق محلي",
    confirmations: 91,
    disputes: 0,
    status: "verified",
    date: "2026-10-08",
    timestamp: "2026-10-08T06:10:00Z",
    notes: "سعر سبيكة الذهب الخالص 999.9 وسعر أونصة الفضة المعتمدة لصندوق الزكاة القطري.",
  },
  {
    id: "ver-om-01",
    countryCode: "OM",
    countryName: "عُمان",
    currency: "OMR",
    city: "مسقط (سوق مطرح للذهب)",
    goldGram24k: 34.8,
    goldGram21k: 30.4,
    silverGramPure: 0.43,
    goldNisab: 34.8 * 85, // 2,958 OMR
    silverNisab: 0.43 * 595, // 255.85 OMR
    sourceType: "gold_souq",
    sourceLabel: "محلات صاغة الذهب بسوق مطرح العريق",
    contributorName: "سعيد البوسعيدي",
    contributorRole: "باحث شرعي مستقل",
    confirmations: 74,
    disputes: 0,
    status: "verified",
    date: "2026-10-08",
    timestamp: "2026-10-08T05:20:00Z",
    notes: "تمت مراجعة التسعيرة بالتنسيق مع الصاغة، والفضة خالصة بنسبة 99.9%.",
  },
  {
    id: "ver-tr-01",
    countryCode: "TR",
    countryName: "تركيا",
    currency: "TRY",
    city: "إسطنبول (البازار الكبير - Kapalıçarşı)",
    goldGram24k: 3020,
    goldGram21k: 2642,
    silverGramPure: 37.5,
    goldNisab: 3020 * 85, // 256,700 TRY
    silverNisab: 37.5 * 595, // 22,312.50 TRY
    sourceType: "gold_souq",
    sourceLabel: "بورصة الذهب بالبازار الكبير ومجلس الإفتاء التركي (ديانت)",
    contributorName: "محمد الفاتح أوزتورك",
    contributorRole: "خبير أسواق صاغة",
    confirmations: 88,
    disputes: 1,
    status: "verified",
    date: "2026-10-08",
    timestamp: "2026-10-08T06:50:00Z",
    notes: "سعر الجرام بالليرة التركية للذهب الصافي 24 قيراط، وموافق لفتوى رئاسة الشؤون الدينية.",
  },
];

const LS_VERIFICATIONS = "nisab_community_verifications_v2";
const LS_USER_CONFIRMED = "nisab_user_confirmed_ids_v2";

export function getCommunityVerifications(): PriceVerification[] {
  if (typeof window === "undefined") return SEED_VERIFICATIONS;
  try {
    const raw = localStorage.getItem(LS_VERIFICATIONS);
    const userConfirmed = getUserConfirmedIds();
    let list: PriceVerification[];
    if (!raw) {
      localStorage.setItem(LS_VERIFICATIONS, JSON.stringify(SEED_VERIFICATIONS));
      list = SEED_VERIFICATIONS;
    } else {
      list = JSON.parse(raw) as PriceVerification[];
      if (!Array.isArray(list) || list.length === 0) {
        list = SEED_VERIFICATIONS;
      }
    }

    return list.map((item) => ({
      ...item,
      userConfirmed: userConfirmed.has(item.id),
    }));
  } catch {
    return SEED_VERIFICATIONS;
  }
}

export function getUserConfirmedIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(LS_USER_CONFIRMED);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

function saveUserConfirmedIds(ids: Set<string>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LS_USER_CONFIRMED, JSON.stringify(Array.from(ids)));
  } catch (e) {
    console.error("Failed to save confirmed IDs", e);
  }
}

function saveVerifications(items: PriceVerification[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LS_VERIFICATIONS, JSON.stringify(items));
    window.dispatchEvent(new Event("nisab-community-updated"));
  } catch (e) {
    console.error("Failed to save verifications", e);
  }
}

/** Toggle or add visitor confirmation for a given verification item */
export function toggleConfirmVerification(id: string): { confirmed: boolean; total: number } {
  const current = getCommunityVerifications();
  const confirmedIds = getUserConfirmedIds();
  const isAlready = confirmedIds.has(id);

  let newTotal = 0;
  const nextList = current.map((item) => {
    if (item.id === id) {
      const nextCount = isAlready ? Math.max(0, item.confirmations - 1) : item.confirmations + 1;
      newTotal = nextCount;
      return {
        ...item,
        confirmations: nextCount,
        status: nextCount >= 10 ? ("verified" as const) : ("trending" as const),
      };
    }
    return item;
  });

  if (isAlready) {
    confirmedIds.delete(id);
  } else {
    confirmedIds.add(id);
  }

  saveUserConfirmedIds(confirmedIds);
  saveVerifications(nextList);

  return { confirmed: !isAlready, total: newTotal };
}

/** Flag an inaccurate price submission */
export function flagVerification(id: string, reason?: string): boolean {
  const current = getCommunityVerifications();
  const nextList = current.map((item) => {
    if (item.id === id) {
      return {
        ...item,
        disputes: item.disputes + 1,
        status: item.disputes + 1 >= 5 ? ("under_review" as const) : item.status,
      };
    }
    return item;
  });
  saveVerifications(nextList);
  return true;
}

export interface NewVerificationInput {
  countryCode: string;
  city?: string | undefined;
  goldGram24k: number;
  goldGram21k?: number | undefined;
  silverGramPure: number;
  sourceType: SourceType;
  sourceLabel: string;
  contributorName: string;
  contributorRole?: string;
  notes?: string;
}

/** Submit a new community verification from a visitor */
export function submitCommunityVerification(input: NewVerificationInput): PriceVerification {
  const country = COUNTRIES.find((c) => c.code === input.countryCode.toUpperCase()) || {
    code: input.countryCode,
    currency: "USD",
    ar: input.countryCode,
    en: input.countryCode,
  };

  const goldNisab = input.goldGram24k * 85;
  const silverNisab = input.silverGramPure * 595;
  const now = new Date();

  const newRecord: PriceVerification = {
    id: `ver-${input.countryCode.toLowerCase()}-${Date.now().toString(36)}`,
    countryCode: country.code,
    countryName: country.ar,
    currency: country.currency,
    city: input.city || undefined,
    goldGram24k: input.goldGram24k,
    goldGram21k: input.goldGram21k || +(input.goldGram24k * 0.875).toFixed(2),
    silverGramPure: input.silverGramPure,
    goldNisab,
    silverNisab,
    sourceType: input.sourceType,
    sourceLabel: input.sourceLabel || SOURCE_TYPE_LABELS[input.sourceType]?.ar || "سوق محلي",
    contributorName: input.contributorName.trim() || "زائر موثوق",
    contributorRole: input.contributorRole?.trim() || "زائر مساهم في التوثيق",
    confirmations: 1, // Author confirms it initially
    disputes: 0,
    status: "trending",
    date: now.toISOString().split("T")[0],
    timestamp: now.toISOString(),
    notes: input.notes?.trim() || undefined,
  };

  const current = getCommunityVerifications();
  const nextList = [newRecord, ...current];
  saveVerifications(nextList);

  // Automatically mark user as confirmed for their own record
  const confirmedIds = getUserConfirmedIds();
  confirmedIds.add(newRecord.id);
  saveUserConfirmedIds(confirmedIds);

  return newRecord;
}

export interface CountryVerificationSummary {
  hasVerifications: boolean;
  totalConfirmations: number;
  verifiedCount: number;
  latestRecord?: PriceVerification | undefined;
  avgGold24k: number;
  avgSilverPure: number;
  communityGoldNisab: number;
  communitySilverNisab: number;
  lowerNisab: number;
  consensusScore: number; // percentage (e.g., 99%)
  statusBadge: "verified" | "trending" | "pending";
}

export function getCountryVerificationSummary(
  countryCode: string,
  spotGoldGram?: number,
  spotSilverGram?: number,
): CountryVerificationSummary {
  const all = getCommunityVerifications();
  const countryRecords = all.filter(
    (r) => r.countryCode.toUpperCase() === countryCode.toUpperCase(),
  );

  if (countryRecords.length === 0) {
    const goldG = spotGoldGram || 0;
    const silverG = spotSilverGram || 0;
    return {
      hasVerifications: false,
      totalConfirmations: 0,
      verifiedCount: 0,
      avgGold24k: goldG,
      avgSilverPure: silverG,
      communityGoldNisab: goldG * 85,
      communitySilverNisab: silverG * 595,
      lowerNisab: Math.min(goldG * 85, silverG * 595),
      consensusScore: 0,
      statusBadge: "pending",
    };
  }

  const latestRecord = countryRecords[0];
  const totalConfirmations = countryRecords.reduce((sum, r) => sum + r.confirmations, 0);
  const totalDisputes = countryRecords.reduce((sum, r) => sum + r.disputes, 0);

  const avgGold24k =
    countryRecords.reduce((sum, r) => sum + r.goldGram24k, 0) / countryRecords.length;
  const avgSilverPure =
    countryRecords.reduce((sum, r) => sum + r.silverGramPure, 0) / countryRecords.length;

  const communityGoldNisab = avgGold24k * 85;
  const communitySilverNisab = avgSilverPure * 595;
  const lowerNisab = Math.min(communityGoldNisab, communitySilverNisab);

  // Consensus score based on ratio of confirmations to disputes
  const totalVotes = totalConfirmations + totalDisputes;
  const consensusScore = totalVotes > 0 ? Math.round((totalConfirmations / totalVotes) * 100) : 95;

  let statusBadge: "verified" | "trending" | "pending" = "pending";
  if (totalConfirmations >= 20 && consensusScore >= 90) {
    statusBadge = "verified";
  } else if (totalConfirmations > 0) {
    statusBadge = "trending";
  }

  return {
    hasVerifications: true,
    totalConfirmations,
    verifiedCount: countryRecords.length,
    latestRecord,
    avgGold24k,
    avgSilverPure,
    communityGoldNisab,
    communitySilverNisab,
    lowerNisab,
    consensusScore,
    statusBadge,
  };
}

export function getOverallCommunityStats() {
  const all = getCommunityVerifications();
  const uniqueCountries = new Set(all.map((r) => r.countryCode));
  const totalConfirmations = all.reduce((sum, r) => sum + r.confirmations, 0);
  const totalDisputes = all.reduce((sum, r) => sum + r.disputes, 0);
  const totalVotes = totalConfirmations + totalDisputes;
  const overallConsensus =
    totalVotes > 0 ? Math.round((totalConfirmations / totalVotes) * 100) : 99;

  return {
    totalRecords: all.length,
    countriesCount: uniqueCountries.size,
    totalConfirmations,
    overallConsensus,
  };
}
