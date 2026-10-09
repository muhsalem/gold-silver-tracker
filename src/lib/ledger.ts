import { createServerFn } from "@tanstack/react-start";

export type ZakatStatus = "fully_paid" | "partially_paid" | "due" | "exempt";

export type ZakatYearRecord = {
  id: string;
  yearLabel: string; // e.g. "1446 هـ" or "2024 م"
  yearType: "hijri" | "gregorian";
  yearNumber: number; // 1446, 2024, etc.
  country: string;
  city?: string;
  currency: string;
  nisabStandard: "silver" | "gold";
  nisabThreshold: number;
  netWealth: number;
  zakatRate: number; // 0.025 (Hijri) or 0.02577 (Gregorian)
  zakatDue: number;
  zakatPaid: number;
  status: ZakatStatus;
  paidDate?: string | undefined;
  recipientChannels?: string; // e.g. "منصة إحسان", "فقراء ومساكين الأقارب", "بيت الزكاة"
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

const STORAGE_KEY = "nisab_zakat_multi_year_ledger_v1";

// Server-side in-memory shared store for demo & cross-device backup
let serverLedgerStore: ZakatYearRecord[] = [
  {
    id: "sample-1445",
    yearLabel: "1445 هـ",
    yearType: "hijri",
    yearNumber: 1445,
    country: "SA",
    city: "riyadh",
    currency: "SAR",
    nisabStandard: "silver",
    nisabThreshold: 2280,
    netWealth: 120000,
    zakatRate: 0.025,
    zakatDue: 3000,
    zakatPaid: 3000,
    status: "fully_paid",
    paidDate: "2024-04-08",
    recipientChannels: "منصة إحسان - تفريج كربة",
    notes: "تم إخراج زكاة الحول كاملة في أواخر شهر رمضان المبارك.",
    createdAt: "2024-04-08T18:00:00.000Z",
    updatedAt: "2024-04-08T18:00:00.000Z",
  },
  {
    id: "sample-1446",
    yearLabel: "1446 هـ",
    yearType: "hijri",
    yearNumber: 1446,
    country: "SA",
    city: "riyadh",
    currency: "SAR",
    nisabStandard: "silver",
    nisabThreshold: 2650,
    netWealth: 154000,
    zakatRate: 0.025,
    zakatDue: 3850,
    zakatPaid: 2000,
    status: "partially_paid",
    paidDate: "2025-03-20",
    recipientChannels: "أسر مستحقة من ذوي القربى",
    notes: "دُفع قسط أول ومتبقي 1850 ريال جاري سدادها قبل نهاية الحول.",
    createdAt: "2025-03-20T12:00:00.000Z",
    updatedAt: "2025-03-20T12:00:00.000Z",
  },
];

export const getServerLedger = createServerFn({ method: "GET" }).handler(
  async (): Promise<ZakatYearRecord[]> => {
    return serverLedgerStore;
  },
);

export const syncServerLedger = createServerFn({ method: "POST" })
  .inputValidator((data: { records: ZakatYearRecord[] }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; count: number }> => {
    if (Array.isArray(data.records) && data.records.length > 0) {
      serverLedgerStore = data.records;
    }
    return { success: true, count: serverLedgerStore.length };
  });

export function getLocalLedger(): ZakatYearRecord[] {
  if (typeof window === "undefined") return serverLedgerStore;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serverLedgerStore));
      return serverLedgerStore;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : serverLedgerStore;
  } catch {
    return serverLedgerStore;
  }
}

export function saveLocalLedger(records: ZakatYearRecord[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (err) {
    console.error("Failed to save ledger to localStorage", err);
  }
}

export function upsertLedgerRecord(record: ZakatYearRecord): ZakatYearRecord[] {
  const current = getLocalLedger();
  const index = current.findIndex((r) => r.id === record.id);
  const now = new Date().toISOString();
  let updated: ZakatYearRecord[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = { ...record, updatedAt: now };
  } else {
    updated = [{ ...record, createdAt: record.createdAt || now, updatedAt: now }, ...current];
  }
  // Sort descending by year number
  updated.sort((a, b) => b.yearNumber - a.yearNumber);
  saveLocalLedger(updated);
  return updated;
}

export function deleteLedgerRecord(id: string): ZakatYearRecord[] {
  const current = getLocalLedger();
  const updated = current.filter((r) => r.id !== id);
  saveLocalLedger(updated);
  return updated;
}

export type LedgerStats = {
  totalRecords: number;
  totalZakatDue: number;
  totalZakatPaid: number;
  remainingDue: number;
  fullyPaidYearsCount: number;
  dueYearsCount: number;
};

export function calculateLedgerStats(records: ZakatYearRecord[]): LedgerStats {
  let totalZakatDue = 0;
  let totalZakatPaid = 0;
  let fullyPaidYearsCount = 0;
  let dueYearsCount = 0;

  for (const r of records) {
    totalZakatDue += r.zakatDue || 0;
    totalZakatPaid += r.zakatPaid || 0;
    if (r.status === "fully_paid") {
      fullyPaidYearsCount++;
    } else if (r.status === "due" || r.status === "partially_paid") {
      dueYearsCount++;
    }
  }

  return {
    totalRecords: records.length,
    totalZakatDue,
    totalZakatPaid,
    remainingDue: Math.max(0, totalZakatDue - totalZakatPaid),
    fullyPaidYearsCount,
    dueYearsCount,
  };
}
