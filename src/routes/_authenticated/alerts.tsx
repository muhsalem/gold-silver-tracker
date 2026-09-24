import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bell, Check } from "lucide-react";

import { Page } from "@/components/site/Page";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { COUNTRIES, countryName, flagOf } from "@/lib/countries";

export const Route = createFileRoute("/_authenticated/alerts")({
  head: () => ({
    meta: [
      { title: "تنبيهاتي · نِصاب" },
      {
        name: "description",
        content: "اختر الدول والمواد التي تتابعها لتصلك تنبيهات الأسعار المحلية الجديدة والتصحيحات المعتمدة.",
      },
      { property: "og:title", content: "تنبيهات نِصاب" },
      { property: "og:description", content: "تنبيه يومي عند وصول سعر محلي جديد أو اعتماد تصحيح." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AlertsPage,
});

type Notification = {
  id: string;
  title: string;
  body: string;
  country: string;
  read_at: string | null;
  created_at: string;
};

function AlertsPage() {
  const { t, lang, country } = useI18n();
  const { user } = useAuth();
  const [countries, setCountries] = useState<string[]>([]);
  const [metals, setMetals] = useState<string[]>(["gold", "silver"]);
  const [inApp, setInApp] = useState(true);
  const [email, setEmail] = useState(false);
  const [daily, setDaily] = useState(true);
  const [saved, setSaved] = useState(false);
  const [inbox, setInbox] = useState<Notification[]>([]);

  useEffect(() => {
    if (!user) return;
    void (async () => {
      const { data } = await supabase
        .from("notification_prefs")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (data) {
        setCountries(data.countries ?? []);
        setMetals(data.metals ?? ["gold", "silver"]);
        setInApp(data.in_app);
        setEmail(data.email);
        setDaily(data.daily_digest);
      } else {
        setCountries([country]);
      }
      const { data: notes } = await supabase
        .from("notifications")
        .select("id,title,body,country,read_at,created_at")
        .order("created_at", { ascending: false })
        .limit(30);
      setInbox((notes ?? []) as Notification[]);
    })();
  }, [user, country]);

  const save = async () => {
    if (!user) return;
    await supabase.from("notification_prefs").upsert({
      user_id: user.id,
      countries,
      metals,
      in_app: inApp,
      email,
      daily_digest: daily,
      updated_at: new Date().toISOString(),
    });
    setSaved(true);
  };

  const markRead = async (id: string) => {
    await supabase.from("notifications").update({ read_at: new Date().toISOString() }).eq("id", id);
    setInbox((prev) => prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n)));
  };

  const toggle = (list: string[], value: string, set: (v: string[]) => void) =>
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  return (
    <Page eyebrow={t("nav.alerts")} title={t("a.title")} sub={t("a.sub")}>
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <section className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-xl text-foreground">{t("a.countries")}</h2>
          <div className="mt-4 max-h-64 overflow-y-auto rounded-lg border border-border p-3">
            {COUNTRIES.map((c) => (
              <label key={c.code} className="flex items-center gap-2 py-1 text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={countries.includes(c.code)}
                  onChange={() => toggle(countries, c.code, setCountries)}
                />
                <span aria-hidden="true">{flagOf(c.code)}</span>
                {countryName(c, lang)}
              </label>
            ))}
          </div>

          <h2 className="mt-6 text-xl text-foreground">{t("a.metals")}</h2>
          <div className="mt-3 flex gap-4 text-sm text-foreground">
            {(["gold", "silver"] as const).map((m) => (
              <label key={m} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={metals.includes(m)}
                  onChange={() => toggle(metals, m, setMetals)}
                />
                {t(m === "gold" ? "gold" : "silver")}
              </label>
            ))}
          </div>

          <div className="mt-6 grid gap-3 text-sm text-foreground">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={inApp} onChange={(e) => setInApp(e.target.checked)} />
              {t("a.inApp")}
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={email} onChange={(e) => setEmail(e.target.checked)} />
              {t("a.email")}
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={daily} onChange={(e) => setDaily(e.target.checked)} />
              {t("a.daily")}
            </label>
          </div>

          <Button className="mt-6" onClick={save}>
            {t("a.save")}
          </Button>
          {saved && <p className="mt-3 text-sm text-muted-foreground">{t("a.saved")}</p>}
        </section>

        <section className="rounded-lg border border-border bg-card p-6">
          <h2 className="flex items-center gap-2 text-xl text-foreground">
            <Bell aria-hidden="true" className="size-5 text-primary" />
            {t("a.inbox")}
          </h2>
          <div className="mt-4 grid gap-3">
            {inbox.length === 0 && <p className="text-sm text-muted-foreground">{t("a.empty")}</p>}
            {inbox.map((note) => (
              <article
                key={note.id}
                className={`rounded-lg border border-border p-4 ${note.read_at ? "opacity-60" : ""}`}
              >
                <p className="text-sm text-foreground">{note.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{note.body}</p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <span className="num text-xs text-muted-foreground">
                    {new Date(note.created_at).toLocaleString("en-GB")}
                  </span>
                  {!note.read_at && (
                    <Button size="sm" variant="ghost" onClick={() => markRead(note.id)}>
                      <Check className="size-4" /> {t("a.markRead")}
                    </Button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </Page>
  );
}
