import { useMemo } from "react";
import {
  type WeatherTheme,
  type AppTheme,
  getTextColors,
  getCardBg,
  citiesWeather,
} from "@/data/weatherData";
import {
  getEnvironment,
  getRecommendations,
} from "@/data/plantData";

interface PlantPreviewProps {
  city: string;
  theme: WeatherTheme;
  appTheme: AppTheme;
  onTap: () => void;
}

export function PlantPreview({ city, theme, appTheme, onTap }: PlantPreviewProps) {
  const colors = getTextColors(theme, appTheme);
  const cardBg = getCardBg(theme, appTheme);
  const cityData = citiesWeather[city] || citiesWeather["New York"];

  const topPlants = useMemo(() => {
    const env = getEnvironment(cityData);
    return getRecommendations(env, "indoor", 3);
  }, [cityData]);

  return (
    <div className="px-4 py-3">
      <button
        onClick={onTap}
        className={`w-full text-left ${cardBg} rounded-2xl p-4 cursor-pointer active:scale-[0.99] transition-transform`}
      >
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <span className="text-sm">🌱</span>
            <span className={`text-xs font-light ${colors.muted} uppercase tracking-widest`}>
              Plant Recommendations
            </span>
          </div>
          <span className={`text-xs font-light ${colors.muted} flex items-center gap-1`}>
            View all
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </span>
        </div>

        <div className="flex items-center gap-3">
          {topPlants.map((rec, i) => (
            <div
              key={rec.plant.id}
              className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl ${
                appTheme === "light" ? "bg-black/3" : "bg-white/5"
              }`}
            >
              <span className="text-2xl">{rec.plant.image}</span>
              <span className={`text-[11px] font-light ${colors.primary} text-center leading-tight`}>
                {rec.plant.name}
              </span>
              <span
                className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                  i === 0
                    ? "bg-green-500/15 text-green-400"
                    : "bg-white/8 text-white/40"
                }`}
              >
                {rec.suitability}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-3 px-1">
          <p className={`text-[11px] font-light ${colors.muted} leading-relaxed`}>
            Based on AQI {cityData.aqi} & {cityData.temp}°C — tailored to your conditions
          </p>
        </div>
      </button>
    </div>
  );
}
