import { type AppTheme, type WeatherTheme, getUi } from "@/data/weatherData";

interface AirQualityProps {
  aqi: number;
  status: string;
  theme: WeatherTheme;
  appTheme: AppTheme;
  onTap?: () => void;
}

function getAqiColor(aqi: number): string {
  if (aqi <= 50) return "#3dd68c";
  if (aqi <= 100) return "#e3c15a";
  if (aqi <= 150) return "#e08a3a";
  if (aqi <= 200) return "#e25b5b";
  return "#b06ad4";
}

export function AirQuality({ aqi, status, theme: _theme, appTheme, onTap }: AirQualityProps) {
  const ui = getUi(appTheme);
  void _theme;
  const aqiColor = getAqiColor(aqi);

  return (
    <div
      className={`${ui.card} rounded-[1.6rem] p-5 ${onTap ? "cursor-pointer transition-transform active:scale-[0.99]" : ""}`}
      onClick={onTap}
    >
      <div className="mb-3 flex items-start justify-between">
        <div>
          <span className={`text-[11px] uppercase tracking-[0.22em] ${ui.faint}`}>Air quality</span>
          <div className="mt-1 flex items-baseline gap-3">
            <span className="font-display text-4xl font-light" style={{ color: aqiColor }}>
              {aqi}
            </span>
            <span
              className="rounded-full px-2.5 py-0.5 text-xs font-medium"
              style={{ backgroundColor: `${aqiColor}22`, color: aqiColor }}
            >
              {status}
            </span>
          </div>
        </div>
        {onTap && <span className={`text-xs ${ui.muted}`}>View →</span>}
      </div>

      <div className={`h-1.5 w-full overflow-hidden rounded-full ${ui.light ? "bg-black/8" : "bg-white/10"}`}>
        <div
          className="h-full rounded-full"
          style={{
            width: `${Math.min((aqi / 300) * 100, 100)}%`,
            background: "linear-gradient(90deg, #3dd68c, #e3c15a, #e08a3a, #e25b5b)",
          }}
        />
      </div>
    </div>
  );
}
