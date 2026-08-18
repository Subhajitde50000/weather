import { type AppTheme, type WeatherTheme, getUi } from "@/data/weatherData";
import { WeatherIcon } from "./WeatherIcon";

interface HeroTemperatureProps {
  temp: number;
  feelsLike: number;
  condition: string;
  conditionIcon: string;
  theme: WeatherTheme;
  appTheme: AppTheme;
}

export function HeroTemperature({
  temp,
  feelsLike,
  condition,
  conditionIcon,
  theme: _theme,
  appTheme,
}: HeroTemperatureProps) {
  const ui = getUi(appTheme);
  void _theme;

  return (
    <div className="flex flex-col items-center px-4 pb-2 pt-4 text-center lg:items-start lg:px-0 lg:text-left">
      <div className="mb-3" style={{ animation: "floatY 5.5s ease-in-out infinite" }}>
        <WeatherIcon type={conditionIcon} size="lg" />
      </div>
      <div
        className={`font-display font-light leading-none tracking-tight ${ui.text}`}
        style={{ fontSize: "clamp(5.4rem, 14vw, 8.4rem)" }}
      >
        {temp}°
      </div>
      <div className={`mt-2 text-xl font-light tracking-wide ${ui.text}`}>{condition}</div>
      <div className={`mt-1 text-sm font-light ${ui.muted}`}>Feels like {feelsLike}°</div>
    </div>
  );
}
