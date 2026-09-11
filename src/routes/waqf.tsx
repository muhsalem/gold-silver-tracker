import { createFileRoute } from "@tanstack/react-router";
import { HeartHandshake } from "lucide-react";
import { Page } from "@/components/site/Page";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/waqf")({
  head: () => ({ meta: [
    { title: "وقف نِصاب · صدقة جارية" },
    { name: "description", content: "نِصاب منصة وقفية مجانية تعين المسلمين على حساب الزكاة دون إعلانات أو تتبع." },
    { property: "og:title", content: "وقف نِصاب · صدقة جارية" },
    { property: "og:description", content: "منصة مجانية لحساب الزكاة، وقف لوجه الله تعالى." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ]}),
  component: Waqf,
});

function Waqf() {
  const { t } = useI18n();
  return <Page eyebrow="وقف رقمي" title={t("about.title")}>
    <div className="border-y border-border bg-card px-6 py-10 sm:px-10">
      <HeartHandshake className="size-10 text-accent" aria-hidden="true" />
      <p className="mt-6 max-w-3xl text-lg leading-9 text-foreground">{t("about.body1")}</p>
      <p className="mt-4 max-w-3xl leading-8 text-muted-foreground">{t("about.body2")}</p>
      <blockquote className="mt-8 border-s-2 border-accent ps-5 font-[family-name:var(--font-display)] text-2xl text-primary">{t("about.dua")}</blockquote>
    </div>
  </Page>;
}