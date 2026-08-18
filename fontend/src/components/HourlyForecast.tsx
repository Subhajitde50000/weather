import { type AppTheme, type WeatherTheme, getUi } from "@/data/weatherData";
import { WeatherIcon } from "./WeatherIcon";

interface HourlyForecastProps {
  hourly: { time: string; temp: number; icon: string }[];
  theme: WeatherTheme;
  appTheme: AppTheme;
  onTap?: () => void;
}

export function HourlyForecast({ hourly, theme: _theme, appTheme, onTap }: HourlyForecastProps) {
  const ui = getUi(appTheme);
  void _theme;

  return (
    <div
      className={`${ui.card} rounded-[1.6rem] p-4 ${onTap ? "cursor-pointer transition-transform active:scale-[0.99]" : ""}`}
      onClick={onTap}
    >
      <div className="mb-3 flex items-center justify-between px-1">
        <span className={`text-[11px] uppercase tracking-[0.22em] ${ui.faint}`}>Hourly</span>
        {onTap && (
          <span className={`flex items-center gap-1 text-xs ${ui.muted}`}>
            Next 24h
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </span>
        )}
      </div>
      <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-hide" style={{ scrollSnapType: "x mandatory" }}>
        {hourly.map((hour, i) => (
          <div
            key={`${hour.time}-${i}`}
            className="flex min-w-[56px] flex-shrink-0 flex-col items-center gap-2"
            style={{ scrollSnapAlign: "start" }}
          >
            <span className={`text-xs font-light ${i === 0 ? ui.text : ui.muted}`}>{hour.time}</span>
            <WeatherIcon type={hour.icon} size="sm" />
            <span className={`text-sm ${ui.text}`}>{hour.temp}°</span>
          </div>
        ))}
      </div>
    </div>
  );
}
