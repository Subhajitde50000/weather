import { type WeatherTheme, type AppTheme, getTextColors } from "@/data/weatherData";

interface HeaderProps {
  city: string;
  country: string;
  theme: WeatherTheme;
  appTheme: AppTheme;
  onCityClick: () => void;
  onMapClick?: () => void;
  onSettingsClick: () => void;
}

export function Header({ city, country, theme, appTheme, onCityClick, onMapClick, onSettingsClick }: HeaderProps) {
  const colors = getTextColors(theme, appTheme);
  const isLight = appTheme === "light";

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-transparent">
      <div className="flex items-center justify-between px-5 py-3 max-w-lg mx-auto">
        <button
          onClick={onCityClick}
          className={`flex items-center gap-2 ${colors.primary} transition-opacity hover:opacity-80 active:opacity-60`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" opacity="0.8">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
          <span className="text-base font-light tracking-wide">{city}, {country}</span>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" opacity="0.6">
            <path d="M7 10l5 5 5-5z" />
          </svg>
        </button>
        <div className="flex items-center gap-1">
          {onMapClick && (
            <button
              onClick={onMapClick}
              className={`${colors.muted} p-2 rounded-full transition-all ${isLight ? "hover:bg-black/5 active:bg-black/10" : "hover:bg-white/10 active:bg-white/20"}`}
              aria-label="Weather map"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z" />
                <path d="M8 2v16M16 6v16" />
              </svg>
            </button>
          )}
          <button
            onClick={onSettingsClick}
            className={`${colors.muted} p-2 rounded-full transition-all ${isLight ? "hover:bg-black/5 active:bg-black/10" : "hover:bg-white/10 active:bg-white/20"}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
