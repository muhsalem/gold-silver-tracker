import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { COUNTRIES } from "@/lib/countries";

type Src = { id: string; country: string; authority: string; url: string; last_checked: string | null; last_changed: string | null; last_value: number | null; last_error: string };

export function OfficialSourcesAdmin() {
  const [list, setList] = useState<Src[]>([]);
  const [country, setCountry] = useState("SA");
  const [authority, setAuthority] = useState("");
  const [url, setUrl] = useState("");
  const [msg, setMsg] = useState("");

  const load = async () => {
    const { data } = await supabase.from("official_sources").select("id,country,authority,url,last_checked,last_changed,last_value,last_error").order("country");
    setList((data as Src[]) ?? []);
  };
  useEffect(() => { void load(); }, []);

  const add = async () => {
    const c = COUNTRIES.find((x) => x.code === country)!;
    if (!authority.trim() || !/^https?:\/\//.test(url.trim())) return setMsg("أدخل اسم الجهة ورابطًا صحيحًا.");
    const { error } = await supabase.from("official_sources").insert({ country, currency: c.currency, authority: authority.trim(), url: url.trim() });
    setMsg(error ? error.message : "أُضيف المصدر وسيُتابَع يوميًا.");
    if (!error) { setAuthority(""); setUrl(""); void load(); }
  };
  const remove = async (id: string) => { await supabase.from("official_sources").delete().eq("id", id); void load(); };
  const fmt = (d: string | null) => (d ? new Date(d).toLocaleString("en-GB") : "—");

  return (
    <section className="mt-8 rounded-lg border border-border bg-card p-6">
      <h2 className="text-xl text-foreground">المصادر الرسمية المتابَعة يوميًا</h2>
      <p className="mt-1 text-sm text-muted-foreground">تُفحص هذه الصفحات كل يوم؛ عند تغيّر إعلان النصاب يصل تنبيه للمشرفين ومتابعي الدولة.</p>
      <div className="scroll-x mt-4">
        <table className="w-full min-w-[36rem] text-sm">
          <thead className="text-muted-foreground"><tr>
            <th className="p-2 text-start font-normal">الجهة</th><th className="p-2 text-start font-normal">آخر فحص</th>
            <th className="p-2 text-start font-normal">آخر تغيّر</th><th className="p-2 text-start font-normal">القيمة</th><th />
          </tr></thead>
          <tbody>
            {list.map((s) => (
              <tr key={s.id} className="border-t border-border">
                <td className="p-2"><a href={s.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">{s.authority}</a> <span className="text-muted-foreground">· {s.country}</span>
                  {s.last_error && <p className="text-xs text-destructive">{s.last_error}</p>}</td>
                <td className="num p-2 text-muted-foreground">{fmt(s.last_checked)}</td>
                <td className="num p-2 text-muted-foreground">{fmt(s.last_changed)}</td>
                <td className="num p-2">{s.last_value ?? "—"}</td>
                <td className="p-2"><Button size="sm" variant="ghost" onClick={() => remove(s.id)}>حذف</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <select value={country} onChange={(e) => setCountry(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
          {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.ar}</option>)}
        </select>
        <Input placeholder="اسم الجهة الرسمية" value={authority} onChange={(e) => setAuthority(e.target.value)} />
        <Input dir="ltr" placeholder="https://…" value={url} onChange={(e) => setUrl(e.target.value)} />
      </div>
      <div className="mt-4 flex items-center gap-3">
        <Button onClick={add}>إضافة مصدر</Button>
        {msg && <span className="text-sm text-muted-foreground">{msg}</span>}
      </div>
    </section>
  );
}
