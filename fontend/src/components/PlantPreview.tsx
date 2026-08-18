import { useMemo } from "react";
import { type AppTheme, type WeatherTheme, citiesWeather, getUi } from "@/data/weatherData";
import { getEnvironment, getRecommendations } from "@/data/plantData";
import { PlantPhoto } from "./PlantPhoto";

interface PlantPreviewProps {
  city: string;
  theme: WeatherTheme;
  appTheme: AppTheme;
  onTap: () => void;
}

export function PlantPreview({ city, theme: _theme, appTheme, onTap }: PlantPreviewProps) {
  const ui = getUi(appTheme);
  void _theme;
  const cityData = citiesWeather[city] || citiesWeather.Kolkata;

  const topPlants = useMemo(() => {
    const env = getEnvironment(cityData);
    return getRecommendations(env, "indoor", 3);
  }, [cityData]);

  return (
    <button
      onClick={onTap}
      className={`w-full text-left ${ui.card} rounded-[1.6rem] p-4 transition-transform active:scale-[0.99]`}
    >
      <div className="mb-3 flex items-center justify-between px-1">
        <span className={`text-[11px] uppercase tracking-[0.22em] ${ui.faint}`}>Best plants today</span>
        <span className={`flex items-center gap-1 text-xs ${ui.muted}`}>
          View all
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </span>
      </div>

      <div className="flex items-center gap-3">
        {topPlants.map((rec, i) => (
          <div key={rec.plant.id} className={`flex flex-1 flex-col items-center gap-2 rounded-2xl px-2 py-3 ${ui.chip}`}>
            <PlantPhoto src={rec.plant.image} alt={rec.plant.name} size="lg" />
            <span className={`text-center text-[11px] leading-tight ${ui.text}`}>{rec.plant.name}</span>
            <span className={`rounded-full px-1.5 py-0.5 text-[9px] ${i === 0 ? ui.accentSoft : ui.muted}`}>
              {rec.suitability}
            </span>
          </div>
        ))}
      </div>

      <p className={`mt-3 px-1 text-[11px] leading-relaxed ${ui.muted}`}>
        Matched to AQI {cityData.aqi} and {cityData.temp}°C in {cityData.city}.
      </p>
    </button>
  );
}
