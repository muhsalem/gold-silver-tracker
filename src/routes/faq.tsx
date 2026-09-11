import { createFileRoute } from "@tanstack/react-router";
import { Page } from "@/components/site/Page";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/faq")({
  head: () => ({ meta: [
    { title: "الأسئلة الشائعة عن النصاب والزكاة · نِصاب" },
    { name: "description", content: "إجابات موجزة عن النصاب ومقدار الزكاة والديون ومصادر الأسعار." },
    { property: "og:title", content: "الأسئلة الشائعة عن الزكاة · نِصاب" },
    { property: "og:description", content: "مرجع مبسط لأكثر أسئلة النصاب والزكاة شيوعاً." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ]}),
  component: Faq,
});

function Faq() {
  const { t } = useI18n();
  return <Page eyebrow="دليل مختصر" title={t("faq.title")} sub="إجابات استرشادية، والفتوى الخاصة تُسأل فيها جهة علمية موثوقة.">
    <Accordion type="single" collapsible className="border-y border-border bg-card px-5 sm:px-8">
      {[1,2,3,4,5,6].map((n) => <AccordionItem key={n} value={`q-${n}`}>
        <AccordionTrigger className="text-start text-base">{t(`faq.q${n}`)}</AccordionTrigger>
        <AccordionContent className="max-w-3xl leading-7 text-muted-foreground">{t(`faq.a${n}`)}</AccordionContent>
      </AccordionItem>)}
    </Accordion>
  </Page>;
}