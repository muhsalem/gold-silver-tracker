import { createFileRoute } from "@tanstack/react-router";

import { authenticateCronRequest } from "@/integrations/supabase/cron-auth";

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

        const { collectFeed, BIG_CHANGE_PCT } = await import("@/lib/jeweler-feed.server");
        const { rows, errors } = await collectFeed();
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
            .upsert({ ...row, day: today, change_pct: change, fetched_at: new Date().toISOString() }, { onConflict: "country,day" });
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
