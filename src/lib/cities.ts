/** Main cities per country — used for city-level manual price customisation. */

export type City = { id: string; ar: string; en: string };

export const CITIES: Record<string, City[]> = {
  SA: [
    { id: "riyadh", ar: "الرياض", en: "Riyadh" },
    { id: "jeddah", ar: "جدة", en: "Jeddah" },
    { id: "makkah", ar: "مكة المكرمة", en: "Makkah" },
    { id: "madinah", ar: "المدينة المنورة", en: "Madinah" },
    { id: "dammam", ar: "الدمام", en: "Dammam" },
  ],
  EG: [
    { id: "cairo", ar: "القاهرة", en: "Cairo" },
    { id: "alexandria", ar: "الإسكندرية", en: "Alexandria" },
    { id: "giza", ar: "الجيزة", en: "Giza" },
    { id: "mansoura", ar: "المنصورة", en: "Mansoura" },
    { id: "asyut", ar: "أسيوط", en: "Asyut" },
  ],
  AE: [
    { id: "dubai", ar: "دبي", en: "Dubai" },
    { id: "abudhabi", ar: "أبوظبي", en: "Abu Dhabi" },
    { id: "sharjah", ar: "الشارقة", en: "Sharjah" },
  ],
  KW: [{ id: "kuwaitcity", ar: "مدينة الكويت", en: "Kuwait City" }],
  QA: [{ id: "doha", ar: "الدوحة", en: "Doha" }],
  BH: [{ id: "manama", ar: "المنامة", en: "Manama" }],
  OM: [
    { id: "muscat", ar: "مسقط", en: "Muscat" },
    { id: "salalah", ar: "صلالة", en: "Salalah" },
  ],
  JO: [
    { id: "amman", ar: "عمّان", en: "Amman" },
    { id: "irbid", ar: "إربد", en: "Irbid" },
  ],
  IQ: [
    { id: "baghdad", ar: "بغداد", en: "Baghdad" },
    { id: "basra", ar: "البصرة", en: "Basra" },
    { id: "erbil", ar: "أربيل", en: "Erbil" },
  ],
  SY: [
    { id: "damascus", ar: "دمشق", en: "Damascus" },
    { id: "aleppo", ar: "حلب", en: "Aleppo" },
  ],
  YE: [
    { id: "sanaa", ar: "صنعاء", en: "Sanaa" },
    { id: "aden", ar: "عدن", en: "Aden" },
  ],
  SD: [
    { id: "khartoum", ar: "الخرطوم", en: "Khartoum" },
    { id: "portsudan", ar: "بورتسودان", en: "Port Sudan" },
  ],
  LY: [
    { id: "tripoli", ar: "طرابلس", en: "Tripoli" },
    { id: "benghazi", ar: "بنغازي", en: "Benghazi" },
  ],
  TN: [
    { id: "tunis", ar: "تونس", en: "Tunis" },
    { id: "sfax", ar: "صفاقس", en: "Sfax" },
  ],
  DZ: [
    { id: "algiers", ar: "الجزائر", en: "Algiers" },
    { id: "oran", ar: "وهران", en: "Oran" },
  ],
  MA: [
    { id: "casablanca", ar: "الدار البيضاء", en: "Casablanca" },
    { id: "rabat", ar: "الرباط", en: "Rabat" },
    { id: "marrakech", ar: "مراكش", en: "Marrakesh" },
  ],
  PS: [
    { id: "gaza", ar: "غزة", en: "Gaza" },
    { id: "alquds", ar: "القدس", en: "Jerusalem" },
  ],
  LB: [{ id: "beirut", ar: "بيروت", en: "Beirut" }],
  TR: [
    { id: "istanbul", ar: "إسطنبول", en: "Istanbul" },
    { id: "ankara", ar: "أنقرة", en: "Ankara" },
    { id: "izmir", ar: "إزمير", en: "Izmir" },
  ],
  PK: [
    { id: "karachi", ar: "كراتشي", en: "Karachi" },
    { id: "lahore", ar: "لاهور", en: "Lahore" },
    { id: "islamabad", ar: "إسلام آباد", en: "Islamabad" },
  ],
  BD: [
    { id: "dhaka", ar: "دكا", en: "Dhaka" },
    { id: "chittagong", ar: "شيتاغونغ", en: "Chattogram" },
  ],
  ID: [
    { id: "jakarta", ar: "جاكرتا", en: "Jakarta" },
    { id: "surabaya", ar: "سورابايا", en: "Surabaya" },
    { id: "bandung", ar: "باندونغ", en: "Bandung" },
  ],
  MY: [
    { id: "kualalumpur", ar: "كوالالمبور", en: "Kuala Lumpur" },
    { id: "johor", ar: "جوهور", en: "Johor Bahru" },
  ],
  NG: [
    { id: "lagos", ar: "لاغوس", en: "Lagos" },
    { id: "kano", ar: "كانو", en: "Kano" },
  ],
  IN: [
    { id: "delhi", ar: "دلهي", en: "Delhi" },
    { id: "mumbai", ar: "مومباي", en: "Mumbai" },
    { id: "hyderabad", ar: "حيدر آباد", en: "Hyderabad" },
  ],
};

export function citiesOf(country: string): City[] {
  return CITIES[country] ?? [];
}

export function cityName(city: City, lang: string) {
  return lang === "ar" ? city.ar : city.en;
}

/** Storage key for a country/city price scope. Empty city = the whole country. */
export function scopeKey(country: string, city: string) {
  return `${country}:${city || "*"}`;
}
