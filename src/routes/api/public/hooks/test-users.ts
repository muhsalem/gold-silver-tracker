import { createFileRoute } from "@tanstack/react-router";

import { authenticateCronRequest } from "@/integrations/supabase/cron-auth";

// TEMPORARY: end-to-end test helper, removed after verification.
export const Route = createFileRoute("/api/public/hooks/test-users")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        void authenticateCronRequest;
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: ok } = await supabaseAdmin.rpc("verify_job_token", { _name: "jeweler_feed", _token: request.headers.get("x-job-token") ?? "" });
        if (!ok) return new Response("Unauthorized", { status: 401 });
        const body = (await request.json()) as { action: "create" | "delete"; ids?: string[] };
        if (body.action === "delete") {
          for (const id of body.ids ?? []) await supabaseAdmin.auth.admin.deleteUser(id);
          return Response.json({ ok: true });
        }
        const out: Record<string, string> = {};
        for (const [k, email] of [["admin", "nisab-admin-e2e@nisab-test.dev"], ["follower", "nisab-follower-e2e@nisab-test.dev"]] as const) {
          const { data, error } = await supabaseAdmin.auth.admin.createUser({ email, password: "Test-Pass-2026!x", email_confirm: true });
          if (error) return Response.json({ error: error.message }, { status: 500 });
          out[k] = data.user.id;
        }
        await supabaseAdmin.from("user_roles").insert({ user_id: out["admin"]!, role: "admin" });
        await supabaseAdmin.from("notification_prefs").upsert({ user_id: out["follower"]!, countries: ["EG"], in_app: true });
        return Response.json(out);
      },
    },
  },
});
