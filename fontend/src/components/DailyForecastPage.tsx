import { useCallback, useEffect, useState } from "react";
import { getDailyForecast, getDailyStats, type DailyEntry } from "@/data/dailyData";
import { type AppTheme, type WeatherTheme, getUi } from "@/data/weatherData";
import { Atmosphere } from "./Atmosphere";

interface Props {
  cityName: string;
  unit: "C" | "F";
  theme: WeatherTheme;
  appTheme: AppTheme;
  onClose: () => void;
}

function ExpandedDetail({ entry }: { entry: DailyEntry }) {
  const items = [
    { label: "Wind", value: `${entry.wind} km/h` },
    { label: "Humidity", value: `${entry.humidity}%` },
    { label: "Rain", value: `${entry.rainPercent}%` },
  ];
  return (
    <div className="animate-slideDown overflow-hidden">
      <div className="grid grid-cols-3 gap-3 px-2 pt-1 pb-4">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col items-center gap-1 rounded-xl bg-white/5 py-3">
            <span className="text-xs opacity-50">{item.label}</span>
            <span className="text-sm font-medium">{item.value}</span>
          </div>
        ))}
        <div className="col-span-3 flex justify-center gap-8 pt-1 text-xs opacity-60">
          <span>Sunrise {entry.sunrise}</span>
          <span>Sunset {entry.sunset}</span>
        </div>
      </div>
    </div>
  );
}

export default function DailyForecastPage({ cityName, unit, theme, appTheme, onClose }: Props) {
  const [days, setDays] = useState<DailyEntry[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const ui = getUi(appTheme);

  useEffect(() => {
    setDays(getDailyForecast(cityName, unit));
  }, [cityName, unit]);

  const stats = days.length ? getDailyStats(days) : null;
  const globalMin = days.length ? Math.min(...days.map((d) => d.low)) : 0;
  const globalMax = days.length ? Math.max(...days.map((d) => d.high)) : 0;
  const range = globalMax - globalMin || 1;

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(onClose, 280);
  }, [onClose]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleClose]);

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden ${isClosing ? "animate-pageSlideOut" : "animate-pageSlideIn"}`}
    >
      <Atmosphere theme={theme} appTheme={appTheme} />
      <div className="relative z-10 h-full">
        <div className={`sticky top-0 z-20 backdrop-blur-xl ${ui.light ? "bg-white/30" : "bg-[#071410]/40"}`}>
          <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
            <button onClick={handleClose} className={`flex h-10 w-10 items-center justify-center rounded-full ${ui.invertBtn}`} aria-label="Go back">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 4L7 10L13 16" />
              </svg>
            </button>
            <div>
              <p className={`text-base ${ui.text}`}>{cityName}</p>
              <p className={`text-xs ${ui.muted}`}>10-day forecast</p>
            </div>
          </div>
        </div>

        <div className="h-[calc(100vh-56px)] overflow-y-auto pb-12">
          <div className="mx-auto max-w-3xl px-4">
            {stats && (
              <div className={`${ui.card} mt-4 mb-3 flex items-center justify-between rounded-[1.4rem] px-5 py-3.5`}>
                <div>
                  <p className={`text-[10px] uppercase tracking-[0.16em] ${ui.faint}`}>Avg high</p>
                  <p className={`text-sm font-medium ${ui.text}`}>{stats.avgHigh}°</p>
                </div>
                <div>
                  <p className={`text-[10px] uppercase tracking-[0.16em] ${ui.faint}`}>Avg low</p>
                  <p className={`text-sm font-medium ${ui.text}`}>{stats.avgLow}°</p>
                </div>
                <div>
                  <p className={`text-[10px] uppercase tracking-[0.16em] ${ui.faint}`}>Rainy</p>
                  <p className={`text-sm font-medium ${ui.text}`}>{stats.rainyDays} days</p>
                </div>
              </div>
            )}

            <div className={`${ui.card} rounded-[1.5rem] p-2`}>
              {days.map((entry, i) => (
                <div key={entry.date} className="animate-dailyRowFadeIn" style={{ animationDelay: `${i * 0.04}s` }}>
                  <button
                    onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
                    className={`flex w-full items-center gap-2 rounded-xl px-2 py-3.5 ${entry.isToday ? (ui.light ? "bg-black/5" : "bg-white/8") : ""}`}
                  >
                    <div className="w-[72px] shrink-0 text-left">
                      <p className={`text-sm ${entry.isToday ? "font-semibold" : "font-medium"} ${ui.text}`}>{entry.day}</p>
                      <p className={`text-[10px] ${ui.faint}`}>{entry.shortDate}</p>
                    </div>
                    <div className="w-8 text-center text-lg">{entry.icon}</div>
                    <span className={`w-8 text-right text-xs ${ui.muted}`}>{entry.low}°</span>
                    <div className={`mx-1 h-1.5 min-w-0 flex-1 rounded-full ${ui.light ? "bg-black/8" : "bg-white/10"}`}>
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#3dd68c] to-[#e3c15a]"
                        style={{
                          marginLeft: `${((entry.low - globalMin) / range) * 100}%`,
                          width: `${Math.max(((entry.high - entry.low) / range) * 100, 6)}%`,
                        }}
                      />
                    </div>
                    <span className={`w-8 text-left text-sm font-semibold ${ui.text}`}>{entry.high}°</span>
                    <span className="w-10 text-right text-xs text-[#8ec8ff]">{entry.rainPercent >= 20 ? `${entry.rainPercent}%` : ""}</span>
                  </button>
                  {expandedIndex === i && <ExpandedDetail entry={entry} />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
