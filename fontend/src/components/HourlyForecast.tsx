import { type WeatherTheme, type AppTheme, getTextColors, getCardBg } from "@/data/weatherData";
import { WeatherIcon } from "./WeatherIcon";

interface HourlyForecastProps {
  hourly: { time: string; temp: number; icon: string }[];
  theme: WeatherTheme;
  appTheme: AppTheme;
  onTap?: () => void;
}

export function HourlyForecast({ hourly, theme, appTheme, onTap }: HourlyForecastProps) {
  const colors = getTextColors(theme, appTheme);
  const cardBg = getCardBg(theme, appTheme);

  return (
    <div className="px-4 py-3">
      <div
        className={`${cardBg} rounded-2xl p-4 ${onTap ? "cursor-pointer active:scale-[0.99] transition-transform" : ""}`}
        onClick={onTap}
      >
        <div className="flex items-center justify-between mb-3 px-1">
          <span className={`text-xs font-light ${colors.muted} uppercase tracking-widest`}>
            Hourly
          </span>
          {onTap && (
            <span className={`text-xs font-light ${colors.muted} flex items-center gap-1`}>
              Details
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </span>
          )}
        </div>
        <div className="flex gap-5 overflow-x-auto scrollbar-hide pb-1" style={{ scrollSnapType: "x mandatory" }}>
          {hourly.map((hour, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-2 min-w-[56px] flex-shrink-0"
              style={{ scrollSnapAlign: "start" }}
            >
              <span className={`text-xs font-light ${i === 0 ? colors.primary : colors.muted}`}>
                {hour.time}
              </span>
              <WeatherIcon type={hour.icon} size="sm" />
              <span className={`text-sm font-light ${colors.primary}`}>
                {hour.temp}°
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
