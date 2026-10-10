import type { SupabaseClient } from "@supabase/supabase-js";

export const DAILY_NISAB_ALERT_PCT = 3;

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

/** Notify each country's followers when today's nisab moved >= threshold vs the previous recorded day. */
export async function notifyNisabChanges(db: SupabaseClient, today: string) {
  const { data: todayRows } = await db.from("nisab_history")
    .select("country,currency,gold_nisab,silver_nisab").eq("day", today);
  const { data: prevDay } = await db.from("nisab_history").select("day")
    .lt("day", today).order("day", { ascending: false }).limit(1).maybeSingle();
  if (!todayRows?.length || !prevDay) return { notified: 0, countries: [] as string[] };
  const { data: prevRows } = await db.from("nisab_history")
    .select("country,gold_nisab,silver_nisab").eq("day", prevDay.day);
  const prev = new Map((prevRows ?? []).map((r) => [r.country, r]));

  const { data: prefs } = await db.from("notification_prefs")
    .select("user_id,countries,metals").eq("in_app", true);
  const out: Record<string, unknown>[] = [];
  const moved: string[] = [];
  for (const r of todayRows) {
    const p = prev.get(r.country);
    if (!p) continue;
    const parts: { metal: string; pct: number; v: number }[] = [];
    for (const metal of ["gold", "silver"] as const) {
      const now = Number(r[`${metal}_nisab`]);
      const was = Number(p[`${metal}_nisab`]);
      if (!now || !was) continue;
      const pct = ((now - was) / was) * 100;
      if (Math.abs(pct) >= DAILY_NISAB_ALERT_PCT) parts.push({ metal, pct, v: now });
    }
    if (!parts.length) continue;
    moved.push(r.country);
    for (const pref of prefs ?? []) {
      if (!(pref.countries ?? []).includes(r.country)) continue;
      const mine = parts.filter((x) => (pref.metals ?? ["gold", "silver"]).includes(x.metal));
      if (!mine.length) continue;
      out.push({
        user_id: pref.user_id, kind: "nisab_change", country: r.country,
        title: `تغيّر نصاب ${r.country} اليوم`,
        body: mine.map((x) => `${x.metal === "gold" ? "الذهب" : "الفضة"}: ${fmt(x.v)} ${r.currency} (${x.pct > 0 ? "+" : ""}${x.pct.toFixed(1)}%)`).join(" · "),
      });
    }
  }
  if (out.length) await db.from("notifications").insert(out);
  return { notified: out.length, countries: moved };
}

/** Post today's nisab summary to the owner's Facebook Page, if configured. */
export async function postDailyToFacebook(db: SupabaseClient, today: string) {
  const pageId = process.env["FACEBOOK_PAGE_ID"];
  const token = process.env["FACEBOOK_PAGE_ACCESS_TOKEN"];
  if (!pageId || !token) return { posted: false, reason: "not configured" };
  const featured = ["EG", "SA", "AE", "KW", "MY", "US"];
  const { data } = await db.from("nisab_history")
    .select("country,currency,gold_nisab,silver_nisab").eq("day", today).in("country", featured);
  if (!data?.length) return { posted: false, reason: "no data" };
  const lines = featured.flatMap((c) => {
    const r = data.find((x) => x.country === c);
    if (!r) return [];
    return [`• ${c}: ذهب ${fmt(Number(r.gold_nisab))} / فضة ${r.silver_nisab ? fmt(Number(r.silver_nisab)) : "—"} ${r.currency}`];
  });
  const message = [`نصاب الزكاة اليوم ${today}`, "(ذهب 85غ عيار 24 · فضة 595غ)", "", ...lines, "",
    "لكل الدول: https://zakat-threshold.lovable.app/today", "أرقام استرشادية وليست فتوى."].join("\n");
  const res = await fetch(`https://graph.facebook.com/v21.0/${pageId}/feed`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, link: "https://zakat-threshold.lovable.app/today", access_token: token }),
  });
  const body = await res.text();
  if (!res.ok) return { posted: false, reason: `Facebook ${res.status}: ${body}` };
  return { posted: true };
}
