import { useState, useEffect, useCallback } from 'react';
import { getDailyForecast, getDailyStats, type DailyEntry } from '../data/dailyData';

interface Props {
  cityName: string;
  unit: 'C' | 'F';
  theme: string;
  onClose: () => void;
}

// Temperature range bar component
function TempRangeBar({
  high,
  low,
  globalMin,
  globalMax,
  theme,
}: {
  high: number;
  low: number;
  globalMin: number;
  globalMax: number;
  theme: string;
}) {
  const range = globalMax - globalMin || 1;
  const leftPercent = ((low - globalMin) / range) * 100;
  const widthPercent = ((high - low) / range) * 100;

  const gradientColor =
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
    <div className="relative h-1.5 w-full rounded-full bg-white/10">
      <div
        className={`absolute h-full rounded-full bg-gradient-to-r ${gradientColor}`}
        style={{
          left: `${leftPercent}%`,
          width: `${Math.max(widthPercent, 4)}%`,
        }}
      />
    </div>
  );
}

// Expanded detail row
function ExpandedDetail({
  entry,
  unit,
}: {
  entry: DailyEntry;
  unit: 'C' | 'F';
}) {
  return (
    <div className="overflow-hidden animate-slideDown">
      <div className="px-4 pb-4 pt-1 grid grid-cols-3 gap-3">
        <div className="flex flex-col items-center gap-1 rounded-xl bg-white/5 py-3">
          <span className="text-xs opacity-50">🌬️ Wind</span>
          <span className="text-sm font-medium">
            {entry.wind} {unit === 'F' ? 'mph' : 'km/h'}
          </span>
        </div>
        <div className="flex flex-col items-center gap-1 rounded-xl bg-white/5 py-3">
          <span className="text-xs opacity-50">💧 Humidity</span>
          <span className="text-sm font-medium">{entry.humidity}%</span>
        </div>
        <div className="flex flex-col items-center gap-1 rounded-xl bg-white/5 py-3">
          <span className="text-xs opacity-50">☔ Rain</span>
          <span className="text-sm font-medium">{entry.rainPercent}%</span>
        </div>
        <div className="col-span-3 flex justify-center gap-8 pt-1">
          <div className="flex items-center gap-2 text-xs opacity-60">
            <span>🌅</span>
            <span>{entry.sunrise}</span>
          </div>
          <div className="flex items-center gap-2 text-xs opacity-60">
            <span>🌇</span>
            <span>{entry.sunset}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DailyForecastPage({ cityName, unit, theme, onClose }: Props) {
  const [days, setDays] = useState<DailyEntry[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    setDays(getDailyForecast(cityName, unit));
  }, [cityName, unit]);

  const stats = days.length ? getDailyStats(days) : null;
  const globalMin = days.length ? Math.min(...days.map((d) => d.low)) : 0;
  const globalMax = days.length ? Math.max(...days.map((d) => d.high)) : 0;

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(onClose, 280);
  }, [onClose]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleClose]);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  // Background gradients matching theme
  const bgGradient =
    theme === 'clear'
      ? 'from-sky-500 via-blue-500 to-indigo-600'
      : theme === 'rainy'
      ? 'from-slate-600 via-slate-700 to-gray-800'
      : theme === 'night'
      ? 'from-indigo-900 via-slate-900 to-gray-950'
      : theme === 'cloudy'
      ? 'from-slate-500 via-gray-500 to-slate-600'
      : theme === 'haze'
      ? 'from-amber-700 via-orange-800 to-yellow-900'
      : 'from-sky-500 via-blue-500 to-indigo-600';

  const unitSymbol = unit === 'F' ? '°F' : '°C';

  return (
    <div
      className={`fixed inset-0 z-50 bg-gradient-to-br ${bgGradient} text-white overflow-hidden ${
        isClosing ? 'animate-pageSlideOut' : 'animate-pageSlideIn'
      }`}
    >
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 backdrop-blur-xl bg-black/10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={handleClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
            aria-label="Go back"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M13 4L7 10L13 16" />
            </svg>
          </button>
          <div className="flex flex-col">
            <span className="text-base font-medium leading-tight">{cityName}</span>
            <span className="text-xs opacity-50">10-Day Forecast</span>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="overflow-y-auto h-[calc(100vh-56px)] pb-12">
        <div className="max-w-lg mx-auto px-4">
          {/* Overview Strip */}
          {stats && (
            <div
              className="mt-4 mb-2 flex items-center justify-between rounded-2xl bg-white/[0.08] backdrop-blur-md px-5 py-3.5"
              style={{ animationDelay: '0.05s' }}
            >
              <div className="flex items-center gap-2">
                <span className="text-orange-300 text-sm">↑</span>
                <div className="flex flex-col">
                  <span className="text-xs opacity-40 leading-none">Avg High</span>
                  <span className="text-sm font-semibold">
                    {stats.avgHigh}°
                  </span>
                </div>
              </div>
              <div className="w-px h-6 bg-white/10" />
              <div className="flex items-center gap-2">
                <span className="text-blue-300 text-sm">↓</span>
                <div className="flex flex-col">
                  <span className="text-xs opacity-40 leading-none">Avg Low</span>
                  <span className="text-sm font-semibold">
                    {stats.avgLow}°
                  </span>
                </div>
              </div>
              <div className="w-px h-6 bg-white/10" />
              <div className="flex items-center gap-2">
                <span className="text-blue-300 text-sm">☔</span>
                <div className="flex flex-col">
                  <span className="text-xs opacity-40 leading-none">Rainy</span>
                  <span className="text-sm font-semibold">
                    {stats.rainyDays} day{stats.rainyDays !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Column headers */}
          <div className="flex items-center px-2 pt-4 pb-1.5 text-[10px] uppercase tracking-widest opacity-30">
            <span className="w-[72px]">Day</span>
            <span className="w-8" />
            <span className="flex-1 text-center">Temp Range</span>
            <span className="w-10 text-right">Rain</span>
          </div>

          {/* Daily Forecast List */}
          <div className="flex flex-col">
            {days.map((entry, i) => (
              <div
                key={i}
                className="animate-dailyRowFadeIn"
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                <button
                  onClick={() => toggleExpand(i)}
                  className={`w-full flex items-center gap-2 px-2 py-3.5 rounded-xl transition-colors ${
                    entry.isToday
                      ? 'bg-white/[0.1]'
                      : expandedIndex === i
                      ? 'bg-white/[0.06]'
                      : 'hover:bg-white/[0.04]'
                  }`}
                >
                  {/* Day + Date */}
                  <div className="w-[72px] flex flex-col items-start shrink-0">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-sm ${
                          entry.isToday ? 'font-bold' : 'font-medium'
                        }`}
                      >
                        {entry.day}
                      </span>
                      {entry.isToday && (
                        <span className="text-[9px] bg-white/20 text-white px-1.5 py-0.5 rounded-full font-medium">
                          NOW
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] opacity-40">{entry.shortDate}</span>
                  </div>

                  {/* Icon */}
                  <div className="w-8 text-center text-lg shrink-0">{entry.icon}</div>

                  {/* Condition (hidden on small screens) */}
                  <span className="hidden sm:block text-xs opacity-50 w-24 text-left truncate">
                    {entry.condition}
                  </span>

                  {/* Low temp */}
                  <span className="text-xs opacity-40 w-8 text-right shrink-0">
                    {entry.low}°
                  </span>

                  {/* Temperature Range Bar */}
                  <div className="flex-1 px-2 min-w-0">
                    <TempRangeBar
                      high={entry.high}
                      low={entry.low}
                      globalMin={globalMin}
                      globalMax={globalMax}
                      theme={theme}
                    />
                  </div>

                  {/* High temp */}
                  <span className="text-sm font-semibold w-8 text-left shrink-0">
                    {entry.high}°
                  </span>

                  {/* Rain */}
                  <div className="w-10 flex items-center justify-end gap-0.5 shrink-0">
                    {entry.rainPercent >= 20 && (
                      <>
                        <span className="text-[10px] text-blue-300">☔</span>
                        <span className="text-xs text-blue-200/70">
                          {entry.rainPercent}%
                        </span>
                      </>
                    )}
                  </div>

                  {/* Expand indicator */}
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    className={`opacity-20 transition-transform shrink-0 ${
                      expandedIndex === i ? 'rotate-180' : ''
                    }`}
                  >
                    <path d="M3 4.5L6 7.5L9 4.5" />
                  </svg>
                </button>

                {/* Expanded Detail */}
                {expandedIndex === i && (
                  <ExpandedDetail entry={entry} unit={unit} />
                )}

                {/* Subtle separator */}
                {i < days.length - 1 && expandedIndex !== i && (
                  <div className="mx-4 border-b border-white/[0.05]" />
                )}
              </div>
            ))}
          </div>

          {/* Footer note */}
          <div className="mt-6 mb-4 text-center">
            <p className="text-[10px] uppercase tracking-widest opacity-20">
              {unitSymbol} · Forecast data is simulated
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
