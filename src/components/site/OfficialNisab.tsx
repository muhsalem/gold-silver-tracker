import { useQuery } from "@tanstack/react-query";
import { Landmark } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { formatMoney } from "@/lib/nisab";

export function OfficialNisab({ country, locale }: { country: string; locale: string }) {
  const { data } = useQuery({
    queryKey: ["official-nisab", country],
    queryFn: async () => {
      const { data } = await supabase.from("official_nisab").select("*").eq("country", country)
        .order("announced_on", { ascending: false }).limit(1).maybeSingle();
      return data;
    },
  });

  return (
    <section className="card-surface mt-4 p-4 sm:p-6" aria-labelledby="official-title">
      <h2 id="official-title" className="flex items-center gap-2 text-xl text-foreground">
        <Landmark aria-hidden="true" className="size-5 text-primary" /> النصاب الرسمي المعلن
      </h2>
      {!data ? (
        <p className="mt-2 text-sm text-muted-foreground">
          لا يوجد نصاب رسمي معلن مسجّل لهذه الدولة بعد. الأرقام أعلاه محسوبة من أسعار السوق.
        </p>
      ) : (
        <>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {data.gold_nisab != null && (
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm text-muted-foreground">نصاب الذهب</p>
                <p className="num mt-1 text-2xl text-foreground">{formatMoney(Number(data.gold_nisab), data.currency, locale)}</p>
              </div>
            )}
            {data.silver_nisab != null && (
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm text-muted-foreground">نصاب الفضة</p>
                <p className="num mt-1 text-2xl text-foreground">{formatMoney(Number(data.silver_nisab), data.currency, locale)}</p>
              </div>
            )}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            الجهة: {data.source_url ? (
              <a href={data.source_url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">{data.authority}</a>
            ) : data.authority}
            {" · "}تاريخ الإعلان: <span className="num">{data.announced_on}</span>
          </p>
        </>
      )}
    </section>
  );
}
