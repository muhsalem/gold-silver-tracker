import { useState } from "react";
import {
  Share2,
  Copy,
  Check,
  MessageSquareHeart,
  Sparkles,
  Send,
  Award,
  BookOpen,
  Code2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function InvitationCard() {
  const [activeTab, setActiveTab] = useState<"general" | "scholars" | "developers" | "community">(
    "general",
  );
  const [copied, setCopied] = useState(false);

  const texts = {
    general: `بسم الله الرحمن الرحيم

السلام عليكم ورحمة الله وبركاته،

أتشرف بدعوتكم للاطلاع على منصة «نِـصَـاب | NISAB» — المرجع الرقمي الوقفي الحي لمتابعة أسعار وأنصبة الزكاة (الذهب ٨٥ جم / الفضة ٥٩٥ جم) بأسعار الأسواق العالمية الفورية بمختلف العملات وحاسبة الزكاة الذكية:

🌐 الرابط: https://zakat-threshold.lovable.app

المنصة مبنية لتكون مرجعاً وقفياً تقنياً دقيقاً ومفتوحاً، خالية تماماً من الإعلانات والتتبع، وتهدف لخدمة عموم المسلمين والمؤسسات والباحثين.
يهمنا جداً رأيكم وملاحظاتكم القيّمة حول دقة المنطق المحاسبي، ووضوح الأنصبة، وتجربة الاستخدام.

شاكرون ومقدّرون لكم وقتكم ودعمكم المبارك!`,

    scholars: `أصحاب الفضيلة والسعادة، والعلماء والباحثين في الفقه والاقتصاد الإسلامي،

السلام عليكم ورحمة الله وبركاته،

نضع بين أيديكم الكريمة النسخة التشغيلية من منصة «نِـصَـاب | NISAB» الرقمية (وقف معرفي تقني):
🌐 https://zakat-threshold.lovable.app

المنصة متخصصة في:
١. التحديد اللحظي لنصاب الزكاة الشرعي بناءً على الضوابط المعتمدة:
   - نصاب الذهب: ٨٥ جراماً عيار ٢٤ (عشرون ديناراً).
   - نصاب الفضة: ٥٩٥ جراماً (مائتا درهم).
٢. حاسبة زكاة شاملة للأموال النقدية، عروض التجارة، الأسهم، والمعادن مع إيضاح الأحكام ومصارف الزكاة.
٣. مقارنة فقهية موثقة بين نصابي الذهب والفضة وتاريخ التفاوت وأثر اختيار النصاب الأحظ للفقراء.

نسعد ونشرف بمرئياتكم الفقهية وتوجيهاتكم السديدة في تدقيق المصطلحات والأوزان والمعادلات لضمان أعلى درجات الإتقان الشرعي.`,

    developers: `الإخوة المطورين وخبراء التقنية المالية (FinTech) ورواد الأعمال،

يسعدنا دعوتكم لاستكشاف منصة «نِـصَـاب | NISAB»:
🌐 https://zakat-threshold.lovable.app

منصة وقفية ومفتوحة المعايير توفر:
• أسعار المعادن والعملات اللحظية عبر تغذيات موثوقة ومدققة في سجل شفاف (Live Ledger).
• واجهات برمجية مفتوحة (REST API) للمطورين وربط أنظمة المحاسبة والـ ERP.
• تصميم عالي التباين ويدعم الهويات البصرية المخصصة ومتوافق مع أعلى معايير إمكانية الوصول والتجاوب.

نرحب بآرائكم التقنية وملاحظاتكم البرمجية حول الأداء وهيكلة البيانات، وكيفية خدمة بيئة التقنية المالية الإسلامية.`,

    community: `الإخوة والأخوات الكرام في كافة الأقطار، وتجار الصاغة والمجوهرات،

السلام عليكم ورحمة الله وبركاته،

ندعوكم للمشاركة في «منظومة التوثيق التشاركي الميداني لنصاب الزكاة» عبر منصة «نِـصَـاب»:
🌐 https://zakat-threshold.lovable.app/verify

تتيح المنصة للزوار والخبراء:
• توثيق السعر الفعلي لجرام الذهب عيار ٢٤ والفضة النقية في أسواق بلدكم اليوم (بدون مصنعية).
• تأكيد ومصادقة التسعيرات المحلية بنقرة واحدة لضبط نصاب الزكاة (ذهب ٨٥ جم / فضة ٥٩٥ جم).
• مساعدة آلاف المزكّين في بلدكم على إخراج فريضة الزكاة بيقين تام ومطابقة لواقع السوق.

مشاركتكم ومصادقتكم صدقة جارية ونفع متعدٍ لعموم المسلمين. شارك وثّق سعر دولتك الآن!`,
  };

  const copyCurrentText = async () => {
    try {
      await navigator.clipboard.writeText(texts[activeTab]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  return (
    <div className="rounded-3xl border border-primary/20 bg-card p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-5">
        <div className="flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-2xl bg-primary/10 text-primary">
            <MessageSquareHeart className="size-6" />
          </div>
          <div>
            <h3 className="font-[family-name:var(--font-display)] text-lg sm:text-xl font-bold text-foreground">
              صيغة دعوة المهتمين والخبراء لإبداء الرأي
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              نماذج محررة وجاهزة للمشاركة عبر واتساب، إكس، لينكدإن والمجالس العلمية
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 rounded-xl bg-secondary/60 p-1 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("general")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-all ${
              activeTab === "general"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sparkles className="size-3.5 text-primary" />
            <span>دعوة عامة</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("scholars")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-all ${
              activeTab === "scholars"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <BookOpen className="size-3.5 text-amber-500" />
            <span>للعلماء والفقهاء</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("developers")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-all ${
              activeTab === "developers"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Code2 className="size-3.5 text-emerald-600" />
            <span>للمطورين والتقنيين</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("community")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-all ${
              activeTab === "community"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="size-3.5 text-primary" />
            <span>للتوثيق الميداني</span>
          </button>
        </div>
      </div>

      {/* Message Box */}
      <div className="mt-5 rounded-2xl border border-border bg-background/60 p-4 sm:p-5">
        <pre className="font-sans text-xs sm:text-sm text-foreground whitespace-pre-wrap leading-relaxed select-all">
          {texts[activeTab]}
        </pre>
      </div>

      {/* Action Footer */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
          <Award className="size-4 text-primary shrink-0" />
          <span>المنصة وقف تقني معرفي حر مفتوح لجميع المسلمين</span>
        </p>

        <div className="flex items-center gap-2">
          <Button
            onClick={copyCurrentText}
            variant={copied ? "default" : "outline"}
            className="flex items-center gap-2 rounded-xl text-xs sm:text-sm"
          >
            {copied ? (
              <>
                <Check className="size-4 text-emerald-500" />
                <span>تم النسخ بنجاح!</span>
              </>
            ) : (
              <>
                <Copy className="size-4" />
                <span>نسخ نص الدعوة</span>
              </>
            )}
          </Button>

          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(texts[activeTab])}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors"
          >
            <Send className="size-3.5" />
            <span>مشاركة عبر واتساب</span>
          </a>
        </div>
      </div>
    </div>
  );
}
