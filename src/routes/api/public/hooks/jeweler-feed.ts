import { createFileRoute } from "@tanstack/react-router";
import type { SupabaseClient } from "@supabase/supabase-js";


import { authenticateCronRequest } from "@/integrations/supabase/cron-auth";
import { COUNTRIES } from "@/lib/countries";
import type { FeedRow } from "@/lib/jeweler-feed.server";

const OZ = 31.1034768;

/** Snapshot today's nisab (gold 85g, silver 595g) per country into nisab_history. */
async function recordNisabHistory(
  supabaseAdmin: SupabaseClient,
  feedRows: FeedRow[],
  today: string,
): Promise<{ recorded: number; source: string }> {
  // 1) Local jeweller feed rows win for their country.
  const byCountry = new Map<string, FeedRow>();
  for (const r of feedRows) byCountry.set(r.country, r);

  // 2) Global spot fallback for every other country.
  let goldOz: number | null = null;
  let silverOz: number | null = null;
  let rates: Record<string, number> = {};
  try {
    const [g, s, fx] = await Promise.all([
      fetch("https://api.gold-api.com/price/XAU", { headers: { accept: "application/json" } }).then((r) => r.json()),
      fetch("https://api.gold-api.com/price/XAG", { headers: { accept: "application/json" } }).then((r) => r.json()),
      fetch("https://open.er-api.com/v6/latest/USD").then((r) => r.json()),
    ]);
    goldOz = Number(g?.price) > 0 ? Number(g.price) : null;
    silverOz = Number(s?.price) > 0 ? Number(s.price) : null;
    rates = (fx?.rates ?? {}) as Record<string, number>;
  } catch {
    /* spot unavailable; only feed rows are recorded */
  }

  const rows: Record<string, unknown>[] = [];
  for (const c of COUNTRIES) {
    const feed = byCountry.get(c.code);
    if (feed?.gold_gram) {
      rows.push({
        country: c.code,
        currency: c.currency,
        day: today,
        gold_gram: feed.gold_gram,
        silver_gram: feed.silver_gram,
        source: feed.source,
        source_url: feed.source_url,
      });
      continue;
    }
    const rate = c.currency === "USD" ? 1 : rates[c.currency];
    if (!goldOz || !rate) continue;
    rows.push({
      country: c.code,
      currency: c.currency,
      day: today,
      gold_gram: (goldOz / OZ) * rate,
      silver_gram: silverOz ? (silverOz / OZ) * rate : null,
      source: "gold-api.com — spot XAU/XAG",
      source_url: "https://api.gold-api.com/price/XAU",
    });
  }

  if (!rows.length) return { recorded: 0, source: "none" };
  const { error } = await supabaseAdmin
    .from("nisab_history")
    .upsert(rows, { onConflict: "country,day" });
  if (error) throw new Error(`nisab_history: ${error.message}`);
  return { recorded: rows.length, source: goldOz ? "spot+feed" : "feed" };
}

export const Route = createFileRoute("/api/public/hooks/jeweler-feed")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const jobToken = request.headers.get("x-job-token");
        if (jobToken) {
          const { data: ok } = await supabaseAdmin.rpc("verify_job_token", { _name: "jeweler_feed", _token: jobToken });
          if (!ok) return new Response("Unauthorized", { status: 401 });
        } else {
          const denied = await authenticateCronRequest(request);
          if (denied) return denied;
        }

        const { collectFeed, BIG_CHANGE_PCT, MAX_SPOT_DEVIATION_PCT } = await import("@/lib/jeweler-feed.server");
        const collected = await collectFeed();
        const errors = collected.errors;

        // Sanity check: skip rows that deviate > 15% from the spot conversion.
        let spotGoldOz = 0;
        let fx: Record<string, number> = {};
        try {
          const [g, r] = await Promise.all([
            fetch("https://api.gold-api.com/price/XAU").then((x) => x.json()),
            fetch("https://open.er-api.com/v6/latest/USD").then((x) => x.json()),
          ]);
          spotGoldOz = Number(g?.price) || 0;
          fx = (r?.rates ?? {}) as Record<string, number>;
        } catch {
          /* no spot: rows pass unchecked */
        }
        const rows: FeedRow[] = [];
        for (const row of collected.rows) {
          const rate = row.currency === "USD" ? 1 : fx[row.currency];
          const spot = spotGoldOz && rate ? (spotGoldOz / OZ) * rate : 0;
          const dev = spot && row.gold_gram ? ((row.gold_gram - spot) / spot) * 100 : 0;
          if (Math.abs(dev) > MAX_SPOT_DEVIATION_PCT) {
            errors.push(`${row.country}: انحراف ${dev.toFixed(1)}% عن السعر العالمي — تم التجاهل`);
            await supabaseAdmin.from("audit_log").insert({
              action: "feed_row_skipped",
              entity: "jeweler_feed",
              entity_id: null,
              reason: `deviation ${dev.toFixed(1)}% > ${MAX_SPOT_DEVIATION_PCT}%`,
              meta: { country: row.country, source: row.source, gold_gram: row.gold_gram, spot_gram: spot },
            });
            continue;
          }
          rows.push(row);
        }
        const today = new Date().toISOString().slice(0, 10);
        const alerts: string[] = [];

        for (const row of rows) {
          const { data: prev } = await supabaseAdmin
            .from("jeweler_feed")
            .select("gold_gram")
            .eq("country", row.country)
            .lt("day", today)
            .order("day", { ascending: false })
            .limit(1)
            .maybeSingle();
          const before = prev?.gold_gram ? Number(prev.gold_gram) : null;
          const change = before && row.gold_gram ? ((row.gold_gram - before) / before) * 100 : null;
          await supabaseAdmin
            .from("jeweler_feed")
            .upsert({ country: row.country, currency: row.currency, source: row.source, source_url: row.source_url, gold_gram: row.gold_gram, buyback_gram: row.buyback_gram, silver_gram: row.silver_gram, silver_buyback_gram: row.silver_buyback_gram ?? null, day: today, change_pct: change, fetched_at: new Date().toISOString() }, { onConflict: "country,day" });
          if (change != null && Math.abs(change) >= BIG_CHANGE_PCT) {
            alerts.push(`${row.country}: ${change > 0 ? "+" : ""}${change.toFixed(1)}% (${row.source})`);
          }
        }

        if (alerts.length || errors.length) {
          const { data: admins } = await supabaseAdmin.from("user_roles").select("user_id").eq("role", "admin");
          const body = [
            alerts.length ? `تغيّر كبير في سعر الصاغة: ${alerts.join(" · ")}` : "",
            errors.length ? `مصادر تعذّرت قراءتها: ${errors.join(" · ")}` : "",
          ].filter(Boolean).join("\n");
          if (admins?.length) {
            await supabaseAdmin.from("notifications").insert(
              admins.map((a) => ({
                user_id: a.user_id,
                kind: alerts.length ? "jeweler_big_change" : "jeweler_feed_error",
                title: alerts.length ? "تنبيه: تغيّر كبير في أسعار الصاغة" : "تنبيه: تعذّر تحديث بعض مصادر الصاغة",
                body,
              })),
            );
          }
        }

        const { watchOfficialSources } = await import("@/lib/official-watch.server");
        const official = await watchOfficialSources(supabaseAdmin);

        // Daily nisab history snapshot: local jeweller prices where available,
        // global spot (converted per currency) everywhere else.
        const history = await recordNisabHistory(supabaseAdmin, rows, today);

        return Response.json({ ok: true, updated: rows.map((r) => r.country), alerts, errors, official, history });
      },
    },
  },
});
