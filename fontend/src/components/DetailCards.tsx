import { type AppTheme, type WeatherTheme, getUi } from "@/data/weatherData";

interface DetailCardsProps {
  humidity: number;
  uvIndex: number;
  visibility: number;
  pressure: number;
  theme: WeatherTheme;
  appTheme: AppTheme;
}

export function DetailCards({
  humidity,
  uvIndex,
  visibility,
  pressure,
  theme: _theme,
  appTheme,
}: DetailCardsProps) {
  const ui = getUi(appTheme);
  void _theme;

  const cards = [
    { value: `${humidity}%`, label: "Humidity", hint: humidity > 80 ? "Sticky" : "Balanced" },
    { value: `${uvIndex}`, label: "UV index", hint: uvIndex >= 7 ? "High" : "Gentle" },
    { value: `${visibility} km`, label: "Visibility", hint: visibility < 7 ? "Hazy" : "Clear" },
    { value: `${pressure}`, label: "Pressure", hint: "hPa" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {cards.map((card) => (
        <div key={card.label} className={`${ui.card} flex flex-col gap-1 rounded-[1.4rem] p-4`}>
          <span className={`text-[11px] uppercase tracking-[0.16em] ${ui.faint}`}>{card.label}</span>
          <span className={`font-display text-3xl font-light ${ui.text}`}>{card.value}</span>
          <span className={`text-xs ${ui.muted}`}>{card.hint}</span>
        </div>
      ))}
    </div>
  );
}
