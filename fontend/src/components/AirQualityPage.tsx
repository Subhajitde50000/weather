import { useState, useEffect, useCallback, useMemo } from "react";
import {
  type WeatherTheme,
  themeTextColors,
  themeGradients,
} from "@/data/weatherData";
import { getAqiDetails, type AqiDetail, type Pollutant } from "@/data/aqiData";

interface AirQualityPageProps {
  theme: WeatherTheme;
  city: string;
  isOpen: boolean;
  onClose: () => void;
}

// --------- AQI Ring Gauge ---------
function AqiRing({ aqi, color }: { aqi: number; color: string }) {
  const radius = 82;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  // Map AQI 0-500 to ring fill (0-100%)
  const fillPercent = Math.min((aqi / 500) * 100, 100);
  const dashOffset = circumference * (1 - fillPercent / 100);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="200" height="200" viewBox="0 0 200 200" className="transform -rotate-90">
        {/* Background track */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Colored arc */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className="aqi-ring-animate"
          style={{
            filter: `drop-shadow(0 0 8px ${color}40)`,
          }}
        />
        {/* Glow overlay on the arc */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth + 6}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          opacity={0.1}
          className="aqi-ring-animate"
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xs font-light opacity-40 uppercase tracking-widest mb-1">
          AQI
        </span>
        <span
          className="font-extralight leading-none"
          style={{ fontSize: "4.5rem", color }}
        >
          {aqi}
        </span>
      </div>
    </div>
  );
}

// --------- Pollutant Row ---------
function PollutantRow({
  pollutant,
  index,
  theme,
}: {
  pollutant: Pollutant;
  index: number;
  theme: WeatherTheme;
}) {
  const colors = themeTextColors[theme];

  return (
    <div
      className="flex items-center gap-3 py-3.5"
      style={{
        animation: `aqiRowFadeIn 0.3s ease-out ${0.08 + index * 0.06}s both`,
      }}
    >
      {/* Pollutant name */}
      <div className="w-16 flex-shrink-0">
        <span className={`text-sm font-medium ${colors.primary}`}>
          {pollutant.formula}
        </span>
      </div>

      {/* Value */}
      <div className="w-20 flex-shrink-0 text-right">
        <span className={`text-sm font-light ${colors.secondary}`}>
          {pollutant.value}
        </span>
        <span className={`text-[10px] font-light ${colors.muted} ml-1`}>
          {pollutant.unit}
        </span>
      </div>

      {/* Status bar */}
      <div className="flex-1 min-w-0">
        <div className="w-full h-2 rounded-full bg-white/8 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${Math.max(pollutant.percent, 3)}%`,
              backgroundColor: pollutant.color,
              animation: `aqiBarGrow 0.8s ease-out ${0.2 + index * 0.08}s both`,
            }}
          />
        </div>
      </div>

      {/* Status dot + text */}
      <div className="flex items-center gap-1.5 w-20 flex-shrink-0 justify-end">
        <div
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: pollutant.color }}
        />
        <span
          className="text-[11px] font-light truncate"
          style={{ color: pollutant.color }}
        >
          {pollutant.status.replace(" (Sensitive)", "")}
        </span>
      </div>
    </div>
  );
}

// --------- Main Page Component ---------
export function AirQualityPage({
  theme,
  city,
  isOpen,
  onClose,
}: AirQualityPageProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [data, setData] = useState<AqiDetail | null>(null);

  const colors = themeTextColors[theme];
  const gradient = themeGradients[theme];

  // Load data
  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      setData(getAqiDetails(city));
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

  // Health icon based on AQI severity
  const healthIcon = useMemo(() => {
    if (!data) return "✅";
    if (data.aqi <= 50) return "✅";
    if (data.aqi <= 100) return "ℹ️";
    if (data.aqi <= 150) return "⚠️";
    if (data.aqi <= 200) return "⚠️";
    if (data.aqi <= 300) return "🚨";
    return "🚨";
  }, [data]);

  // Trend color
  const trendColor = useMemo(() => {
    if (!data) return "";
    if (data.trend === "Improving") return "#22C55E";
    if (data.trend === "Worsening") return "#EF4444";
    return "#94A3B8";
  }, [data]);

  if (!isOpen || !data) return null;

  return (
    <div
      className={`fixed inset-0 z-[200] bg-gradient-to-b ${gradient} flex flex-col`}
      style={{
        animation: isClosing
          ? "pageSlideOut 0.2s ease-in forwards"
          : "pageSlideIn 0.3s ease-out",
      }}
    >
      {/* ========== Sticky Header ========== */}
      <div className="sticky top-0 z-20 backdrop-blur-xl bg-black/5">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3 px-4 pt-4 pb-3">
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
                Air Quality
              </span>
            </div>
          </div>
        </div>
        <div className="h-px bg-white/5" />
      </div>

      {/* ========== Scrollable Content ========== */}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        <div className="max-w-lg mx-auto pb-12">

          {/* ========== AQI Hero Score ========== */}
          <div
            className="flex flex-col items-center pt-8 pb-6 px-4"
            style={{ animation: "aqiHeroFadeIn 0.5s ease-out" }}
          >
            <AqiRing aqi={data.aqi} color={data.color} />

            {/* Status label */}
            <div
              className="mt-4 px-5 py-2 rounded-full text-sm font-medium tracking-wide"
              style={{
                backgroundColor: `${data.color}20`,
                color: data.color,
                border: `1px solid ${data.color}30`,
              }}
            >
              {data.status}
            </div>

            {/* AQI Scale reference - text labels for accessibility */}
            <div className="flex items-center gap-1 mt-5 px-2">
              {[
                { label: "Good", color: "#22C55E", max: 50 },
                { label: "Moderate", color: "#EAB308", max: 100 },
                { label: "Sensitive", color: "#F97316", max: 150 },
                { label: "Unhealthy", color: "#EF4444", max: 200 },
                { label: "V. Unhealthy", color: "#A855F7", max: 300 },
                { label: "Hazardous", color: "#991B1B", max: 500 },
              ].map((level, i) => (
                <div key={i} className="flex flex-col items-center flex-1">
                  <div
                    className="w-full h-1.5 rounded-full"
                    style={{
                      backgroundColor: level.color,
                      opacity: data.aqi > (i === 0 ? 0 : [0, 50, 100, 150, 200, 300][i]) ? 1 : 0.25,
                    }}
                  />
                  <span
                    className="text-[8px] mt-1 font-light text-center leading-tight"
                    style={{
                      color: data.aqi > (i === 0 ? 0 : [0, 50, 100, 150, 200, 300][i])
                        ? level.color
                        : "rgba(255,255,255,0.25)",
                    }}
                  >
                    {level.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ========== Health Status & Advice ========== */}
          <div
            className="px-4 mb-4"
            style={{ animation: "aqiRowFadeIn 0.4s ease-out 0.15s both" }}
          >
            <div className="bg-white/8 backdrop-blur-md rounded-2xl p-4 border border-white/5">
              <div className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0 mt-0.5">{healthIcon}</span>
                <div className="flex flex-col gap-1.5">
                  <p className={`text-sm font-light ${colors.primary} leading-relaxed`}>
                    {data.healthMessage}
                  </p>
                  <p className={`text-xs font-light ${colors.muted}`}>
                    Affects: {data.targetGroup}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ========== Pollutant Breakdown ========== */}
          <div
            className="px-4 mb-4"
            style={{ animation: "aqiRowFadeIn 0.4s ease-out 0.2s both" }}
          >
            <div className="bg-white/8 backdrop-blur-md rounded-2xl p-5 border border-white/5">
              {/* Section header */}
              <div className="flex items-center justify-between mb-4">
                <span className={`text-xs font-light ${colors.muted} uppercase tracking-widest`}>
                  Pollutants
                </span>
                <span className={`text-[10px] font-light ${colors.muted}`}>
                  Sorted by severity
                </span>
              </div>

              {/* Pollutant rows */}
              <div className="divide-y divide-white/5">
                {data.pollutants.map((pollutant, i) => (
                  <PollutantRow
                    key={pollutant.name}
                    pollutant={pollutant}
                    index={i}
                    theme={theme}
                  />
                ))}
              </div>

              {/* Dominant pollutant callout */}
              {data.pollutants.length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: data.pollutants[0].color }}
                    />
                    <span className={`text-xs font-light ${colors.muted}`}>
                      Primary pollutant:
                    </span>
                    <span
                      className="text-xs font-medium"
                      style={{ color: data.pollutants[0].color }}
                    >
                      {data.pollutants[0].formula}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ========== Trend & Update Info ========== */}
          <div
            className="px-4 mb-4"
            style={{ animation: "aqiRowFadeIn 0.4s ease-out 0.35s both" }}
          >
            <div className="bg-white/8 backdrop-blur-md rounded-2xl p-5 border border-white/5">
              <div className="flex items-center justify-between">
                {/* Trend */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium"
                    style={{
                      backgroundColor: `${trendColor}18`,
                      color: trendColor,
                    }}
                  >
                    {data.trendArrow}
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-sm font-light ${colors.primary}`}>
                      {data.trend}
                    </span>
                    <span className={`text-xs font-light ${colors.muted}`}>
                      Trend
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div className="w-px h-8 bg-white/8" />

                {/* Last updated */}
                <div className="flex flex-col items-end">
                  <span className={`text-sm font-light ${colors.primary}`}>
                    {data.lastUpdated}
                  </span>
                  <span className={`text-xs font-light ${colors.muted}`}>
                    Last updated
                  </span>
                </div>
              </div>

              {/* Data source */}
              <div className="mt-3 pt-3 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-light ${colors.muted}`}>
                    Data source
                  </span>
                  <span className={`text-[11px] font-light ${colors.secondary}`}>
                    {data.source}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ========== AQI Scale Legend ========== */}
          <div
            className="px-4 mb-6"
            style={{ animation: "aqiRowFadeIn 0.4s ease-out 0.45s both" }}
          >
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/5">
              <span className={`text-xs font-light ${colors.muted} uppercase tracking-widest`}>
                AQI Scale Reference
              </span>
              <div className="mt-3 space-y-2">
                {[
                  { range: "0 – 50", label: "Good", color: "#22C55E", desc: "Minimal impact" },
                  { range: "51 – 100", label: "Moderate", color: "#EAB308", desc: "Acceptable quality" },
                  { range: "101 – 150", label: "Unhealthy for Sensitive Groups", color: "#F97316", desc: "Risk for sensitive people" },
                  { range: "151 – 200", label: "Unhealthy", color: "#EF4444", desc: "Health effects for everyone" },
                  { range: "201 – 300", label: "Very Unhealthy", color: "#A855F7", desc: "Serious health effects" },
                  { range: "301+", label: "Hazardous", color: "#991B1B", desc: "Emergency conditions" },
                ].map((level, i) => {
                  // Highlight the current level
                  const isActive =
                    (data.aqi <= 50 && i === 0) ||
                    (data.aqi > 50 && data.aqi <= 100 && i === 1) ||
                    (data.aqi > 100 && data.aqi <= 150 && i === 2) ||
                    (data.aqi > 150 && data.aqi <= 200 && i === 3) ||
                    (data.aqi > 200 && data.aqi <= 300 && i === 4) ||
                    (data.aqi > 300 && i === 5);

                  return (
                    <div
                      key={i}
                      className={`flex items-center gap-3 py-1.5 px-2 rounded-lg transition-colors ${
                        isActive ? "bg-white/8" : ""
                      }`}
                    >
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor: level.color,
                          opacity: isActive ? 1 : 0.4,
                        }}
                      />
                      <span
                        className={`text-xs w-16 flex-shrink-0 ${
                          isActive ? "font-medium" : "font-light"
                        }`}
                        style={{ color: isActive ? level.color : "rgba(255,255,255,0.4)" }}
                      >
                        {level.range}
                      </span>
                      <span
                        className={`text-xs flex-1 ${
                          isActive ? colors.primary : colors.muted
                        } font-light`}
                      >
                        {level.label}
                      </span>
                      {isActive && (
                        <span className="text-[10px] font-light opacity-50">
                          ← Current
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center px-4 pb-4">
            <p className={`text-[10px] uppercase tracking-widest ${colors.muted} opacity-40`}>
              Air quality data is simulated for demonstration
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
