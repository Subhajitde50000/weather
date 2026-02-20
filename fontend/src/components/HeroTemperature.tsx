import { type WeatherTheme, type AppTheme, getTextColors } from "@/data/weatherData";
import { WeatherIcon } from "./WeatherIcon";

interface HeroTemperatureProps {
  temp: number;
  feelsLike: number;
  condition: string;
  conditionIcon: string;
  theme: WeatherTheme;
  appTheme: AppTheme;
}

export function HeroTemperature({ temp, feelsLike, condition, conditionIcon, theme, appTheme }: HeroTemperatureProps) {
  const colors = getTextColors(theme, appTheme);

  return (
    <div className="flex flex-col items-center justify-center pt-6 pb-4 px-4">
      <div className="mb-2">
        <WeatherIcon type={conditionIcon} size="lg" />
      </div>
      <div className={`${colors.primary} font-extralight leading-none tracking-tighter`} style={{ fontSize: "8.5rem" }}>
        {temp}°
      </div>
      <div className={`${colors.secondary} text-xl font-light mt-1 tracking-wide`}>
        {condition}
      </div>
      <div className={`${colors.muted} text-sm font-light mt-1`}>
        Feels like {feelsLike}°
      </div>
    </div>
  );
}
