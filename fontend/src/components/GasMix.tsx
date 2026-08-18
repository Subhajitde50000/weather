import { type AppTheme, type GasMix as GasMixData, getUi } from "@/data/weatherData";

interface GasMixProps {
  gases: GasMixData;
  appTheme: AppTheme;
  onTap?: () => void;
}

const RINGS = [
  { key: "n2" as const, label: "Nitrogen", formula: "N₂", color: "#6eb5ff", max: 80 },
  { key: "o2" as const, label: "Oxygen", formula: "O₂", color: "#3dd68c", max: 22 },
  { key: "co2" as const, label: "Carbon dioxide", formula: "CO₂", color: "#e08a3a", max: 0.08 },
];

export function GasMixCard({ gases, appTheme, onTap }: GasMixProps) {
  const ui = getUi(appTheme);

  return (
    <button
      onClick={onTap}
      className={`w-full text-left ${ui.card} rounded-[1.6rem] p-5 transition-transform active:scale-[0.99]`}
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className={`text-[11px] uppercase tracking-[0.22em] ${ui.faint}`}>Atmosphere</p>
          <p className={`mt-1 text-sm ${ui.text}`}>Gas mix at street level</p>
        </div>
        <span className={`text-xs ${ui.muted} flex items-center gap-1`}>
          Details
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {RINGS.map((ring, i) => {
          const value = gases[ring.key];
          const pct = Math.min(value / ring.max, 1);
          const r = 28;
          const c = 2 * Math.PI * r;
          const offset = c * (1 - pct);
          return (
            <div key={ring.key} className={`flex flex-col items-center rounded-2xl px-2 py-3 ${ui.chip}`}>
              <svg width="76" height="76" viewBox="0 0 76 76" className="-rotate-90">
                <circle cx="38" cy="38" r={r} fill="none" stroke="currentColor" strokeWidth="6" className={ui.light ? "text-black/8" : "text-white/10"} />
                <circle
                  cx="38"
                  cy="38"
                  r={r}
                  fill="none"
                  stroke={ring.color}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={c}
                  strokeDashoffset={offset}
                  style={{
                    animation: `gasFill 1.1s ease-out ${0.1 + i * 0.12}s both`,
                    ["--gas-circ" as string]: `${c}`,
                    ["--gas-offset" as string]: `${offset}`,
                  }}
                />
              </svg>
              <span className="mt-1 font-display text-lg leading-none" style={{ color: ring.color }}>
                {ring.key === "co2" ? value.toFixed(3) : value.toFixed(2)}%
              </span>
              <span className={`mt-1 text-[11px] ${ui.muted}`}>{ring.formula}</span>
            </div>
          );
        })}
      </div>
    </button>
  );
}

export function GasMixDetail({ gases, appTheme }: { gases: GasMixData; appTheme: AppTheme }) {
  const ui = getUi(appTheme);
  const items = [
    { ...RINGS[0], value: gases.n2, note: "Inert bulk of the air column. Barely changes city to city." },
    { ...RINGS[1], value: gases.o2, note: "A touch lower where traffic and industry consume oxygen." },
    { ...RINGS[2], value: gases.co2, note: "Rises with vehicles, generators, and stagnant monsoon air." },
  ];

  return (
    <div className={`${ui.card} rounded-[1.6rem] p-5`}>
      <p className={`text-[11px] uppercase tracking-[0.22em] ${ui.faint}`}>Gas percentage</p>
      <div className="mt-4 space-y-4">
        {items.map((item) => {
          const width = item.key === "n2" ? 97 : item.key === "o2" ? 26 : 8;
          return (
            <div key={item.key}>
              <div className="mb-1.5 flex items-baseline justify-between">
                <span className={`text-sm ${ui.text}`}>
                  {item.formula} <span className={`${ui.muted} font-light`}>· {item.label}</span>
                </span>
                <span className="font-display text-lg" style={{ color: item.color }}>
                  {item.key === "co2" ? item.value.toFixed(3) : item.value.toFixed(2)}%
                </span>
              </div>
              <div className={`h-1.5 overflow-hidden rounded-full ${ui.light ? "bg-black/8" : "bg-white/8"}`}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${width}%`,
                    background: item.color,
                    animation: "aqiBarGrow 0.9s ease-out both",
                    ["--bar-width" as string]: `${width}%`,
                  }}
                />
              </div>
              <p className={`mt-1.5 text-[11px] leading-relaxed ${ui.faint}`}>{item.note}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
