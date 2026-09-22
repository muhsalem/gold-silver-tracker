import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Page } from "@/components/site/Page";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>) => ({
    next: typeof search["next"] === "string" ? (search["next"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "الدخول والتسجيل · نِصاب" },
      {
        name: "description",
        content: "سجّل دخولك في منصة نِصاب لنشر أسعار الصاغة، والتصويت على دقتها، ومتابعة التنبيهات.",
      },
      { property: "og:title", content: "الدخول والتسجيل في نِصاب" },
      { property: "og:description", content: "حساب واحد للصائغ والسفير والمتطوع والمشرف." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function safeNext(value?: string) {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/partners";
}

function AuthPage() {
  const { t } = useI18n();
  const { session } = useAuth();
  const navigate = useNavigate();
  const search = useSearch({ from: "/auth" });
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (session) void navigate({ to: safeNext(search.next) });
  }, [session, navigate, search.next]);

  const submit = async () => {
    setBusy(true);
    setMsg("");
    const redirect = `${window.location.origin}${safeNext(search.next)}`;
    const res =
      mode === "up"
        ? await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: redirect, data: { display_name: name } },
          })
        : await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (res.error) {
      setMsg(res.error.message);
      return;
    }
    if (mode === "up" && !res.data.session) setMsg(t("auth.checkEmail"));
  };

  const google = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) setMsg(String(result.error));
  };

  return (
    <Page eyebrow={t("auth.eyebrow")} title={t("auth.title")} sub={t("auth.sub")}>
      <div className="mx-auto max-w-md rounded-lg border border-border bg-card p-6">
        <div className="flex gap-2">
          <Button size="sm" variant={mode === "in" ? "default" : "outline"} onClick={() => setMode("in")}>
            {t("auth.signIn")}
          </Button>
          <Button size="sm" variant={mode === "up" ? "default" : "outline"} onClick={() => setMode("up")}>
            {t("auth.signUp")}
          </Button>
        </div>

        <div className="mt-5 grid gap-4">
          {mode === "up" && (
            <label className="grid gap-1.5 text-sm">
              <span className="text-muted-foreground">{t("auth.name")}</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-lg border border-border bg-background px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
          )}
          <label className="grid gap-1.5 text-sm">
            <span className="text-muted-foreground">{t("auth.email")}</span>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="num rounded-lg border border-border bg-background px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
          <label className="grid gap-1.5 text-sm">
            <span className="text-muted-foreground">{t("auth.password")}</span>
            <input
              type="password"
              autoComplete={mode === "up" ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="num rounded-lg border border-border bg-background px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
        </div>

        <Button className="mt-5 w-full" disabled={busy} onClick={submit}>
          {mode === "up" ? t("auth.signUp") : t("auth.signIn")}
        </Button>
        <Button className="mt-3 w-full" variant="outline" onClick={google}>
          {t("auth.google")}
        </Button>
        {msg && <p className="mt-4 border-s-2 border-accent ps-3 text-sm text-muted-foreground">{msg}</p>}
        <p className="mt-5 text-xs leading-6 text-muted-foreground">{t("auth.note")}</p>
      </div>
    </Page>
  );
}
