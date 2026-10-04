import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { bootstrapAdmin } from "@/lib/admin-bootstrap.functions";
import { useCallback, useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";

import { Page } from "@/components/site/Page";
import { OfficialNisabAdmin } from "@/components/site/OfficialNisabAdmin";
import { OfficialSourcesAdmin } from "@/components/site/OfficialSourcesAdmin";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, type AppRole } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { flagOf } from "@/lib/countries";
import { formatNumber } from "@/lib/nisab";

export const Route = createFileRoute("/_authenticated/moderation")({
  head: () => ({
    meta: [
      { title: "مراجعة أسعار الصاغة · نِصاب" },
      {
        name: "description",
        content: "لوحة المشرف لمراجعة أسعار الصاغة والتصويتات مع سجل تدقيق كامل لكل قرار اعتماد أو رفض.",
      },
      { property: "og:title", content: "مراجعة أسعار الصاغة" },
      { property: "og:description", content: "اعتماد أو رفض السعر مع بيان السبب قبل نشره لكل دولة." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ModerationPage,
});

type Submission = {
  id: string;
  user_id: string;
  country: string;
  city: string;
  currency: string;
  gold_gram: number | null;
  silver_gram: number | null;
  buyback_gram: number | null;
  source: string;
  status: string;
  created_at: string;
};

type AuditRow = {
  id: string;
  action: string;
  entity: string;
  reason: string;
  created_at: string;
};

function ModerationPage() {
  const { t } = useI18n();
  const { user, isAdmin, loading } = useAuth();
  const runBootstrap = useServerFn(bootstrapAdmin);
  const [bootMsg, setBootMsg] = useState("");
  const [queue, setQueue] = useState<Submission[]>([]);
  const [audit, setAudit] = useState<AuditRow[]>([]);
  const [reasons, setReasons] = useState<Record<string, string>>({});
  const [roleEmail, setRoleEmail] = useState("");
  const [roleValue, setRoleValue] = useState<AppRole>("jeweler");
  const [roleMsg, setRoleMsg] = useState("");

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("price_submissions")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(50);
    setQueue((data ?? []) as Submission[]);
    const { data: log } = await supabase
      .from("audit_log")
      .select("id,action,entity,reason,created_at")
      .order("created_at", { ascending: false })
      .limit(30);
    setAudit((log ?? []) as AuditRow[]);
  }, []);

  useEffect(() => {
    if (isAdmin) void load();
  }, [isAdmin, load]);

  const decide = async (row: Submission, status: "approved" | "rejected") => {
    if (!user) return;
    const reason = reasons[row.id]?.trim() ?? "";
    await supabase
      .from("price_submissions")
      .update({
        status,
        review_reason: reason,
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", row.id);
    await supabase.from("audit_log").insert({
      actor_id: user.id,
      action: status,
      entity: "price_submission",
      entity_id: row.id,
      reason,
      meta: { country: row.country, currency: row.currency },
    });
    await load();
  };

  const grantRole = async () => {
    setRoleMsg("");
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("contact", roleEmail.trim())
      .maybeSingle();
    if (!profile || !user) {
      setRoleMsg("—");
      return;
    }
    await supabase.from("user_roles").insert({ user_id: profile.id, role: roleValue });
    await supabase.from("audit_log").insert({
      actor_id: user.id,
      action: "grant_role",
      entity: "user_role",
      entity_id: profile.id,
      reason: roleValue,
    });
    setRoleMsg("✓");
    void load();
  };

  if (loading || !isAdmin) {
    return (
      <Page eyebrow={t("nav.moderation")} title={t("m.title")} sub={t("m.denied")}>
        <p className="text-sm text-muted-foreground">{t("m.denied")}</p>
        {!loading && user && (
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                const res = await runBootstrap();
                setBootMsg(res.ok ? "تم تفعيل صلاحية المشرف. أعد تحميل الصفحة." : `تعذّر التفعيل (${res.reason}).`);
                if (res.ok) window.location.reload();
              }}
            >
              تفعيل المشرف الأول
            </Button>
            {bootMsg && <p className="mt-2 text-xs text-muted-foreground">{bootMsg}</p>}
          </div>
        )}
      </Page>
    );
  }

  return (
    <Page eyebrow={t("nav.moderation")} title={t("m.title")} sub={t("m.sub")}>
      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="flex items-center gap-2 text-xl text-foreground">
          <ShieldCheck aria-hidden="true" className="size-5 text-primary" />
          {t("m.queue")}
        </h2>
        <div className="mt-4 grid gap-4">
          {queue.length === 0 && <p className="text-sm text-muted-foreground">{t("m.empty")}</p>}
          {queue.map((row) => (
            <article key={row.id} className="rounded-lg border border-border p-4">
              <p className="text-sm text-foreground">
                {flagOf(row.country)} {row.country} {row.city ? `· ${row.city}` : ""} · {row.currency}
              </p>
              <p className="num mt-1 text-sm text-muted-foreground">
                {row.gold_gram ? `${t("p.gold")}: ${formatNumber(row.gold_gram, 2)}` : ""}
                {row.silver_gram ? ` · ${t("p.silver")}: ${formatNumber(row.silver_gram, 2)}` : ""}
                {row.buyback_gram ? ` · ${t("p.buyback")}: ${formatNumber(row.buyback_gram, 2)}` : ""}
                {row.source ? ` · ${row.source}` : ""}
              </p>
              <input
                value={reasons[row.id] ?? ""}
                onChange={(e) => setReasons({ ...reasons, [row.id]: e.target.value })}
                placeholder={t("m.reason")}
                className="mt-3 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
              />
              <div className="mt-3 flex gap-2">
                <Button size="sm" onClick={() => decide(row, "approved")}>
                  {t("m.approve")}
                </Button>
                <Button size="sm" variant="outline" onClick={() => decide(row, "rejected")}>
                  {t("m.reject")}
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl text-foreground">{t("m.roles")}</h2>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <label className="grid gap-1.5 text-sm">
            <span className="text-muted-foreground">{t("auth.email")}</span>
            <input
              value={roleEmail}
              onChange={(e) => setRoleEmail(e.target.value)}
              className="num rounded-lg border border-border bg-background px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
          <select
            aria-label={t("m.roles")}
            value={roleValue}
            onChange={(e) => setRoleValue(e.target.value as AppRole)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
          >
            {(["jeweler", "ambassador", "volunteer", "admin"] as const).map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <Button onClick={grantRole}>{t("m.grant")}</Button>
          {roleMsg && <span className="text-sm text-muted-foreground">{roleMsg}</span>}
        </div>
      </section>

      {user && <OfficialNisabAdmin userId={user.id} />}
      <OfficialSourcesAdmin />



      <section className="mt-8 rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl text-foreground">{t("m.audit")}</h2>
        <div className="scroll-x mt-4">
          <table className="w-full min-w-[32rem] border-collapse text-sm">
            <tbody>
              {audit.map((row) => (
                <tr key={row.id} className="border-b border-border last:border-0">
                  <td className="num p-3 text-muted-foreground">
                    {new Date(row.created_at).toLocaleString("en-GB")}
                  </td>
                  <td className="p-3 text-foreground">{row.action}</td>
                  <td className="p-3 text-muted-foreground">{row.entity}</td>
                  <td className="p-3 text-muted-foreground">{row.reason || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </Page>
  );
}
