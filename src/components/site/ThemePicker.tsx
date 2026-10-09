import { useState, useRef, useEffect } from "react";
import { Palette, Check, Sparkles } from "lucide-react";
import { useTheme, THEMES, type ThemeId } from "@/lib/theme";
import { useI18n } from "@/lib/i18n";

export function ThemePicker() {
  const { theme, setTheme, currentTheme } = useTheme();
  const { lang } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const isAr = lang === "ar";

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isAr ? "تغيير المظهر والهوية البصرية" : "Change visual theme"}
        title={isAr ? `الهوية البصرية: ${currentTheme.nameAr}` : `Theme: ${currentTheme.nameEn}`}
        className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-2 text-xs font-medium text-foreground transition-all hover:bg-secondary hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <span
          className="size-3.5 rounded-full border border-black/10 shadow-xs"
          style={{ backgroundColor: currentTheme.primaryColor }}
        />
        <Palette className="size-3.5 text-muted-foreground" />
        <span className="hidden sm:inline-block max-w-[120px] truncate">
          {isAr ? currentTheme.nameAr : currentTheme.nameEn}
        </span>
      </button>

      {isOpen && (
        <div
          className={`absolute ${
            isAr ? "left-0 sm:right-auto sm:left-0" : "right-0 sm:left-auto sm:right-0"
          } mt-2 w-72 origin-top-right rounded-xl border border-border bg-card p-2 shadow-xl ring-1 ring-black/5 z-50 animate-in fade-in-50 zoom-in-95`}
        >
          <div className="mb-2 px-2 py-1 border-b border-border/60">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <Sparkles className="size-3.5 text-accent" />
              {isAr ? "الهوية البصرية والألوان" : "Visual Identity & Palette"}
            </p>
            <p className="text-[0.7rem] text-muted-foreground mt-0.5">
              {isAr
                ? "اختر نمط الألوان المعتمد لعرض الذهب والفضة والأنصبة"
                : "Select the sovereign palette for bullion and nisab display"}
            </p>
          </div>

          <div className="space-y-1">
            {THEMES.map((t) => {
              const isSelected = theme === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setTheme(t.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-start gap-2.5 rounded-lg p-2 text-start text-xs transition-colors ${
                    isSelected
                      ? "bg-secondary text-foreground font-medium ring-1 ring-primary/30"
                      : "hover:bg-secondary/60 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {/* Color dots preview */}
                  <div className="flex -space-x-1 rtl:space-x-reverse shrink-0 mt-0.5">
                    <span
                      className="size-4 rounded-full border border-white/50 shadow-xs ring-1 ring-black/10"
                      style={{ backgroundColor: t.primaryColor }}
                    />
                    <span
                      className="size-4 rounded-full border border-white/50 shadow-xs ring-1 ring-black/10"
                      style={{ backgroundColor: t.accentColor }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground truncate">
                        {isAr ? t.nameAr : t.nameEn}
                      </span>
                      {t.id === "emerald" && (
                        <span className="text-[0.625rem] rounded bg-emerald-600/15 text-emerald-800 dark:text-emerald-300 font-medium px-1.5 py-0.2">
                          {isAr ? "الموصى بها" : "Default"}
                        </span>
                      )}
                    </div>
                    <p className="text-[0.68rem] text-muted-foreground truncate mt-0.5">
                      {isAr ? t.taglineAr : t.taglineEn}
                    </p>
                  </div>

                  {isSelected && <Check className="size-4 shrink-0 text-primary mt-0.5" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
