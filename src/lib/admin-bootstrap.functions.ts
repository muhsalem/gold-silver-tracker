import { createServerFn } from "@tanstack/react-start";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * One-time admin bootstrap: grants 'admin' to the signed-in account only when
 * its email matches the ADMIN_BOOTSTRAP_EMAIL secret AND no admin exists yet.
 */
export const bootstrapAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const target = (process.env["ADMIN_BOOTSTRAP_EMAIL"] ?? "").trim().toLowerCase();
    if (!target) return { ok: false as const, reason: "not_configured" };

    const { data: userData, error: userErr } = await context.supabase.auth.getUser();
    const email = userData.user?.email?.toLowerCase();
    if (userErr || !email || !userData.user?.email_confirmed_at) return { ok: false as const, reason: "unverified" };
    if (email !== target) return { ok: false as const, reason: "forbidden" };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { count, error: countErr } = await supabaseAdmin
      .from("user_roles")
      .select("id", { count: "exact", head: true })
      .eq("role", "admin");
    if (countErr) throw new Error(countErr.message);
    if ((count ?? 0) > 0) return { ok: false as const, reason: "admin_exists" };

    const { error } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: context.userId, role: "admin" });
    if (error) throw new Error(error.message);
    await supabaseAdmin.from("audit_log").insert({
      action: "admin_bootstrap",
      entity: "user_roles",
      entity_id: context.userId,
      actor_id: context.userId,
      reason: "one-time bootstrap via ADMIN_BOOTSTRAP_EMAIL",
    });
    return { ok: true as const, reason: "granted" };
  });
