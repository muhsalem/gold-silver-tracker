import type { ReactNode } from "react";

export function Page({
  eyebrow,
  title,
  sub,
  children,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="rise mb-8 max-w-3xl">
        {eyebrow && <p className="eyebrow text-muted-foreground">{eyebrow}</p>}
        <h1 className="mt-2 text-3xl leading-tight text-foreground sm:text-4xl">{title}</h1>
        {sub && <p className="mt-3 text-muted-foreground">{sub}</p>}
      </header>
      {children}
    </div>
  );
}

export function Field({
  label,
  value,
  onChange,
  suffix,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  suffix?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="mt-1 flex items-center gap-2 rounded-xl border border-input bg-card px-3 py-2 focus-within:ring-2 focus-within:ring-ring">
        <input
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^\d.]/g, ""))}
          placeholder="0"
          className="num w-full bg-transparent text-base text-foreground outline-none"
        />
        {suffix && <span className="text-xs text-muted-foreground">{suffix}</span>}
      </span>
    </label>
  );
}
