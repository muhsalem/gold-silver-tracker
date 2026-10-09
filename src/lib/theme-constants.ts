export type ThemeId = "emerald" | "sapphire" | "dark-emerald" | "desert";

export interface ThemeOption {
  id: ThemeId;
  nameAr: string;
  nameEn: string;
  taglineAr: string;
  taglineEn: string;
  primaryColor: string;
  accentColor: string;
  bgColor: string;
}

export const THEMES: ThemeOption[] = [
  {
    id: "emerald",
    nameAr: "الزمرد الملكي واللؤلؤ",
    nameEn: "Royal Emerald & Pearl",
    taglineAr: "الهوية المعتمدة: وقار إسلامي بنقاء لؤلؤي وذهب مصقول",
    taglineEn: "Recommended: Sovereign Islamic emerald with pearl clarity & gold",
    primaryColor: "#064e3b",
    accentColor: "#d97706",
    bgColor: "#f8faf9",
  },
  {
    id: "sapphire",
    nameAr: "الكحلي السيادي الوقفي",
    nameEn: "Sovereign Sapphire",
    taglineAr: "طابع مالي مؤسسي كحلي رصين مع ذهب خالص",
    taglineEn: "Institutional midnight navy with radiant gold",
    primaryColor: "#0f172a",
    accentColor: "#d97706",
    bgColor: "#f8fafc",
  },
  {
    id: "dark-emerald",
    nameAr: "الزمرد الليلي الفاخر",
    nameEn: "Midnight Luxury",
    taglineAr: "وضع داكن زمردي مريح للعين مع بريق الذهب",
    taglineEn: "Deep emerald night mode with glowing bullion",
    primaryColor: "#10b981",
    accentColor: "#f59e0b",
    bgColor: "#091410",
  },
  {
    id: "desert",
    nameAr: "الرمال التراثية",
    nameEn: "Heritage Sand",
    taglineAr: "طابع ورق البردي والرمال الصحراوية الأصيل",
    taglineEn: "Classic desert parchment & warm sand tone",
    primaryColor: "#284438",
    accentColor: "#b48324",
    bgColor: "#f4ede2",
  },
];
