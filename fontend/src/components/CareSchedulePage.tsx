import { useState, useEffect, useCallback, useMemo } from "react";
import {
  type WeatherTheme,
  themeTextColors,
  themeGradients,
  citiesWeather,
} from "@/data/weatherData";
import { getEnvironment } from "@/data/plantData";
import { type MyPlant, generateTasks, type PlantTask } from "@/data/myPlantsData";
import {
  getWeekDays,
  getPlantSchedules,
  getCareHistory,
  getMissedCare,
  getSeasonalNotice,
  getTodayContext,
  getDefaultReminderSettings,
  type WeekDay,
  type ReminderSettings,
} from "@/data/careScheduleData";

interface CareSchedulePageProps {
  theme: WeatherTheme;
  city: string;
  myPlants: MyPlant[];
  isOpen: boolean;
  onClose: () => void;
  onWaterPlant: (plantId: string) => void;
  onRotatePlant: (plantId: string) => void;
}

// ========== 1. Context Strip ==========
function ContextStrip({
  theme,
  city,
}: {
  theme: WeatherTheme;
  city: string;
}) {
  const colors = themeTextColors[theme];
  const cityData = citiesWeather[city] || citiesWeather["New York"];
  const todayCtx = getTodayContext();

  const aqiColor =
    cityData.aqi <= 50 ? "#22C55E" : cityData.aqi <= 100 ? "#EAB308" : cityData.aqi <= 150 ? "#F97316" : "#EF4444";
  const aqiLabel =
    cityData.aqi <= 50 ? "Good" : cityData.aqi <= 100 ? "Moderate" : cityData.aqi <= 150 ? "Unhealthy" : "Poor";

  return (
    <div
      className="px-4 pt-4 pb-2"
      style={{ animation: "scheduleFadeIn 0.3s ease-out both" }}
    >
      <div className="bg-white/8 backdrop-blur-md rounded-2xl px-4 py-3.5 border border-white/5">
        {/* Date line */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-sm">📅</span>
            <span className={`text-sm font-medium ${colors.primary}`}>
              {todayCtx.fullDate}
            </span>
          </div>
        </div>

        {/* Weather + AQI */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-xs opacity-50">🌤️</span>
            <span className={`text-xs font-light ${colors.muted}`}>
              {cityData.condition} ({cityData.temp}°C)
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: aqiColor }} />
            <span className={`text-xs font-light ${colors.muted}`}>
              AQI: {cityData.aqi} ({aqiLabel})
            </span>
          </div>
        </div>

        {/* Adaptive note */}
        <div className="mt-2.5 pt-2.5 border-t border-white/5">
          <p className={`text-[10px] font-light ${colors.muted} opacity-70 leading-relaxed`}>
            Care schedule is adjusted based on weather & air quality.
          </p>
        </div>
      </div>
    </div>
  );
}

// ========== 2. Today's Task Card ==========
function ScheduleTaskCard({
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
  const [isDone, setIsDone] = useState(false);
  const [snoozed, setSnoozed] = useState(false);

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

  if (snoozed) return null;

  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-xl bg-white/6 border border-white/5 border-l-[3px] ${priorityBorder} transition-all duration-300 ${
        isDone ? "opacity-35 scale-[0.98]" : ""
      }`}
      style={{
        animation: `scheduleTaskSlide 0.3s ease-out ${0.06 + index * 0.05}s both`,
      }}
    >
      {/* Checkbox */}
      <button
        onClick={handleDone}
        disabled={isDone}
        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
          isDone
            ? "bg-green-500/30 border-green-500"
            : "border-white/20 hover:border-white/40 active:scale-95"
        }`}
      >
        {isDone && (
          <svg width="13" height="13" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
            <path d="M2.5 6L5 8.5L9.5 3.5" />
          </svg>
        )}
      </button>

      {/* Task info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-base">{task.icon}</span>
          <span className={`text-sm font-medium ${colors.primary} ${isDone ? "line-through" : ""}`}>
            {task.title}
          </span>
        </div>
        <span className={`text-[11px] font-light ${colors.muted} mt-0.5 block`}>
          {task.reason}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {/* Snooze */}
        {!isDone && (
          <button
            onClick={() => setSnoozed(true)}
            className={`p-1.5 rounded-lg ${colors.muted} hover:bg-white/10 transition-colors`}
            title="Snooze to tomorrow"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </button>
        )}
        {/* Plant emoji */}
        <span className="text-xl">{task.plantImage}</span>
      </div>
    </div>
  );
}

// ========== 3. Weekly Calendar ==========
function WeeklyCalendar({
  weekDays,
  selectedDay,
  onSelectDay,
  theme,
}: {
  weekDays: WeekDay[];
  selectedDay: number;
  onSelectDay: (index: number) => void;
  theme: WeatherTheme;
}) {
  const colors = themeTextColors[theme];

  return (
    <div
      className="px-4 pt-3 pb-2"
      style={{ animation: "scheduleFadeIn 0.3s ease-out 0.05s both" }}
    >
      <div className="flex items-center gap-2 mb-3 px-1">
        <span className="text-sm">📆</span>
        <span className={`text-xs uppercase tracking-widest ${colors.muted} font-medium`}>
          This Week
        </span>
      </div>

      <div className="flex gap-1.5">
        {weekDays.map((day, i) => {
          const isSelected = i === selectedDay;
          const hasTasks = day.tasks.length > 0;

          return (
            <button
              key={i}
              onClick={() => onSelectDay(i)}
              className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all duration-200 ${
                isSelected
                  ? "bg-white/15 border border-white/15"
                  : day.isToday
                  ? "bg-white/8 border border-white/5"
                  : "border border-transparent hover:bg-white/5"
              }`}
            >
              <span className={`text-[10px] font-light uppercase tracking-wider ${
                isSelected ? colors.primary : day.isPast ? `${colors.muted} opacity-50` : colors.muted
              }`}>
                {day.dayShort}
              </span>

              <span className={`text-sm ${
                isSelected
                  ? `font-semibold ${colors.primary}`
                  : day.isToday
                  ? `font-medium ${colors.primary}`
                  : day.isPast
                  ? `font-light ${colors.muted} opacity-50`
                  : `font-light ${colors.secondary}`
              }`}>
                {day.date}
              </span>

              {/* Task indicators */}
              <div className="flex gap-0.5 h-3 items-center">
                {hasTasks ? (
                  day.taskIcons.slice(0, 2).map((icon, j) => (
                    <span key={j} className="text-[8px]">{icon}</span>
                  ))
                ) : (
                  <span className="w-1 h-1 rounded-full bg-white/10" />
                )}
              </div>

              {/* Today indicator */}
              {day.isToday && (
                <div className="w-1 h-1 rounded-full bg-green-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected day tasks */}
      {weekDays[selectedDay] && weekDays[selectedDay].tasks.length > 0 && (
        <div className="mt-3 px-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs font-light ${colors.muted}`}>
              {weekDays[selectedDay].fullDate}
            </span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 ${colors.muted}`}>
              {weekDays[selectedDay].tasks.length} task{weekDays[selectedDay].tasks.length > 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            {weekDays[selectedDay].tasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg ${
                  task.done ? "bg-white/3 opacity-50" : "bg-white/5"
                }`}
              >
                <span className="text-xs">{task.icon}</span>
                <span className={`text-xs font-light ${task.done ? `${colors.muted} line-through` : colors.secondary}`}>
                  {task.title}
                </span>
                <span className="text-xs ml-auto">{task.plantImage}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ========== 4. Plant-Wise Breakdown ==========
function PlantBreakdown({
  myPlants,
  env,
  theme,
}: {
  myPlants: MyPlant[];
  env: ReturnType<typeof getEnvironment>;
  theme: WeatherTheme;
}) {
  const colors = themeTextColors[theme];
  const schedules = useMemo(() => getPlantSchedules(myPlants, env), [myPlants, env]);

  return (
    <div
      className="px-4 pt-4 pb-2"
      style={{ animation: "scheduleFadeIn 0.3s ease-out 0.15s both" }}
    >
      <div className="flex items-center gap-2 mb-3 px-1">
        <span className="text-sm">🌱</span>
        <span className={`text-xs uppercase tracking-widest ${colors.muted} font-medium`}>
          Care by Plant
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        {schedules.map((sched, i) => (
          <div
            key={sched.plantId}
            className="bg-white/6 backdrop-blur-md rounded-2xl border border-white/5 p-4"
            style={{
              animation: `scheduleCardFadeIn 0.3s ease-out ${0.18 + i * 0.06}s both`,
            }}
          >
            <div className="flex items-start gap-3.5">
              {/* Plant avatar */}
              <div className="w-11 h-11 rounded-xl bg-white/8 flex items-center justify-center text-2xl flex-shrink-0 border border-white/5">
                {sched.plantImage}
              </div>

              <div className="flex-1 min-w-0">
                {/* Name + badge */}
                <div className="flex items-center gap-2 mb-2.5">
                  <span className={`text-sm font-medium ${colors.primary}`}>
                    {sched.plantName}
                  </span>
                  <div className="flex items-center gap-1">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: sched.healthColor }}
                    />
                    <span
                      className="text-[10px] font-light capitalize"
                      style={{ color: sched.healthColor }}
                    >
                      {sched.healthBadge === "stable" ? "Stable" : sched.healthBadge === "attention" ? "Attention" : "At Risk"}
                    </span>
                  </div>
                </div>

                {/* Schedule items */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] opacity-50">💧</span>
                    <span className={`text-xs font-light ${colors.muted}`}>
                      Next Watering:{" "}
                      <span className={sched.nextWaterDays <= 1 ? "text-yellow-400" : colors.secondary}>
                        {sched.nextWaterLabel}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] opacity-50">☀️</span>
                    <span className={`text-xs font-light ${colors.muted}`}>
                      Light Check: <span className={colors.secondary}>{sched.lightCheckLabel}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] opacity-50">🧪</span>
                    <span className={`text-xs font-light ${colors.muted}`}>
                      Fertilizer: <span className={colors.secondary}>{sched.fertilizerLabel}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ========== 5. Seasonal Notice ==========
function SeasonalCard({ theme }: { theme: WeatherTheme }) {
  const colors = themeTextColors[theme];
  const notice = getSeasonalNotice();

  if (!notice.show) return null;

  return (
    <div
      className="px-4 pt-3 pb-2"
      style={{ animation: "scheduleFadeIn 0.3s ease-out 0.3s both" }}
    >
      <div className="bg-amber-500/8 backdrop-blur-md rounded-2xl p-4 border border-amber-500/15">
        <div className="flex items-start gap-3">
          <span className="text-xl flex-shrink-0 mt-0.5">{notice.icon}</span>
          <div className="flex-1">
            <span className={`text-xs uppercase tracking-widest font-medium ${colors.secondary}`}>
              {notice.title}
            </span>
            <p className={`text-xs font-light ${colors.muted} leading-relaxed mt-1.5`}>
              {notice.message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ========== 6. Missed Care Warning ==========
function MissedCareCard({
  myPlants,
  theme,
  onWater,
}: {
  myPlants: MyPlant[];
  theme: WeatherTheme;
  onWater: (plantId: string) => void;
}) {
  const colors = themeTextColors[theme];
  const missed = getMissedCare(myPlants);

  if (missed.length === 0) return null;

  return (
    <div
      className="px-4 pt-3 pb-2"
      style={{ animation: "scheduleFadeIn 0.3s ease-out 0.25s both" }}
    >
      <div className="flex items-center gap-2 mb-2.5 px-1">
        <span className="text-sm">⚠️</span>
        <span className={`text-xs uppercase tracking-widest ${colors.muted} font-medium`}>
          Missed Care Alert
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {missed.map((m) => (
          <div
            key={m.plantName}
            className="bg-red-500/8 backdrop-blur-md rounded-xl p-4 border border-red-500/15"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{m.plantImage}</span>
              <div className="flex-1 min-w-0">
                <span className={`text-sm font-medium ${colors.primary}`}>
                  {m.plantName}
                </span>
                <p className={`text-xs font-light ${colors.muted} mt-0.5`}>
                  {m.action}
                </p>
                <p className="text-[11px] font-light text-red-400/80 mt-0.5">
                  Risk: {m.risk}
                </p>
              </div>
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={() => {
                    const plant = myPlants.find(
                      (mp) => (mp.nickname || mp.plant.name) === m.plantName
                    );
                    if (plant) onWater(plant.plantId);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-green-500/15 text-green-300 text-[11px] font-medium hover:bg-green-500/25 active:bg-green-500/35 transition-colors"
                >
                  Do Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ========== 7. Reminder Settings Strip ==========
function ReminderStrip({ theme }: { theme: WeatherTheme }) {
  const colors = themeTextColors[theme];
  const [settings, setSettings] = useState<ReminderSettings>(getDefaultReminderSettings);

  return (
    <div
      className="px-4 pt-4 pb-2"
      style={{ animation: "scheduleFadeIn 0.3s ease-out 0.35s both" }}
    >
      <div className="flex items-center gap-2 mb-3 px-1">
        <span className="text-sm">🔔</span>
        <span className={`text-xs uppercase tracking-widest ${colors.muted} font-medium`}>
          Reminder Settings
        </span>
      </div>

      <div className="bg-white/6 backdrop-blur-md rounded-2xl border border-white/5 p-4">
        {/* Enable/Disable */}
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2.5">
            <span className={`text-sm font-light ${colors.primary}`}>Notifications</span>
          </div>
          <button
            onClick={() => setSettings((s) => ({ ...s, enabled: !s.enabled }))}
            className={`w-11 h-6 rounded-full transition-all duration-200 flex items-center ${
              settings.enabled
                ? "bg-green-500/50 justify-end"
                : "bg-white/10 justify-start"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full mx-0.5 transition-all ${
                settings.enabled ? "bg-green-400" : "bg-white/40"
              }`}
            />
          </button>
        </div>

        <div className="h-px bg-white/5 mb-3.5" />

        {/* Preferred time */}
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <span className="text-xs opacity-50">⏱</span>
            <span className={`text-xs font-light ${colors.muted}`}>Reminder time</span>
          </div>
          <span className={`text-xs font-medium ${colors.secondary}`}>{settings.preferredTime}</span>
        </div>

        <div className="h-px bg-white/5 mb-3.5" />

        {/* Frequency type */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className={`text-xs font-light ${colors.muted}`}>Schedule type</span>
          </div>
          <div className="flex rounded-xl overflow-hidden bg-white/8">
            <button
              onClick={() => setSettings((s) => ({ ...s, frequencyType: "fixed" }))}
              className={`px-3 py-1.5 text-[11px] transition-all ${
                settings.frequencyType === "fixed"
                  ? `bg-white/20 ${colors.primary} font-medium`
                  : `${colors.muted} hover:bg-white/5`
              }`}
            >
              Fixed
            </button>
            <button
              onClick={() => setSettings((s) => ({ ...s, frequencyType: "weather-adaptive" }))}
              className={`px-3 py-1.5 text-[11px] transition-all ${
                settings.frequencyType === "weather-adaptive"
                  ? `bg-white/20 ${colors.primary} font-medium`
                  : `${colors.muted} hover:bg-white/5`
              }`}
            >
              Adaptive
            </button>
          </div>
        </div>

        {settings.frequencyType === "weather-adaptive" && (
          <p className={`text-[10px] font-light ${colors.muted} opacity-60 mt-2.5 leading-relaxed`}>
            Weather-adaptive reminders adjust during heatwaves and monsoon.
          </p>
        )}
      </div>
    </div>
  );
}

// ========== 8. Care History ==========
function CareHistory({
  myPlants,
  theme,
}: {
  myPlants: MyPlant[];
  theme: WeatherTheme;
}) {
  const colors = themeTextColors[theme];
  const [expanded, setExpanded] = useState(false);
  const history = useMemo(() => getCareHistory(myPlants), [myPlants]);

  const visibleHistory = expanded ? history : history.slice(0, 5);

  return (
    <div
      className="px-4 pt-4 pb-2"
      style={{ animation: "scheduleFadeIn 0.3s ease-out 0.4s both" }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 mb-3 px-1 w-full"
      >
        <span className="text-sm">📋</span>
        <span className={`text-xs uppercase tracking-widest ${colors.muted} font-medium`}>
          Recent Care Activity
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className={`ml-auto ${colors.muted} transition-transform ${expanded ? "rotate-180" : ""}`}
        >
          <path d="M3 4.5L6 7.5L9 4.5" />
        </svg>
      </button>

      <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden">
        <div className="divide-y divide-white/5">
          {visibleHistory.map((entry) => (
            <div key={entry.id} className="flex items-center gap-3 px-4 py-3">
              <span
                className={`text-sm ${
                  entry.status === "done" ? "opacity-70" : "opacity-100"
                }`}
              >
                {entry.status === "done" ? "✔" : "❌"}
              </span>
              <span className="text-xs">{entry.icon}</span>
              <div className="flex-1 min-w-0">
                <span
                  className={`text-xs font-light ${
                    entry.status === "missed" ? "text-red-400/80" : colors.secondary
                  }`}
                >
                  {entry.action}{" "}
                  <span className={colors.primary}>{entry.plantName}</span>
                </span>
              </div>
              <span className={`text-[10px] font-light ${colors.muted} flex-shrink-0`}>
                {entry.date}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ========== 9. Empty State ==========
function EmptyState({ theme }: { theme: WeatherTheme }) {
  const colors = themeTextColors[theme];

  return (
    <div
      className="flex flex-col items-center justify-center py-20 px-8"
      style={{ animation: "scheduleFadeIn 0.4s ease-out 0.1s both" }}
    >
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full bg-white/6 flex items-center justify-center">
          <span className="text-5xl opacity-40">📅</span>
        </div>
      </div>
      <h3 className={`text-base font-light ${colors.primary} mb-2`}>
        No care tasks yet.
      </h3>
      <p className={`text-xs font-light ${colors.muted} text-center max-w-[260px]`}>
        Add plants to your collection to see their care schedule here.
      </p>
    </div>
  );
}

// ========== Main CareSchedulePage ==========
export function CareSchedulePage({
  theme,
  city,
  myPlants,
  isOpen,
  onClose,
  onWaterPlant,
  onRotatePlant,
}: CareSchedulePageProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [selectedCalendarDay, setSelectedCalendarDay] = useState(-1); // -1 = no selection, auto today

  const colors = themeTextColors[theme];
  const gradient = themeGradients[theme];

  const cityData = citiesWeather[city] || citiesWeather["New York"];
  const env = useMemo(() => getEnvironment(cityData), [cityData]);

  // Generate tasks for today
  const todayTasks = useMemo(
    () => generateTasks(myPlants, env),
    [myPlants, env]
  );

  // Weekly calendar data
  const weekDays = useMemo(
    () => getWeekDays(myPlants, env),
    [myPlants, env]
  );

  // Find today index in weekDays
  const todayIndex = weekDays.findIndex((d) => d.isToday);

  // Initialize selectedCalendarDay to today
  useEffect(() => {
    if (isOpen && todayIndex >= 0) {
      setSelectedCalendarDay(todayIndex);
    }
  }, [isOpen, todayIndex]);

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
                Care Schedule
              </span>
              <span className={`text-xs font-light ${colors.muted}`}>
                {todayTasks.length} task{todayTasks.length !== 1 ? "s" : ""} today
              </span>
            </div>
          </div>
        </div>
        <div className="h-px bg-white/5" />
      </div>

      {/* ===== Scrollable Content ===== */}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        <div className="max-w-lg mx-auto pb-12">
          {isEmpty ? (
            <EmptyState theme={theme} />
          ) : (
            <>
              {/* 1. Context Strip */}
              <ContextStrip theme={theme} city={city} />

              {/* 2. Today's Care Tasks */}
              {todayTasks.length > 0 && (
                <div className="px-4 pt-3 pb-2">
                  <div className="flex items-center gap-2 mb-3 px-1">
                    <span className="text-sm">✅</span>
                    <span className={`text-xs uppercase tracking-widest ${colors.muted} font-medium`}>
                      Today's Care Tasks
                    </span>
                    <span className="ml-auto px-2 py-0.5 rounded-full bg-white/10 text-[10px] text-white/50">
                      {todayTasks.length}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {todayTasks.slice(0, 5).map((task, i) => (
                      <ScheduleTaskCard
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

              {/* 3. Weekly Calendar */}
              <WeeklyCalendar
                weekDays={weekDays}
                selectedDay={selectedCalendarDay >= 0 ? selectedCalendarDay : todayIndex}
                onSelectDay={setSelectedCalendarDay}
                theme={theme}
              />

              {/* 4. Missed Care Warning */}
              <MissedCareCard
                myPlants={myPlants}
                theme={theme}
                onWater={onWaterPlant}
              />

              {/* 5. Plant-Wise Breakdown */}
              <PlantBreakdown myPlants={myPlants} env={env} theme={theme} />

              {/* 6. Seasonal Notice */}
              <SeasonalCard theme={theme} />

              {/* 7. Reminder Settings */}
              <ReminderStrip theme={theme} />

              {/* 8. Care History */}
              <CareHistory myPlants={myPlants} theme={theme} />

              {/* Footer */}
              <div className="text-center px-4 mt-6 pb-4">
                <p className={`text-[10px] uppercase tracking-widest ${colors.muted} opacity-40`}>
                  Schedule adapts to weather conditions automatically
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
