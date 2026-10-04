import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { BadgeCheck, MapPin, ShieldCheck, Sparkles, ThumbsDown, ThumbsUp, Trophy } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Page } from "@/components/site/Page";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { assessLocalPrice } from "@/lib/ai.functions";
import { useAuth } from "@/lib/auth";
import { ACCREDITATION_STEPS, AMBASSADOR_DUTIES } from "@/lib/community";
import { countryName, findCountry, flagOf } from "@/lib/countries";
import { useI18n } from "@/lib/i18n";
import { formatNumber } from "@/lib/nisab";

export const Route = createFileRoute("/partners")({
  head: () => ({
    meta: [
      { title: "شبكة الصاغة وسفراء نِصاب · نِصاب" },
      {
        name: "description",
        content:
          "انضم كصائغ معتمد أو سفير، انشر سعر مدينتك، صوّت على دقة الأسعار، وتابع ترتيب الصاغة الأكثر التزامًا في كل دولة.",
      },
      { property: "og:title", content: "شبكة الصاغة وسفراء نِصاب" },
      {
        property: "og:description",
        content: "أسعار محلية معتمدة، تحقق مجتمعي، وترتيب شهري للصاغة والسفراء.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PartnersPage,
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

type LeaderRow = {
  user_id: string;
  display_name: string;
  org: string;
  country: string;
  approved: number;
  accuracy: number | null;
  points: number;
};

function Field(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="grid gap-1.5 text-sm">
      <span className="text-muted-foreground">{props.label}</span>
      <input
        value={props.value}
        placeholder={props.placeholder ?? ""}
        onChange={(e) => props.onChange(e.target.value)}
        className="rounded-lg border border-border bg-background px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-ring"
      />
    </label>
  );
}

function PartnersPage() {
  const { t, lang, country, city, currency } = useI18n();
  const { user } = useAuth();
  const assess = useServerFn(assessLocalPrice);

  const [profile, setProfile] = useState({ name: "", org: "", contact: "", license: "" });
  const [profileSaved, setProfileSaved] = useState(false);
  const [requested, setRequested] = useState(false);

  const [price, setPrice] = useState({ gold: "", silver: "", buyback: "", source: "" });
  const [priceSent, setPriceSent] = useState(false);

  const [rows, setRows] = useState<Submission[]>([]);
  const [votes, setVotes] = useState<Record<string, { up: number; down: number; mine?: number }>>({});
  const [board, setBoard] = useState<LeaderRow[]>([]);

  const [aiHistory, setAiHistory] = useState("");
  const [aiText, setAiText] = useState("");
  const [aiBusy, setAiBusy] = useState(false);

  const countryLabel = useMemo(() => countryName(findCountry(country), lang), [country, lang]);

  const loadPrices = useCallback(async () => {
    const { data } = await supabase
      .from("public_price_quotes")
      .select("id, country, city, currency, metal, gold_gram, silver_gram, buyback_gram, source, created_at, reviewed_at")
      .eq("country", country)
      .order("created_at", { ascending: false })
      .limit(25);
    const list: Submission[] = (data ?? []).map((r) => ({
      id: r.id ?? "",
      user_id: "",
      country: r.country ?? country,
      city: r.city ?? "",
      currency: r.currency ?? "",
      gold_gram: r.gold_gram,
      silver_gram: r.silver_gram,
      buyback_gram: r.buyback_gram,
      source: r.source ?? "",
      status: "approved",
      created_at: r.created_at ?? "",
    }));
    setRows(list);

    if (list.length > 0) {
      const { data: voteRows } = await supabase
        .from("price_votes")
        .select("submission_id,user_id,vote")
        .in(
          "submission_id",
          list.map((r) => r.id),
        );
      const tally: Record<string, { up: number; down: number; mine?: number }> = {};
      for (const v of voteRows ?? []) {
        const entry = tally[v.submission_id] ?? { up: 0, down: 0 };
        if (v.vote === 1) entry.up += 1;
        else entry.down += 1;
        if (user && v.user_id === user.id) entry.mine = v.vote;
        tally[v.submission_id] = entry;
      }
      setVotes(tally);
    } else {
      setVotes({});
    }

    const { data: leaders } = await supabase.rpc("jeweler_leaderboard", { _country: country });
    setBoard((leaders ?? []) as unknown as LeaderRow[]);
  }, [country, user]);

  useEffect(() => {
    void loadPrices();
  }, [loadPrices]);

  useEffect(() => {
    if (!user) return;
    void (async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      if (data) {
        setProfile({
          name: data.display_name,
          org: data.org,
          contact: data.contact,
          license: data.license,
        });
      }
    })();
  }, [user]);

  const saveProfile = async () => {
    if (!user) return;
    await supabase.from("profiles").upsert({
      id: user.id,
      display_name: profile.name,
      org: profile.org,
      contact: profile.contact,
      license: profile.license,
      country,
      city,
    });
    setProfileSaved(true);
  };

  const requestRole = async () => {
    if (!user) return;
    await supabase.from("audit_log").insert({
      actor_id: user.id,
      action: "role_request",
      entity: "profile",
      entity_id: user.id,
      reason: profile.org || profile.name,
      meta: { country, city },
    });
    setRequested(true);
  };

  const publish = async () => {
    if (!user) return;
    const gold = Number(price.gold);
    const silver = Number(price.silver);
    const buyback = Number(price.buyback);
    if (!Number.isFinite(gold) || gold <= 0) return;
    await supabase.from("price_submissions").insert({
      user_id: user.id,
      country,
      city,
      currency,
      metal: "gold",
      gold_gram: gold,
      silver_gram: Number.isFinite(silver) && silver > 0 ? silver : null,
      buyback_gram: Number.isFinite(buyback) && buyback > 0 ? buyback : null,
      source: price.source,
    });
    setPrice({ gold: "", silver: "", buyback: "", source: "" });
    setPriceSent(true);
    void loadPrices();
  };

  const vote = async (id: string, value: 1 | -1) => {
    if (!user) return;
    await supabase
      .from("price_votes")
      .upsert({ submission_id: id, user_id: user.id, vote: value }, { onConflict: "submission_id,user_id" });
    void loadPrices();
  };

  const runAi = async () => {
    const gold = Number(price.gold);
    if (!Number.isFinite(gold) || gold <= 0) return;
    setAiBusy(true);
    setAiText("");
    try {
      const history = aiHistory
        .split("\n")
        .map((line) => line.split("="))
        .filter((parts) => parts.length === 2 && Number.isFinite(Number(parts[1])))
        .map((parts) => ({ date: parts[0]!.trim(), price: Number(parts[1]) }));
      const result = await assess({
        data: { country, currency, metal: "gold", localGram: gold, globalGram: null, history, lang },
      });
      setAiText(result.text);
    } catch (error) {
      setAiText(error instanceof Error ? error.message : String(error));
    } finally {
      setAiBusy(false);
    }
  };

  return (
    <Page eyebrow={t("p.eyebrow")} title={t("p.title")} sub={t("p.sub")}>
      <section className="grid gap-4 md:grid-cols-3">
        {[
          { icon: BadgeCheck, title: t("p.card1.t"), body: t("p.card1.b") },
          { icon: ShieldCheck, title: t("p.card2.t"), body: t("p.card2.b") },
          { icon: ThumbsUp, title: t("p.card3.t"), body: t("p.card3.b") },
        ].map((item) => (
          <article key={item.title} className="card-surface p-6">
            <item.icon aria-hidden="true" className="size-6 text-primary" />
            <h2 className="mt-4 text-xl text-foreground">{item.title}</h2>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.body}</p>
          </article>
        ))}
      </section>

      <section className="mt-10">
        <h2 className="text-2xl text-foreground">{t("p.path")}</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ACCREDITATION_STEPS.map((step) => (
            <article key={step.n} className="rounded-lg border border-border bg-card p-5">
              <span className="num text-2xl text-accent">{step.n}</span>
              <h3 className="mt-3 text-lg text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      {!user && (
        <p className="mt-8 rounded-lg border border-border bg-secondary p-5 text-sm text-secondary-foreground">
          {t("p.signInFirst")}{" "}
          <Link to="/auth" className="underline underline-offset-4">
            {t("auth.signIn")}
          </Link>
        </p>
      )}

      {user && (
        <section className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl text-foreground">{t("p.join")}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {flagOf(country)} {countryLabel}
              {city ? ` · ${city}` : ""}
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label={t("p.name")} value={profile.name} onChange={(v) => setProfile({ ...profile, name: v })} />
              <Field label={t("p.org")} value={profile.org} onChange={(v) => setProfile({ ...profile, org: v })} />
              <Field
                label={t("p.contact")}
                value={profile.contact}
                onChange={(v) => setProfile({ ...profile, contact: v })}
              />
              <Field
                label={t("p.license")}
                value={profile.license}
                onChange={(v) => setProfile({ ...profile, license: v })}
              />
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button onClick={saveProfile}>{t("p.save")}</Button>
              <Button variant="outline" onClick={requestRole}>
                {t("p.requestRole")}
              </Button>
            </div>
            {profileSaved && <p className="mt-3 text-sm text-muted-foreground">{t("p.saved")}</p>}
            {requested && <p className="mt-2 text-sm text-muted-foreground">{t("p.requested")}</p>}
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-2xl text-foreground">{t("p.duties")}</h2>
            <ul className="mt-4 grid gap-3 text-sm leading-7 text-muted-foreground">
              {AMBASSADOR_DUTIES.map((duty) => (
                <li key={duty} className="flex gap-2">
                  <BadgeCheck aria-hidden="true" className="mt-1 size-4 shrink-0 text-primary" />
                  <span>{duty}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {user && (
        <section className="mt-10 rounded-lg border border-border bg-card p-6">
          <h2 className="text-2xl text-foreground">{t("p.submitTitle")}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("p.submitSub")} · <span className="num">{currency}</span>
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-4">
            <Field label={t("p.gold")} value={price.gold} onChange={(v) => setPrice({ ...price, gold: v })} />
            <Field label={t("p.silver")} value={price.silver} onChange={(v) => setPrice({ ...price, silver: v })} />
            <Field label={t("p.buyback")} value={price.buyback} onChange={(v) => setPrice({ ...price, buyback: v })} />
            <Field label={t("p.source")} value={price.source} onChange={(v) => setPrice({ ...price, source: v })} />
          </div>
          <Button className="mt-5" onClick={publish}>
            {t("p.publish")}
          </Button>
          {priceSent && <p className="mt-3 text-sm text-muted-foreground">{t("p.sent")}</p>}

          <div className="mt-8 border-t border-border pt-6">
            <h3 className="flex items-center gap-2 text-xl text-foreground">
              <Sparkles aria-hidden="true" className="size-5 text-accent" />
              {t("p.ai.title")}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">{t("p.ai.sub")}</p>
            <label className="mt-4 grid gap-1.5 text-sm">
              <span className="text-muted-foreground">{t("p.ai.history")}</span>
              <textarea
                rows={4}
                value={aiHistory}
                onChange={(e) => setAiHistory(e.target.value)}
                className="num rounded-lg border border-border bg-background px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
            <Button className="mt-4" variant="outline" disabled={aiBusy} onClick={runAi}>
              {aiBusy ? t("p.ai.busy") : t("p.ai.run")}
            </Button>
            {aiText && (
              <p className="mt-4 whitespace-pre-wrap border-s-2 border-accent ps-4 text-sm leading-7 text-muted-foreground">
                {aiText}
              </p>
            )}
            <p className="mt-3 text-xs text-muted-foreground">{t("p.ai.note")}</p>
          </div>
        </section>
      )}

      <section className="mt-10 rounded-lg border border-border bg-card p-6">
        <h2 className="text-2xl text-foreground">{t("p.listTitle")}</h2>
        <div className="mt-5 grid gap-3">
          {rows.length === 0 && <p className="text-sm text-muted-foreground">{t("p.noPrices")}</p>}
          {rows.map((item) => {
            const v = votes[item.id];
            const total = (v?.up ?? 0) + (v?.down ?? 0);
            const score = total === 0 ? null : ((v?.up ?? 0) / total) * 100;
            return (
              <article
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border p-4"
              >
                <div className="min-w-0">
                  <p className="flex items-center gap-2 text-sm text-foreground">
                    <MapPin aria-hidden="true" className="size-4 text-primary" />
                    {flagOf(item.country)} {item.city || countryLabel}
                    {item.source ? ` · ${item.source}` : ""}
                  </p>
                  <p className="num mt-1 text-sm text-muted-foreground">
                    {t("p.gold")} {formatNumber(item.gold_gram ?? 0, 2)} {item.currency}
                    {item.silver_gram
                      ? ` · ${t("p.silver")} ${formatNumber(item.silver_gram, 2)} ${item.currency}`
                      : ""}
                    {item.buyback_gram
                      ? ` · ${t("p.buyback")} ${formatNumber(item.buyback_gram, 2)} ${item.currency}`
                      : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="num rounded-md bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">
                    {score === null ? t("p.noVotes") : `${formatNumber(score, 0)}% ${t("p.accuracy")}`}
                  </span>
                  <Button
                    size="sm"
                    variant={v?.mine === 1 ? "default" : "outline"}
                    disabled={!user}
                    onClick={() => vote(item.id, 1)}
                    aria-label={t("p.approved")}
                  >
                    <ThumbsUp className="size-4" /> {v?.up ?? 0}
                  </Button>
                  <Button
                    size="sm"
                    variant={v?.mine === -1 ? "default" : "outline"}
                    disabled={!user}
                    onClick={() => vote(item.id, -1)}
                    aria-label={t("p.rejected")}
                  >
                    <ThumbsDown className="size-4" /> {v?.down ?? 0}
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mt-10 rounded-lg border border-border bg-card p-6">
        <h2 className="flex items-center gap-2 text-2xl text-foreground">
          <Trophy aria-hidden="true" className="size-6 text-accent" />
          {t("p.leaderboard")}
        </h2>
        <div className="scroll-x mt-4">
          <table className="w-full min-w-[30rem] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="p-3 text-start font-medium">#</th>
                <th className="p-3 text-start font-medium">{t("p.name")}</th>
                <th className="p-3 text-start font-medium">{t("p.entries")}</th>
                <th className="p-3 text-start font-medium">{t("p.accuracy")}</th>
                <th className="p-3 text-start font-medium">{t("p.points")}</th>
              </tr>
            </thead>
            <tbody>
              {board.length === 0 && (
                <tr>
                  <td className="p-3 text-muted-foreground" colSpan={5}>
                    {t("p.noPrices")}
                  </td>
                </tr>
              )}
              {board.map((row, index) => (
                <tr key={row.user_id} className="border-b border-border last:border-0">
                  <td className="num p-3 text-muted-foreground">{index + 1}</td>
                  <td className="p-3 text-foreground">
                    {row.display_name}
                    {row.org ? ` — ${row.org}` : ""}
                    {index === 0 && (
                      <span className="ms-2 rounded-md bg-accent/15 px-2 py-0.5 text-xs text-accent">
                        {t("p.badgeMonth")}
                      </span>
                    )}
                  </td>
                  <td className="num p-3 text-muted-foreground">{row.approved}</td>
                  <td className="num p-3 text-muted-foreground">
                    {row.accuracy === null ? "—" : `${formatNumber(Number(row.accuracy), 0)}%`}
                  </td>
                  <td className="num p-3 text-foreground">{formatNumber(Number(row.points), 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <p className="mt-8 rounded-lg border border-border bg-secondary p-5 text-sm leading-7 text-secondary-foreground">
        {t("p.localNote")}
      </p>
    </Page>
  );
}
