import { useState, useEffect, useCallback, useMemo } from "react";
import {
  type AppTheme,
  type WeatherTheme,
  themeTextColors,
  citiesWeather,
} from "@/data/weatherData";
import {
  type SpaceType,
  type PlantRecommendation,
  type EnvironmentConditions,
  type Plant,
  getEnvironment,
  getRecommendations,
  getSystemInsight,
  getAqiColor,
  getAqiLabel,
} from "@/data/plantData";
import { PlantDetailPage } from "./PlantDetailPage";
import { Atmosphere } from "./Atmosphere";
import { PlantPhoto } from "./PlantPhoto";

interface PlantRecommendationPageProps {
  theme: WeatherTheme;
  appTheme: AppTheme;
  city: string;
  isOpen: boolean;
  onClose: () => void;
  onAddPlant: (plant: Plant) => void;
}

// ========== Environment Card ==========
function EnvCard({
  icon,
  value,
  label,
  color,
  theme,
  index,
}: {
  icon: string;
  value: string;
  label: string;
  color: string;
  theme: WeatherTheme;
  index: number;
}) {
  const colors = themeTextColors[theme];

  return (
    <div
      className="bg-white/8 backdrop-blur-md rounded-xl p-3.5 border border-white/5 flex flex-col items-center gap-1.5"
      style={{
        animation: `plantFadeIn 0.3s ease-out ${0.08 + index * 0.05}s both`,
      }}
    >
      <span className="text-lg">{icon}</span>
      <span
        className="text-lg font-medium"
        style={{ color }}
      >
        {value}
      </span>
      <span className={`text-[10px] ${colors.muted} uppercase tracking-wider`}>
        {label}
      </span>
    </div>
  );
}

// ========== Plant Card ==========
function PlantCard({
  recommendation,
  env,
  theme,
  index,
  onTap,
}: {
  recommendation: PlantRecommendation;
  env: EnvironmentConditions;
  theme: WeatherTheme;
  index: number;
  onTap: () => void;
}) {
  const colors = themeTextColors[theme];
  const plant = recommendation.plant;

  return (
    <div
      className="bg-white/8 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden cursor-pointer hover:bg-white/12 active:scale-[0.99] transition-all duration-150"
      style={{
        animation: `plantCardSlideIn 0.4s ease-out ${0.15 + index * 0.08}s both`,
      }}
      onClick={onTap}
    >
      <div className="p-5">
        <div className="flex gap-4">
          {/* LEFT: Image + name */}
          <div className="flex flex-col items-center gap-2 flex-shrink-0">
            <PlantPhoto src={plant.image} alt={plant.name} size="lg" />
            <span className={`text-sm font-medium ${colors.primary} text-center leading-tight`}>
              {plant.name}
            </span>
            <div className="flex gap-1">
              {plant.spaceType.map((s) => (
                <span
                  key={s}
                  className="px-2 py-0.5 rounded-full bg-white/8 text-[9px] text-white/50 capitalize"
                >
                  {s === "indoor" ? "🏠" : "🌤️"} {s}
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT: Benefits */}
          <div className="flex-1 min-w-0">
            {/* Air benefits */}
            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-xs opacity-50">🌬️</span>
              <span className={`text-xs ${colors.muted}`}>Air Benefit:</span>
            </div>
            <div className="flex flex-col gap-1.5 mb-3">
              <div className="flex items-center gap-2">
                <span className={`text-[11px] ${plant.benefits.vocAbsorption ? "text-green-400" : "text-white/20"}`}>
                  {plant.benefits.vocAbsorption ? "✔" : "—"}
                </span>
                <span className={`text-xs font-light ${colors.secondary}`}>
                  VOC absorption
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[11px] ${plant.benefits.dustControl ? "text-green-400" : "text-white/20"}`}>
                  {plant.benefits.dustControl ? "✔" : "—"}
                </span>
                <span className={`text-xs font-light ${colors.secondary}`}>
                  Dust control
                </span>
              </div>
            </div>

            {/* Care info */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] opacity-50">💧</span>
                <span className={`text-xs font-light ${colors.muted}`}>
                  Water: {plant.care.water}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] opacity-50">☀️</span>
                <span className={`text-xs font-light ${colors.muted}`}>
                  Light: {plant.care.light}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] opacity-50">🧠</span>
                <span className={`text-xs font-light ${colors.muted}`}>
                  Care: {plant.care.difficultyLabel}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="flex items-center justify-between px-5 py-3 bg-white/3 border-t border-white/5">
        <div className="flex items-center gap-2">
          <span className={`text-xs ${env.aqi <= 150 ? "text-green-400" : "text-yellow-400"}`}>
            {env.aqi <= 150 ? "✅" : "⚠️"}
          </span>
          <span className={`text-[11px] font-light ${colors.muted}`}>
            {env.aqi <= 150 ? "Suitable for your AQI" : "Monitor with high AQI"}
          </span>
        </div>
        {!plant.safety.petSafe && (
          <span className={`text-[11px] font-light text-yellow-400/60`}>
            ⚠ Not pet-safe
          </span>
        )}
      </div>

      {/* CTA strip */}
      <div className="flex items-center justify-end px-5 py-2.5 bg-white/2">
        <span className={`text-xs font-light ${colors.secondary} flex items-center gap-1`}>
          View Full Details
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </span>
      </div>
    </div>
  );
}

// ========== Main Page Component ==========
export function PlantRecommendationPage({
  theme,
  appTheme,
  city,
  isOpen,
  onClose,
  onAddPlant,
}: PlantRecommendationPageProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [spaceType, setSpaceType] = useState<SpaceType>("indoor");
  const [selectedPlant, setSelectedPlant] = useState<PlantRecommendation | null>(null);

  const colors = themeTextColors[theme];

  const cityData = citiesWeather[city] || citiesWeather.Kolkata;

  const env = useMemo(() => getEnvironment(cityData), [cityData]);

  const recommendations = useMemo(
    () => getRecommendations(env, spaceType, 5),
    [env, spaceType]
  );

  const insight = useMemo(
    () => getSystemInsight(env, spaceType),
    [env, spaceType]
  );

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200);
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      setSelectedPlant(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  // AQI environment colors
  const aqiColor = getAqiColor(cityData.aqi);
  const pm25Color = cityData.aqi > 100 ? "#EF4444" : cityData.aqi > 50 ? "#EAB308" : "#22C55E";
  const tempColor = cityData.temp > 35 ? "#F97316" : cityData.temp > 25 ? "#EAB308" : cityData.temp > 15 ? "#22C55E" : "#60A5FA";
  const humColor = cityData.humidity > 70 ? "#60A5FA" : cityData.humidity > 50 ? "#22C55E" : "#EAB308";

  return (
    <>
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
        {/* ===== Sticky Header ===== */}
        <div className="sticky top-0 z-20 backdrop-blur-xl bg-black/5">
          <div className="max-w-lg mx-auto">
            <div className="flex items-center gap-3 px-4 pt-4 pb-3">
              <button
                onClick={handleClose}
                className={`p-2 -ml-2 rounded-full transition-all hover:bg-white/10 active:bg-white/20 ${colors.primary}`}
                aria-label="Go back"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="flex flex-col">
                <span className={`text-base font-light ${colors.primary} tracking-wide`}>
                  Plant Recommendations
                </span>
                <span className={`text-xs font-light ${colors.muted}`}>
                  {cityData.city}, {cityData.country}
                </span>
              </div>
            </div>
          </div>
          <div className="h-px bg-white/5" />
        </div>

        {/* ===== Scrollable Content ===== */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="max-w-lg mx-auto pb-12">

            {/* ===== 1. Location & Space Toggle ===== */}
            <div
              className="px-4 pt-5 pb-2"
              style={{ animation: "plantFadeIn 0.3s ease-out" }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm">📍</span>
                  <span className={`text-sm font-light ${colors.primary}`}>
                    {cityData.city}, {cityData.country}
                  </span>
                </div>
                {/* Space type toggle */}
                <div className="flex rounded-xl overflow-hidden bg-white/8">
                  {(["indoor", "balcony"] as SpaceType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => setSpaceType(type)}
                      className={`px-3.5 py-2 text-xs font-light transition-all duration-200 ${
                        spaceType === type
                          ? "bg-white/20 text-white font-medium"
                          : "text-white/40 hover:text-white/60"
                      }`}
                    >
                      {type === "indoor" ? "🏠 Indoor" : "🌤️ Balcony"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ===== 2. Live Conditions Cards ===== */}
            <div className="px-4 pt-3 pb-2">
              <div className="grid grid-cols-4 gap-2.5">
                <EnvCard
                  icon="🌫️"
                  value={`${cityData.aqi}`}
                  label={getAqiLabel(cityData.aqi)}
                  color={aqiColor}
                  theme={theme}
                  index={0}
                />
                <EnvCard
                  icon="🌬️"
                  value={cityData.aqi > 100 ? "High" : "Low"}
                  label="PM2.5"
                  color={pm25Color}
                  theme={theme}
                  index={1}
                />
                <EnvCard
                  icon="🌡️"
                  value={`${cityData.temp}°`}
                  label="Temp"
                  color={tempColor}
                  theme={theme}
                  index={2}
                />
                <EnvCard
                  icon="💧"
                  value={`${cityData.humidity}%`}
                  label="Humidity"
                  color={humColor}
                  theme={theme}
                  index={3}
                />
              </div>
            </div>

            {/* ===== 3. System Insight Bar ===== */}
            <div
              className="px-4 pt-3 pb-4"
              style={{ animation: "plantFadeIn 0.35s ease-out 0.12s both" }}
            >
              <div className="bg-white/6 backdrop-blur-md rounded-xl px-4 py-3 border border-white/5">
                <div className="flex items-start gap-2.5">
                  <span className="text-base mt-0.5 flex-shrink-0">🧠</span>
                  <p className={`text-xs font-light ${colors.secondary} leading-relaxed`}>
                    {insight}
                  </p>
                </div>
              </div>
            </div>

            {/* ===== 4. Recommended Plants ===== */}
            <div className="px-4">
              <div
                className="flex items-center gap-2 mb-3"
                style={{ animation: "plantFadeIn 0.35s ease-out 0.18s both" }}
              >
                <span className="text-sm">🌱</span>
                <span className={`text-xs uppercase tracking-widest ${colors.muted} font-medium`}>
                  Best Plants for Your Space Today
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {recommendations.map((rec, i) => (
                  <PlantCard
                    key={rec.plant.id}
                    recommendation={rec}
                    env={env}
                    theme={theme}
                    index={i}
                    onTap={() => setSelectedPlant(rec)}
                  />
                ))}
              </div>
            </div>

            {/* Footer disclaimer */}
            <div
              className="text-center px-4 mt-8 pb-4"
              style={{ animation: "plantFadeIn 0.3s ease-out 0.6s both" }}
            >
              <p className={`text-[10px] uppercase tracking-widest ${colors.muted} opacity-40`}>
                Recommendations based on current weather conditions
              </p>
            </div>
          </div>
        </div>
        </div>
      </div>

      <PlantDetailPage
        theme={theme}
        appTheme={appTheme}
        recommendation={selectedPlant || recommendations[0]}
        env={env}
        isOpen={!!selectedPlant}
        onClose={() => setSelectedPlant(null)}
        onAddPlant={onAddPlant}
      />
    </>
  );
}
