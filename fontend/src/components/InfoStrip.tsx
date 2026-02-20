import { type WeatherTheme, type WindUnit, convertWind, windUnitLabel } from "@/data/weatherData";
import { getTextColors, type AppTheme } from "@/data/weatherData";

interface InfoStripProps {
  high: number;
  low: number;
  rainChance: number;
  windSpeed: number;
  windUnit: WindUnit;
  theme: WeatherTheme;
  appTheme: AppTheme;
}

export function InfoStrip({ high, low, rainChance, windSpeed, windUnit, theme, appTheme }: InfoStripProps) {
  const colors = getTextColors(theme, appTheme);

  const displayWind = convertWind(windSpeed, windUnit);

  const items = [
    { icon: "🌡️", label: `H: ${high}°` },
    { icon: "❄️", label: `L: ${low}°` },
    { icon: "☔", label: `${rainChance}%` },
    { icon: "🌬️", label: `${displayWind} ${windUnitLabel(windUnit)}` },
  ];

  return (
    <div className="flex items-center justify-center gap-6 py-4 px-4">
      {items.map((item, i) => (
        <div key={i} className={`flex items-center gap-1.5 ${colors.muted} text-sm font-light`}>
          <span className="text-xs opacity-80">{item.icon}</span>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
