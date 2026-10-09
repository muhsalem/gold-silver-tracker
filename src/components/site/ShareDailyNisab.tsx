import { useState } from "react";
import {
  Share2,
  Copy,
  Check,
  Send,
  MessageCircle,
  ExternalLink,
  Printer,
  Sparkles,
  MapPin,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { CITIES } from "@/lib/cities";
import { countryName, findCountry } from "@/lib/countries";
import { GOLD_NISAB_G, SILVER_NISAB_G } from "@/lib/nisab";
export interface NisabValues {
  gold: number;
  silver: number;
  goldGram: number;
  silverGram: number;
  ratio: number;
  lower: number;
}

type Props = {
  values: NisabValues;
  money: (n: number) => string;
};

export function ShareDailyNisab({ values, money }: Props) {
  const { country, lang, currency, t } = useI18n();
  const [selectedCityId, setSelectedCityId] = useState<string>("");
  const [copiedText, setCopiedText] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const countryObj = findCountry(country);
  const countryTitle = countryObj ? countryName(countryObj, lang) : country;
  const availableCities = CITIES[country] ?? [];
  const selectedCity = availableCities.find((c) => c.id === selectedCityId);
  const cityTitle = selectedCity
    ? lang === "ar"
      ? selectedCity.ar
      : selectedCity.en
    : availableCities[0]
      ? lang === "ar"
        ? availableCities[0].ar
        : availableCities[0].en
      : "";

  const todayGregorian = new Intl.DateTimeFormat(lang === "ar" ? "ar-EG" : "en-US", {
    dateStyle: "full",
  }).format(new Date());

  const todayHijri = new Intl.DateTimeFormat(
    lang === "ar" ? "ar-SA-u-ca-islamic" : "en-US-u-ca-islamic",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  ).format(new Date());

  const locationLabel = cityTitle ? `${cityTitle} · ${countryTitle}` : countryTitle;

  // Formatted message for WhatsApp, Telegram, or Clipboard
  const shareMessage = `✨ نصاب الزكاة اليومي · منصة نِصاب
📍 الموقع: ${locationLabel} (${currency})
📅 التاريخ: ${todayHijri} | ${todayGregorian}

🪙 نصاب الذهب (85 جم عيار 24):
${money(values.gold)}
(سعر جرام 24: ${money(values.goldGram)} | عيار 21: ${money(values.goldGram * 0.875)})

🥈 نصاب الفضة (595 جم):
${money(values.silver)}
(سعر جرام الفضة: ${money(values.silverGram)})

⚖️ نسبة الذهب إلى الفضة: ${values.ratio.toFixed(1)}:1
💡 النصاب الأدنى الموصى به لمعظم الأوراق النقدية (الأحظ للفقراء): ${money(values.lower)}

🔗 رابط المنصة وحاسبة الزكاة:
${typeof window !== "undefined" ? window.location.origin : "https://nisab.org"}?country=${country}${selectedCityId ? `&city=${selectedCityId}` : ""}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareMessage);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    } catch {
      // fallback
    }
  };

  const copyShareLink = async () => {
    try {
      const url = `${typeof window !== "undefined" ? window.location.origin : ""}?country=${country}${selectedCityId ? `&city=${selectedCityId}` : ""}`;
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // fallback
    }
  };

  const shareWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const shareTelegram = () => {
    const pageUrl = typeof window !== "undefined" ? window.location.href : "";
    const url = `https://t.me/share/url?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(shareMessage)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const shareTwitter = () => {
    const text = `نصاب الزكاة اليوم في ${locationLabel}:\nذهب: ${money(values.gold)}\nفضة: ${money(values.silver)}\nاحسب زكاتك بدقة:`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section className="card-surface mt-6 overflow-hidden border border-border bg-gradient-to-br from-card via-card to-secondary/30 p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-accent/20 text-accent">
              <Share2 className="size-4" />
            </span>
            <h2 className="text-xl font-semibold text-foreground">
              إرسال ومشاركة نصاب الزكاة اليومي
            </h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            شارك نصاب اليوم المحدّث لبلدك ومدينتك عبر واتساب وتيليجرام وشبكات التواصل بسهولة واحتساب
            للأجر.
          </p>
        </div>

        {availableCities.length > 0 && (
          <div className="flex items-center gap-2">
            <MapPin className="size-4 text-muted-foreground" />
            <select
              aria-label="اختر المدينة"
              value={selectedCityId}
              onChange={(e) => setSelectedCityId(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">كافة مدن {countryTitle}</option>
              {availableCities.map((city) => (
                <option key={city.id} value={city.id}>
                  {lang === "ar" ? city.ar : city.en}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Visual Live Card */}
      <div className="mt-6 rounded-2xl border border-accent/30 bg-gradient-to-r from-card to-background p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-accent" />
            <span className="font-semibold text-foreground">بطاقة نصاب اليوم المعتمدة</span>
            <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-foreground">
              {locationLabel}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="size-3.5" />
            <span>{todayHijri}</span>
            <span>·</span>
            <span>{todayGregorian}</span>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-background/80 p-4">
            <p className="eyebrow text-xs text-muted-foreground">نصاب الذهب (85 جم خالص 24K)</p>
            <p className="num mt-2 text-2xl font-bold text-foreground sm:text-3xl">
              {money(values.gold)}
            </p>
            <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span>
                عيار 24: <strong className="num text-foreground">{money(values.goldGram)}</strong>
              </span>
              <span>·</span>
              <span>
                عيار 21:{" "}
                <strong className="num text-foreground">{money(values.goldGram * 0.875)}</strong>
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-background/80 p-4">
            <p className="eyebrow text-xs text-muted-foreground">نصاب الفضة (595 جم خالصة)</p>
            <p className="num mt-2 text-2xl font-bold text-foreground sm:text-3xl">
              {money(values.silver)}
            </p>
            <div className="mt-2 text-xs text-muted-foreground">
              <span>
                جرام الفضة:{" "}
                <strong className="num text-foreground">{money(values.silverGram)}</strong>
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-secondary/50 px-3 py-2 text-xs text-muted-foreground">
          <span>
            العملة الرسمية المعتمَدة: <strong className="num text-foreground">{currency}</strong>
          </span>
          <span>
            نسبة الذهب إلى الفضة:{" "}
            <strong className="num text-foreground">{values.ratio.toFixed(1)} : 1</strong>
          </span>
          <span>
            الأحظ للفقراء: <strong className="text-foreground">{money(values.lower)}</strong>
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-wrap items-center gap-2.5">
        <Button
          onClick={shareWhatsApp}
          className="bg-emerald-600 text-white hover:bg-emerald-700"
          size="sm"
        >
          <MessageCircle className="size-4 me-1.5" />
          إرسال عبر واتساب
        </Button>

        <Button
          onClick={shareTelegram}
          variant="outline"
          size="sm"
          className="border-[#229ED9]/40 text-[#229ED9] hover:bg-[#229ED9]/10"
        >
          <Send className="size-4 me-1.5" />
          تيليجرام
        </Button>

        <Button onClick={shareTwitter} variant="outline" size="sm">
          <ExternalLink className="size-4 me-1.5" />
          منصة إكس
        </Button>

        <Button onClick={copyToClipboard} variant="secondary" size="sm">
          {copiedText ? (
            <>
              <Check className="size-4 me-1.5 text-emerald-600" />
              تم نسخ نص النصاب!
            </>
          ) : (
            <>
              <Copy className="size-4 me-1.5" />
              نسخ النص المنظم
            </>
          )}
        </Button>

        <Button onClick={copyShareLink} variant="ghost" size="sm">
          {copiedLink ? (
            <>
              <Check className="size-4 me-1.5 text-emerald-600" />
              تم نسخ الرابط!
            </>
          ) : (
            <>
              <Share2 className="size-4 me-1.5" />
              نسخ رابط مخصص
            </>
          )}
        </Button>

        <Button onClick={handlePrint} variant="ghost" size="sm" className="ms-auto">
          <Printer className="size-4 me-1.5" />
          طباعة البطاقة
        </Button>
      </div>
    </section>
  );
}
