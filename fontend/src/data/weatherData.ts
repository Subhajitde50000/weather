export interface HourlyPreview {
  time: string;
  temp: number;
  icon: string;
}

export interface GasMix {
  o2: number;
  co2: number;
  n2: number;
  ar: number;
}

export interface CityWeather {
  city: string;
  country: string;
  state: string;
  temp: number;
  feelsLike: number;
  high: number;
  low: number;
  condition: string;
  conditionIcon: string;
  rainChance: number;
  windSpeed: number;
  humidity: number;
  uvIndex: number;
  visibility: number;
  pressure: number;
  aqi: number;
  aqiStatus: string;
  isNight: boolean;
  dewPoint: number;
  cloudCover: number;
  gases: GasMix;
  hourly: HourlyPreview[];
  /** Root-absolute path to the city backdrop photo used on the home page */
  photo: string;
}

export const CITIES = ["Kolkata", "Delhi", "Kharagpur"] as const;
export type SupportedCity = (typeof CITIES)[number];

export const citiesWeather: Record<string, CityWeather> = {
  Kolkata: {
    city: "Kolkata",
    country: "India",
    state: "West Bengal",
    temp: 29,
    feelsLike: 35,
    high: 31,
    low: 26,
    condition: "Monsoon showers",
    conditionIcon: "rainy",
    rainChance: 78,
    windSpeed: 18,
    humidity: 86,
    uvIndex: 4,
    visibility: 6.2,
    pressure: 1004,
    aqi: 98,
    aqiStatus: "Moderate",
    isNight: false,
    dewPoint: 26,
    cloudCover: 88,
    gases: { o2: 20.78, co2: 0.046, n2: 78.09, ar: 0.93 },
    photo: "/backgrounds/kolkata.jpg",
    hourly: [
      { time: "Now", temp: 29, icon: "rainy" },
      { time: "2 PM", temp: 30, icon: "rainy" },
      { time: "3 PM", temp: 31, icon: "cloudy" },
      { time: "4 PM", temp: 30, icon: "rainy" },
      { time: "5 PM", temp: 29, icon: "rainy" },
      { time: "6 PM", temp: 28, icon: "cloudy" },
      { time: "7 PM", temp: 27, icon: "cloudy" },
      { time: "8 PM", temp: 27, icon: "night" },
      { time: "9 PM", temp: 26, icon: "night" },
      { time: "10 PM", temp: 26, icon: "rainy" },
      { time: "11 PM", temp: 26, icon: "night" },
      { time: "12 AM", temp: 25, icon: "night" },
    ],
  },
  Delhi: {
    city: "Delhi",
    country: "India",
    state: "Delhi",
    temp: 33,
    feelsLike: 39,
    high: 36,
    low: 27,
    condition: "Humid haze",
    conditionIcon: "haze",
    rainChance: 34,
    windSpeed: 12,
    humidity: 72,
    uvIndex: 7,
    visibility: 5.4,
    pressure: 1007,
    aqi: 128,
    aqiStatus: "Unhealthy (SG)",
    isNight: false,
    dewPoint: 27,
    cloudCover: 46,
    gases: { o2: 20.61, co2: 0.054, n2: 78.02, ar: 0.93 },
    photo: "/backgrounds/delhi.jpg",
    hourly: [
      { time: "Now", temp: 33, icon: "haze" },
      { time: "2 PM", temp: 35, icon: "sunny" },
      { time: "3 PM", temp: 36, icon: "sunny" },
      { time: "4 PM", temp: 35, icon: "haze" },
      { time: "5 PM", temp: 34, icon: "haze" },
      { time: "6 PM", temp: 32, icon: "partly-cloudy" },
      { time: "7 PM", temp: 31, icon: "partly-cloudy" },
      { time: "8 PM", temp: 30, icon: "night" },
      { time: "9 PM", temp: 29, icon: "night" },
      { time: "10 PM", temp: 28, icon: "night" },
      { time: "11 PM", temp: 28, icon: "night" },
      { time: "12 AM", temp: 27, icon: "night" },
    ],
  },
  Kharagpur: {
    city: "Kharagpur",
    country: "India",
    state: "West Bengal",
    temp: 28,
    feelsLike: 33,
    high: 30,
    low: 25,
    condition: "Cloudy with rain",
    conditionIcon: "cloudy",
    rainChance: 62,
    windSpeed: 14,
    humidity: 88,
    uvIndex: 5,
    visibility: 8.1,
    pressure: 1005,
    aqi: 64,
    aqiStatus: "Moderate",
    isNight: false,
    dewPoint: 25,
    cloudCover: 74,
    gases: { o2: 20.89, co2: 0.041, n2: 78.1, ar: 0.93 },
    photo: "/backgrounds/kharagpur.jpg",
    hourly: [
      { time: "Now", temp: 28, icon: "cloudy" },
      { time: "2 PM", temp: 29, icon: "rainy" },
      { time: "3 PM", temp: 29, icon: "rainy" },
      { time: "4 PM", temp: 28, icon: "cloudy" },
      { time: "5 PM", temp: 28, icon: "cloudy" },
      { time: "6 PM", temp: 27, icon: "rainy" },
      { time: "7 PM", temp: 26, icon: "cloudy" },
      { time: "8 PM", temp: 26, icon: "night" },
      { time: "9 PM", temp: 26, icon: "night" },
      { time: "10 PM", temp: 25, icon: "rainy" },
      { time: "11 PM", temp: 25, icon: "night" },
      { time: "12 AM", temp: 25, icon: "night" },
    ],
  },
};

export type WeatherTheme = "clear" | "cloudy" | "rainy" | "night" | "haze";
export type AppTheme = "dark" | "light";
export type WindUnit = "kmh" | "ms";

export function getTheme(data: CityWeather): WeatherTheme {
  if (data.isNight) return "night";
  const c = data.conditionIcon;
  if (c === "rainy") return "rainy";
  if (c === "cloudy") return "cloudy";
  if (c === "haze") return "haze";
  return "clear";
}

export interface UiTokens {
  light: boolean;
  text: string;
  muted: string;
  faint: string;
  card: string;
  chip: string;
  accent: string;
  accentSoft: string;
  hairline: string;
  invertBtn: string;
}

export function getUi(appTheme: AppTheme): UiTokens {
  const light = appTheme === "light";
  return {
    light,
    text: light ? "text-[#123028]" : "text-[#eef8f2]",
    muted: light ? "text-[#4f6b60]" : "text-[#9bc4b3]",
    faint: light ? "text-[#7a9388]" : "text-[#6d9183]",
    card: light
      ? "bg-white/78 backdrop-blur-xl border border-[#123028]/8 shadow-[0_10px_40px_rgba(18,48,40,0.07)]"
      : "bg-white/[0.065] backdrop-blur-xl border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.28)]",
    chip: light ? "bg-[#123028]/6" : "bg-white/8",
    accent: light ? "text-[#147a4e]" : "text-[#7ef0b4]",
    accentSoft: light
      ? "bg-[#1ea36a]/12 text-[#147a4e]"
      : "bg-[#3dd68c]/16 text-[#9af7c8]",
    hairline: light ? "bg-[#123028]/8" : "bg-white/10",
    invertBtn: light
      ? "hover:bg-[#123028]/6 active:bg-[#123028]/10"
      : "hover:bg-white/10 active:bg-white/16",
  };
}

// Kept so older imports still type-check; overlays now use the forest canvas.
export const themeGradients: Record<WeatherTheme, string> = {
  clear: "from-[#0b1f18] via-[#0d241c] to-[#071410]",
  cloudy: "from-[#0a1c1a] via-[#0c201c] to-[#071410]",
  rainy: "from-[#08161a] via-[#0a1c1c] to-[#071410]",
  night: "from-[#071018] via-[#0a1614] to-[#050c0a]",
  haze: "from-[#1a1810] via-[#161810] to-[#0c120e]",
};

export const themeGradientsLight: Record<WeatherTheme, string> = {
  clear: "from-[#eef6ea] via-[#f4f7f0] to-[#e8f0e6]",
  cloudy: "from-[#e6eeea] via-[#eef2ee] to-[#e4ebe6]",
  rainy: "from-[#e2ecec] via-[#e8f0ee] to-[#dce8e4]",
  night: "from-[#dce4e6] via-[#e6ece8] to-[#d8e0dc]",
  haze: "from-[#f3efe4] via-[#f6f1e6] to-[#eee8dc]",
};

export function getGradient(weatherTheme: WeatherTheme, appTheme: AppTheme): string {
  return appTheme === "light" ? themeGradientsLight[weatherTheme] : themeGradients[weatherTheme];
}

export const themeTextColors: Record<WeatherTheme, { primary: string; secondary: string; muted: string }> = {
  clear: { primary: "text-[#eef8f2]", secondary: "text-[#c5e6d6]", muted: "text-[#9bc4b3]" },
  cloudy: { primary: "text-[#eef8f2]", secondary: "text-[#c5e6d6]", muted: "text-[#9bc4b3]" },
  rainy: { primary: "text-[#eef8f2]", secondary: "text-[#c5e6d6]", muted: "text-[#9bc4b3]" },
  night: { primary: "text-[#eef8f2]", secondary: "text-[#c5e6d6]", muted: "text-[#9bc4b3]" },
  haze: { primary: "text-[#eef8f2]", secondary: "text-[#c5e6d6]", muted: "text-[#9bc4b3]" },
};

export const themeTextColorsLight: Record<WeatherTheme, { primary: string; secondary: string; muted: string }> = {
  clear: { primary: "text-[#123028]", secondary: "text-[#2d4a40]", muted: "text-[#4f6b60]" },
  cloudy: { primary: "text-[#123028]", secondary: "text-[#2d4a40]", muted: "text-[#4f6b60]" },
  rainy: { primary: "text-[#123028]", secondary: "text-[#2d4a40]", muted: "text-[#4f6b60]" },
  night: { primary: "text-[#123028]", secondary: "text-[#2d4a40]", muted: "text-[#4f6b60]" },
  haze: { primary: "text-[#123028]", secondary: "text-[#2d4a40]", muted: "text-[#4f6b60]" },
};

export function getTextColors(weatherTheme: WeatherTheme, appTheme: AppTheme) {
  return appTheme === "light" ? themeTextColorsLight[weatherTheme] : themeTextColors[weatherTheme];
}

export const themeCardBg: Record<WeatherTheme, string> = {
  clear: "bg-white/[0.065] backdrop-blur-xl border border-white/10",
  cloudy: "bg-white/[0.065] backdrop-blur-xl border border-white/10",
  rainy: "bg-white/[0.065] backdrop-blur-xl border border-white/10",
  night: "bg-white/[0.065] backdrop-blur-xl border border-white/10",
  haze: "bg-white/[0.065] backdrop-blur-xl border border-white/10",
};

export const themeCardBgLight: Record<WeatherTheme, string> = {
  clear: "bg-white/78 backdrop-blur-xl border border-[#123028]/8 shadow-[0_10px_40px_rgba(18,48,40,0.07)]",
  cloudy: "bg-white/78 backdrop-blur-xl border border-[#123028]/8 shadow-[0_10px_40px_rgba(18,48,40,0.07)]",
  rainy: "bg-white/78 backdrop-blur-xl border border-[#123028]/8 shadow-[0_10px_40px_rgba(18,48,40,0.07)]",
  night: "bg-white/78 backdrop-blur-xl border border-[#123028]/8 shadow-[0_10px_40px_rgba(18,48,40,0.07)]",
  haze: "bg-white/78 backdrop-blur-xl border border-[#123028]/8 shadow-[0_10px_40px_rgba(18,48,40,0.07)]",
};

export function getCardBg(weatherTheme: WeatherTheme, appTheme: AppTheme): string {
  return appTheme === "light" ? themeCardBgLight[weatherTheme] : themeCardBg[weatherTheme];
}

export function convertWind(kmh: number, windUnit: WindUnit): number {
  if (windUnit === "ms") return Math.round((kmh / 3.6) * 10) / 10;
  return kmh;
}

export function windUnitLabel(windUnit: WindUnit): string {
  return windUnit === "ms" ? "m/s" : "km/h";
}

/** Backdrop photo for a city; falls back to Kolkata's. */
export function getCityPhoto(cityName: string): string {
  return citiesWeather[cityName]?.photo ?? citiesWeather.Kolkata.photo;
}

export function resolveCity(cityName: string): string {
  if (citiesWeather[cityName]) return cityName;
  const lower = cityName.toLowerCase();
  const found = Object.keys(citiesWeather).find((c) => c.toLowerCase() === lower);
  if (found) return found;
  if (lower.includes("delhi") || lower.includes("new delhi")) return "Delhi";
  if (lower.includes("kolkata") || lower.includes("calcutta") || lower.includes("howrah")) {
    return "Kolkata";
  }
  if (lower.includes("kharagpur") || lower.includes("kgp") || lower.includes("midnapore")) {
    return "Kharagpur";
  }
  return "Kolkata";
}
