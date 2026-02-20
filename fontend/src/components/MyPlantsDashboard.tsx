import { useState, useEffect, useCallback, useMemo } from "react";
import {
  type WeatherTheme,
  themeTextColors,
  themeGradients,
  citiesWeather,
} from "@/data/weatherData";
import { getEnvironment, type EnvironmentConditions } from "@/data/plantData";
import {
  type MyPlant,
  type PlantTask,
  type PlantAlert,
  estimateHealth,
  generateTasks,
  generateAlerts,
  getHealthSummary,
  getStressLevel,
  type PlantHealthInfo,
} from "@/data/myPlantsData";

interface MyPlantsDashboardProps {
  theme: WeatherTheme;
  city: string;
  myPlants: MyPlant[];
  isOpen: boolean;
  onClose: () => void;
  onNavigateRecommendations: () => void;
  onNavigateCareSchedule?: () => void;
  onAddPlant: () => void;
  onRemovePlant: (plantId: string) => void;
  onWaterPlant: (plantId: string) => void;
  onRotatePlant: (plantId: string) => void;
}

// ========== Sticky Header ==========
function DashboardHeader({
  theme,
  plantCount,
  onClose,
}: {
  theme: WeatherTheme;
  plantCount: number;
  onClose: () => void;
}) {
  const colors = themeTextColors[theme];
  return (
    <div className="sticky top-0 z-20 backdrop-blur-xl bg-black/5">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-3 px-4 pt-4 pb-3">
          <button
            onClick={onClose}
            className={`p-2 -ml-2 rounded-full transition-all hover:bg-white/10 active:bg-white/20 ${colors.primary}`}
            aria-label="Go back"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex flex-col">
            <span className={`text-base font-light ${colors.primary} tracking-wide`}>
              My Plants
            </span>
            <span className={`text-xs font-light ${colors.muted}`}>
              {plantCount} plant{plantCount !== 1 ? "s" : ""} in your collection
            </span>
          </div>
        </div>
      </div>
      <div className="h-px bg-white/5" />
    </div>
  );
}

// ========== 1. Environment Summary Strip ==========
function EnvironmentStrip({
  env,
  city,
  theme,
}: {
  env: EnvironmentConditions;
  city: string;
  theme: WeatherTheme;
}) {
  const colors = themeTextColors[theme];
  const cityData = citiesWeather[city] || citiesWeather["New York"];
  const stress = getStressLevel(env);

  const aqiColor =
    env.aqi <= 50 ? "#22C55E" : env.aqi <= 100 ? "#EAB308" : env.aqi <= 150 ? "#F97316" : "#EF4444";
  const aqiLabel =
    env.aqi <= 50 ? "Good" : env.aqi <= 100 ? "Moderate" : env.aqi <= 150 ? "Unhealthy" : "Poor";

  return (
    <div
      className="px-4 pt-4 pb-2"
      style={{ animation: "dashFadeIn 0.3s ease-out both" }}
    >
      <div className="bg-white/8 backdrop-blur-md rounded-2xl px-4 py-3 border border-white/5">
        <div className="flex items-center justify-between">
          {/* AQI */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: aqiColor }} />
            <div className="flex flex-col">
              <span className={`text-xs ${colors.muted}`}>AQI</span>
              <span className={`text-sm font-medium ${colors.primary}`}>
                {env.aqi}{" "}
                <span className="text-[10px] font-light" style={{ color: aqiColor }}>
                  {aqiLabel}
                </span>
              </span>
            </div>
          </div>

          <div className="w-px h-7 bg-white/8" />

          {/* Weather */}
          <div className="flex flex-col items-center">
            <span className={`text-xs ${colors.muted}`}>Weather</span>
            <span className={`text-sm font-medium ${colors.primary}`}>
              {cityData.condition} ({cityData.temp}°)
            </span>
          </div>

          <div className="w-px h-7 bg-white/8" />

          {/* Plant Stress */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stress.color }} />
            <div className="flex flex-col">
              <span className={`text-xs ${colors.muted}`}>Stress</span>
              <span className="text-sm font-medium" style={{ color: stress.color }}>
                {stress.level}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ========== 2. Task Card ==========
function TaskCard({
  task,
  theme,
  index,
  onDone,
}: {
  task: PlantTask;
  theme: WeatherTheme;
  index: number;
  onDone: () => void;
}) {
  const colors = themeTextColors[theme];
  const [isDone, setIsDone] = useState(task.done);

  const handleDone = () => {
    setIsDone(true);
    onDone();
  };

  const priorityBorder =
    task.priority === "high"
      ? "border-l-red-400/50"
      : task.priority === "medium"
      ? "border-l-yellow-400/50"
      : "border-l-white/10";

  return (
    <div
      className={`flex items-center gap-3 p-3.5 rounded-xl bg-white/6 border border-white/5 border-l-[3px] ${priorityBorder} transition-all duration-300 ${
        isDone ? "opacity-40 scale-[0.98]" : ""
      }`}
      style={{
        animation: `dashTaskSlideIn 0.3s ease-out ${0.08 + index * 0.06}s both`,
      }}
    >
      {/* Checkbox */}
      <button
        onClick={handleDone}
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
          isDone
            ? "bg-green-500/30 border-green-500"
            : "border-white/20 hover:border-white/40"
        }`}
      >
        {isDone && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
            <path d="M2.5 6L5 8.5L9.5 3.5" />
          </svg>
        )}
      </button>

      {/* Task info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm">{task.icon}</span>
          <span className={`text-sm font-medium ${colors.primary} ${isDone ? "line-through" : ""}`}>
            {task.title}
          </span>
        </div>
        <span className={`text-[11px] font-light ${colors.muted} mt-0.5 block`}>
          {task.reason}
        </span>
      </div>

      {/* Plant avatar */}
      <span className="text-xl flex-shrink-0">{task.plantImage}</span>
    </div>
  );
}

// ========== 3. Plant Card ==========
function PlantListCard({
  myPlant,
  health,
  theme,
  index,
  onRemove,
}: {
  myPlant: MyPlant;
  health: PlantHealthInfo;
  theme: WeatherTheme;
  index: number;
  onRemove: () => void;
}) {
  const colors = themeTextColors[theme];
  const plant = myPlant.plant;

  return (
    <div
      className="bg-white/8 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden transition-all group"
      style={{
        animation: `dashCardFadeIn 0.35s ease-out ${0.1 + index * 0.07}s both`,
      }}
    >
      <div className="p-4">
        <div className="flex gap-4">
          {/* LEFT: Image + name */}
          <div className="flex flex-col items-center gap-1.5 flex-shrink-0 w-16">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-3xl border border-white/5">
              {plant.image}
            </div>
            <span className={`text-xs font-medium ${colors.primary} text-center leading-tight`}>
              {myPlant.nickname || plant.name}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-white/8 text-[9px] text-white/50 capitalize">
              {myPlant.location === "indoor" ? "🏠" : "🌤️"} {myPlant.location}
            </span>
          </div>

          {/* RIGHT: Status */}
          <div className="flex-1 min-w-0">
            {/* Health status */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: health.statusColor }} />
                <span className="text-sm font-medium" style={{ color: health.statusColor }}>
                  {health.status}
                </span>
              </div>
              {health.stressFactors.length > 0 && (
                <span className={`text-[10px] ${colors.muted} truncate`}>
                  · {health.stressFactors[0]}
                </span>
              )}
            </div>

            {/* Info rows */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] opacity-50">💧</span>
                <span className={`text-xs font-light ${colors.muted}`}>
                  Next water:{" "}
                  <span className={health.nextWaterDays <= 1 ? "text-yellow-400" : colors.secondary}>
                    {health.nextWaterDays === 0
                      ? "Today"
                      : health.nextWaterDays === 1
                      ? "Tomorrow"
                      : `${health.nextWaterDays} days`}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] opacity-50">☀️</span>
                <span className={`text-xs font-light ${colors.muted}`}>
                  Light match:{" "}
                  <span
                    className={
                      health.lightMatch === "Good"
                        ? "text-green-400"
                        : health.lightMatch === "Fair"
                        ? "text-yellow-400"
                        : "text-red-400"
                    }
                  >
                    {health.lightMatch}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] opacity-50">🌬️</span>
                <span className={`text-xs font-light ${colors.muted}`}>
                  AQI tolerance:{" "}
                  <span
                    className={
                      health.aqiTolerance === "High"
                        ? "text-green-400"
                        : health.aqiTolerance === "Medium"
                        ? "text-yellow-400"
                        : "text-red-400"
                    }
                  >
                    {health.aqiTolerance}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: actions */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white/3 border-t border-white/5">
        <span className={`text-[10px] ${colors.muted}`}>
          Added {new Date(myPlant.addedDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </span>
        <button
          onClick={onRemove}
          className={`text-[11px] ${colors.muted} opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all px-2 py-1 rounded-lg hover:bg-white/5`}
        >
          Remove
        </button>
      </div>
    </div>
  );
}

// ========== 4. Health Summary Bar ==========
function HealthSummaryBar({
  myPlants,
  env,
  theme,
}: {
  myPlants: MyPlant[];
  env: EnvironmentConditions;
  theme: WeatherTheme;
}) {
  const colors = themeTextColors[theme];
  const summary = getHealthSummary(myPlants, env);
  const total = myPlants.length;

  return (
    <div
      className="px-4 pb-2"
      style={{ animation: "dashFadeIn 0.35s ease-out 0.2s both" }}
    >
      <div className="bg-white/6 backdrop-blur-md rounded-2xl p-4 border border-white/5">
        <span className={`text-xs uppercase tracking-widest ${colors.muted} font-medium`}>
          Overall Plant Health
        </span>

        {/* Bars */}
        <div className="flex items-center gap-1.5 mt-3 mb-2.5 h-3 rounded-full overflow-hidden bg-white/5">
          {summary.healthy > 0 && (
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-500"
              style={{ width: `${(summary.healthy / total) * 100}%` }}
            />
          )}
          {summary.needsAttention > 0 && (
            <div
              className="h-full bg-yellow-500 rounded-full transition-all duration-500"
              style={{ width: `${(summary.needsAttention / total) * 100}%` }}
            />
          )}
          {summary.atRisk > 0 && (
            <div
              className="h-full bg-red-500 rounded-full transition-all duration-500"
              style={{ width: `${(summary.atRisk / total) * 100}%` }}
            />
          )}
        </div>

        {/* Labels */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className={`text-xs font-light ${colors.secondary}`}>
              Healthy: {summary.healthy}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <span className={`text-xs font-light ${colors.secondary}`}>
              Attention: {summary.needsAttention}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className={`text-xs font-light ${colors.secondary}`}>
              At Risk: {summary.atRisk}
            </span>
          </div>
        </div>

        {/* Disclaimer */}
        <p className={`text-[10px] ${colors.muted} opacity-50 mt-2.5 leading-relaxed`}>
          Health status is estimated using weather, AQI, and care history.
        </p>
      </div>
    </div>
  );
}

// ========== 5. Alert Card ==========
function AlertCard({
  alert,
  theme,
  index,
  onDismiss,
}: {
  alert: PlantAlert;
  theme: WeatherTheme;
  index: number;
  onDismiss: () => void;
}) {
  const colors = themeTextColors[theme];

  return (
    <div
      className="flex items-start gap-3 p-3.5 rounded-xl border transition-all"
      style={{
        backgroundColor: `${alert.color}08`,
        borderColor: `${alert.color}20`,
        animation: `dashFadeIn 0.3s ease-out ${0.3 + index * 0.06}s both`,
      }}
    >
      <span className="text-base flex-shrink-0 mt-0.5">{alert.icon}</span>
      <p className={`text-xs font-light ${colors.secondary} leading-relaxed flex-1`}>
        {alert.message}
      </p>
      {alert.dismissible && (
        <button
          onClick={onDismiss}
          className={`p-1 rounded-full ${colors.muted} hover:bg-white/10 transition-colors flex-shrink-0`}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M9 3L3 9M3 3l6 6" />
          </svg>
        </button>
      )}
    </div>
  );
}

// ========== 7. Empty State ==========
function EmptyState({
  theme,
  onGetRecommendations,
  onAddPlant,
}: {
  theme: WeatherTheme;
  onGetRecommendations: () => void;
  onAddPlant: () => void;
}) {
  const colors = themeTextColors[theme];

  return (
    <div
      className="flex flex-col items-center justify-center py-20 px-8"
      style={{ animation: "dashFadeIn 0.4s ease-out 0.1s both" }}
    >
      {/* Subtle illustration */}
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full bg-white/6 flex items-center justify-center">
          <span className="text-5xl opacity-40">🪴</span>
        </div>
        <div className="absolute -right-1 -bottom-1 w-8 h-8 rounded-full bg-white/8 flex items-center justify-center">
          <span className="text-lg opacity-40">✨</span>
        </div>
      </div>

      <h3 className={`text-base font-light ${colors.primary} mb-2`}>
        You haven't added any plants yet.
      </h3>
      <p className={`text-xs font-light ${colors.muted} text-center mb-6 max-w-[260px]`}>
        Get personalized recommendations or add your existing plants to start tracking their health.
      </p>

      <div className="flex gap-3">
        <button
          onClick={onGetRecommendations}
          className="px-5 py-3 rounded-2xl bg-white/15 text-white text-sm font-light border border-white/10 hover:bg-white/25 active:bg-white/30 transition-all"
        >
          🌿 Get Recommendations
        </button>
        <button
          onClick={onAddPlant}
          className="px-5 py-3 rounded-2xl bg-green-500/15 text-green-300 text-sm font-light border border-green-500/20 hover:bg-green-500/25 active:bg-green-500/35 transition-all"
        >
          ➕ Add Plant
        </button>
      </div>
    </div>
  );
}

// ========== Main Dashboard Component ==========
export function MyPlantsDashboard({
  theme,
  city,
  myPlants,
  isOpen,
  onClose,
  onNavigateRecommendations,
  onNavigateCareSchedule,
  onAddPlant,
  onRemovePlant,
  onWaterPlant,
  onRotatePlant,
}: MyPlantsDashboardProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

  const colors = themeTextColors[theme];
  const gradient = themeGradients[theme];

  const cityData = citiesWeather[city] || citiesWeather["New York"];
  const env = useMemo(() => getEnvironment(cityData), [cityData]);

  // Generate tasks
  const tasks = useMemo(() => generateTasks(myPlants, env), [myPlants, env]);

  // Generate alerts
  const alerts = useMemo(() => {
    const all = generateAlerts(myPlants, env);
    return all.filter((a) => !dismissedAlerts.has(a.id));
  }, [myPlants, env, dismissedAlerts]);

  // Plant health data
  const plantHealthMap = useMemo(() => {
    const map = new Map<string, PlantHealthInfo>();
    myPlants.forEach((mp) => {
      map.set(mp.plantId, estimateHealth(mp, env));
    });
    return map;
  }, [myPlants, env]);

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
      setDismissedAlerts(new Set());
    }
  }, [isOpen]);

  // Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, handleClose]);

  const handleTaskDone = useCallback(
    (task: PlantTask) => {
      if (task.type === "water") onWaterPlant(task.plantId);
      if (task.type === "rotate") onRotatePlant(task.plantId);
    },
    [onWaterPlant, onRotatePlant]
  );

  if (!isOpen) return null;

  const isEmpty = myPlants.length === 0;

  return (
    <div
      className={`fixed inset-0 z-[200] bg-gradient-to-b ${gradient} flex flex-col`}
      style={{
        animation: isClosing
          ? "pageSlideOut 0.2s ease-in forwards"
          : "pageSlideIn 0.3s ease-out",
      }}
    >
      {/* ===== Header ===== */}
      <DashboardHeader theme={theme} plantCount={myPlants.length} onClose={handleClose} />

      {/* ===== Scrollable Content ===== */}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        <div className="max-w-lg mx-auto pb-32">
          {isEmpty ? (
            <EmptyState
              theme={theme}
              onGetRecommendations={onNavigateRecommendations}
              onAddPlant={onAddPlant}
            />
          ) : (
            <>
              {/* ===== 1. Environment Summary ===== */}
              <EnvironmentStrip env={env} city={city} theme={theme} />

              {/* ===== 2. Today's Action Panel ===== */}
              {tasks.length > 0 && (
                <div className="px-4 pt-3 pb-2">
                  <div className="flex items-center gap-2 mb-2.5 px-1">
                    <span className="text-sm">📋</span>
                    <span className={`text-xs uppercase tracking-widest ${colors.muted} font-medium`}>
                      Today's Plant Tasks
                    </span>
                    <span className="ml-auto px-2 py-0.5 rounded-full bg-white/10 text-[10px] text-white/50">
                      {tasks.length}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {tasks.slice(0, 4).map((task, i) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        theme={theme}
                        index={i}
                        onDone={() => handleTaskDone(task)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* ===== 3. My Plants List ===== */}
              <div className="px-4 pt-4 pb-2">
                <div className="flex items-center gap-2 mb-3 px-1">
                  <span className="text-sm">🌱</span>
                  <span className={`text-xs uppercase tracking-widest ${colors.muted} font-medium`}>
                    My Plants
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  {myPlants.map((mp, i) => (
                    <PlantListCard
                      key={mp.plantId}
                      myPlant={mp}
                      health={plantHealthMap.get(mp.plantId)!}
                      theme={theme}
                      index={i}
                      onRemove={() => onRemovePlant(mp.plantId)}
                    />
                  ))}
                </div>
              </div>

              {/* ===== 4. Health Summary ===== */}
              <div className="pt-2">
                <HealthSummaryBar myPlants={myPlants} env={env} theme={theme} />
              </div>

              {/* ===== 5. Alerts ===== */}
              {alerts.length > 0 && (
                <div className="px-4 pt-3 pb-2">
                  <div className="flex items-center gap-2 mb-2.5 px-1">
                    <span className="text-sm">🔔</span>
                    <span className={`text-xs uppercase tracking-widest ${colors.muted} font-medium`}>
                      Important Alerts
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {alerts.map((alert, i) => (
                      <AlertCard
                        key={alert.id}
                        alert={alert}
                        theme={theme}
                        index={i}
                        onDismiss={() =>
                          setDismissedAlerts((prev) => new Set([...prev, alert.id]))
                        }
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* ===== Footer ===== */}
              <div className="text-center px-4 mt-6 pb-4">
                <p className={`text-[10px] uppercase tracking-widest ${colors.muted} opacity-40`}>
                  Health status based on weather, AQI & care history
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ===== 6. Sticky Bottom Action Bar ===== */}
      {!isEmpty && (
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <div
            className="px-4 pb-6 pt-10"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)",
            }}
          >
            <div className="max-w-lg mx-auto flex gap-2">
              <button
                onClick={onAddPlant}
                className="flex-1 py-3.5 rounded-2xl text-sm font-light bg-green-500/15 text-green-300 border border-green-500/20 hover:bg-green-500/25 active:bg-green-500/35 transition-all flex items-center justify-center gap-1.5"
              >
                <span>➕</span> Add
              </button>
              {onNavigateCareSchedule && (
                <button
                  onClick={onNavigateCareSchedule}
                  className="flex-1 py-3.5 rounded-2xl text-sm font-light bg-blue-500/12 text-blue-300 border border-blue-500/15 hover:bg-blue-500/20 active:bg-blue-500/30 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>📅</span> Schedule
                </button>
              )}
              <button
                onClick={() => {
                  handleClose();
                  setTimeout(onNavigateRecommendations, 250);
                }}
                className="flex-1 py-3.5 rounded-2xl text-sm font-light bg-white/10 text-white/80 border border-white/8 hover:bg-white/15 active:bg-white/25 transition-all flex items-center justify-center gap-1.5"
              >
                <span>🧠</span> Tips
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
