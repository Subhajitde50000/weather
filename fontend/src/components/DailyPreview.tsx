import { getDailyForecast } from '@/data/dailyData';
import { type WeatherTheme, type AppTheme, getTextColors, getCardBg } from '@/data/weatherData';

interface Props {
  cityName: string;
  unit: 'C' | 'F';
  theme: WeatherTheme;
  appTheme: AppTheme;
  onTap: () => void;
}

export function DailyPreview({ cityName, unit, theme, appTheme, onTap }: Props) {
  const days = getDailyForecast(cityName, unit).slice(0, 5);
  const globalMin = Math.min(...days.map((d) => d.low));
  const globalMax = Math.max(...days.map((d) => d.high));
  const range = globalMax - globalMin || 1;
  const colors = getTextColors(theme, appTheme);
  const cardBg = getCardBg(theme, appTheme);

  const barColor =
    theme === 'rainy'
      ? 'from-blue-400 to-blue-300'
      : theme === 'night'
      ? 'from-indigo-400 to-purple-400'
      : theme === 'cloudy'
      ? 'from-slate-400 to-slate-300'
      : theme === 'haze'
      ? 'from-amber-400 to-orange-300'
      : 'from-amber-400 to-orange-400';

  return (
    <button
      onClick={onTap}
      className="w-full text-left px-5 group"
    >
      <div className={`rounded-2xl ${cardBg} p-4 transition-colors`}>
        {/* Title row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs opacity-40">📅</span>
            <span className={`text-xs font-medium uppercase tracking-wider ${colors.muted}`}>
              10-Day Forecast
            </span>
          </div>
          <span className={`text-xs ${colors.muted} group-hover:opacity-80 transition-opacity`}>
            Details →
          </span>
        </div>

        {/* Preview rows */}
        <div className="flex flex-col gap-2">
          {days.map((day, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span className={`w-12 text-xs ${day.isToday ? `font-bold ${colors.primary}` : colors.muted}`}>
                {day.day}
              </span>
              <span className="w-6 text-center text-sm">{day.icon}</span>
              <span className={`text-xs ${colors.muted} w-6 text-right`}>{day.low}°</span>
              <div className={`flex-1 h-1 rounded-full ${appTheme === 'light' ? 'bg-black/8' : 'bg-white/10'} mx-1`}>
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${barColor}`}
                  style={{
                    marginLeft: `${((day.low - globalMin) / range) * 100}%`,
                    width: `${Math.max(((day.high - day.low) / range) * 100, 5)}%`,
                  }}
                />
              </div>
              <span className={`text-xs font-medium ${colors.primary} w-6 text-left`}>{day.high}°</span>
            </div>
          ))}
        </div>
      </div>
    </button>
  );
}
