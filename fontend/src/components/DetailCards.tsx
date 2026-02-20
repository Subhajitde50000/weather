import { type WeatherTheme, type AppTheme, getTextColors, getCardBg } from "@/data/weatherData";

interface DetailCardsProps {
  humidity: number;
  uvIndex: number;
  visibility: number;
  pressure: number;
  theme: WeatherTheme;
  appTheme: AppTheme;
}

export function DetailCards({ humidity, uvIndex, visibility, pressure, theme, appTheme }: DetailCardsProps) {
  const colors = getTextColors(theme, appTheme);
  const cardBg = getCardBg(theme, appTheme);

  const cards = [
    { icon: "💧", value: `${humidity}%`, label: "Humidity" },
    { icon: "☀️", value: `${uvIndex}`, label: "UV Index" },
    { icon: "👁️", value: `${visibility} km`, label: "Visibility" },
    { icon: "🔵", value: `${pressure} hPa`, label: "Pressure" },
  ];

  return (
    <div className="px-4 py-3">
      <div className="grid grid-cols-2 gap-3">
        {cards.map((card, i) => (
          <div key={i} className={`${cardBg} rounded-2xl p-4 flex flex-col gap-1`}>
            <span className="text-lg">{card.icon}</span>
            <span className={`text-xl font-light ${colors.primary}`}>{card.value}</span>
            <span className={`text-xs font-light ${colors.muted}`}>{card.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
