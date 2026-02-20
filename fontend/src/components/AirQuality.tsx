import { type WeatherTheme, type AppTheme, getTextColors, getCardBg } from "@/data/weatherData";

interface AirQualityProps {
  aqi: number;
  status: string;
  theme: WeatherTheme;
  appTheme: AppTheme;
  onTap?: () => void;
}

function getAqiColor(aqi: number): string {
  if (aqi <= 50) return "#22C55E";
  if (aqi <= 100) return "#EAB308";
  if (aqi <= 150) return "#F97316";
  if (aqi <= 200) return "#EF4444";
  if (aqi <= 300) return "#A855F7";
  return "#991B1B";
}

function getAqiBarWidth(aqi: number): number {
  return Math.min((aqi / 300) * 100, 100);
}

export function AirQuality({ aqi, status, theme, appTheme, onTap }: AirQualityProps) {
  const colors = getTextColors(theme, appTheme);
  const cardBg = getCardBg(theme, appTheme);
  const aqiColor = getAqiColor(aqi);
  const isLight = appTheme === "light";

  return (
    <div className="px-4 py-3">
      <div
        className={`${cardBg} rounded-2xl p-5 ${onTap ? "cursor-pointer active:scale-[0.99] transition-transform" : ""}`}
        onClick={onTap}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex flex-col gap-1">
            <span className={`text-xs font-light ${colors.muted} uppercase tracking-widest`}>Air Quality</span>
            <div className="flex items-baseline gap-3">
              <span className={`text-4xl font-light ${colors.primary}`}>{aqi}</span>
              <span
                className="text-sm font-medium px-2.5 py-0.5 rounded-full"
                style={{ backgroundColor: aqiColor + "30", color: aqiColor }}
              >
                {status}
              </span>
            </div>
          </div>
          <span className="text-2xl">🌿</span>
        </div>

        {/* AQI bar */}
        <div className={`w-full h-1.5 rounded-full ${isLight ? "bg-black/8" : "bg-white/10"} overflow-hidden`}>
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${getAqiBarWidth(aqi)}%`,
              background: `linear-gradient(90deg, #22C55E, #EAB308, #F97316, #EF4444, #A855F7)`,
            }}
          />
        </div>

        <div className="flex justify-between mt-2">
          <div className="flex gap-1">
            {["Good", "Moderate", "Unhealthy"].map((label, i) => (
              <span key={i} className={`text-[10px] ${colors.muted}`}>{label}</span>
            ))}
          </div>
          {onTap && (
            <span className={`text-xs ${colors.secondary} hover:opacity-80 transition-opacity flex items-center gap-1`}>
              View details
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
