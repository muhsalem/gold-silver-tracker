import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, MapPin, ShieldCheck, ThumbsDown, ThumbsUp, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Page } from "@/components/site/Page";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { COUNTRIES, countryName, findCountry, flagOf } from "@/lib/countries";
import {
  ACCREDITATION_STEPS,
  AMBASSADOR_DUTIES,
  accuracy,
  addApplication,
  addReport,
  readCommunity,
  removeReport,
  subscribeCommunity,
  voteReport,
  type CommunityStore,
  type ProgramKind,
} from "@/lib/community";
import { formatNumber } from "@/lib/nisab";

export const Route = createFileRoute("/partners")({
  head: () => ({
    meta: [
      { title: "برنامج اعتماد الصاغة وسفراء نِصاب · نِصاب" },
      {
        name: "description",
        content:
          "برنامج اعتماد الصاغة داخل كل دولة، وسفير نِصاب لتحديث سعر الذهب والفضة يوميًا، والتحقق المجتمعي من دقة السعر المنشور.",
      },
      { property: "og:title", content: "برنامج اعتماد الصاغة وسفراء نِصاب" },
      {
        property: "og:description",
        content: "انضم كصائغ معتمد أو سفير يحدّث سعر مدينته يوميًا، أو شارك في تقييم دقة الأسعار.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PartnersPage,
});

const EMPTY: CommunityStore = { applications: [], reports: [], votes: {} };

function useCommunity() {
  const [store, setStore] = useState<CommunityStore>(EMPTY);
  useEffect(() => {
    const sync = () => setStore(readCommunity());
    sync();
    return subscribeCommunity(sync);
  }, []);
  return store;
}

function Input(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="grid gap-1.5 text-sm">
      <span className="text-muted-foreground">{props.label}</span>
      <input
        value={props.value}
        placeholder={props.placeholder ?? ""}
        onChange={(e) => props.onChange(e.target.value)}
        className="rounded-lg border border-border bg-card px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-ring"
      />
    </label>
  );
}

function PartnersPage() {
  const { lang, country, city, currency } = useI18n();
  const store = useCommunity();

  const [kind, setKind] = useState<ProgramKind>("jeweler");
  const [form, setForm] = useState({ name: "", org: "", contact: "", license: "", note: "" });
  const [sent, setSent] = useState(false);

  const [report, setReport] = useState({ reporter: "", gold: "", silver: "", note: "" });
  const [reportSent, setReportSent] = useState(false);

  const countryLabel = useMemo(() => countryName(findCountry(country), lang), [country, lang]);

  const submitApplication = () => {
    if (!form.name.trim()) return;
    addApplication({
      kind,
      name: form.name.trim(),
      org: form.org.trim(),
      country,
      city,
      contact: form.contact.trim(),
      license: form.license.trim(),
      note: form.note.trim(),
    });
    setForm({ name: "", org: "", contact: "", license: "", note: "" });
    setSent(true);
  };

  const submitReport = () => {
    const gold = Number(report.gold);
    const silver = Number(report.silver);
    if (!Number.isFinite(gold) || gold <= 0) return;
    addReport({
      kind: "volunteer",
      reporter: report.reporter.trim() || "مشارك",
      country,
      city,
      currency,
      goldGram: gold,
      silverGram: Number.isFinite(silver) && silver > 0 ? silver : 0,
      note: report.note.trim(),
    });
    setReport({ reporter: "", gold: "", silver: "", note: "" });
    setReportSent(true);
  };

  const localReports = store.reports.filter((r) => r.country === country);

  return (
    <Page
      eyebrow="شبكة الثقة"
      title="برنامج اعتماد الصاغة وسفراء نِصاب"
      sub="سعر النصاب الأدق هو سعر الصاغة داخل دولتك يوم وجوب الزكاة. هذه الشبكة تفتح الباب للصاغة المعتمدين والسفراء المتطوعين والمجتمع لتقييم دقة السعر المنشور."
    >
      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            icon: BadgeCheck,
            title: "صائغ معتمد",
            body: "محل أو صائغ مرخّص ينشر سعر الجرام مجرَّدًا من المصنعية وسعر الشراء (التسييل) في مدينته.",
          },
          {
            icon: ShieldCheck,
            title: "سفير نِصاب",
            body: "متطوع يحدّث سعر الذهب عيار ٢٤ والفضة النقية يوميًا لمدينته ويوثّق مصدر الاقتباس.",
          },
          {
            icon: ThumbsUp,
            title: "تحقق مجتمعي",
            body: "أي زائر يقيّم السعر المنشور: مطابق للسوق أم بعيد عنه، فتظهر نسبة الدقة بجانب كل سعر.",
          },
        ].map((item) => (
          <article key={item.title} className="card-surface p-6">
            <item.icon aria-hidden="true" className="size-6 text-primary" />
            <h2 className="mt-4 text-xl text-foreground">{item.title}</h2>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.body}</p>
          </article>
        ))}
      </section>

      <section className="mt-10">
        <h2 className="text-2xl text-foreground">مسار الاعتماد</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ACCREDITATION_STEPS.map((step) => (
            <article key={step.n} className="rounded-lg border border-border bg-card p-5">
              <span className="num text-2xl text-accent">{step.n}</span>
              <h3 className="mt-3 text-lg text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-2xl text-foreground">نموذج الانضمام</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            الدولة الحالية: {flagOf(country)} {countryLabel}
            {city ? ` · ${city}` : ""}
          </p>
          <div className="mt-5 flex gap-2">
            {(
              [
                { key: "jeweler", label: "صائغ / محل" },
                { key: "ambassador", label: "سفير متطوع" },
              ] as const
            ).map((option) => (
              <Button
                key={option.key}
                size="sm"
                variant={kind === option.key ? "default" : "outline"}
                onClick={() => setKind(option.key)}
              >
                {option.label}
              </Button>
            ))}
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Input label="الاسم" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            <Input
              label={kind === "jeweler" ? "اسم المحل" : "الجهة أو الصفة"}
              value={form.org}
              onChange={(v) => setForm({ ...form, org: v })}
            />
            <Input
              label="وسيلة تواصل"
              value={form.contact}
              onChange={(v) => setForm({ ...form, contact: v })}
              placeholder="بريد أو رقم"
            />
            <Input
              label={kind === "jeweler" ? "رقم الترخيص / السجل" : "مصدر السعر المعتاد"}
              value={form.license}
              onChange={(v) => setForm({ ...form, license: v })}
            />
          </div>
          <div className="mt-4">
            <Input label="ملاحظة" value={form.note} onChange={(v) => setForm({ ...form, note: v })} />
          </div>
          <Button className="mt-5" onClick={submitApplication}>
            حفظ الطلب
          </Button>
          {sent && (
            <p className="mt-3 text-sm text-muted-foreground">
              حُفظ الطلب على جهازك. لا توجد قاعدة بيانات مشتركة بعد، فالمراجعة والاعتماد يتمّان يدويًا حين
              يُفعَّل التسجيل.
            </p>
          )}
          {store.applications.length > 0 && (
            <ul className="mt-5 grid gap-2 border-t border-border pt-4 text-sm">
              {store.applications.slice(0, 5).map((app) => (
                <li key={app.id} className="flex flex-wrap justify-between gap-2 text-muted-foreground">
                  <span>
                    {app.kind === "jeweler" ? "صائغ" : "سفير"} · {app.name} {app.org ? `— ${app.org}` : ""}
                  </span>
                  <span className="num">{new Date(app.createdAt).toLocaleDateString("en-GB")}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-2xl text-foreground">واجبات السفير اليومية</h2>
          <ul className="mt-4 grid gap-3 text-sm leading-7 text-muted-foreground">
            {AMBASSADOR_DUTIES.map((duty) => (
              <li key={duty} className="flex gap-2">
                <BadgeCheck aria-hidden="true" className="mt-1 size-4 shrink-0 text-primary" />
                <span>{duty}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 border-s-2 border-accent ps-3 text-sm leading-7 text-muted-foreground">
            السعر المنشور من سفير أو صائغ لا يُغيّر حساب النصاب تلقائيًا؛ يبقى الأساس هو السعر العالمي
            المجرَّد، ويُستخدم سعر الصاغة كتصحيح محلي بعد مراجعته.
          </p>
        </div>
      </section>

      <section className="mt-10 rounded-lg border border-border bg-card p-6">
        <h2 className="text-2xl text-foreground">أرسل سعر مدينتك وقيّم الأسعار</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          سعر الجرام مجرَّدًا من المصنعية والدمغة والضريبة، بعملة {currency}.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-4">
          <Input label="اسمك" value={report.reporter} onChange={(v) => setReport({ ...report, reporter: v })} />
          <Input label="جرام الذهب ٢٤" value={report.gold} onChange={(v) => setReport({ ...report, gold: v })} />
          <Input label="جرام الفضة" value={report.silver} onChange={(v) => setReport({ ...report, silver: v })} />
          <Input label="المصدر" value={report.note} onChange={(v) => setReport({ ...report, note: v })} />
        </div>
        <Button className="mt-5" onClick={submitReport}>
          نشر السعر
        </Button>
        {reportSent && (
          <p className="mt-3 text-sm text-muted-foreground">نُشر السعر على جهازك ويمكن تقييمه أدناه.</p>
        )}

        <div className="mt-6 grid gap-3">
          {localReports.length === 0 && (
            <p className="text-sm text-muted-foreground">لا توجد أسعار منشورة لهذه الدولة على جهازك بعد.</p>
          )}
          {localReports.map((item) => {
            const votes = store.votes[item.id];
            const score = accuracy(votes);
            return (
              <article
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border p-4"
              >
                <div className="min-w-0">
                  <p className="flex items-center gap-2 text-sm text-foreground">
                    <MapPin aria-hidden="true" className="size-4 text-primary" />
                    {item.reporter} · {flagOf(item.country)} {item.city || countryLabel}
                  </p>
                  <p className="num mt-1 text-sm text-muted-foreground">
                    ذهب {formatNumber(item.goldGram, 2)} {item.currency}
                    {item.silverGram > 0 ? ` · فضة ${formatNumber(item.silverGram, 2)} ${item.currency}` : ""}
                    {item.note ? ` · ${item.note}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="num rounded-md bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">
                    {score === null ? "بلا تقييم" : `${formatNumber(score, 0)}% دقة`}
                  </span>
                  <Button
                    size="sm"
                    variant={votes?.mine === 1 ? "default" : "outline"}
                    onClick={() => voteReport(item.id, 1)}
                    aria-label="السعر صحيح"
                  >
                    <ThumbsUp className="size-4" /> {votes?.up ?? 0}
                  </Button>
                  <Button
                    size="sm"
                    variant={votes?.mine === -1 ? "default" : "outline"}
                    onClick={() => voteReport(item.id, -1)}
                    aria-label="السعر خاطئ"
                  >
                    <ThumbsDown className="size-4" /> {votes?.down ?? 0}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => removeReport(item.id)} aria-label="حذف">
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <p className="mt-8 rounded-lg border border-border bg-secondary p-5 text-sm leading-7 text-secondary-foreground">
        ملاحظة مهمة: كل ما تُدخله هنا محفوظ على جهازك وحده، ولا يظهر لبقية الزوار حتى يُفعَّل التسجيل
        المشترك. الأسعار والتقييمات استرشادية، والنصاب يبقى ٨٥ جرام ذهب و٥٩٥ جرام فضة، ومقدار الزكاة ٢٫٥٪.
      </p>
      <p className="mt-4 text-sm text-muted-foreground">
        الدول المتاحة للانضمام: {COUNTRIES.length} دولة.
      </p>
    </Page>
  );
}
