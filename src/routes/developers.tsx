import { createFileRoute } from "@tanstack/react-router";

import { Page } from "@/components/site/Page";

const BASE = "https://nissab-rates.lovable.app";

export const Route = createFileRoute("/developers")({
  head: () => ({
    meta: [
      { title: "واجهة نصاب للمطوّرين · نِصاب API" },
      { name: "description", content: "واجهة مجانية مفتوحة لجلب نصاب الزكاة اليومي والرسمي والتاريخي لأي دولة بصيغة JSON." },
      { property: "og:title", content: "واجهة نصاب للمطوّرين" },
      { property: "og:description", content: "نصاب الذهب والفضة اليومي والرسمي والتاريخي لكل دولة بصيغة JSON." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Developers,
});

function Code({ children }: { children: string }) {
  return (
    <pre dir="ltr" className="scroll-x mt-3 rounded-lg bg-muted p-4 text-start text-xs text-foreground">
      <code>{children}</code>
    </pre>
  );
}

function Developers() {
  return (
    <Page eyebrow="API" title="اربط تطبيقك بنصاب" sub="واجهة مجانية مفتوحة (JSON) تعيد نصاب اليوم والنصاب الرسمي المعلن وسلسلة النصاب التاريخية لأي دولة.">
      <section className="card-surface p-6">
        <h2 className="text-xl text-foreground">نصاب اليوم لدولة</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          يعيد قيمة نصاب الذهب (٨٥غ عيار ٢٤) والفضة (٥٩٥غ) بسعر السوق، وآخر سعر للصاغة المحليين، وآخر نصاب رسمي معلن مع الجهة ورابطها.
        </p>
        <Code>{`GET ${BASE}/api/public/v1/nisab?country=EG`}</Code>
      </section>
      <section className="card-surface mt-6 p-6">
        <h2 className="text-xl text-foreground">النصاب التاريخي</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          المدى: 1mo, 6mo, 1y, 5y, 10y, 20y…100y. أضف date لإرجاع أقرب قيمة لتاريخ معيّن. المدد الطويلة متوسطات سنوية تقريبية.
        </p>
        <Code>{`GET ${BASE}/api/public/v1/nisab/history?country=SA&range=5y
GET ${BASE}/api/public/v1/nisab/history?country=EG&range=10y&date=2020-03-15`}</Code>
      </section>
      <section className="card-surface mt-6 p-6">
        <h2 className="text-xl text-foreground">مثال</h2>
        <Code>{`const r = await fetch("${BASE}/api/public/v1/nisab?country=AE");
const { market, official } = await r.json();
console.log(market.gold_nisab, official?.gold_nisab);`}</Code>
        <p className="mt-3 text-sm text-muted-foreground">
          الواجهة تسمح بالطلبات من أي موقع، والنتائج تُخزَّن ١٥ دقيقة. يُرجى ذكر «نِصاب» مصدرًا. الأرقام استرشادية وليست فتوى.
        </p>
      </section>
    </Page>
  );
}
