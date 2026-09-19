import { BellRing, CalendarClock } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { formatGregorianIso, formatHijri } from "@/lib/calendars";
import {
  daysUntil,
  ensureNotificationPermission,
  nextDue,
  notify,
  readHawl,
  writeHawl,
  type HawlSettings,
} from "@/lib/reminders";

/**
 * Yearly hawl reminder. The date and preferences stay on this device;
 * when the browser allows notifications we also push a message.
 */
export function HawlReminder() {
  const { t, lang } = useI18n();
  const [settings, setSettings] = useState<HawlSettings | null>(null);
  const [granted, setGranted] = useState(false);

  useEffect(() => {
    const sync = () => setSettings(readHawl());
    sync();
    window.addEventListener("nisab-hawl", sync);
    window.addEventListener("storage", sync);
    setGranted(
      typeof window !== "undefined" &&
        "Notification" in window &&
        Notification.permission === "granted",
    );
    return () => {
      window.removeEventListener("nisab-hawl", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const update = useCallback((patch: Partial<HawlSettings>) => {
    const next = { ...readHawl(), ...patch };
    writeHawl(next);
    setSettings(next);
  }, []);

  const due = settings ? nextDue(settings) : null;
  const left = due ? daysUntil(due) : null;
  const dueIso = due ? formatGregorianIso(due) : "";
  const showBanner =
    settings != null &&
    left != null &&
    left <= settings.leadDays &&
    settings.dismissedFor !== dueIso;

  useEffect(() => {
    if (!showBanner || !granted || !settings || left == null) return;
    const key = `nisab.notified.${dueIso}`;
    if (localStorage.getItem(key)) return;
    localStorage.setItem(key, "1");
    notify(t("hawl.notifyTitle"), t("hawl.notifyBody").replace("{days}", String(Math.max(left, 0))));
  }, [showBanner, granted, settings, left, dueIso, t]);

  if (!settings) return null;

  return (
    <section className="card-surface mt-6 p-5">
      <div className="flex flex-wrap items-center gap-2">
        <CalendarClock aria-hidden="true" className="size-5 text-primary" />
        <h2 className="text-base text-foreground">{t("hawl.title")}</h2>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{t("hawl.sub")}</p>

      {showBanner && left != null && (
        <div
          role="status"
          className="mt-4 rounded-xl border border-accent/50 bg-accent/10 p-4 text-sm"
        >
          <p className="text-foreground">
            {left > 0
              ? t("hawl.due").replace("{days}", String(left))
              : t("hawl.dueToday")}
          </p>
          <p className="num mt-1 text-xs text-muted-foreground">
            {dueIso} · {due ? formatHijri(due, lang) : ""}
          </p>
          <Button
            size="sm"
            variant="outline"
            className="mt-3"
            onClick={() => update({ dismissedFor: dueIso })}
          >
            {t("alert.dismiss")}
          </Button>
        </div>
      )}

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="text-muted-foreground">{t("hawl.start")}</span>
          <input
            type="date"
            value={settings.startIso}
            onChange={(event) => update({ startIso: event.target.value, dismissedFor: "" })}
            className="num mt-1 w-full rounded-lg border border-input bg-card px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-ring"
          />
        </label>
        <label className="block text-sm">
          <span className="text-muted-foreground">{t("hawl.calendar")}</span>
          <select
            value={settings.lunar ? "lunar" : "solar"}
            onChange={(event) => update({ lunar: event.target.value === "lunar" })}
            className="mt-1 w-full rounded-lg border border-input bg-card px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="lunar">{t("hawl.lunar")}</option>
            <option value="solar">{t("hawl.solar")}</option>
          </select>
        </label>
      </div>

      {due && !showBanner && (
        <p className="mt-3 text-sm text-muted-foreground">
          {t("hawl.next")}: <span className="num">{dueIso}</span> · {formatHijri(due, lang)}
          {left != null && ` · ${t("hawl.remaining").replace("{days}", String(left))}`}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          variant={granted ? "secondary" : "default"}
          onClick={async () => setGranted(await ensureNotificationPermission())}
        >
          <BellRing aria-hidden="true" />
          {granted ? t("hawl.notifyOn") : t("hawl.notifyEnable")}
        </Button>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={settings.nisabAlerts}
            onChange={(event) => update({ nisabAlerts: event.target.checked })}
            className="size-4 accent-[var(--color-primary)]"
          />
          {t("hawl.nisabAlerts")}
        </label>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">{t("hawl.privacy")}</p>
    </section>
  );
}
