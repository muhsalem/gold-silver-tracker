import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";

import { Page } from "@/components/site/Page";
import { supabase } from "@/integrations/supabase/client";
import { COUNTRIES, countryName, flagOf } from "@/lib/countries";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/sources")({
  head: () => ({
    meta: [
      { title: "مصادر النصاب الرسمية لكل دولة · نِصاب" },
      { name: "description", content: "روابط الجهات الرسمية التي تعلن النصاب أو أحكام الزكاة في كل دولة، تتابعها منصة نِصاب يوميًا." },
      { property: "og:title", content: "مصادر النصاب الرسمية لكل دولة" },
      { property: "og:description", content: "دور الإفتاء وبيوت الزكاة والهيئات الرسمية المتابَعة يوميًا." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SourcesPage,
});

function SourcesPage() {
  const { lang } = useI18n();
  const { data = [], isLoading } = useQuery({
    queryKey: ["official-sources-public"],
    queryFn: async () => {
      const { data } = await supabase
        .from("official_sources")
        .select("id,country,authority,url,last_checked,active")
        .eq("active", true)
        .order("country");
      return data ?? [];
    },
  });

  const byCountry = new Map<string, typeof data>();
  for (const s of data) byCountry.set(s.country, [...(byCountry.get(s.country) ?? []), s]);

  return (
    <Page eyebrow="SOURCES" title="مصادر النصاب الرسمية" sub="الجهات الرسمية التي نتابع إعلاناتها يوميًا؛ عند أي تحديث يصل تنبيه للمشرفين ومتابعي الدولة.">
      {isLoading && <p className="text-sm text-muted-foreground">…</p>}
      <div className="grid gap-4 sm:grid-cols-2">
        {[...byCountry.entries()].map(([code, list]) => {
          const c = COUNTRIES.find((x) => x.code === code);
          return (
            <article key={code} className="card-surface p-5">
              <h2 className="text-lg text-foreground">
                <span aria-hidden="true">{flagOf(code)}</span> {c ? countryName(c, lang) : code}
              </h2>
              <ul className="mt-3 grid gap-2">
                {list.map((s) => (
                  <li key={s.id}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-primary underline underline-offset-4">
                      {s.authority} <ExternalLink aria-hidden="true" className="size-3.5" />
                    </a>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
      <p className="mt-6 text-xs text-muted-foreground">أرقام استرشادية وليست فتوى؛ المرجع النهائي هو إعلان الجهة الرسمية.</p>
    </Page>
  );
}
