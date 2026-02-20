import { useState, useEffect, useCallback } from "react";
import {
  type WeatherTheme,
  type AppTheme,
  type WindUnit,
} from "@/data/weatherData";
import { getTextColors, getGradient, getCardBg } from "@/data/weatherData";

interface SettingsPageProps {
  weatherTheme: WeatherTheme;
  appTheme: AppTheme;
  unit: "C" | "F";
  windUnit: WindUnit;
  isOpen: boolean;
  onUnitChange: (unit: "C" | "F") => void;
  onWindUnitChange: (unit: WindUnit) => void;
  onThemeChange: (theme: AppTheme) => void;
  onClose: () => void;
}

// ---------- Toggle Switch Component ----------
function ToggleSwitch({
  options,
  value,
  onChange,
  weatherTheme,
  appTheme,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  weatherTheme: WeatherTheme;
  appTheme: AppTheme;
}) {
  const colors = getTextColors(weatherTheme, appTheme);
  const isLight = appTheme === "light";

  return (
    <div
      className={`flex rounded-2xl overflow-hidden ${
        isLight ? "bg-black/5" : "bg-white/10"
      }`}
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-5 py-2.5 text-sm font-light transition-all duration-200 ${
            value === opt.value
              ? isLight
                ? `bg-white shadow-sm ${colors.primary} font-medium`
                : `bg-white/25 ${colors.primary} font-medium`
              : `${colors.muted} ${isLight ? "hover:bg-black/3" : "hover:bg-white/5"}`
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ---------- Setting Row ----------
function SettingRow({
  icon,
  label,
  description,
  children,
  weatherTheme,
  appTheme,
  index,
}: {
  icon: string;
  label: string;
  description?: string;
  children: React.ReactNode;
  weatherTheme: WeatherTheme;
  appTheme: AppTheme;
  index: number;
}) {
  const colors = getTextColors(weatherTheme, appTheme);
  const cardBg = getCardBg(weatherTheme, appTheme);

  return (
    <div
      className={`${cardBg} rounded-2xl p-5 border ${
        appTheme === "light" ? "border-black/5" : "border-white/5"
      }`}
      style={{
        animation: `settingsFadeIn 0.3s ease-out ${0.05 + index * 0.06}s both`,
      }}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${
              appTheme === "light" ? "bg-black/5" : "bg-white/10"
            }`}
          >
            {icon}
          </div>
          <div className="flex flex-col min-w-0">
            <span className={`text-sm font-medium ${colors.primary}`}>
              {label}
            </span>
            {description && (
              <span className={`text-xs font-light ${colors.muted} mt-0.5`}>
                {description}
              </span>
            )}
          </div>
        </div>
        <div className="flex-shrink-0">{children}</div>
      </div>
    </div>
  );
}

// ---------- Location Permission Component ----------
function LocationPermission({
  weatherTheme,
  appTheme,
}: {
  weatherTheme: WeatherTheme;
  appTheme: AppTheme;
}) {
  const [permStatus, setPermStatus] = useState<
    "granted" | "denied" | "prompt" | "unknown"
  >("unknown");
  const [isRequesting, setIsRequesting] = useState(false);
  const colors = getTextColors(weatherTheme, appTheme);
  const isLight = appTheme === "light";

  useEffect(() => {
    if ("permissions" in navigator) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((result) => {
          setPermStatus(result.state as "granted" | "denied" | "prompt");
          result.onchange = () => {
            setPermStatus(result.state as "granted" | "denied" | "prompt");
          };
        })
        .catch(() => {
          setPermStatus("unknown");
        });
    }
  }, []);

  const requestPermission = () => {
    setIsRequesting(true);
    navigator.geolocation.getCurrentPosition(
      () => {
        setPermStatus("granted");
        setIsRequesting(false);
      },
      () => {
        setPermStatus("denied");
        setIsRequesting(false);
      },
      { timeout: 10000 }
    );
  };

  if (permStatus === "granted") {
    return (
      <div className="flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
        <span className={`text-sm font-light ${colors.primary}`}>Allowed</span>
      </div>
    );
  }

  if (permStatus === "denied") {
    return (
      <div className="flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
        <span className={`text-xs font-light ${colors.muted}`}>Blocked</span>
      </div>
    );
  }

  return (
    <button
      onClick={requestPermission}
      disabled={isRequesting}
      className={`px-4 py-2 rounded-xl text-sm font-light transition-all ${
        isLight
          ? "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 active:bg-blue-500/30"
          : "bg-white/15 text-white hover:bg-white/25 active:bg-white/35"
      } ${isRequesting ? "opacity-50" : ""}`}
    >
      {isRequesting ? (
        <span className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 border border-current border-t-transparent rounded-full animate-spin" />
          Requesting...
        </span>
      ) : (
        "Allow"
      )}
    </button>
  );
}

// ---------- Theme Preview Component ----------
function ThemePreview({
  appTheme,
  weatherTheme,
  onChange,
}: {
  appTheme: AppTheme;
  weatherTheme: WeatherTheme;
  onChange: (theme: AppTheme) => void;
}) {
  const colors = getTextColors(weatherTheme, appTheme);
  const isLight = appTheme === "light";

  return (
    <div className="flex gap-2.5">
      {/* Light */}
      <button
        onClick={() => onChange("light")}
        className={`relative flex flex-col items-center gap-1.5 transition-all duration-200`}
      >
        <div
          className={`w-14 h-10 rounded-xl overflow-hidden border-2 transition-all ${
            isLight
              ? "border-blue-500 shadow-md shadow-blue-500/20"
              : isLight
              ? "border-black/10"
              : "border-white/10"
          }`}
        >
          <div className="w-full h-full bg-gradient-to-b from-sky-200 via-blue-100 to-white relative">
            <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-amber-400" />
            <div className="absolute bottom-1 left-1 right-1 h-1.5 rounded-full bg-gray-800/8" />
            <div className="absolute bottom-3 left-1 right-1 h-1 rounded-full bg-gray-800/5" />
          </div>
        </div>
        <span
          className={`text-[11px] ${
            isLight ? `font-medium ${colors.primary}` : `font-light ${colors.muted}`
          }`}
        >
          Light
        </span>
        {isLight && (
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
            <svg
              width="8"
              height="8"
              viewBox="0 0 10 10"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M1.5 5.5L4 8L8.5 2" />
            </svg>
          </div>
        )}
      </button>

      {/* Dark */}
      <button
        onClick={() => onChange("dark")}
        className={`relative flex flex-col items-center gap-1.5 transition-all duration-200`}
      >
        <div
          className={`w-14 h-10 rounded-xl overflow-hidden border-2 transition-all ${
            !isLight
              ? "border-blue-500 shadow-md shadow-blue-500/20"
              : isLight
              ? "border-black/10"
              : "border-white/10"
          }`}
        >
          <div className="w-full h-full bg-gradient-to-b from-indigo-800 via-slate-800 to-gray-900 relative">
            <div className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-white/50" />
            <div className="absolute top-1 right-4 w-0.5 h-0.5 rounded-full bg-white/30" />
            <div className="absolute bottom-1 left-1 right-1 h-1.5 rounded-full bg-white/10" />
            <div className="absolute bottom-3 left-1 right-1 h-1 rounded-full bg-white/5" />
          </div>
        </div>
        <span
          className={`text-[11px] ${
            !isLight ? `font-medium ${colors.primary}` : `font-light ${colors.muted}`
          }`}
        >
          Dark
        </span>
        {!isLight && (
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
            <svg
              width="8"
              height="8"
              viewBox="0 0 10 10"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M1.5 5.5L4 8L8.5 2" />
            </svg>
          </div>
        )}
      </button>
    </div>
  );
}

// ---------- Main Settings Page ----------
export function SettingsPage({
  weatherTheme,
  appTheme,
  unit,
  windUnit,
  isOpen,
  onUnitChange,
  onWindUnitChange,
  onThemeChange,
  onClose,
}: SettingsPageProps) {
  const [isClosing, setIsClosing] = useState(false);

  const colors = getTextColors(weatherTheme, appTheme);
  const gradient = getGradient(weatherTheme, appTheme);
  const isLight = appTheme === "light";

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
    setIsClosing(false);
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

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
      <div
        className={`sticky top-0 z-20 backdrop-blur-xl ${
          isLight ? "bg-white/30" : "bg-black/5"
        }`}
      >
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3 px-4 pt-4 pb-3">
            <button
              onClick={handleClose}
              className={`p-2 -ml-2 rounded-full transition-all ${
                isLight
                  ? "hover:bg-black/5 active:bg-black/10"
                  : "hover:bg-white/10 active:bg-white/20"
              } ${colors.primary}`}
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
              <span
                className={`text-base font-light ${colors.primary} tracking-wide`}
              >
                Settings
              </span>
              <span className={`text-xs font-light ${colors.muted}`}>
                Customize your experience
              </span>
            </div>
          </div>
        </div>
        <div
          className={`h-px ${isLight ? "bg-black/5" : "bg-white/5"}`}
        />
      </div>

      {/* ========== Scrollable Content ========== */}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        <div className="max-w-lg mx-auto px-4 py-6 flex flex-col gap-3">
          {/* ---------- Section: Units ---------- */}
          <div
            className={`mb-1`}
            style={{
              animation: "settingsFadeIn 0.3s ease-out both",
            }}
          >
            <span
              className={`text-xs font-light ${colors.muted} uppercase tracking-widest px-1`}
            >
              Units
            </span>
          </div>

          {/* Temperature */}
          <SettingRow
            icon="🌡️"
            label="Temperature"
            description="Display temperature in"
            weatherTheme={weatherTheme}
            appTheme={appTheme}
            index={0}
          >
            <ToggleSwitch
              options={[
                { value: "C", label: "°C" },
                { value: "F", label: "°F" },
              ]}
              value={unit}
              onChange={(v) => onUnitChange(v as "C" | "F")}
              weatherTheme={weatherTheme}
              appTheme={appTheme}
            />
          </SettingRow>

          {/* Wind Speed */}
          <SettingRow
            icon="🌬️"
            label="Wind Speed"
            description="Display wind speed in"
            weatherTheme={weatherTheme}
            appTheme={appTheme}
            index={1}
          >
            <ToggleSwitch
              options={[
                { value: "kmh", label: "km/h" },
                { value: "ms", label: "m/s" },
              ]}
              value={windUnit}
              onChange={(v) => onWindUnitChange(v as WindUnit)}
              weatherTheme={weatherTheme}
              appTheme={appTheme}
            />
          </SettingRow>

          {/* ---------- Section: Location ---------- */}
          <div
            className="mt-4 mb-1"
            style={{
              animation: "settingsFadeIn 0.3s ease-out 0.15s both",
            }}
          >
            <span
              className={`text-xs font-light ${colors.muted} uppercase tracking-widest px-1`}
            >
              Location
            </span>
          </div>

          {/* Location Permissions */}
          <SettingRow
            icon="📍"
            label="Location Access"
            description="Allow GPS for current location"
            weatherTheme={weatherTheme}
            appTheme={appTheme}
            index={2}
          >
            <LocationPermission
              weatherTheme={weatherTheme}
              appTheme={appTheme}
            />
          </SettingRow>

          {/* ---------- Section: Appearance ---------- */}
          <div
            className="mt-4 mb-1"
            style={{
              animation: "settingsFadeIn 0.3s ease-out 0.25s both",
            }}
          >
            <span
              className={`text-xs font-light ${colors.muted} uppercase tracking-widest px-1`}
            >
              Appearance
            </span>
          </div>

          {/* Theme */}
          <SettingRow
            icon={isLight ? "☀️" : "🌙"}
            label="Theme"
            description="Choose light or dark mode"
            weatherTheme={weatherTheme}
            appTheme={appTheme}
            index={3}
          >
            <ThemePreview
              appTheme={appTheme}
              weatherTheme={weatherTheme}
              onChange={onThemeChange}
            />
          </SettingRow>

          {/* ---------- About Section ---------- */}
          <div
            className="mt-6 mb-1"
            style={{
              animation: "settingsFadeIn 0.3s ease-out 0.35s both",
            }}
          >
            <span
              className={`text-xs font-light ${colors.muted} uppercase tracking-widest px-1`}
            >
              About
            </span>
          </div>

          <div
            className={`${getCardBg(weatherTheme, appTheme)} rounded-2xl p-5 border ${
              isLight ? "border-black/5" : "border-white/5"
            }`}
            style={{
              animation: "settingsFadeIn 0.3s ease-out 0.4s both",
            }}
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-light ${colors.secondary}`}>
                  Version
                </span>
                <span className={`text-sm font-light ${colors.muted}`}>
                  1.0.0
                </span>
              </div>
              <div
                className={`h-px ${isLight ? "bg-black/5" : "bg-white/5"}`}
              />
              <div className="flex items-center justify-between">
                <span className={`text-sm font-light ${colors.secondary}`}>
                  Data Source
                </span>
                <span className={`text-sm font-light ${colors.muted}`}>
                  Simulated
                </span>
              </div>
              <div
                className={`h-px ${isLight ? "bg-black/5" : "bg-white/5"}`}
              />
              <div className="flex items-center justify-between">
                <span className={`text-sm font-light ${colors.secondary}`}>
                  Design
                </span>
                <span className={`text-sm font-light ${colors.muted}`}>
                  Google Weather–inspired
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className="text-center mt-6 pb-8"
            style={{
              animation: "settingsFadeIn 0.3s ease-out 0.45s both",
            }}
          >
            <p
              className={`text-[10px] uppercase tracking-widest ${colors.muted} opacity-50`}
            >
              Weather Dashboard · Made with care
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
