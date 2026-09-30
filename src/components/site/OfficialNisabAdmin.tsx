import { useState } from "react";
import { Landmark } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { COUNTRIES } from "@/lib/countries";

export function OfficialNisabAdmin({ userId }: { userId: string }) {
  const [country, setCountry] = useState("EG");
  const [gold, setGold] = useState("");
  const [silver, setSilver] = useState("");
  const [authority, setAuthority] = useState("");
  const [url, setUrl] = useState("");
  const [day, setDay] = useState(new Date().toISOString().slice(0, 10));
  const [msg, setMsg] = useState("");

  const save = async () => {
    const c = COUNTRIES.find((x) => x.code === country)!;
    if (!authority.trim() || (!gold && !silver)) return setMsg("أدخل الجهة وقيمة واحدة على الأقل.");
    const { error } = await supabase.from("official_nisab").insert({
      country, currency: c.currency, authority: authority.trim(), source_url: url.trim(), announced_on: day,
      gold_nisab: gold ? Number(gold) : null, silver_nisab: silver ? Number(silver) : null, created_by: userId,
    });
    if (error) return setMsg(error.message);
    await supabase.from("audit_log").insert({ actor_id: userId, action: "official_nisab", entity: country, reason: authority.trim() });
    setMsg("تم حفظ النصاب الرسمي ونشره.");
    setGold(""); setSilver("");
  };

  return (
    <section className="mt-8 rounded-lg border border-border bg-card p-6">
      <h2 className="flex items-center gap-2 text-xl text-foreground">
        <Landmark aria-hidden="true" className="size-5 text-primary" /> النصاب الرسمي المعلن
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">سجّل النصاب الذي تعلنه جهة رسمية (دار إفتاء، بيت زكاة…) مع رابط الإعلان.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <select value={country} onChange={(e) => setCountry(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
          {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.ar} · {c.currency}</option>)}
        </select>
        <Input inputMode="decimal" placeholder="نصاب الذهب بالعملة المحلية" value={gold} onChange={(e) => setGold(e.target.value)} />
        <Input inputMode="decimal" placeholder="نصاب الفضة بالعملة المحلية" value={silver} onChange={(e) => setSilver(e.target.value)} />
        <Input placeholder="الجهة الرسمية" value={authority} onChange={(e) => setAuthority(e.target.value)} />
        <Input placeholder="رابط الإعلان" value={url} onChange={(e) => setUrl(e.target.value)} />
        <Input type="date" value={day} onChange={(e) => setDay(e.target.value)} />
      </div>
      <div className="mt-4 flex items-center gap-3">
        <Button onClick={save}>حفظ ونشر</Button>
        {msg && <span className="text-sm text-muted-foreground">{msg}</span>}
      </div>
    </section>
  );
}
