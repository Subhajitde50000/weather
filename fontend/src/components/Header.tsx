import { type AppTheme, type WeatherTheme, getUi } from "@/data/weatherData";

interface HeaderProps {
  city: string;
  country: string;
  theme: WeatherTheme;
  appTheme: AppTheme;
  onCityClick: () => void;
  onMapClick?: () => void;
  onSettingsClick: () => void;
}

export function Header({
  city,
  country,
  theme: _theme,
  appTheme,
  onCityClick,
  onMapClick,
  onSettingsClick,
}: HeaderProps) {
  const ui = getUi(appTheme);
  void _theme;

  return (
    <header className="sticky top-0 z-50">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-4 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#3dd68c]/18 text-[#7ef0b4]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 3c2 4 2 6 0 9 2 0 5-1 7-3-1 5-5 9-7 10-2-1-6-5-7-10 2 2 5 3 7 3-2-3-2-5 0-9z" />
            </svg>
          </div>
          <div className="hidden sm:block">
            <p className={`text-[11px] uppercase tracking-[0.24em] ${ui.faint}`}>Verdant</p>
            <p className={`text-sm ${ui.text}`}>Weather · Air · Plants</p>
          </div>
        </div>

        <button
          onClick={onCityClick}
          className={`flex items-center gap-2 rounded-full px-3 py-1.5 ${ui.card} ${ui.text} transition-transform active:scale-95`}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="opacity-70">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
          <span className="text-sm font-medium tracking-wide">
            {city}
            <span className={`hidden font-light sm:inline ${ui.muted}`}> · {country}</span>
          </span>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="opacity-50">
            <path d="M7 10l5 5 5-5z" />
          </svg>
        </button>

        <div className="flex items-center gap-1">
          {onMapClick && (
            <button
              onClick={onMapClick}
              className={`${ui.muted} rounded-full p-2 transition-all ${ui.invertBtn}`}
              aria-label="Weather map"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z" />
                <path d="M8 2v16M16 6v16" />
              </svg>
            </button>
          )}
          <button
            onClick={onSettingsClick}
            className={`${ui.muted} rounded-full p-2 transition-all ${ui.invertBtn}`}
            aria-label="Settings"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
