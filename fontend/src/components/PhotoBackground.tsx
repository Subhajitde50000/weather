import { type AppTheme, type WeatherTheme } from "@/data/weatherData";

interface PhotoBackgroundProps {
  /** Root-absolute path to the photo, e.g. "/backgrounds/kolkata.jpg" */
  src: string;
  alt?: string;
  appTheme: AppTheme;
  weatherTheme?: WeatherTheme;
  /**
   * "default" lets more of the photo show (home page).
   * "strong" adds a deeper scrim for text-dense pages (care schedule, settings).
   */
  strength?: "default" | "strong";
  /** Changing this key cross-fades to a new photo (e.g. when the city changes). */
  photoKey?: string;
}

/**
 * Full-screen photographic backdrop with a weather-tinted scrim so translucent
 * cards and light text stay readable on top of it. Layer the Atmosphere
 * particle canvas above it (baseWash disabled) for rain / clouds / stars.
 */
export function PhotoBackground({
  src,
  alt = "",
  appTheme,
  weatherTheme = "clear",
  strength = "default",
  photoKey = src,
}: PhotoBackgroundProps) {
  const light = appTheme === "light";
  const strong = strength === "strong";

  // Dark mode: deep ink base + a hue cast that follows the live weather theme.
  const tintDark: Record<WeatherTheme, string> = {
    rainy: "rgba(56,120,140,0.30)",
    haze: "rgba(160,120,40,0.30)",
    night: "rgba(40,56,110,0.32)",
    cloudy: "rgba(70,96,104,0.28)",
    clear: "rgba(34,110,78,0.28)",
  };

  // Light mode: a soft cream wash keeps dark ink text legible over the photo.
  const tintLight: Record<WeatherTheme, string> = {
    rainy: "rgba(214,232,232,0.72)",
    haze: "rgba(240,230,200,0.72)",
    night: "rgba(214,222,228,0.72)",
    cloudy: "rgba(222,232,228,0.72)",
    clear: "rgba(222,240,224,0.72)",
  };

  const inkEdges = strong ? 0.9 : 0.74;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#071410]">
      {/* Photo with a slow drift so the backdrop feels alive */}
      <img
        key={photoKey}
        src={src}
        alt={alt}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full scale-[1.12] object-cover"
        style={{ animation: "photoFadeIn 0.9s ease-out both, kenBurns 44s ease-in-out infinite alternate" }}
      />

      {/* Weather-tinted scrim for legibility */}
      <div
        className="absolute inset-0 transition-all duration-700"
        style={{
          background: light
            ? `linear-gradient(to bottom, rgba(248,250,246,${strong ? 0.86 : 0.74}) 0%, ${
                tintLight[weatherTheme]
              } 46%, rgba(244,248,240,${strong ? 0.9 : 0.8}) 100%)`
            : `linear-gradient(to bottom, rgba(7,20,16,${inkEdges}) 0%, ${
                tintDark[weatherTheme]
              } 42%, rgba(7,20,16,${strong ? 0.94 : 0.86}) 100%)`,
        }}
      />

      {/* Soft vignette to focus the centre column */}
      <div
        className="absolute inset-0"
        style={{
          background: light
            ? "radial-gradient(ellipse at center, transparent 55%, rgba(18,48,40,0.10) 100%)"
            : "radial-gradient(ellipse at center, transparent 52%, rgba(0,0,0,0.42) 100%)",
        }}
      />
    </div>
  );
}
