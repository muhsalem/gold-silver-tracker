/**
 * Community trust layer (device-local).
 *
 * Three programmes share one store:
 *  - جواهرجي معتمد: a jeweller applies for accreditation.
 *  - سفير نِصاب: a volunteer ambassador updates the local gram price daily.
 *  - التحقق المجتمعي: visitors vote whether a posted price is accurate.
 *
 * Nothing here touches zakat math (`nisab.ts`); it only records what the
 * visitor typed on this device. No shared database is connected yet, so every
 * entry stays private to this browser.
 */

export type ProgramKind = "jeweler" | "ambassador";

export type Application = {
  id: string;
  kind: ProgramKind;
  name: string;
  org: string;
  country: string;
  city: string;
  contact: string;
  license: string;
  note: string;
  createdAt: string;
};

export type PriceReport = {
  id: string;
  kind: ProgramKind | "volunteer";
  reporter: string;
  country: string;
  city: string;
  currency: string;
  goldGram: number;
  silverGram: number;
  note: string;
  createdAt: string;
};

export type Vote = 1 | -1;

export type CommunityStore = {
  applications: Application[];
  reports: PriceReport[];
  /** reportId -> { up, down, mine } */
  votes: Record<string, { up: number; down: number; mine?: Vote }>;
};

const LS = "nisab.community";
const EVENT = "nisab-community";

const EMPTY: CommunityStore = { applications: [], reports: [], votes: {} };

export function readCommunity(): CommunityStore {
  if (typeof window === "undefined") return EMPTY;
  try {
    const parsed = JSON.parse(localStorage.getItem(LS) ?? "{}") as Partial<CommunityStore>;
    return {
      applications: Array.isArray(parsed.applications) ? parsed.applications : [],
      reports: Array.isArray(parsed.reports) ? parsed.reports : [],
      votes: parsed.votes && typeof parsed.votes === "object" ? parsed.votes : {},
    };
  } catch {
    return EMPTY;
  }
}

function write(next: CommunityStore) {
  localStorage.setItem(LS, JSON.stringify(next));
  window.dispatchEvent(new Event(EVENT));
}

export function subscribeCommunity(fn: () => void) {
  window.addEventListener(EVENT, fn);
  window.addEventListener("storage", fn);
  return () => {
    window.removeEventListener(EVENT, fn);
    window.removeEventListener("storage", fn);
  };
}

function newId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function addApplication(value: Omit<Application, "id" | "createdAt">) {
  const store = readCommunity();
  const entry: Application = { ...value, id: newId(), createdAt: new Date().toISOString() };
  write({ ...store, applications: [entry, ...store.applications].slice(0, 100) });
  return entry;
}

export function addReport(value: Omit<PriceReport, "id" | "createdAt">) {
  const store = readCommunity();
  const entry: PriceReport = { ...value, id: newId(), createdAt: new Date().toISOString() };
  write({ ...store, reports: [entry, ...store.reports].slice(0, 200) });
  return entry;
}

export function removeReport(id: string) {
  const store = readCommunity();
  const votes = { ...store.votes };
  delete votes[id];
  write({ ...store, reports: store.reports.filter((r) => r.id !== id), votes });
}

/** Records (or undoes) this visitor's accuracy vote on a posted price. */
export function voteReport(id: string, vote: Vote) {
  const store = readCommunity();
  const current = store.votes[id] ?? { up: 0, down: 0 };
  const same = current.mine === vote;
  const next = { up: current.up, down: current.down, ...(same ? {} : { mine: vote }) };
  if (current.mine === 1) next.up = Math.max(0, next.up - 1);
  if (current.mine === -1) next.down = Math.max(0, next.down - 1);
  if (!same) {
    if (vote === 1) next.up += 1;
    else next.down += 1;
  }
  write({ ...store, votes: { ...store.votes, [id]: next } });
}

/** Share of "accurate" votes, or null when nobody voted yet. */
export function accuracy(votes?: { up: number; down: number }): number | null {
  if (!votes) return null;
  const total = votes.up + votes.down;
  if (total === 0) return null;
  return (votes.up / total) * 100;
}

export const ACCREDITATION_STEPS = [
  {
    n: "01",
    title: "التقديم",
    body: "يقدّم الصائغ أو المحل بيانات السجل التجاري ورقم ترخيص المشغولات الذهبية والمدينة التي يعمل بها.",
  },
  {
    n: "02",
    title: "التحقق",
    body: "تُراجع البيانات مع الجهة المانحة للترخيص (دمغة/مصلحة الدمغة أو ما يعادلها في الدولة) قبل أي اعتماد.",
  },
  {
    n: "03",
    title: "الالتزام",
    body: "يلتزم المعتمد بنشر سعر الجرام مجرَّدًا من المصنعية والدمغة والضرائب، وبذكر سعر الشراء (التسييل) كذلك.",
  },
  {
    n: "04",
    title: "المتابعة",
    body: "يُقيَّم السعر المنشور شهريًا بمقارنته بالسعر العالمي وبتصويت المجتمع؛ والانحراف غير المبرر يُنهي الاعتماد.",
  },
] as const;

export const AMBASSADOR_DUTIES = [
  "تحديث سعر جرام الذهب عيار ٢٤ والفضة النقية يوميًا من صاغة مدينته.",
  "توثيق المصدر: اسم المحل أو الغرفة أو الشعبة، مع وقت الاقتباس.",
  "تجريد السعر من المصنعية والدمغة والضريبة قبل إرساله.",
  "إرسال سعر الشراء (التسييل) بجانب سعر البيع كلما توفّر.",
  "عدم ترجيح رأي فقهي؛ دوره بيانات فقط.",
] as const;
