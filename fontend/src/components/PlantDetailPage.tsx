import { useState, useEffect, useCallback } from "react";
import {
  type AppTheme,
  type WeatherTheme,
  themeTextColors,
} from "@/data/weatherData";
import { type PlantRecommendation, type EnvironmentConditions, type Plant } from "@/data/plantData";
import { Atmosphere } from "./Atmosphere";
import { PlantPhoto } from "./PlantPhoto";

interface PlantDetailPageProps {
  theme: WeatherTheme;
  appTheme: AppTheme;
  recommendation: PlantRecommendation;
  env: EnvironmentConditions;
  isOpen: boolean;
  onClose: () => void;
  onAddPlant: (plant: Plant) => void;
}

function DifficultyMeter({ level }: { level: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={`w-5 h-2 rounded-full transition-all ${
            i <= level ? "bg-green-400" : "bg-white/10"
          }`}
          style={{
            opacity: i <= level ? 1 - (i - 1) * 0.12 : 0.3,
          }}
        />
      ))}
    </div>
  );
}

export function PlantDetailPage({
  theme,
  appTheme: _appTheme,
  recommendation,
  env,
  isOpen,
  onClose,
  onAddPlant,
}: PlantDetailPageProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [addedToMyPlants, setAddedToMyPlants] = useState(false);

  const colors = themeTextColors[theme];
  const plant = recommendation.plant;

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
      setAddedToMyPlants(false);
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

  return (
    <div
      className="fixed inset-0 z-[300] flex flex-col"
      style={{
        animation: isClosing
          ? "pageSlideOut 0.2s ease-in forwards"
          : "pageSlideIn 0.3s ease-out",
      }}
    >
      <Atmosphere theme={theme} appTheme="dark" />
      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
      {/* Sticky Header */}
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
                {plant.name}
              </span>
              <span className={`text-xs font-light ${colors.muted} italic`}>
                {plant.scientificName}
              </span>
            </div>
          </div>
        </div>
        <div className="h-px bg-white/5" />
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        <div className="max-w-lg mx-auto pb-32">

          {/* ===== A. Plant Header ===== */}
          <div
            className="flex flex-col items-center pt-8 pb-6 px-4"
            style={{ animation: "plantFadeIn 0.4s ease-out" }}
          >
            {/* Big icon */}
            <div className="mb-4">
              <PlantPhoto src={plant.image} alt={plant.name} size="xl" />
            </div>

            {/* Name + badges */}
            <h1 className={`text-2xl font-light ${colors.primary} tracking-wide`}>
              {plant.name}
            </h1>

            <div className="flex items-center gap-2 mt-3">
              {plant.spaceType.map((s) => (
                <span
                  key={s}
                  className="px-3 py-1 rounded-full bg-white/10 text-xs font-light text-white/70 capitalize"
                >
                  {s === "indoor" ? "🏠 Indoor" : "🌤️ Balcony"}
                </span>
              ))}
              <span
                className={`px-3 py-1 rounded-full text-xs font-light ${
                  recommendation.suitability === "Excellent"
                    ? "bg-green-500/20 text-green-300"
                    : recommendation.suitability === "Good"
                    ? "bg-blue-500/20 text-blue-300"
                    : "bg-yellow-500/20 text-yellow-300"
                }`}
              >
                {recommendation.suitability} Match
              </span>
            </div>

            {/* Difficulty */}
            <div className="flex items-center gap-3 mt-4">
              <span className={`text-xs ${colors.muted}`}>Difficulty:</span>
              <DifficultyMeter level={plant.care.difficulty} />
              <span className={`text-xs ${colors.secondary}`}>
                {plant.care.difficultyLabel}
              </span>
            </div>
          </div>

          {/* ===== "Why This Plant?" AI Explanation ===== */}
          <div
            className="px-4 mb-4"
            style={{ animation: "plantFadeIn 0.4s ease-out 0.08s both" }}
          >
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/8">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">🧠</span>
                <span className={`text-xs uppercase tracking-widest ${colors.muted} font-medium`}>
                  Why This Plant?
                </span>
              </div>
              <p className={`text-sm font-light ${colors.secondary} leading-relaxed`}>
                "{recommendation.reason}"
              </p>
            </div>
          </div>

          {/* ===== B. Environmental Impact ===== */}
          <div
            className="px-4 mb-4"
            style={{ animation: "plantFadeIn 0.4s ease-out 0.16s both" }}
          >
            <div className="bg-white/8 backdrop-blur-md rounded-2xl p-5 border border-white/5">
              <span className={`text-xs uppercase tracking-widest ${colors.muted} font-medium`}>
                Environmental Impact
              </span>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="flex items-start gap-2.5">
                  <span className="text-lg mt-0.5">🌬️</span>
                  <div>
                    <span className={`text-sm font-medium ${colors.primary} block`}>
                      CO₂ Absorption
                    </span>
                    <span className={`text-xs ${colors.muted}`}>
                      {plant.benefits.co2Absorption}
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-lg mt-0.5">💨</span>
                  <div>
                    <span className={`text-sm font-medium ${colors.primary} block`}>
                      O₂ Release
                    </span>
                    <span className={`text-xs ${colors.muted}`}>
                      {plant.benefits.oxygenRelease}
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-lg mt-0.5">🧪</span>
                  <div>
                    <span className={`text-sm font-medium ${colors.primary} block`}>
                      VOC Reduction
                    </span>
                    <span className={`text-xs ${colors.muted}`}>
                      {plant.benefits.vocAbsorption ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-lg mt-0.5">🧘</span>
                  <div>
                    <span className={`text-sm font-medium ${colors.primary} block`}>
                      Psych Benefit
                    </span>
                    <span className={`text-xs ${colors.muted}`}>
                      {plant.benefits.psychologicalBenefit}
                    </span>
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="mt-4 pt-3 border-t border-white/5">
                <p className={`text-[10px] ${colors.muted} opacity-60 leading-relaxed`}>
                  ⚠️ Plants support air quality locally. They do not replace ventilation or air purifiers.
                </p>
              </div>
            </div>
          </div>

          {/* ===== Live Impact Panel ===== */}
          <div
            className="px-4 mb-4"
            style={{ animation: "plantFadeIn 0.4s ease-out 0.24s both" }}
          >
            <div className="bg-white/8 backdrop-blur-md rounded-2xl p-5 border border-white/5">
              <span className={`text-xs uppercase tracking-widest ${colors.muted} font-medium`}>
                What This Plant Helps With
              </span>
              <div className="flex flex-col gap-3 mt-4">
                {plant.benefits.dustControl && (
                  <div className="flex items-center gap-3">
                    <span className="text-green-400 text-sm">✔</span>
                    <span className={`text-sm font-light ${colors.secondary}`}>
                      Visual dust reduction on leaf surfaces
                    </span>
                  </div>
                )}
                {plant.benefits.psychologicalBenefit !== "Low" && (
                  <div className="flex items-center gap-3">
                    <span className="text-green-400 text-sm">✔</span>
                    <span className={`text-sm font-light ${colors.secondary}`}>
                      Stress & sleep improvement
                    </span>
                  </div>
                )}
                {plant.benefits.humidityBalance && (
                  <div className="flex items-center gap-3">
                    <span className="text-green-400 text-sm">✔</span>
                    <span className={`text-sm font-light ${colors.secondary}`}>
                      Humidity balance (minor)
                    </span>
                  </div>
                )}
                {plant.benefits.vocAbsorption && (
                  <div className="flex items-center gap-3">
                    <span className="text-green-400 text-sm">✔</span>
                    <span className={`text-sm font-light ${colors.secondary}`}>
                      Reduces volatile organic compounds
                    </span>
                  </div>
                )}
                {plant.benefits.oxygenRelease === "Nighttime" && (
                  <div className="flex items-center gap-3">
                    <span className="text-green-400 text-sm">✔</span>
                    <span className={`text-sm font-light ${colors.secondary}`}>
                      Releases oxygen at night (bedroom ideal)
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ===== C. Care Guide ===== */}
          <div
            className="px-4 mb-4"
            style={{ animation: "plantFadeIn 0.4s ease-out 0.32s both" }}
          >
            <div className="bg-white/8 backdrop-blur-md rounded-2xl p-5 border border-white/5">
              <span className={`text-xs uppercase tracking-widest ${colors.muted} font-medium`}>
                Care Guide
              </span>
              <div className="flex flex-col gap-4 mt-4">
                {[
                  { icon: "💧", label: "Water", value: plant.care.water },
                  { icon: "☀️", label: "Light", value: plant.care.light },
                  { icon: "🌱", label: "Pot Size", value: plant.care.potSize },
                  { icon: "🪴", label: "Soil", value: plant.care.soil },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <span className="text-base w-7 text-center">{item.icon}</span>
                    <div className="flex flex-col">
                      <span className={`text-xs ${colors.muted}`}>{item.label}</span>
                      <span className={`text-sm font-light ${colors.primary}`}>
                        {item.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ===== D. Safety & Suitability ===== */}
          <div
            className="px-4 mb-4"
            style={{ animation: "plantFadeIn 0.4s ease-out 0.40s both" }}
          >
            <div className="bg-white/8 backdrop-blur-md rounded-2xl p-5 border border-white/5">
              <span className={`text-xs uppercase tracking-widest ${colors.muted} font-medium`}>
                Safety & Suitability
              </span>
              <div className="flex flex-col gap-3 mt-4">
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-light ${colors.secondary}`}>Pet safe</span>
                  <span className={`text-sm font-medium ${plant.safety.petSafe ? "text-green-400" : "text-red-400"}`}>
                    {plant.safety.petSafe ? "✓ Yes" : "✗ No"}
                  </span>
                </div>
                <div className="h-px bg-white/5" />
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-light ${colors.secondary}`}>Allergy risk</span>
                  <span className={`text-sm font-light ${colors.primary}`}>{plant.safety.allergyRisk}</span>
                </div>
                <div className="h-px bg-white/5" />
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-light ${colors.secondary}`}>Mold risk</span>
                  <span className={`text-sm font-light ${colors.primary}`}>
                    {plant.safety.moldRisk}
                    {plant.safety.moldRisk !== "None" && " (if not overwatered)"}
                  </span>
                </div>
              </div>

              {/* AQI suitability */}
              <div className="mt-4 pt-3 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <span className={env.aqi <= 150 ? "text-green-400" : "text-yellow-400"}>
                    {env.aqi <= 150 ? "✅" : "⚠️"}
                  </span>
                  <span className={`text-xs font-light ${colors.secondary}`}>
                    {env.aqi <= 150
                      ? "Suitable for your current AQI"
                      : "AQI is high — keep plant indoors with ventilation"}
                  </span>
                </div>
                {!plant.safety.petSafe && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-yellow-400">⚠</span>
                    <span className={`text-xs font-light ${colors.muted}`}>
                      Not pet-safe — keep out of reach of cats and dogs
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ===== Placement Guide ===== */}
          <div
            className="px-4 mb-4"
            style={{ animation: "plantFadeIn 0.4s ease-out 0.48s both" }}
          >
            <div className="bg-white/8 backdrop-blur-md rounded-2xl p-5 border border-white/5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">🌟</span>
                <span className={`text-xs uppercase tracking-widest ${colors.muted} font-medium`}>
                  Placement Guide
                </span>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <span className="text-sm opacity-60 mt-0.5">📍</span>
                  <span className={`text-sm font-light ${colors.secondary}`}>
                    {plant.placement.distanceFromWindow}
                  </span>
                </div>
                {plant.placement.avoidDirectAC && (
                  <div className="flex items-start gap-3">
                    <span className="text-sm opacity-60 mt-0.5">❌</span>
                    <span className={`text-sm font-light ${colors.secondary}`}>
                      Avoid direct AC airflow
                    </span>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <span className="text-sm opacity-60 mt-0.5">✨</span>
                  <span className={`text-sm font-light ${colors.secondary}`}>
                    {plant.placement.idealSpot}
                  </span>
                </div>
                <div className="mt-2 px-3 py-2.5 rounded-xl bg-white/5">
                  <span className={`text-xs font-light ${colors.muted} leading-relaxed`}>
                    💡 {plant.placement.notes}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ===== Care Reminder Preview ===== */}
          <div
            className="px-4 mb-6"
            style={{ animation: "plantFadeIn 0.4s ease-out 0.56s both" }}
          >
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">📅</span>
                <span className={`text-xs uppercase tracking-widest ${colors.muted} font-medium`}>
                  Care Reminders
                </span>
              </div>
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center text-sm">
                    💧
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-sm font-light ${colors.primary}`}>Water reminder</span>
                    <span className={`text-[11px] ${colors.muted}`}>{plant.care.water}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-500/15 flex items-center justify-center text-sm">
                    🔄
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-sm font-light ${colors.primary}`}>Rotate plant</span>
                    <span className={`text-[11px] ${colors.muted}`}>Every 2 weeks for even growth</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Bottom CTA ===== */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div
          className="px-4 pb-6 pt-8"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)",
          }}
        >
          <div className="max-w-lg mx-auto flex gap-3">
            <button
              onClick={() => {
                if (!addedToMyPlants) onAddPlant(plant);
                setAddedToMyPlants(true);
              }}
              className={`flex-1 py-3.5 rounded-2xl text-sm font-medium transition-all duration-200 ${
                addedToMyPlants
                  ? "bg-green-500/20 text-green-300 border border-green-500/30"
                  : "bg-white/15 text-white border border-white/10 hover:bg-white/25 active:bg-white/30"
              }`}
            >
              {addedToMyPlants ? "✓ Added to My Garden" : "Add to My Garden"}
            </button>
            <button
              onClick={handleClose}
              className="px-5 py-3.5 rounded-2xl text-sm font-light bg-white/8 text-white/70 border border-white/5 hover:bg-white/15 active:bg-white/20 transition-all"
            >
              🔁 Compare
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
