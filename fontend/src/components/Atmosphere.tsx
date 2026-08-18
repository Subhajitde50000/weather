import { type AppTheme, type WeatherTheme } from "@/data/weatherData";

interface AtmosphereProps {
  theme: WeatherTheme;
  appTheme: AppTheme;
}

export function Atmosphere({ theme, appTheme }: AtmosphereProps) {
  const light = appTheme === "light";

  const wash =
    theme === "rainy"
      ? light
        ? "from-[#c9ddd8] via-[#dceae4] to-[#e7f0ea]"
        : "from-[#0a1c22] via-[#0b1a18] to-[#071410]"
      : theme === "haze"
        ? light
          ? "from-[#efe4c8] via-[#f3ecda] to-[#eae6d6]"
          : "from-[#241c10] via-[#16140e] to-[#0c100c]"
        : theme === "night"
          ? light
            ? "from-[#cfd8dc] via-[#dce4e0] to-[#e4ece8]"
            : "from-[#081018] via-[#0a1412] to-[#050c0a]"
          : theme === "cloudy"
            ? light
              ? "from-[#d5e0dc] via-[#e4eee8] to-[#eaf2ec]"
              : "from-[#101c1a] via-[#0c1816] to-[#071410]"
            : light
              ? "from-[#dcefd4] via-[#eef6ea] to-[#f4f8f0]"
              : "from-[#122418] via-[#0c1c16] to-[#071410]";

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-b ${wash} transition-colors duration-700`} />

      <div
        className="absolute -top-24 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            theme === "haze"
              ? "radial-gradient(circle, rgba(227,193,90,0.28), transparent 68%)"
              : theme === "rainy"
                ? "radial-gradient(circle, rgba(110,181,255,0.18), transparent 68%)"
                : theme === "night"
                  ? "radial-gradient(circle, rgba(120,150,220,0.16), transparent 68%)"
                  : "radial-gradient(circle, rgba(61,214,140,0.22), transparent 68%)",
          animation: "sunPulse 8s ease-in-out infinite",
        }}
      />

      {(theme === "cloudy" || theme === "rainy" || theme === "haze") && (
        <>
          <div
            className={`absolute top-[8%] -left-[10%] h-32 w-[46%] rounded-full blur-2xl ${
              light ? "bg-white/50" : "bg-white/8"
            }`}
            style={{ animation: "driftX 18s ease-in-out infinite alternate" }}
          />
          <div
            className={`absolute top-[16%] left-[30%] h-24 w-[40%] rounded-full blur-2xl ${
              light ? "bg-white/40" : "bg-white/6"
            }`}
            style={{ animation: "driftX 22s ease-in-out infinite alternate-reverse" }}
          />
        </>
      )}

      {theme === "rainy" &&
        Array.from({ length: 28 }).map((_, i) => (
          <span
            key={i}
            className="rain-drop"
            style={{
              left: `${(i * 3.6 + 4) % 100}%`,
              animationDuration: `${1.1 + (i % 7) * 0.18}s`,
              animationDelay: `${(i % 9) * 0.12}s`,
              opacity: 0.35 + (i % 5) * 0.08,
            }}
          />
        ))}

      {theme === "haze" && (
        <div
          className="absolute inset-x-0 top-[18%] h-56 blur-3xl"
          style={{
            background: light
              ? "linear-gradient(90deg, transparent, rgba(227,193,90,0.28), transparent)"
              : "linear-gradient(90deg, transparent, rgba(227,193,90,0.16), transparent)",
            animation: "hazeDrift 16s ease-in-out infinite",
          }}
        />
      )}

      {theme === "night" &&
        [
          [18, 14],
          [72, 10],
          [84, 22],
          [30, 8],
          [56, 18],
          [12, 26],
        ].map(([x, y], i) => (
          <span
            key={i}
            className="absolute h-1 w-1 rounded-full bg-white"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              animation: `twinkle ${2.4 + i * 0.4}s ease-in-out infinite`,
            }}
          />
        ))}

      <div
        className={`absolute inset-x-0 bottom-0 h-40 ${
          light
            ? "bg-gradient-to-t from-[#e8f0e6] to-transparent"
            : "bg-gradient-to-t from-[#071410] to-transparent"
        }`}
      />
    </div>
  );
}
