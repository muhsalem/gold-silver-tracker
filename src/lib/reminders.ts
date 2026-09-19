/**
 * Local (device-only) reminders: the yearly hawl anniversary and
 * permission handling for in-app / browser notifications.
 * Nothing is uploaded; everything lives in this browser.
 */

import { gregorianToHijri, hijriToGregorian } from "./calendars";

const LS_HAWL = "nisab.hawl";

export type HawlSettings = {
  /** Start of the hawl as an ISO date (yyyy-mm-dd). */
  startIso: string;
  /** Follow the lunar (hijri) year instead of the solar one. */
  lunar: boolean;
  /** How many days before the due date the reminder appears. */
  leadDays: number;
  /** Alert when the nisab moves sharply. */
  nisabAlerts: boolean;
  /** ISO date of the last dismissal, so the banner stays quiet for that cycle. */
  dismissedFor?: string;
};

export const DEFAULT_HAWL: HawlSettings = {
  startIso: "",
  lunar: true,
  leadDays: 14,
  nisabAlerts: true,
};

export function readHawl(): HawlSettings {
  if (typeof window === "undefined") return DEFAULT_HAWL;
  try {
    const raw = localStorage.getItem(LS_HAWL);
    if (!raw) return DEFAULT_HAWL;
    return { ...DEFAULT_HAWL, ...(JSON.parse(raw) as Partial<HawlSettings>) };
  } catch {
    return DEFAULT_HAWL;
  }
}

export function writeHawl(next: HawlSettings) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_HAWL, JSON.stringify(next));
  window.dispatchEvent(new Event("nisab-hawl"));
}

const DAY = 24 * 60 * 60 * 1000;

/** Next anniversary of the hawl start, solar or lunar. */
export function nextDue(settings: HawlSettings, now = new Date()): Date | null {
  if (!settings.startIso) return null;
  const start = new Date(`${settings.startIso}T00:00:00Z`);
  if (Number.isNaN(start.getTime())) return null;

  if (!settings.lunar) {
    const due = new Date(start);
    due.setUTCFullYear(now.getUTCFullYear());
    if (due.getTime() < now.getTime() - DAY) due.setUTCFullYear(now.getUTCFullYear() + 1);
    return due;
  }

  const h = gregorianToHijri(start);
  const currentHijriYear = gregorianToHijri(now).year;
  for (let year = currentHijriYear; year <= currentHijriYear + 1; year += 1) {
    if (year <= h.year) continue;
    const due = hijriToGregorian(year, h.month, h.day);
    if (due.getTime() >= now.getTime() - DAY) return due;
  }
  return hijriToGregorian(currentHijriYear + 1, h.month, h.day);
}

export function daysUntil(date: Date, now = new Date()): number {
  return Math.ceil((date.getTime() - now.getTime()) / DAY);
}

/** Asks for browser notification permission; resolves to whether it is granted. */
export async function ensureNotificationPermission(): Promise<boolean> {
  if (typeof window === "undefined" || !("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  try {
    return (await Notification.requestPermission()) === "granted";
  } catch {
    return false;
  }
}

/** Sends a device notification when allowed; silently no-ops otherwise. */
export function notify(title: string, body: string) {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  try {
    new Notification(title, { body, icon: "/favicon.ico" });
  } catch {
    /* some browsers require a service worker; the in-app banner still shows */
  }
}
