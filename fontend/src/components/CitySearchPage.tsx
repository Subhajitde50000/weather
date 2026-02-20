import { useState, useEffect, useRef, useCallback } from "react";
import { type WeatherTheme, themeTextColors, themeGradients } from "@/data/weatherData";
import { searchCities, type CityEntry } from "@/data/cityDatabase";

interface CitySearchPageProps {
  theme: WeatherTheme;
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
  const colors = themeTextColors[theme];
  const gradient = themeGradients[theme];

  // Auto-focus on open
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setResults([]);
      setIsClosing(false);
      // Small delay to let animation start, then focus
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Search as user types
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length === 0) {
      setResults([]);
      return;
    }
    const found = searchCities(trimmed);
    setResults(found);
  }, [query]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200);
  }, [onClose]);

  const handleSelect = useCallback(
    (city: string) => {
      onSelect(city);
    },
    [onSelect]
  );

  // Handle back via Escape key
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
  const hasRecent = recentCities.length > 0;
  const hasSaved = savedCities.length > 0;
  const isEmpty = !hasRecent && !hasSaved && !hasQuery;

  return (
    <div
      className={`fixed inset-0 z-[200] bg-gradient-to-b ${gradient} flex flex-col`}
      style={{
        animation: isClosing ? "pageSlideOut 0.2s ease-in forwards" : "pageSlideIn 0.3s ease-out",
      }}
    >
      {/* Fixed Search Bar */}
      <div className="sticky top-0 z-10 px-4 pt-4 pb-2">
        {/* Back button row */}
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={handleClose}
            className={`p-2 -ml-2 rounded-full transition-all hover:bg-white/10 active:bg-white/20 ${colors.primary}`}
            aria-label="Go back"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <span className={`text-base font-light ${colors.primary} tracking-wide`}>
            Search Location
          </span>
        </div>

        {/* Search Input */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className={`${colors.muted}`}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search city or pincode"
            className={`
              w-full h-12 pl-12 pr-12 rounded-2xl
              bg-white/15 backdrop-blur-xl
              ${colors.primary} placeholder:${colors.muted}
              text-base font-light tracking-wide
              outline-none border border-white/10
              focus:border-white/25 focus:bg-white/20
              transition-all duration-200
            `}
            style={{ caretColor: "white" }}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
          {/* Clear button */}
          {hasQuery && (
            <button
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/15 hover:bg-white/25 active:bg-white/35 transition-colors`}
              aria-label="Clear search"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className={colors.primary}>
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-8">
        {/* Current Location Card - shown when not searching */}
        {!hasQuery && (
          <div
            className="mt-3 mb-5"
            style={{ animation: "searchItemFadeIn 0.2s ease-out" }}
          >
            <button
              onClick={() => handleSelect(currentCity)}
              className={`
                w-full flex items-center gap-3.5 p-4 rounded-2xl
                bg-white/12 backdrop-blur-md
                hover:bg-white/18 active:bg-white/25
                transition-all duration-150
                border border-white/8
              `}
            >
              <div className={`w-10 h-10 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className={`${colors.primary} opacity-80`}>
                  <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0013 3.06V1h-2v2.06A8.994 8.994 0 003.06 11H1v2h2.06A8.994 8.994 0 0011 20.94V23h2v-2.06A8.994 8.994 0 0020.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" />
                </svg>
              </div>
              <div className="flex flex-col items-start">
                <span className={`text-sm font-normal ${colors.primary}`}>Use current location</span>
                <span className={`text-xs font-light ${colors.muted} mt-0.5`}>Based on GPS</span>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={`${colors.muted} ml-auto`}>
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        )}

        {/* Search Results */}
        {hasQuery && (
          <div className="mt-2">
            {results.length > 0 ? (
              <div>
                {results.map((entry, i) => (
                  <button
                    key={`${entry.city}-${entry.country}`}
                    onClick={() => handleSelect(entry.city)}
                    className={`
                      w-full flex items-center gap-3.5 py-3.5 px-1
                      hover:bg-white/8 active:bg-white/15
                      transition-all duration-100
                      ${i < results.length - 1 ? "border-b border-white/6" : ""}
                    `}
                    style={{
                      animation: `searchItemFadeIn 0.15s ease-out ${i * 0.03}s both`,
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className={`${colors.muted} flex-shrink-0`}>
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                    <div className="flex flex-col items-start min-w-0">
                      <span className={`text-sm font-medium ${colors.primary} truncate`}>
                        {entry.city}
                      </span>
                      <span className={`text-xs font-light ${colors.muted} truncate`}>
                        {entry.state}, {entry.country}
                      </span>
                    </div>
                    {savedCities.includes(entry.city) && (
                      <span className="ml-auto text-xs opacity-60 flex-shrink-0">⭐</span>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div
                className="flex flex-col items-center justify-center py-16"
                style={{ animation: "searchItemFadeIn 0.2s ease-out" }}
              >
                <div className={`text-4xl mb-4 opacity-30`}>🔍</div>
                <span className={`text-sm font-light ${colors.muted}`}>
                  No cities found for "{query}"
                </span>
                <span className={`text-xs font-light ${colors.muted} mt-1 opacity-70`}>
                  Try a different name or pincode
                </span>
              </div>
            )}
          </div>
        )}

        {/* Recent Locations - shown only when not searching */}
        {!hasQuery && hasRecent && (
          <div
            className="mb-6"
            style={{ animation: "searchItemFadeIn 0.25s ease-out 0.05s both" }}
          >
            <div className={`flex items-center gap-2 mb-2 px-1`}>
              <span className={`text-xs font-light ${colors.muted} uppercase tracking-widest`}>
                Recent
              </span>
            </div>
            <div className="space-y-0.5">
              {recentCities.map((city, i) => (
                <div
                  key={city}
                  className="flex items-center group"
                  style={{
                    animation: `searchItemFadeIn 0.2s ease-out ${0.1 + i * 0.04}s both`,
                  }}
                >
                  <button
                    onClick={() => handleSelect(city)}
                    className={`
                      flex-1 flex items-center gap-3.5 py-3 px-1
                      hover:bg-white/8 active:bg-white/15
                      transition-all duration-100 rounded-xl
                    `}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={`${colors.muted} opacity-60 flex-shrink-0`}>
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                    <span className={`text-sm font-light ${colors.secondary}`}>{city}</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveRecent(city);
                    }}
                    className={`p-2 rounded-full opacity-0 group-hover:opacity-100 hover:bg-white/10 transition-all ${colors.muted}`}
                    aria-label={`Remove ${city} from recent`}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Saved / Favorite Locations */}
        {!hasQuery && hasSaved && (
          <div
            className="mb-6"
            style={{ animation: "searchItemFadeIn 0.25s ease-out 0.1s both" }}
          >
            <div className={`flex items-center gap-2 mb-2 px-1`}>
              <span className={`text-xs font-light ${colors.muted} uppercase tracking-widest`}>
                Saved
              </span>
            </div>
            <div className="space-y-0.5">
              {savedCities.map((city, i) => (
                <div
                  key={city}
                  className="flex items-center group"
                  style={{
                    animation: `searchItemFadeIn 0.2s ease-out ${0.15 + i * 0.04}s both`,
                  }}
                >
                  <button
                    onClick={() => handleSelect(city)}
                    className={`
                      flex-1 flex items-center gap-3.5 py-3 px-1
                      hover:bg-white/8 active:bg-white/15
                      transition-all duration-100 rounded-xl
                    `}
                  >
                    <span className="text-sm flex-shrink-0 opacity-70">⭐</span>
                    <span className={`text-sm font-normal ${colors.primary}`}>{city}</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSave(city);
                    }}
                    className={`p-2 rounded-full opacity-0 group-hover:opacity-100 hover:bg-white/10 transition-all ${colors.muted}`}
                    aria-label={`Remove ${city} from saved`}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {isEmpty && (
          <div
            className="flex flex-col items-center justify-center py-24"
            style={{ animation: "searchItemFadeIn 0.3s ease-out 0.1s both" }}
          >
            <div className="relative mb-6">
              {/* Subtle illustration */}
              <div className={`w-20 h-20 rounded-full bg-white/8 flex items-center justify-center`}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className={`${colors.muted} opacity-40`}>
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
              </div>
            </div>
            <span className={`text-sm font-light ${colors.muted}`}>
              Search for a city to get started
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
