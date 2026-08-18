import { getDailyForecast } from "@/data/dailyData";
import { type AppTheme, type WeatherTheme, getUi } from "@/data/weatherData";

interface Props {
  cityName: string;
  unit: "C" | "F";
  theme: WeatherTheme;
  appTheme: AppTheme;
  onTap: () => void;
}

export function DailyPreview({ cityName, unit, theme: _theme, appTheme, onTap }: Props) {
  void _theme;
  const days = getDailyForecast(cityName, unit).slice(0, 5);
  const globalMin = Math.min(...days.map((d) => d.low));
  const globalMax = Math.max(...days.map((d) => d.high));
  const range = globalMax - globalMin || 1;
  const ui = getUi(appTheme);

  return (
    <button onClick={onTap} className="w-full text-left">
      <div className={`rounded-[1.6rem] ${ui.card} p-4 transition-transform active:scale-[0.99]`}>
        <div className="mb-3 flex items-center justify-between">
          <span className={`text-[11px] uppercase tracking-[0.22em] ${ui.faint}`}>10-day forecast</span>
          <span className={`text-xs ${ui.muted}`}>Details →</span>
        </div>
        <div className="flex flex-col gap-2.5">
          {days.map((day) => (
            <div key={day.date} className="flex items-center gap-2 text-sm">
              <span className={`w-12 text-xs ${day.isToday ? `font-medium ${ui.text}` : ui.muted}`}>
                {day.day}
              </span>
              <span className="w-6 text-center text-sm">{day.icon}</span>
              <span className={`w-6 text-right text-xs ${ui.muted}`}>{day.low}°</span>
              <div className={`mx-1 h-1.5 flex-1 rounded-full ${ui.light ? "bg-black/8" : "bg-white/10"}`}>
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#3dd68c] to-[#e3c15a]"
                  style={{
                    marginLeft: `${((day.low - globalMin) / range) * 100}%`,
                    width: `${Math.max(((day.high - day.low) / range) * 100, 8)}%`,
                  }}
                />
              </div>
              <span className={`w-6 text-left text-xs font-medium ${ui.text}`}>{day.high}°</span>
            </div>
          ))}
        </div>
      </div>
    </button>
  );
}
