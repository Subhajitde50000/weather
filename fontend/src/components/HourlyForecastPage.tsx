import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  type AppTheme,
  type WeatherTheme,
  themeTextColors,
  getUi,
} from "@/data/weatherData";
import { getHourlyForecast, type DayForecast, type HourlyEntry } from "@/data/hourlyData";
import { WeatherIcon } from "./WeatherIcon";
import { Atmosphere } from "./Atmosphere";

interface HourlyForecastPageProps {
  theme: WeatherTheme;
  appTheme: AppTheme;
  city: string;
  unit: "C" | "F";
  isOpen: boolean;
  onClose: () => void;
}

function toF(c: number): number {
  return Math.round((c * 9) / 5 + 32);
}

// ---------- Temperature Chart (SVG) ----------
function TempChart({
  hours,
  theme,
  unit,
}: {
  hours: HourlyEntry[];
  theme: WeatherTheme;
  unit: "C" | "F";
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const temps = hours.map((h) => (unit === "F" ? toF(h.temp) : h.temp));
  const minT = Math.min(...temps) - 2;
  const maxT = Math.max(...temps) + 2;
  const range = maxT - minT || 1;

  // Chart dimensions
  const paddingLeft = 0;
  const paddingRight = 0;
  const paddingTop = 32;
  const paddingBottom = 36;
  const chartWidth = Math.max(hours.length * 52, 600);
  const chartHeight = 180;
  const plotW = chartWidth - paddingLeft - paddingRight;
  const plotH = chartHeight - paddingTop - paddingBottom;

  // Data points
  const points = temps.map((t, i) => ({
    x: paddingLeft + (i / (temps.length - 1)) * plotW,
    y: paddingTop + (1 - (t - minT) / range) * plotH,
    temp: t,
    hour: hours[i],
  }));

  // Smooth curve path using cardinal spline
  const pathD = useMemo(() => {
    if (points.length < 2) return "";

    const tension = 0.3;
    let d = `M ${points[0].x},${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[Math.max(i - 1, 0)];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[Math.min(i + 2, points.length - 1)];

      const cp1x = p1.x + ((p2.x - p0.x) * tension);
      const cp1y = p1.y + ((p2.y - p0.y) * tension);
      const cp2x = p2.x - ((p3.x - p1.x) * tension);
      const cp2y = p2.y - ((p3.y - p1.y) * tension);

      d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
    }

    return d;
  }, [points]);

  // Area fill path
  const areaD = useMemo(() => {
    if (!pathD) return "";
    return `${pathD} L ${points[points.length - 1].x},${chartHeight} L ${points[0].x},${chartHeight} Z`;
  }, [pathD, points, chartHeight]);

  // Rain bars
  const barWidth = 6;

  // Color based on theme
  const lineColor = theme === "haze" ? "#92400E" : "#FFFFFF";
  const lineOpacity = theme === "haze" ? 0.7 : 0.9;
  const areaFillOpacity = theme === "haze" ? 0.08 : 0.12;
  const dotColor = lineColor;
  const rainColor = theme === "haze" ? "#1E40AF" : "#93C5FD";
  const textFill = theme === "haze" ? "#78350F" : "#FFFFFF";
  const mutedFill = theme === "haze" ? "rgba(120,53,15,0.4)" : "rgba(255,255,255,0.4)";

  // "Now" index
  const nowIdx = hours.findIndex((h) => h.marker === "now");

  // Scroll to "Now" on mount
  useEffect(() => {
    if (containerRef.current && nowIdx > 0) {
      const scrollTo = Math.max(0, points[nowIdx].x - 80);
      containerRef.current.scrollLeft = scrollTo;
    }
  }, [nowIdx, points]);

  return (
    <div
      ref={containerRef}
      className="overflow-x-auto scrollbar-hide"
      style={{ scrollSnapType: "x proximity" }}
    >
      <svg
        width={chartWidth}
        height={chartHeight + 30}
        viewBox={`0 0 ${chartWidth} ${chartHeight + 30}`}
        className="block"
      >
        {/* Gradient fill definition */}
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={lineColor} stopOpacity={areaFillOpacity * 2} />
            <stop offset="100%" stopColor={lineColor} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={lineColor} stopOpacity={lineOpacity * 0.6} />
            <stop offset="30%" stopColor={lineColor} stopOpacity={lineOpacity} />
            <stop offset="70%" stopColor={lineColor} stopOpacity={lineOpacity} />
            <stop offset="100%" stopColor={lineColor} stopOpacity={lineOpacity * 0.6} />
          </linearGradient>
        </defs>

        {/* Area fill */}
        <path d={areaD} fill="url(#areaGrad)" />

        {/* Smooth line */}
        <path
          d={pathD}
          fill="none"
          stroke="url(#lineGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="chart-line-animate"
        />

        {/* Rain bars at bottom */}
        {hours.map((h, i) => {
          if (h.rainChance < 5) return null;
          const barH = Math.max(2, (h.rainChance / 100) * 20);
          const barX = points[i].x - barWidth / 2;
          const barY = chartHeight + 28 - barH;
          return (
            <rect
              key={`rain-${i}`}
              x={barX}
              y={barY}
              width={barWidth}
              height={barH}
              rx={3}
              fill={rainColor}
              opacity={0.35 + (h.rainChance / 100) * 0.35}
            />
          );
        })}

        {/* Data points + labels */}
        {points.map((p, i) => {
          const isNow = i === nowIdx;
          const showLabel = i % 2 === 0 || isNow || hours[i].marker === "sunrise" || hours[i].marker === "sunset";

          return (
            <g key={i}>
              {/* Dot */}
              <circle
                cx={p.x}
                cy={p.y}
                r={isNow ? 5 : 3}
                fill={isNow ? dotColor : dotColor}
                opacity={isNow ? 1 : 0.7}
              />
              {isNow && (
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={9}
                  fill="none"
                  stroke={dotColor}
                  strokeWidth="1.5"
                  opacity={0.3}
                >
                  <animate
                    attributeName="r"
                    values="7;12;7"
                    dur="2.5s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.3;0.1;0.3"
                    dur="2.5s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}

              {/* Temperature label above point */}
              {showLabel && (
                <text
                  x={p.x}
                  y={p.y - 12}
                  textAnchor="middle"
                  fill={textFill}
                  opacity={isNow ? 1 : 0.7}
                  fontSize="11"
                  fontWeight={isNow ? "500" : "300"}
                  fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
                >
                  {p.temp}°
                </text>
              )}

              {/* Time label below */}
              <text
                x={p.x}
                y={chartHeight + 6}
                textAnchor="middle"
                fill={isNow ? textFill : mutedFill}
                fontSize="10"
                fontWeight={isNow ? "500" : "300"}
                fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
              >
                {hours[i].time}
              </text>

              {/* Sunrise/Sunset markers */}
              {hours[i].marker === "sunrise" && (
                <text
                  x={p.x}
                  y={chartHeight + 18}
                  textAnchor="middle"
                  fontSize="10"
                  fill={mutedFill}
                >
                  🌅
                </text>
              )}
              {hours[i].marker === "sunset" && (
                <text
                  x={p.x}
                  y={chartHeight + 18}
                  textAnchor="middle"
                  fontSize="10"
                  fill={mutedFill}
                >
                  🌇
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ---------- Hourly Detail Row ----------
function HourRow({
  entry,
  unit,
  theme,
  index,
}: {
  entry: HourlyEntry;
  unit: "C" | "F";
  theme: WeatherTheme;
  index: number;
}) {
  const colors = themeTextColors[theme];
  const temp = unit === "F" ? toF(entry.temp) : entry.temp;
  const isNow = entry.marker === "now";
  const isMarker = entry.marker === "sunrise" || entry.marker === "sunset";

  return (
    <>
      {/* Sunrise/Sunset inline marker */}
      {isMarker && (
        <div
          className={`flex items-center gap-3 px-4 py-2`}
          style={{
            animation: `searchItemFadeIn 0.2s ease-out ${0.02 * index}s both`,
          }}
        >
          <span className="text-base">
            {entry.marker === "sunrise" ? "🌅" : "🌇"}
          </span>
          <span className={`text-xs font-light ${colors.muted}`}>
            {entry.marker === "sunrise" ? "Sunrise" : "Sunset"} · {entry.time}
          </span>
          <div className={`flex-1 h-px bg-white/10`} />
        </div>
      )}

      <div
        className={`
          flex items-center gap-4 px-4 py-3
          ${isNow ? "bg-white/8 rounded-xl mx-2" : ""}
          transition-colors
        `}
        style={{
          animation: `searchItemFadeIn 0.2s ease-out ${0.02 * index}s both`,
        }}
      >
        {/* Time */}
        <div className="w-14 flex-shrink-0">
          <span
            className={`text-sm ${
              isNow ? `font-medium ${colors.primary}` : `font-light ${colors.muted}`
            }`}
          >
            {entry.time}
          </span>
          {isNow && (
            <div className="flex items-center gap-1 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            </div>
          )}
        </div>

        {/* Night indicator for night hours */}
        {entry.icon === "night" && !isMarker && (
          <span className="text-[10px] opacity-40">🌙</span>
        )}

        {/* Icon */}
        <div className="w-8 flex-shrink-0 flex justify-center">
          <WeatherIcon type={entry.icon} size="sm" />
        </div>

        {/* Temperature */}
        <span
          className={`text-lg font-light ${colors.primary} w-12 text-right flex-shrink-0`}
        >
          {temp}°
        </span>

        {/* Rain */}
        <div className="flex items-center gap-1 w-14 flex-shrink-0">
          <span className="text-xs opacity-50">☔</span>
          <span className={`text-xs font-light ${colors.muted}`}>
            {entry.rainChance}%
          </span>
        </div>

        {/* Wind */}
        <div className="flex items-center gap-1 flex-shrink-0 ml-auto">
          <span className="text-xs opacity-50">🌬️</span>
          <span className={`text-xs font-light ${colors.muted}`}>
            {entry.windSpeed} km/h
          </span>
        </div>
      </div>
    </>
  );
}

// ---------- Main Page Component ----------
export function HourlyForecastPage({
  theme,
  appTheme,
  city,
  unit,
  isOpen,
  onClose,
}: HourlyForecastPageProps) {
  const [selectedDay, setSelectedDay] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const [forecast, setForecast] = useState<DayForecast[]>([]);

  const colors = themeTextColors[theme];
  const ui = getUi(appTheme);
  const cardBg = ui.card;

  // Load forecast data
  useEffect(() => {
    if (isOpen) {
      setSelectedDay(0);
      setIsClosing(false);
      setForecast(getHourlyForecast(city));
    }
  }, [isOpen, city]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200);
  }, [onClose]);

  // Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, handleClose]);

  const currentDay = forecast[selectedDay];

  // Memoize the "umbrella needed" quick answer
  const umbrellaNeeded = useMemo(() => {
    if (!currentDay) return false;
    return currentDay.hours.some((h) => h.rainChance >= 40);
  }, [currentDay]);

  if (!isOpen || !currentDay) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col"
      style={{
        animation: isClosing
          ? "pageSlideOut 0.2s ease-in forwards"
          : "pageSlideIn 0.3s ease-out",
      }}
    >
      <Atmosphere theme={theme} appTheme="dark" />
      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
      <div className={`sticky top-0 z-20 backdrop-blur-xl ${ui.light ? "bg-white/30" : "bg-[#071410]/40"}`}>
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3 px-4 pt-4 pb-2">
            <button
              onClick={handleClose}
              className={`p-2 -ml-2 rounded-full transition-all hover:bg-white/10 active:bg-white/20 ${colors.primary}`}
              aria-label="Go back"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex flex-col">
              <span className={`text-base font-light ${colors.primary} tracking-wide`}>
                {city}
              </span>
              <span className={`text-xs font-light ${colors.muted}`}>
                {currentDay.label} · {currentDay.date}
              </span>
            </div>
          </div>

          {/* ========== Timeline Selector ========== */}
          <div className="flex items-center gap-2 px-4 pb-3 pt-1">
            {forecast.map((day, i) => (
              <button
                key={i}
                onClick={() => setSelectedDay(i)}
                className={`
                  px-4 py-1.5 rounded-full text-sm transition-all duration-200
                  ${
                    i === selectedDay
                      ? `bg-white/20 ${colors.primary} font-medium`
                      : `${colors.muted} font-light hover:bg-white/8`
                  }
                `}
              >
                {day.label}
              </button>
            ))}

            {/* Quick umbrella indicator */}
            {umbrellaNeeded && (
              <div
                className={`ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 text-xs ${colors.muted}`}
              >
                <span>☔</span>
                <span className="font-light">Carry umbrella</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom subtle line */}
        <div className="h-px bg-white/5" />
      </div>

      {/* ========== Scrollable Content ========== */}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        <div className="max-w-lg mx-auto pb-12">
          {/* ========== Chart Section ========== */}
          <div className="px-4 pt-4 pb-2">
            <div className={`${cardBg} rounded-2xl p-4 overflow-hidden`}>
              {/* Chart label */}
              <div className="flex items-center justify-between mb-3 px-1">
                <span className={`text-xs font-light ${colors.muted} uppercase tracking-widest`}>
                  Temperature
                </span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-0.5 rounded-full bg-white/60" />
                    <span className={`text-[10px] ${colors.muted}`}>Temp</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-2 rounded-sm bg-blue-300/40" />
                    <span className={`text-[10px] ${colors.muted}`}>Rain</span>
                  </div>
                </div>
              </div>

              <TempChart
                key={`${city}-${selectedDay}`}
                hours={currentDay.hours}
                theme={theme}
                unit={unit}
              />
            </div>
          </div>

          {/* ========== Sunrise/Sunset Strip ========== */}
          <div className="flex items-center justify-center gap-8 py-3 px-4">
            <div className="flex items-center gap-2">
              <span className="text-sm">🌅</span>
              <span className={`text-xs font-light ${colors.muted}`}>
                {currentDay.sunrise}
              </span>
            </div>
            <div className={`w-px h-3 bg-white/15`} />
            <div className="flex items-center gap-2">
              <span className="text-sm">🌇</span>
              <span className={`text-xs font-light ${colors.muted}`}>
                {currentDay.sunset}
              </span>
            </div>
          </div>

          {/* ========== Hourly Detail List ========== */}
          <div className="px-2 pt-2">
            {/* List header */}
            <div className="flex items-center gap-4 px-6 pb-2 mb-1">
              <span className={`text-[10px] font-light ${colors.muted} uppercase tracking-widest w-14`}>
                Time
              </span>
              <span className="w-8" />
              <span className="w-8" />
              <span className={`text-[10px] font-light ${colors.muted} uppercase tracking-widest w-12 text-right`}>
                Temp
              </span>
              <span className={`text-[10px] font-light ${colors.muted} uppercase tracking-widest w-14`}>
                Rain
              </span>
              <span className={`text-[10px] font-light ${colors.muted} uppercase tracking-widest ml-auto`}>
                Wind
              </span>
            </div>

            {/* Hour rows */}
            <div className="space-y-0">
              {currentDay.hours.map((entry, i) => (
                <HourRow
                  key={`${selectedDay}-${i}`}
                  entry={entry}
                  unit={unit}
                  theme={theme}
                  index={i}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
