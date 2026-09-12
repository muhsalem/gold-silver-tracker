import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { DEFAULT_COUNTRY, findCountry } from "./countries";
import { PAGE_STRINGS } from "./i18n-pages";

export type Lang = "ar" | "en" | "fr" | "tr" | "id" | "ur";

export const LANGS: { code: Lang; label: string; rtl: boolean }[] = [
  { code: "ar", label: "العربية", rtl: true },
  { code: "en", label: "English", rtl: false },
  { code: "fr", label: "Français", rtl: false },
  { code: "tr", label: "Türkçe", rtl: false },
  { code: "id", label: "Indonesia", rtl: false },
  { code: "ur", label: "اردو", rtl: true },
];

const en: Record<string, string> = {
  "brand.name": "Nisab",
  "brand.tagline": "ZAKAT NISAB",
  "nav.home": "Home",
  "nav.calculator": "Zakat calculator",
  "nav.history": "Historical prices",
  "nav.types": "Types of zakat",
  "nav.faq": "FAQ",
  "nav.about": "About the waqf",
  "hero.eyebrow": "Daily nisab value",
  "hero.title": "Today's nisab for gold and silver",
  "hero.sub": "Based on 85 g of gold and 595 g of silver, priced in your local currency.",
  "hero.updated": "Updated",
  "hero.country": "Country",
  "hero.currency": "Currency",
  "gold": "Gold",
  "silver": "Silver",
  "perGram": "per gram",
  "grams": "grams",
  "karat.title": "Karat breakdown",
  "karat.purity": "Purity",
  "karat.price": "Price / gram",
  "nisab.gold": "Gold nisab",
  "nisab.silver": "Silver nisab",
  "ratio.label": "Gold-to-silver ratio",
  "ratio.note": "Most scholars advise using the lower of the two nisabs, which benefits the poor.",
  "calc.title": "Zakat calculator",
  "calc.eyebrow": "Calculator",
  "calc.cash": "Cash, bank and savings",
  "calc.goldValue": "Value of gold you own",
  "calc.silverValue": "Value of silver you own",
  "calc.business": "Trade goods and inventory",
  "calc.investments": "Shares, funds and crypto",
  "calc.receivables": "Money owed to you",
  "calc.debts": "Debts due now (subtracted)",
  "calc.standard": "Nisab standard",
  "calc.netWealth": "Net zakatable wealth",
  "calc.due": "Zakat due",
  "calc.above": "Above the nisab — zakat is due",
  "calc.below": "Below the nisab — no zakat due",
  "calc.rate": "Rate 2.5%",
  "calc.reset": "Reset",
  "history.title": "Historical prices",
  "history.sub": "Nisab value over time",
  "history.high": "High",
  "history.low": "Low",
  "history.change": "Change",
  "history.range.1mo": "1 month",
  "history.range.6mo": "6 months",
  "history.range.1y": "1 year",
  "history.range.5y": "5 years",
  "history.range.10y": "10 years",
  "history.range.1448": "Since 1448 AH",
  "types.eyebrow": "Reference",
  "types.title": "Other types of zakat",
  "types.all": "Browse all",
  "types.learn": "Read more",
  "faq.title": "Frequently asked questions",
  "about.title": "A waqf — an ongoing charity",
  "footer.disclaimer":
    "© Nisab — an independent reference for prices and zakat. Prices are indicative and are not a fatwa.",
  "footer.meta": "Gold 85 g · Silver 595 g · Rates by country",
  "footer.waqf": "This site is a waqf, given as ṣadaqa jāriya.",
  "common.loading": "Loading live prices…",
  "common.error": "Live prices are unavailable right now. Please try again shortly.",
  "common.retry": "Try again",
  "common.source": "Source: international spot market",
};

const ar: Record<string, string> = {
  "brand.name": "نِصاب",
  "brand.tagline": "ZAKAT NISAB",
  "nav.home": "الرئيسية",
  "nav.calculator": "حاسبة الزكاة",
  "nav.history": "الأسعار التاريخية",
  "nav.types": "أنواع الزكاة",
  "nav.faq": "الأسئلة الشائعة",
  "nav.about": "عن الوقف",
  "hero.eyebrow": "قيمة النصاب اليومي",
  "hero.title": "نصاب الذهب والفضّة لهذا اليوم",
  "hero.sub": "محسوبٌ على ٨٥ جراماً من الذهب و٥٩٥ جراماً من الفضّة، بعملة بلدك.",
  "hero.updated": "آخر تحديث",
  "hero.country": "الدولة",
  "hero.currency": "العملة",
  "gold": "الذهب",
  "silver": "الفضّة",
  "perGram": "سعر الجرام",
  "grams": "جرام",
  "karat.title": "جدول العيارات",
  "karat.purity": "النقاء",
  "karat.price": "سعر الجرام",
  "nisab.gold": "نصاب الذهب",
  "nisab.silver": "نصاب الفضّة",
  "ratio.label": "نسبة الذهب إلى الفضّة",
  "ratio.note": "يُستحبّ عند جمهور أهل العلم الأخذ بأقلّ النصابين لما فيه من نفعٍ للفقراء.",
  "calc.title": "حاسبة الزكاة",
  "calc.eyebrow": "Calculator",
  "calc.cash": "النقد والحسابات والمدّخرات",
  "calc.goldValue": "قيمة ما تملك من ذهب",
  "calc.silverValue": "قيمة ما تملك من فضّة",
  "calc.business": "عروض التجارة والبضائع",
  "calc.investments": "الأسهم والصناديق والعملات الرقمية",
  "calc.receivables": "الديون المرجوّة لك",
  "calc.debts": "الديون الحالّة عليك (تُخصم)",
  "calc.standard": "المرجع في النصاب",
  "calc.netWealth": "صافي المال الزكوي",
  "calc.due": "الزكاة المستحقّة",
  "calc.above": "بلغ المال النصاب — تجب الزكاة",
  "calc.below": "لم يبلغ المال النصاب — لا زكاة",
  "calc.rate": "المقدار ٢٫٥٪",
  "calc.reset": "تصفير",
  "history.title": "الأسعار التاريخية",
  "history.sub": "قيمة النصاب عبر الزمن",
  "history.high": "الأعلى",
  "history.low": "الأدنى",
  "history.change": "التغيّر",
  "history.range.1mo": "شهر",
  "history.range.6mo": "٦ أشهر",
  "history.range.1y": "سنة",
  "history.range.5y": "٥ سنوات",
  "history.range.10y": "١٠ سنوات",
  "history.range.1448": "منذ ١٤٤٨هـ",
  "types.eyebrow": "مرجع",
  "types.title": "أنواع الزكاة الأُخرى",
  "types.all": "تصفّح الكل",
  "types.learn": "التفاصيل",
  "faq.title": "الأسئلة الشائعة",
  "about.title": "وقفٌ وصدقةٌ جارية",
  "footer.disclaimer": "© نِصاب — مرجعٌ مستقلّ للأسعار والزكاة. الأسعار استرشادية ولا تُعدّ فتوى.",
  "footer.meta": "ذهب ٨٥ جم · فضّة ٥٩٥ جم · أسعار بحسب الدولة",
  "footer.waqf": "هذا الموقع وقفٌ لوجه الله، صدقةً جارية.",
  "common.loading": "جارٍ جلب أسعار اليوم…",
  "common.error": "تعذّر جلب الأسعار الآن. حاول بعد قليل.",
  "common.retry": "إعادة المحاولة",
  "common.source": "المصدر: السوق الفوريّة العالمية",
};

const fr: Record<string, string> = {
  "nav.home": "Accueil",
  "nav.calculator": "Calculateur de zakat",
  "nav.history": "Prix historiques",
  "nav.types": "Types de zakat",
  "nav.faq": "Questions fréquentes",
  "nav.about": "À propos du waqf",
  "hero.eyebrow": "Valeur du nisab du jour",
  "hero.title": "Le nisab de l'or et de l'argent aujourd'hui",
  "hero.sub": "Calculé sur 85 g d'or et 595 g d'argent, dans votre devise locale.",
  "hero.updated": "Mis à jour",
  "hero.country": "Pays",
  "hero.currency": "Devise",
  "gold": "Or",
  "silver": "Argent",
  "perGram": "par gramme",
  "grams": "grammes",
  "karat.title": "Détail par carat",
  "karat.purity": "Pureté",
  "karat.price": "Prix / gramme",
  "nisab.gold": "Nisab de l'or",
  "nisab.silver": "Nisab de l'argent",
  "ratio.label": "Ratio or / argent",
  "ratio.note": "La plupart des savants recommandent le nisab le plus bas, au bénéfice des pauvres.",
  "calc.title": "Calculateur de zakat",
  "calc.cash": "Liquidités et épargne",
  "calc.goldValue": "Valeur de votre or",
  "calc.silverValue": "Valeur de votre argent",
  "calc.business": "Marchandises et stocks",
  "calc.investments": "Actions, fonds et crypto",
  "calc.receivables": "Créances à recevoir",
  "calc.debts": "Dettes exigibles (déduites)",
  "calc.standard": "Référence du nisab",
  "calc.netWealth": "Patrimoine imposable net",
  "calc.due": "Zakat due",
  "calc.above": "Au-dessus du nisab — la zakat est due",
  "calc.below": "En dessous du nisab — pas de zakat",
  "calc.rate": "Taux 2,5 %",
  "calc.reset": "Réinitialiser",
  "history.title": "Prix historiques",
  "history.sub": "Valeur du nisab dans le temps",
  "history.high": "Haut",
  "history.low": "Bas",
  "history.change": "Variation",
  "history.range.1mo": "1 mois",
  "history.range.6mo": "6 mois",
  "history.range.1y": "1 an",
  "history.range.5y": "5 ans",
  "history.range.10y": "10 ans",
  "history.range.1448": "Depuis 1448 H",
  "types.title": "Autres types de zakat",
  "types.all": "Tout voir",
  "types.learn": "En savoir plus",
  "faq.title": "Questions fréquentes",
  "about.title": "Un waqf — une aumône continue",
  "footer.disclaimer":
    "© Nisab — référence indépendante des prix et de la zakat. Prix indicatifs, non une fatwa.",
  "footer.waqf": "Ce site est un waqf, offert comme ṣadaqa jāriya.",
  "common.loading": "Chargement des prix…",
  "common.error": "Prix indisponibles pour le moment. Réessayez bientôt.",
  "common.retry": "Réessayer",
};

const tr: Record<string, string> = {
  "nav.home": "Ana sayfa",
  "nav.calculator": "Zekât hesaplayıcı",
  "nav.history": "Geçmiş fiyatlar",
  "nav.types": "Zekât türleri",
  "nav.faq": "Sıkça sorulanlar",
  "nav.about": "Vakıf hakkında",
  "hero.eyebrow": "Günlük nisap değeri",
  "hero.title": "Bugünün altın ve gümüş nisabı",
  "hero.sub": "85 gram altın ve 595 gram gümüş üzerinden, kendi para biriminizle.",
  "hero.updated": "Güncellendi",
  "hero.country": "Ülke",
  "hero.currency": "Para birimi",
  "gold": "Altın",
  "silver": "Gümüş",
  "perGram": "gram başına",
  "grams": "gram",
  "karat.title": "Ayar tablosu",
  "karat.purity": "Saflık",
  "karat.price": "Gram fiyatı",
  "nisab.gold": "Altın nisabı",
  "nisab.silver": "Gümüş nisabı",
  "ratio.label": "Altın / gümüş oranı",
  "ratio.note": "Âlimlerin çoğu, fakirin lehine olan düşük nisabın esas alınmasını tavsiye eder.",
  "calc.title": "Zekât hesaplayıcı",
  "calc.cash": "Nakit ve birikimler",
  "calc.goldValue": "Sahip olunan altının değeri",
  "calc.silverValue": "Sahip olunan gümüşün değeri",
  "calc.business": "Ticaret malları ve stok",
  "calc.investments": "Hisse, fon ve kripto",
  "calc.receivables": "Alacaklar",
  "calc.debts": "Vadesi gelen borçlar (düşülür)",
  "calc.standard": "Nisap ölçüsü",
  "calc.netWealth": "Net zekâta tabi mal",
  "calc.due": "Ödenecek zekât",
  "calc.above": "Nisabın üzerinde — zekât gerekir",
  "calc.below": "Nisabın altında — zekât gerekmez",
  "calc.rate": "Oran %2,5",
  "calc.reset": "Sıfırla",
  "history.title": "Geçmiş fiyatlar",
  "history.sub": "Zaman içinde nisap değeri",
  "history.high": "En yüksek",
  "history.low": "En düşük",
  "history.change": "Değişim",
  "history.range.1mo": "1 ay",
  "history.range.6mo": "6 ay",
  "history.range.1y": "1 yıl",
  "history.range.5y": "5 yıl",
  "history.range.10y": "10 yıl",
  "history.range.1448": "1448 H'den beri",
  "types.title": "Diğer zekât türleri",
  "types.all": "Tümünü gör",
  "types.learn": "Devamı",
  "faq.title": "Sıkça sorulan sorular",
  "about.title": "Bir vakıf — sadaka-i câriye",
  "footer.disclaimer":
    "© Nisab — fiyat ve zekât için bağımsız kaynak. Fiyatlar bilgilendirme amaçlıdır, fetva değildir.",
  "footer.waqf": "Bu site sadaka-i câriye olarak vakfedilmiştir.",
  "common.loading": "Fiyatlar yükleniyor…",
  "common.error": "Fiyatlara şu anda ulaşılamıyor. Lütfen tekrar deneyin.",
  "common.retry": "Tekrar dene",
};

const id: Record<string, string> = {
  "nav.home": "Beranda",
  "nav.calculator": "Kalkulator zakat",
  "nav.history": "Harga historis",
  "nav.types": "Jenis zakat",
  "nav.faq": "Tanya jawab",
  "nav.about": "Tentang wakaf",
  "hero.eyebrow": "Nilai nisab harian",
  "hero.title": "Nisab emas dan perak hari ini",
  "hero.sub": "Dihitung dari 85 gram emas dan 595 gram perak, dalam mata uang Anda.",
  "hero.updated": "Diperbarui",
  "hero.country": "Negara",
  "hero.currency": "Mata uang",
  "gold": "Emas",
  "silver": "Perak",
  "perGram": "per gram",
  "grams": "gram",
  "karat.title": "Rincian karat",
  "karat.purity": "Kemurnian",
  "karat.price": "Harga / gram",
  "nisab.gold": "Nisab emas",
  "nisab.silver": "Nisab perak",
  "ratio.label": "Rasio emas / perak",
  "ratio.note": "Mayoritas ulama menganjurkan memakai nisab terendah karena lebih bermanfaat bagi fakir miskin.",
  "calc.title": "Kalkulator zakat",
  "calc.cash": "Kas, bank dan tabungan",
  "calc.goldValue": "Nilai emas yang dimiliki",
  "calc.silverValue": "Nilai perak yang dimiliki",
  "calc.business": "Barang dagangan dan persediaan",
  "calc.investments": "Saham, reksa dana dan kripto",
  "calc.receivables": "Piutang",
  "calc.debts": "Utang jatuh tempo (dikurangi)",
  "calc.standard": "Acuan nisab",
  "calc.netWealth": "Harta bersih wajib zakat",
  "calc.due": "Zakat yang wajib",
  "calc.above": "Di atas nisab — zakat wajib",
  "calc.below": "Di bawah nisab — belum wajib zakat",
  "calc.rate": "Kadar 2,5%",
  "calc.reset": "Atur ulang",
  "history.title": "Harga historis",
  "history.sub": "Nilai nisab dari waktu ke waktu",
  "history.high": "Tertinggi",
  "history.low": "Terendah",
  "history.change": "Perubahan",
  "history.range.1mo": "1 bulan",
  "history.range.6mo": "6 bulan",
  "history.range.1y": "1 tahun",
  "history.range.5y": "5 tahun",
  "history.range.10y": "10 tahun",
  "history.range.1448": "Sejak 1448 H",
  "types.title": "Jenis zakat lainnya",
  "types.all": "Lihat semua",
  "types.learn": "Selengkapnya",
  "faq.title": "Pertanyaan yang sering diajukan",
  "about.title": "Wakaf — sedekah jariyah",
  "footer.disclaimer":
    "© Nisab — rujukan mandiri harga dan zakat. Harga bersifat indikatif dan bukan fatwa.",
  "footer.waqf": "Situs ini adalah wakaf, sedekah jariyah.",
  "common.loading": "Memuat harga…",
  "common.error": "Harga tidak tersedia saat ini. Coba lagi sebentar.",
  "common.retry": "Coba lagi",
};

const ur: Record<string, string> = {
  "nav.home": "صفحہ اول",
  "nav.calculator": "زکوٰۃ کیلکولیٹر",
  "nav.history": "سابقہ قیمتیں",
  "nav.types": "زکوٰۃ کی اقسام",
  "nav.faq": "عام سوالات",
  "nav.about": "وقف کے بارے میں",
  "hero.eyebrow": "آج کا نصاب",
  "hero.title": "آج سونے اور چاندی کا نصاب",
  "hero.sub": "85 گرام سونا اور 595 گرام چاندی کے حساب سے، آپ کی مقامی کرنسی میں۔",
  "hero.updated": "تازہ کاری",
  "hero.country": "ملک",
  "hero.currency": "کرنسی",
  "gold": "سونا",
  "silver": "چاندی",
  "perGram": "فی گرام",
  "grams": "گرام",
  "karat.title": "قیراط کے مطابق",
  "karat.purity": "خلوص",
  "karat.price": "قیمت فی گرام",
  "nisab.gold": "سونے کا نصاب",
  "nisab.silver": "چاندی کا نصاب",
  "ratio.label": "سونے اور چاندی کا تناسب",
  "ratio.note": "اکثر علماء کم نصاب اختیار کرنے کا مشورہ دیتے ہیں کیونکہ اس میں فقراء کا فائدہ ہے۔",
  "calc.title": "زکوٰۃ کیلکولیٹر",
  "calc.cash": "نقدی، بینک اور بچت",
  "calc.goldValue": "آپ کے سونے کی مالیت",
  "calc.silverValue": "آپ کی چاندی کی مالیت",
  "calc.business": "مالِ تجارت اور اسٹاک",
  "calc.investments": "حصص، فنڈز اور کرپٹو",
  "calc.receivables": "وصول طلب قرض",
  "calc.debts": "واجب الادا قرض (منہا)",
  "calc.standard": "نصاب کا معیار",
  "calc.netWealth": "خالص قابلِ زکوٰۃ مال",
  "calc.due": "واجب زکوٰۃ",
  "calc.above": "نصاب سے زیادہ — زکوٰۃ واجب ہے",
  "calc.below": "نصاب سے کم — زکوٰۃ واجب نہیں",
  "calc.rate": "شرح 2.5%",
  "calc.reset": "دوبارہ ترتیب",
  "history.title": "سابقہ قیمتیں",
  "history.sub": "وقت کے ساتھ نصاب کی قیمت",
  "history.high": "بلند ترین",
  "history.low": "کم ترین",
  "history.change": "تبدیلی",
  "history.range.1mo": "ایک ماہ",
  "history.range.6mo": "چھ ماہ",
  "history.range.1y": "ایک سال",
  "history.range.5y": "پانچ سال",
  "history.range.10y": "دس سال",
  "history.range.1448": "1448ھ سے اب تک",
  "types.title": "زکوٰۃ کی دیگر اقسام",
  "types.all": "سب دیکھیں",
  "types.learn": "مزید پڑھیں",
  "faq.title": "عام سوالات",
  "about.title": "وقف — صدقۂ جاریہ",
  "footer.disclaimer": "© نصاب — قیمتوں اور زکوٰۃ کا خودمختار حوالہ۔ قیمتیں رہنمائی کے لیے ہیں، فتویٰ نہیں۔",
  "footer.waqf": "یہ ویب سائٹ وقف ہے، صدقۂ جاریہ کے طور پر۔",
  "common.loading": "قیمتیں لوڈ ہو رہی ہیں…",
  "common.error": "اس وقت قیمتیں دستیاب نہیں۔ کچھ دیر بعد کوشش کریں۔",
  "common.retry": "دوبارہ کوشش",
};

const DICTS: Record<Lang, Record<string, string>> = { ar, en, fr, tr, id, ur };

type Ctx = {
  lang: Lang;
  rtl: boolean;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  country: string;
  setCountry: (c: string) => void;
  currency: string;
  setCurrency: (c: string) => void;
  city: string;
  setCity: (c: string) => void;
};

const I18nContext = createContext<Ctx | null>(null);

const LS_LANG = "nisab.lang";
const LS_COUNTRY = "nisab.country";
const LS_CURRENCY = "nisab.currency";
const LS_CITY = "nisab.city";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ar");
  const [country, setCountryState] = useState<string>(DEFAULT_COUNTRY);
  const [currency, setCurrencyState] = useState<string>(findCountry(DEFAULT_COUNTRY).currency);
  const [city, setCityState] = useState<string>("");

  useEffect(() => {
    const storedLang = localStorage.getItem(LS_LANG) as Lang | null;
    if (storedLang && DICTS[storedLang]) setLangState(storedLang);
    const storedCountry = localStorage.getItem(LS_COUNTRY);
    if (storedCountry) setCountryState(storedCountry);
    const storedCurrency = localStorage.getItem(LS_CURRENCY);
    if (storedCurrency) setCurrencyState(storedCurrency);
    const storedCity = localStorage.getItem(LS_CITY);
    if (storedCity) setCityState(storedCity);
  }, []);

  const rtl = LANGS.find((l) => l.code === lang)?.rtl ?? false;

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = rtl ? "rtl" : "ltr";
  }, [lang, rtl]);

  const value = useMemo<Ctx>(
    () => ({
      lang,
      rtl,
      setLang: (l) => {
        setLangState(l);
        localStorage.setItem(LS_LANG, l);
      },
      t: (key) =>
        DICTS[lang][key] ??
        PAGE_STRINGS[lang]?.[key] ??
        en[key] ??
        PAGE_STRINGS["en"]?.[key] ??
        key,
      country,
      setCountry: (c) => {
        setCountryState(c);
        localStorage.setItem(LS_COUNTRY, c);
        const cur = findCountry(c).currency;
        setCurrencyState(cur);
        localStorage.setItem(LS_CURRENCY, cur);
        setCityState("");
        localStorage.removeItem(LS_CITY);
      },
      currency,
      setCurrency: (c) => {
        setCurrencyState(c);
        localStorage.setItem(LS_CURRENCY, c);
      },
      city,
      setCity: (c) => {
        setCityState(c);
        if (c) localStorage.setItem(LS_CITY, c);
        else localStorage.removeItem(LS_CITY);
      },
    }),
    [lang, rtl, country, currency, city],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): Ctx {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
