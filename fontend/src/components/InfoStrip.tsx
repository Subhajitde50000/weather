import {
  type AppTheme,
  type WeatherTheme,
  type WindUnit,
  convertWind,
  getUi,
  windUnitLabel,
} from "@/data/weatherData";

interface InfoStripProps {
  high: number;
  low: number;
  rainChance: number;
  windSpeed: number;
  windUnit: WindUnit;
  theme: WeatherTheme;
  appTheme: AppTheme;
}

export function InfoStrip({
  high,
  low,
  rainChance,
  windSpeed,
  windUnit,
  theme: _theme,
  appTheme,
}: InfoStripProps) {
  const ui = getUi(appTheme);
  void _theme;
  const displayWind = convertWind(windSpeed, windUnit);

  const items = [
    { label: "High", value: `${high}°` },
    { label: "Low", value: `${low}°` },
    { label: "Rain", value: `${rainChance}%` },
    { label: "Wind", value: `${displayWind} ${windUnitLabel(windUnit)}` },
  ];

  return (
    <div className={`mt-5 grid grid-cols-4 gap-2 ${ui.card} rounded-[1.4rem] p-3`}>
      {items.map((item) => (
        <div key={item.label} className="flex flex-col items-center gap-1 py-1">
          <span className={`text-[10px] uppercase tracking-[0.16em] ${ui.faint}`}>{item.label}</span>
          <span className={`text-sm font-medium ${ui.text}`}>{item.value}</span>
        </div>
      ))}
    </div>
  );
}
