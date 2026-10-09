import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  CalendarDays,
  Plus,
  Trash2,
  Printer,
  CheckCircle2,
  BookmarkPlus,
  History as HistoryIcon,
  HelpCircle,
  TrendingDown,
  TrendingUp,
  Compass,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import {
  AVAILABLE_HIJRI_YEARS,
  ALL_HIJRI_YEARS,
  AVAILABLE_GREGORIAN_YEARS,
  calculateYearNisab,
  type PastYearItem,
} from "@/lib/historical-nisab";
import { upsertLedgerRecord, type ZakatYearRecord } from "@/lib/ledger";
import { useNisab } from "@/components/site/Prices";

export function HistoricalYearsCalculator() {
  const { currency, lang } = useI18n();
  const { values, money, data } = useNisab();

  // Exchange rate to USD for user's currency
  const exchangeRate = data?.rates?.[currency] ?? 1;

  const [calendarMode, setCalendarMode] = useState<"hijri" | "gregorian">("hijri");
  const [selectedYear, setSelectedYear] = useState<number>(1445);
  const [wealthInput, setWealthInput] = useState<string>("80000");
  const [standard, setStandard] = useState<"silver" | "gold">("silver");

  // Accumulated multi-year past calculations list
  const [pastYearRows, setPastYearRows] = useState<PastYearItem[]>([
    {
      id: "row-1445",
      yearNumber: 1445,
      yearType: "hijri",
      yearLabel: "1445 هـ (2023-2024 م)",
      wealth: 75000,
      nisabStandard: "silver",
      goldNisab: 0,
      silverNisab: 0,
      selectedNisab: 0,
      reachedNisab: true,
      rate: 0.025,
      zakatDue: 1875,
    },
    {
      id: "row-1444",
      yearNumber: 1444,
      yearType: "hijri",
      yearLabel: "1444 هـ (2022-2023 م)",
      wealth: 60000,
      nisabStandard: "silver",
      goldNisab: 0,
      silverNisab: 0,
      selectedNisab: 0,
      reachedNisab: true,
      rate: 0.025,
      zakatDue: 1500,
    },
  ]);

  const [savedAllToLedger, setSavedAllToLedger] = useState(false);

  // Current year nisab preview for the single selector
  const activeYearNisab = useMemo(() => {
    return calculateYearNisab(selectedYear, calendarMode === "hijri", exchangeRate);
  }, [selectedYear, calendarMode, exchangeRate]);

  // Recalculate pastYearRows with accurate nisabs
  const computedRows: PastYearItem[] = useMemo(() => {
    return pastYearRows.map((item) => {
      const nisabInfo = calculateYearNisab(
        item.yearNumber,
        item.yearType === "hijri",
        exchangeRate,
      );
      const chosenNisab =
        item.nisabStandard === "silver" ? nisabInfo.silverNisab : nisabInfo.goldNisab;
      const reached = item.wealth >= chosenNisab && item.wealth > 0;
      const zakatRate = item.yearType === "hijri" ? 0.025 : 0.02577;
      const zakatDue = reached ? item.wealth * zakatRate : 0;

      return {
        ...item,
        goldNisab: nisabInfo.goldNisab,
        silverNisab: nisabInfo.silverNisab,
        selectedNisab: chosenNisab,
        reachedNisab: reached,
        rate: zakatRate,
        zakatDue,
      };
    });
  }, [pastYearRows, exchangeRate]);

  // Grand Total of past years Zakat
  const totalAccumulatedZakat = useMemo(() => {
    return computedRows.reduce((acc, row) => acc + row.zakatDue, 0);
  }, [computedRows]);

  const totalAccumulatedWealth = useMemo(() => {
    return computedRows.reduce((acc, row) => acc + row.wealth, 0);
  }, [computedRows]);

  // Add a new past year calculation to the accumulated list
  const handleAddYear = () => {
    const wealthNum = parseFloat(wealthInput) || 0;
    const isHijri = calendarMode === "hijri";
    const effectiveYear = isHijri ? Math.max(2, selectedYear) : selectedYear;
    const yearLabel = isHijri ? `${effectiveYear} هـ` : `${effectiveYear} م`;

    const nisabInfo = calculateYearNisab(effectiveYear, isHijri, exchangeRate);
    const chosenNisab = standard === "silver" ? nisabInfo.silverNisab : nisabInfo.goldNisab;
    const reached = wealthNum >= chosenNisab && wealthNum > 0;
    const zakatRate = isHijri ? 0.025 : 0.02577;
    const zakatDue = reached ? wealthNum * zakatRate : 0;

    const newItem: PastYearItem = {
      id: `past-year-${effectiveYear}-${Date.now()}`,
      yearNumber: effectiveYear,
      yearType: calendarMode,
      yearLabel,
      wealth: wealthNum,
      nisabStandard: standard,
      goldNisab: nisabInfo.goldNisab,
      silverNisab: nisabInfo.silverNisab,
      selectedNisab: chosenNisab,
      reachedNisab: reached,
      rate: zakatRate,
      zakatDue,
    };

    setPastYearRows((prev) => [
      newItem,
      ...prev.filter((r) => !(r.yearNumber === effectiveYear && r.yearType === calendarMode)),
    ]);
  };

  const handleRemoveRow = (id: string) => {
    setPastYearRows((prev) => prev.filter((r) => r.id !== id));
  };

  // Transfer all calculated historical years into the permanent Multi-Year Ledger
  const handleSaveAllToLedger = () => {
    for (const row of computedRows) {
      const record: ZakatYearRecord = {
        id: `ledger-past-${row.yearType}-${row.yearNumber}`,
        yearLabel: row.yearLabel,
        yearType: row.yearType,
        yearNumber: row.yearNumber,
        country: "SA",
        currency,
        nisabStandard: row.nisabStandard,
        nisabThreshold: row.selectedNisab,
        netWealth: row.wealth,
        zakatRate: row.rate,
        zakatDue: row.zakatDue,
        zakatPaid: 0,
        status: row.zakatDue > 0 ? "due" : "exempt",
        paidDate: new Date().toISOString().split("T")[0],
        recipientChannels: "قيد السداد لتبرئة الذمة عن الأعوام السابقة",
        notes: `حُسبت بنصاب ${row.nisabStandard === "silver" ? "الفضة" : "الذهب"} التاريخي لعام ${row.yearLabel}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      upsertLedgerRecord(record);
    }
    setSavedAllToLedger(true);
    setTimeout(() => setSavedAllToLedger(false), 4000);
  };

  return (
    <section className="card-surface mt-10 overflow-hidden border border-accent/40 bg-gradient-to-br from-card via-card to-secondary/30 p-6 sm:p-8">
      {/* Title & Introduction */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-xl bg-accent/20 text-accent font-[family-name:var(--font-display)]">
              <HistoryIcon className="size-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              حساب زكاة السنوات السابقة بأنصبتها التاريخية
            </h2>
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground max-w-3xl">
            إذا تأخرت في إخراج زكاة أعوام ماضية، فإن الواجب شرعاً هو إخراجها استناداً إلى{" "}
            <strong>سعر النصاب الفعلي في تلك السنوات</strong> وليس بسعر اليوم لتبرئة الذمة بدقة
            وعدل.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-border bg-background p-1 text-xs">
          <button
            type="button"
            onClick={() => {
              setCalendarMode("hijri");
              setSelectedYear(1445);
            }}
            className={`rounded-lg px-3 py-1.5 font-medium transition-colors ${
              calendarMode === "hijri"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            التقويم الهجري (٢٫٥٪)
          </button>
          <button
            type="button"
            onClick={() => {
              setCalendarMode("gregorian");
              setSelectedYear(2023);
            }}
            className={`rounded-lg px-3 py-1.5 font-medium transition-colors ${
              calendarMode === "gregorian"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            التقويم الميلادي (٢٫٥٧٧٪)
          </button>
        </div>
      </div>

      {/* Input Form for adding a year */}
      <div className="mt-6 rounded-2xl border border-border bg-background/80 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <CalendarDays className="size-4 text-accent" />
            تحديد السنة السابقة وحساب نصابها التلقائي (من عام 2 هـ وحتى 1448 هـ — بدءاً من فرض
            الزكاة)
          </h3>
          <Link
            to="/history"
            className="flex items-center gap-1 text-xs text-primary font-semibold hover:underline bg-primary/10 px-2.5 py-1 rounded-lg"
          >
            <Compass className="size-3.5" />
            <span>تصفح موسوعة كافة سنوات الهجرة (2 - 1448 هـ)</span>
            <ArrowRight className="size-3" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-4">
          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-foreground">السنة المطلوبة</label>
              {calendarMode === "hijri" && (
                <span className="text-[0.65rem] text-muted-foreground font-mono">
                  2 إلى 1448 هـ
                </span>
              )}
            </div>
            <div className="mt-1.5 flex items-center gap-2">
              <input
                type="number"
                min={calendarMode === "hijri" ? 2 : 1970}
                max={calendarMode === "hijri" ? 1448 : 2026}
                value={selectedYear}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val))
                    setSelectedYear(calendarMode === "hijri" ? Math.max(2, val) : val);
                }}
                className="w-24 rounded-xl border border-input bg-card px-2.5 py-2 text-center text-sm font-bold text-foreground num outline-none focus:ring-2 focus:ring-ring"
              />
              <select
                aria-label="اختيار سريع للأعوام"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="flex-1 rounded-xl border border-input bg-card px-2.5 py-2 text-xs text-foreground outline-none focus:ring-2 focus:ring-ring"
              >
                {calendarMode === "hijri" ? (
                  <>
                    <optgroup label="الأعوام الأخيرة">
                      {AVAILABLE_HIJRI_YEARS.map((y) => (
                        <option key={y} value={y}>
                          عام {y} هـ
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="سنوات مفصلية من التاريخ">
                      <option value={2}>عام 2 هـ (فرض الزكاة وتأسيس النصاب)</option>
                      <option value={11}>عام 11 هـ (أبو بكر والردة)</option>
                      <option value={18}>عام 18 هـ (عام الرمادة)</option>
                      <option value={77}>عام 77 هـ (الدينار الأموي)</option>
                      <option value={99}>عام 99 هـ (عمر بن عبد العزيز)</option>
                      <option value={132}>عام 132 هـ (قيام العباسي)</option>
                      <option value={656}>عام 656 هـ (سقوط بغداد)</option>
                      <option value={923}>عام 923 هـ (العصر العثماني)</option>
                      <option value={1391}>عام 1391 هـ (فك ارتباط الذهب)</option>
                    </optgroup>
                  </>
                ) : (
                  AVAILABLE_GREGORIAN_YEARS.map((y) => (
                    <option key={y} value={y}>
                      عام {y} م
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-foreground">
              وعاؤك المالي في ذلك العام ({currency})
            </label>
            <input
              type="number"
              value={wealthInput}
              onChange={(e) => setWealthInput(e.target.value)}
              placeholder="مثال: 50000"
              className="mt-1.5 w-full rounded-xl border border-input bg-card px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-foreground">معيار النصاب المعتمد</label>
            <select
              value={standard}
              onChange={(e) => setStandard(e.target.value as "silver" | "gold")}
              className="mt-1.5 w-full rounded-xl border border-input bg-card px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="silver">نصاب الفضة (الأحظ للفقراء)</option>
              <option value="gold">نصاب الذهب (85 جم)</option>
            </select>
          </div>

          <div className="flex items-end">
            <Button
              onClick={handleAddYear}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="size-4 me-1.5" />
              إضافة السنة للكشف
            </Button>
          </div>
        </div>

        {/* Live preview of that year's historical nisab */}
        <div className="mt-4 rounded-xl bg-secondary/50 p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground border border-border/60">
          <div>
            <span>نصاب الفضة التاريخي لعام {selectedYear}: </span>
            <strong className="num text-foreground">{money(activeYearNisab.silverNisab)}</strong>
            <span className="ms-2">({money(activeYearNisab.silverPerGram)} / جم)</span>
          </div>
          <div>
            <span>نصاب الذهب التاريخي لعام {selectedYear}: </span>
            <strong className="num text-foreground">{money(activeYearNisab.goldNisab)}</strong>
            <span className="ms-2">({money(activeYearNisab.goldPerGram)} / جم)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-accent/20 px-2 py-0.5 text-[0.7rem] font-medium text-foreground">
              {activeYearNisab.eraNameAr}
            </span>
            <span className="num text-[0.7rem] text-muted-foreground">
              نسبة الذهب للفضة 1 : {activeYearNisab.ratio}
            </span>
          </div>
        </div>
      </div>

      {/* Accumulated Multi-Year Breakdown Table */}
      <div className="mt-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <h3 className="text-sm font-semibold text-foreground">
            كشف تبرئة الذمة عن زكوات السنوات السابقة ({computedRows.length} أعوام)
          </h3>
          <span className="text-xs text-muted-foreground">
            حساب فوري بمقدار ٢٫٥٪ (هجري) أو ٢٫٥٧٧٪ (ميلادي)
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40 text-muted-foreground text-xs">
              <tr className="border-b border-border">
                <th className="py-3 px-4 text-start font-medium">السنة الزكوية</th>
                <th className="py-3 px-4 text-start font-medium">النصاب التاريخي في ذلك العام</th>
                <th className="py-3 px-4 text-start font-medium">وعاؤك المالي حينها</th>
                <th className="py-3 px-4 text-start font-medium">بلوغ النصاب</th>
                <th className="py-3 px-4 text-start font-medium">الزكاة الواجبة</th>
                <th className="py-3 px-4 text-center font-medium">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {computedRows.map((row) => (
                <tr key={row.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="py-3 px-4 font-semibold text-foreground">{row.yearLabel}</td>
                  <td className="py-3 px-4 text-muted-foreground">
                    <span className="num font-medium text-foreground">
                      {money(row.selectedNisab)}
                    </span>
                    <span className="block text-[0.7rem] text-muted-foreground">
                      ({row.nisabStandard === "silver" ? "فضة 595 جم" : "ذهب 85 جم"})
                    </span>
                  </td>
                  <td className="py-3 px-4 num font-medium text-foreground">{money(row.wealth)}</td>
                  <td className="py-3 px-4">
                    {row.reachedNisab ? (
                      <span className="inline-flex items-center text-xs font-medium text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 className="size-3.5 me-1" />
                        بلغ النصاب
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">دون النصاب (معفى)</span>
                    )}
                  </td>
                  <td className="py-3 px-4 num font-bold text-primary text-base">
                    {money(row.zakatDue)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveRow(row.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors p-1"
                      title="حذف هذه السنة"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grand Total & Conscience Clearance Box */}
      <div className="mt-6 rounded-2xl bg-primary p-6 text-primary-foreground shadow-md flex flex-wrap items-center justify-between gap-6">
        <div>
          <span className="eyebrow text-xs opacity-80">إجمالي الزكوات المتراكمة لتبرئة الذمة</span>
          <p className="num mt-1 text-3xl sm:text-4xl font-bold">{money(totalAccumulatedZakat)}</p>
          <p className="mt-2 text-xs opacity-90 max-w-xl">
            هذا هو إجمالي المبالغ الواجب إخراجها شرعاً عن السنوات السابقة المحددة بأعلاه، محسوبة
            بأنصبتها الرسمية الصحيحة.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={handleSaveAllToLedger}
            variant="secondary"
            className="bg-card text-foreground hover:bg-secondary"
          >
            {savedAllToLedger ? (
              <>
                <CheckCircle2 className="size-4 me-1.5 text-emerald-600" />
                تم الترحيل لسجل الأعوام!
              </>
            ) : (
              <>
                <BookmarkPlus className="size-4 me-1.5" />
                ترحيل الكل لسجل الأعوام
              </>
            )}
          </Button>

          <Button
            onClick={() => window.print()}
            variant="outline"
            className="border-white/30 text-primary-foreground hover:bg-white/10"
          >
            <Printer className="size-4 me-1.5" />
            طباعة كشف تبرئة الذمة
          </Button>
        </div>
      </div>
    </section>
  );
}
