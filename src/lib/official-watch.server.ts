import { createHash } from "crypto";

type Admin = Awaited<typeof import("@/integrations/supabase/client.server")>["supabaseAdmin"];

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36";
const KEYWORDS = /(نصاب|النصاب|nisab|nisap|nishab)/i;

function pageText(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ");
}

/** Sentences around nisab mentions — only these drive change detection, not the whole page. */
function snippets(text: string) {
  const out: string[] = [];
  const re = new RegExp(`.{0,120}${KEYWORDS.source}.{0,120}`, "gi");
  for (const m of text.matchAll(re)) out.push(m[0].trim());
  return [...new Set(out)].slice(0, 12);
}

export async function watchOfficialSources(db: Admin) {
  const { data: sources } = await db.from("official_sources").select("*").eq("active", true);
  const changed: string[] = [];
  const errors: string[] = [];

  for (const s of sources ?? []) {
    const now = new Date().toISOString();
    try {
      const res = await fetch(s.url, { headers: { "User-Agent": UA, "Accept-Language": "ar,en;q=0.8" } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = pageText(await res.text());
      const found = snippets(text);
      let value: number | null = null;
      if (s.value_pattern) {
        const m = text.match(new RegExp(s.value_pattern, "i"));
        if (m?.[1]) value = Number(m[1].replace(/,/g, ""));
      }
      const basis = value != null ? `v:${value}` : found.join("|");
      const hash = createHash("sha256").update(basis).digest("hex");
      const isChange = Boolean(s.last_hash) && hash !== s.last_hash && (value != null || found.length > 0);
      const isFirstValue = !s.last_hash && value != null;

      await db.from("official_sources").update({
        last_hash: hash, last_snippet: found.slice(0, 3).join(" … "), last_value: value,
        last_checked: now, last_error: "", ...(isChange || isFirstValue ? { last_changed: now } : {}),
      }).eq("id", s.id);

      if (value != null && (isChange || isFirstValue)) {
        // Inserting fires the notify trigger for admins and the country's followers.
        await db.from("official_nisab").insert({
          country: s.country, currency: s.currency, authority: s.authority, source_url: s.url,
          gold_nisab: s.metal === "gold" ? value : null, silver_nisab: s.metal === "silver" ? value : null,
        });
        changed.push(`${s.country}: ${value} ${s.currency}`);
      } else if (isChange) {
        const { data: followers } = await db.from("notification_prefs").select("user_id")
          .eq("in_app", true).contains("countries", [s.country]);
        const { data: admins } = await db.from("user_roles").select("user_id").eq("role", "admin");
        const ids = [...new Set([...(followers ?? []), ...(admins ?? [])].map((r) => r.user_id))];
        if (ids.length) {
          await db.from("notifications").insert(ids.map((user_id) => ({
            user_id, kind: "official_update", country: s.country,
            title: `تحديث في إعلان النصاب لدى ${s.authority}`,
            body: `${found[0] ?? "تغيّر محتوى صفحة الإعلان"} — ${s.url}`,
          })));
        }
        changed.push(`${s.country}: page updated`);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      await db.from("official_sources").update({ last_checked: now, last_error: msg }).eq("id", s.id);
      errors.push(`${s.authority}: ${msg}`);
    }
  }
  return { changed, errors };
}
