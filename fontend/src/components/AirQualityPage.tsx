import { useCallback, useEffect, useMemo, useState } from "react";
import { type AppTheme, type WeatherTheme, citiesWeather, getUi } from "@/data/weatherData";
import { getAqiDetails, type AqiDetail, type Pollutant } from "@/data/aqiData";
import { Atmosphere } from "./Atmosphere";
import { GasMixDetail } from "./GasMix";

interface AirQualityPageProps {
  theme: WeatherTheme;
  appTheme: AppTheme;
  city: string;
  isOpen: boolean;
  onClose: () => void;
}

function AqiRing({ aqi, color }: { aqi: number; color: string }) {
  const radius = 82;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const fillPercent = Math.min((aqi / 500) * 100, 100);
  const dashOffset = circumference * (1 - fillPercent / 100);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="200" height="200" viewBox="0 0 200 200" className="-rotate-90 transform">
        <circle cx="100" cy="100" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={strokeWidth} />
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
          style={{ filter: `drop-shadow(0 0 8px ${color}40)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="mb-1 text-xs uppercase tracking-[0.2em] opacity-40">AQI</span>
        <span className="font-display leading-none font-light" style={{ fontSize: "4.2rem", color }}>
          {aqi}
        </span>
      </div>
    </div>
  );
}

function PollutantRow({ pollutant, index, appTheme }: { pollutant: Pollutant; index: number; appTheme: AppTheme }) {
  const ui = getUi(appTheme);
  return (
    <div className="flex items-center gap-3 py-3.5" style={{ animation: `aqiRowFadeIn 0.3s ease-out ${0.08 + index * 0.06}s both` }}>
      <div className="w-16 shrink-0">
        <span className={`text-sm font-medium ${ui.text}`}>{pollutant.formula}</span>
      </div>
      <div className="w-20 shrink-0 text-right">
        <span className={`text-sm ${ui.muted}`}>{pollutant.value}</span>
        <span className={`ml-1 text-[10px] ${ui.faint}`}>{pollutant.unit}</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className={`h-2 w-full overflow-hidden rounded-full ${ui.light ? "bg-black/8" : "bg-white/8"}`}>
          <div
            className="h-full rounded-full"
            style={{
              width: `${Math.max(pollutant.percent, 3)}%`,
              backgroundColor: pollutant.color,
              animation: `aqiBarGrow 0.8s ease-out ${0.2 + index * 0.08}s both`,
              ["--bar-width" as string]: `${Math.max(pollutant.percent, 3)}%`,
            }}
          />
        </div>
      </div>
      <div className="flex w-20 shrink-0 items-center justify-end gap-1.5">
        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: pollutant.color }} />
        <span className="truncate text-[11px]" style={{ color: pollutant.color }}>
          {pollutant.status.replace(" (Sensitive)", "")}
        </span>
      </div>
    </div>
  );
}

export function AirQualityPage({ theme, appTheme, city, isOpen, onClose }: AirQualityPageProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [data, setData] = useState<AqiDetail | null>(null);
  const ui = getUi(appTheme);
  const cityWeather = citiesWeather[city] || citiesWeather.Kolkata;

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

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, handleClose]);

  const trendColor = useMemo(() => {
    if (!data) return "#94A3B8";
    if (data.trend === "Improving") return "#3dd68c";
    if (data.trend === "Worsening") return "#e25b5b";
    return "#94A3B8";
  }, [data]);

  if (!isOpen || !data) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col"
      style={{ animation: isClosing ? "pageSlideOut 0.2s ease-in forwards" : "pageSlideIn 0.3s ease-out" }}
    >
      <Atmosphere theme={theme} appTheme={appTheme} />
      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <div className={`sticky top-0 z-20 backdrop-blur-xl ${ui.light ? "bg-white/30" : "bg-[#071410]/40"}`}>
          <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 pt-4 pb-3">
            <button onClick={handleClose} className={`-ml-2 rounded-full p-2 ${ui.text} ${ui.invertBtn}`} aria-label="Go back">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <p className={`text-base ${ui.text}`}>{city}</p>
              <p className={`text-xs ${ui.muted}`}>Air quality & gases</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-3xl px-4 pb-12">
            <div className="flex flex-col items-center pt-8 pb-6" style={{ animation: "aqiHeroFadeIn 0.5s ease-out" }}>
              <AqiRing aqi={data.aqi} color={data.color} />
              <div
                className="mt-4 rounded-full px-5 py-2 text-sm font-medium"
                style={{ backgroundColor: `${data.color}20`, color: data.color, border: `1px solid ${data.color}30` }}
              >
                {data.status}
              </div>
            </div>

            <div className={`${ui.card} mb-4 rounded-[1.5rem] p-4`}>
              <p className={`text-sm leading-relaxed ${ui.text}`}>{data.healthMessage}</p>
              <p className={`mt-1 text-xs ${ui.muted}`}>Affects: {data.targetGroup}</p>
            </div>

            <div className="mb-4">
              <GasMixDetail gases={cityWeather.gases} appTheme={appTheme} />
            </div>

            <div className={`${ui.card} mb-4 rounded-[1.5rem] p-5`}>
              <div className="mb-3 flex items-center justify-between">
                <span className={`text-[11px] uppercase tracking-[0.2em] ${ui.faint}`}>Pollutants</span>
                <span className={`text-[10px] ${ui.faint}`}>Worst first</span>
              </div>
              <div className={`divide-y ${ui.light ? "divide-black/5" : "divide-white/5"}`}>
                {data.pollutants.map((pollutant, i) => (
                  <PollutantRow key={pollutant.name} pollutant={pollutant} index={i} appTheme={appTheme} />
                ))}
              </div>
            </div>

            <div className={`${ui.card} rounded-[1.5rem] p-5`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${ui.text}`}>{data.trend}</p>
                  <p className={`text-xs ${ui.muted}`}>Trend {data.trendArrow}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm ${ui.text}`}>{data.lastUpdated}</p>
                  <p className={`text-xs ${ui.muted}`}>{data.source}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: trendColor }} />
                <span className={`text-xs ${ui.faint}`}>Street-level mix for {city}, 18 Aug 2026</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
