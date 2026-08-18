import { useCallback, useEffect, useRef, useState } from "react";
import { type AppTheme, type WeatherTheme, getUi } from "@/data/weatherData";
import { searchCities, cityDatabase, type CityEntry } from "@/data/cityDatabase";
import { Atmosphere } from "./Atmosphere";

interface CitySearchPageProps {
  theme: WeatherTheme;
  appTheme: AppTheme;
  currentCity: string;
  recentCities: string[];
  savedCities: string[];
  isOpen: boolean;
  onSelect: (city: string) => void;
  onClose: () => void;
  onToggleSave: (city: string) => void;
  onRemoveRecent: (city: string) => void;
}

export function CitySearchPage({
  theme,
  appTheme,
  currentCity,
  recentCities,
  savedCities,
  isOpen,
  onSelect,
  onClose,
  onToggleSave,
  onRemoveRecent,
}: CitySearchPageProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CityEntry[]>([]);
  const [isClosing, setIsClosing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const ui = getUi(appTheme);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setResults([]);
      setIsClosing(false);
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const trimmed = query.trim();
    setResults(trimmed.length === 0 ? [] : searchCities(trimmed));
  }, [query]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200);
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  const hasQuery = query.trim().length > 0;

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col"
      style={{
        animation: isClosing ? "pageSlideOut 0.2s ease-in forwards" : "pageSlideIn 0.3s ease-out",
      }}
    >
      <Atmosphere theme={theme} appTheme={appTheme} />
      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <div className="px-4 pt-4 pb-2">
          <div className="mx-auto max-w-3xl">
            <div className="mb-3 flex items-center gap-3">
              <button onClick={handleClose} className={`-ml-2 rounded-full p-2 ${ui.text} ${ui.invertBtn}`} aria-label="Go back">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>
              <span className={`text-base ${ui.text}`}>Choose a city</span>
            </div>
            <div className="relative">
              <div className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={ui.muted}>
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </div>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Kolkata, Delhi or Kharagpur"
                className={`h-12 w-full rounded-2xl border pr-12 pl-12 text-base outline-none ${ui.card} ${ui.text}`}
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
              />
              {hasQuery && (
                <button
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                  className={`absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1.5 ${ui.chip}`}
                  aria-label="Clear search"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={ui.text}>
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-8">
          <div className="mx-auto max-w-3xl">
            {!hasQuery && (
              <div className="mt-4 mb-6">
                <p className={`mb-3 text-[11px] uppercase tracking-[0.2em] ${ui.faint}`}>Covered cities</p>
                <div className="grid gap-3 sm:grid-cols-3">
                  {cityDatabase.map((entry) => (
                    <button
                      key={entry.city}
                      onClick={() => onSelect(entry.city)}
                      className={`${ui.card} rounded-2xl p-4 text-left transition-transform active:scale-[0.98] ${
                        entry.city === currentCity ? "ring-1 ring-[#3dd68c]/50" : ""
                      }`}
                    >
                      <p className={`text-sm font-medium ${ui.text}`}>{entry.city}</p>
                      <p className={`mt-1 text-xs ${ui.muted}`}>
                        {entry.state} · {entry.airportCode}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {hasQuery && (
              <div className="mt-3">
                {results.length > 0 ? (
                  results.map((entry) => (
                    <button
                      key={entry.city}
                      onClick={() => onSelect(entry.city)}
                      className={`flex w-full items-center gap-3.5 border-b py-3.5 ${ui.light ? "border-black/5" : "border-white/6"}`}
                    >
                      <div className="min-w-0 text-left">
                        <p className={`text-sm font-medium ${ui.text}`}>{entry.city}</p>
                        <p className={`text-xs ${ui.muted}`}>
                          {entry.state}, {entry.country}
                        </p>
                      </div>
                      {savedCities.includes(entry.city) && <span className="ml-auto text-xs">★</span>}
                    </button>
                  ))
                ) : (
                  <div className="py-16 text-center">
                    <p className={`text-sm ${ui.muted}`}>No match for “{query}”</p>
                    <p className={`mt-1 text-xs ${ui.faint}`}>Try Kolkata, Delhi or Kharagpur</p>
                  </div>
                )}
              </div>
            )}

            {!hasQuery && recentCities.length > 0 && (
              <div className="mb-6">
                <p className={`mb-2 text-[11px] uppercase tracking-[0.2em] ${ui.faint}`}>Recent</p>
                {recentCities.map((city) => (
                  <div key={city} className="group flex items-center">
                    <button onClick={() => onSelect(city)} className="flex-1 py-3 text-left">
                      <span className={`text-sm ${ui.text}`}>{city}</span>
                    </button>
                    <button onClick={() => onRemoveRecent(city)} className={`rounded-full p-2 ${ui.muted}`} aria-label={`Remove ${city}`}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {!hasQuery && savedCities.length > 0 && (
              <div>
                <p className={`mb-2 text-[11px] uppercase tracking-[0.2em] ${ui.faint}`}>Saved</p>
                {savedCities.map((city) => (
                  <div key={city} className="flex items-center">
                    <button onClick={() => onSelect(city)} className="flex-1 py-3 text-left">
                      <span className={`text-sm ${ui.text}`}>{city}</span>
                    </button>
                    <button onClick={() => onToggleSave(city)} className={`rounded-full p-2 ${ui.muted}`} aria-label={`Unsave ${city}`}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
