import { Link } from "@tanstack/react-router";

interface NisabLogoProps {
  compact?: boolean;
  showTagline?: boolean;
  className?: string;
}

export function NisabEmblem({ size = 42, className = "" }: { size?: number; className?: string }) {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
      aria-label="شعار نِصاب: ميزان نصاب الزكاة الشرعي"
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="size-full drop-shadow-sm select-none"
      >
        <defs>
          {/* Gradients for Gold, Silver and Emerald */}
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="50%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>

          <linearGradient id="silverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="50%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>

          <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="60%" stopColor="#047857" />
            <stop offset="100%" stopColor="#064e3b" />
          </linearGradient>

          <linearGradient id="ringGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d97706" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#059669" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#b45309" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* Outer Islamic Architectural Medallion Frame */}
        <rect
          x="3"
          y="3"
          width="94"
          height="94"
          rx="24"
          fill="url(#emeraldGrad)"
          stroke="url(#goldGrad)"
          strokeWidth="2.5"
        />

        {/* Subtle geometric inner border */}
        <rect
          x="8"
          y="8"
          width="84"
          height="84"
          rx="19"
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1"
          strokeDasharray="3 2"
        />

        {/* Top Arch Finial / Crescent of Purity & Awqaf */}
        <path
          d="M 50 14 C 47 14 45 16 45 19 C 45 22 47 24 50 24 C 53 24 55 22 55 19 C 55 16 53 14 50 14 Z"
          fill="url(#goldGrad)"
        />
        <circle cx="50" cy="19" r="1.5" fill="#fff" />

        {/* Central Vertical Pillar of Justice & Measurement */}
        <line
          x1="50"
          y1="23"
          x2="50"
          y2="76"
          stroke="url(#goldGrad)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <line
          x1="50"
          y1="25"
          x2="50"
          y2="74"
          stroke="#fef08a"
          strokeWidth="1"
          strokeLinecap="round"
        />

        {/* Central Balance Pivot / Dial Indicator (Fulcrum) */}
        <circle cx="50" cy="33" r="4.5" fill="#064e3b" stroke="url(#goldGrad)" strokeWidth="2" />
        <circle cx="50" cy="33" r="1.8" fill="#fde047" />

        {/* Analytical Balance Beam (Precision Scale Arm) */}
        <path
          d="M 23 35 Q 50 31 77 35"
          fill="none"
          stroke="url(#goldGrad)"
          strokeWidth="2.75"
          strokeLinecap="round"
        />

        {/* Scale Cords (Left: Gold / Right: Silver) */}
        {/* Left Pan Cords (Gold) */}
        <line
          x1="25"
          y1="35"
          x2="19"
          y2="52"
          stroke="#fde047"
          strokeWidth="1"
          strokeOpacity="0.85"
        />
        <line
          x1="25"
          y1="35"
          x2="31"
          y2="52"
          stroke="#fde047"
          strokeWidth="1"
          strokeOpacity="0.85"
        />

        {/* Right Pan Cords (Silver) */}
        <line
          x1="75"
          y1="35"
          x2="69"
          y2="52"
          stroke="#e2e8f0"
          strokeWidth="1"
          strokeOpacity="0.85"
        />
        <line
          x1="75"
          y1="35"
          x2="81"
          y2="52"
          stroke="#e2e8f0"
          strokeWidth="1"
          strokeOpacity="0.85"
        />

        {/* Left Pan (Gold Pan) */}
        <path
          d="M 17 52 Q 25 57 33 52"
          fill="none"
          stroke="url(#goldGrad)"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        {/* Gold Bullion Ingot (85g) */}
        <rect
          x="20"
          y="45"
          width="10"
          height="5.5"
          rx="1.5"
          fill="url(#goldGrad)"
          stroke="#fef08a"
          strokeWidth="0.75"
        />
        <text
          x="25"
          y="49.2"
          textAnchor="middle"
          fontSize="3.8"
          fontWeight="bold"
          fill="#451a03"
          fontFamily="system-ui, sans-serif"
        >
          85g
        </text>

        {/* Right Pan (Silver Pan) */}
        <path
          d="M 67 52 Q 75 57 83 52"
          fill="none"
          stroke="url(#silverGrad)"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        {/* Silver Bullion Ingot (595g) */}
        <rect
          x="70"
          y="45"
          width="10"
          height="5.5"
          rx="1.5"
          fill="url(#silverGrad)"
          stroke="#ffffff"
          strokeWidth="0.75"
        />
        <text
          x="75"
          y="49.2"
          textAnchor="middle"
          fontSize="3.4"
          fontWeight="bold"
          fill="#0f172a"
          fontFamily="system-ui, sans-serif"
        >
          595g
        </text>

        {/* Base Pedestal (قاعدة الميزان الشرعي الثابت) */}
        <path d="M 37 78 L 63 78 L 59 74 L 41 74 Z" fill="url(#goldGrad)" />
        <line
          x1="33"
          y1="81"
          x2="67"
          y2="81"
          stroke="url(#goldGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Threshold Calculation Pointer (مؤشر احتساب النصاب) */}
        <path d="M 50 33 L 50 42" stroke="#ef4444" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="50" cy="42" r="1.2" fill="#ef4444" />

        {/* Arabic Calligraphic Letter 'ن' at Lower Center with Nuqta (نِصاب) */}
        <circle cx="50" cy="88" r="1.6" fill="#fde047" />
      </svg>
    </div>
  );
}

export function NisabBrand({
  compact = false,
  showTagline = true,
  className = "",
}: NisabLogoProps) {
  return (
    <Link
      to="/"
      className={`group inline-flex items-center gap-3 transition-opacity hover:opacity-95 ${className}`}
      aria-label="منصة نِصاب - الرئيسية"
    >
      <NisabEmblem size={compact ? 38 : 46} />

      <div className="flex flex-col text-start">
        {/* Authentic Classical Arabic Typography with Diacritics */}
        <div className="flex items-center gap-2">
          <span
            className="font-[family-name:var(--font-calligraphy)] text-2xl sm:text-[1.75rem] font-bold leading-none tracking-tight text-foreground transition-colors group-hover:text-primary"
            style={{
              fontFeatureSettings: '"kern" 1, "liga" 1',
            }}
          >
            نِـصَـاب
          </span>

          <span className="hidden sm:inline-block rounded-md border border-primary/20 bg-primary/10 px-1.5 py-0.5 text-[0.65rem] font-semibold tracking-wider text-primary">
            NISAB
          </span>
        </div>

        {showTagline && (
          <span className="text-[0.68rem] sm:text-[0.72rem] leading-tight text-muted-foreground font-medium flex items-center gap-1.5 mt-0.5">
            <span className="text-primary font-semibold">حاسبة وموازين الزكاة</span>
            <span className="text-border">·</span>
            <span className="text-foreground/75 font-mono text-[0.62rem]">
              ذهب ٨٥جم | فضة ٥٩٥جم
            </span>
          </span>
        )}
      </div>
    </Link>
  );
}
