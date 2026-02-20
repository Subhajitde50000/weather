export interface CityWeather {
  city: string;
  country: string;
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
  hourly: { time: string; temp: number; icon: string }[];
}

export const citiesWeather: Record<string, CityWeather> = {
  "New Delhi": {
    city: "New Delhi",
    country: "India",
    temp: 38,
    feelsLike: 42,
    high: 41,
    low: 28,
    condition: "Haze",
    conditionIcon: "haze",
    rainChance: 10,
    windSpeed: 14,
    humidity: 45,
    uvIndex: 9,
    visibility: 3.2,
    pressure: 1006,
    aqi: 156,
    aqiStatus: "Unhealthy",
    isNight: false,
    hourly: [
      { time: "Now", temp: 38, icon: "haze" },
      { time: "1 PM", temp: 39, icon: "sunny" },
      { time: "2 PM", temp: 40, icon: "sunny" },
      { time: "3 PM", temp: 41, icon: "sunny" },
      { time: "4 PM", temp: 40, icon: "sunny" },
      { time: "5 PM", temp: 38, icon: "partly-cloudy" },
      { time: "6 PM", temp: 36, icon: "partly-cloudy" },
      { time: "7 PM", temp: 34, icon: "cloudy" },
      { time: "8 PM", temp: 32, icon: "night" },
      { time: "9 PM", temp: 31, icon: "night" },
      { time: "10 PM", temp: 30, icon: "night" },
      { time: "11 PM", temp: 29, icon: "night" },
    ],
  },
  "London": {
    city: "London",
    country: "United Kingdom",
    temp: 14,
    feelsLike: 12,
    high: 16,
    low: 9,
    condition: "Overcast",
    conditionIcon: "cloudy",
    rainChance: 65,
    windSpeed: 22,
    humidity: 78,
    uvIndex: 3,
    visibility: 8.5,
    pressure: 1013,
    aqi: 42,
    aqiStatus: "Good",
    isNight: false,
    hourly: [
      { time: "Now", temp: 14, icon: "cloudy" },
      { time: "1 PM", temp: 15, icon: "cloudy" },
      { time: "2 PM", temp: 15, icon: "rainy" },
      { time: "3 PM", temp: 14, icon: "rainy" },
      { time: "4 PM", temp: 14, icon: "cloudy" },
      { time: "5 PM", temp: 13, icon: "cloudy" },
      { time: "6 PM", temp: 12, icon: "partly-cloudy" },
      { time: "7 PM", temp: 11, icon: "night" },
      { time: "8 PM", temp: 10, icon: "night" },
      { time: "9 PM", temp: 10, icon: "night" },
      { time: "10 PM", temp: 9, icon: "night" },
      { time: "11 PM", temp: 9, icon: "night" },
    ],
  },
  "Tokyo": {
    city: "Tokyo",
    country: "Japan",
    temp: 26,
    feelsLike: 29,
    high: 28,
    low: 22,
    condition: "Partly Cloudy",
    conditionIcon: "partly-cloudy",
    rainChance: 30,
    windSpeed: 10,
    humidity: 68,
    uvIndex: 6,
    visibility: 12,
    pressure: 1010,
    aqi: 58,
    aqiStatus: "Moderate",
    isNight: false,
    hourly: [
      { time: "Now", temp: 26, icon: "partly-cloudy" },
      { time: "1 PM", temp: 27, icon: "partly-cloudy" },
      { time: "2 PM", temp: 28, icon: "sunny" },
      { time: "3 PM", temp: 28, icon: "sunny" },
      { time: "4 PM", temp: 27, icon: "partly-cloudy" },
      { time: "5 PM", temp: 26, icon: "partly-cloudy" },
      { time: "6 PM", temp: 25, icon: "cloudy" },
      { time: "7 PM", temp: 24, icon: "night" },
      { time: "8 PM", temp: 23, icon: "night" },
      { time: "9 PM", temp: 23, icon: "night" },
      { time: "10 PM", temp: 22, icon: "night" },
      { time: "11 PM", temp: 22, icon: "night" },
    ],
  },
  "New York": {
    city: "New York",
    country: "United States",
    temp: 22,
    feelsLike: 23,
    high: 25,
    low: 17,
    condition: "Clear",
    conditionIcon: "sunny",
    rainChance: 5,
    windSpeed: 8,
    humidity: 52,
    uvIndex: 7,
    visibility: 16,
    pressure: 1018,
    aqi: 35,
    aqiStatus: "Good",
    isNight: false,
    hourly: [
      { time: "Now", temp: 22, icon: "sunny" },
      { time: "1 PM", temp: 23, icon: "sunny" },
      { time: "2 PM", temp: 24, icon: "sunny" },
      { time: "3 PM", temp: 25, icon: "sunny" },
      { time: "4 PM", temp: 24, icon: "sunny" },
      { time: "5 PM", temp: 23, icon: "partly-cloudy" },
      { time: "6 PM", temp: 21, icon: "partly-cloudy" },
      { time: "7 PM", temp: 20, icon: "night" },
      { time: "8 PM", temp: 19, icon: "night" },
      { time: "9 PM", temp: 18, icon: "night" },
      { time: "10 PM", temp: 18, icon: "night" },
      { time: "11 PM", temp: 17, icon: "night" },
    ],
  },
  "Sydney": {
    city: "Sydney",
    country: "Australia",
    temp: 18,
    feelsLike: 16,
    high: 20,
    low: 13,
    condition: "Rainy",
    conditionIcon: "rainy",
    rainChance: 85,
    windSpeed: 28,
    humidity: 88,
    uvIndex: 2,
    visibility: 5,
    pressure: 1002,
    aqi: 25,
    aqiStatus: "Good",
    isNight: false,
    hourly: [
      { time: "Now", temp: 18, icon: "rainy" },
      { time: "1 PM", temp: 17, icon: "rainy" },
      { time: "2 PM", temp: 17, icon: "rainy" },
      { time: "3 PM", temp: 18, icon: "rainy" },
      { time: "4 PM", temp: 18, icon: "cloudy" },
      { time: "5 PM", temp: 17, icon: "cloudy" },
      { time: "6 PM", temp: 16, icon: "cloudy" },
      { time: "7 PM", temp: 15, icon: "night" },
      { time: "8 PM", temp: 14, icon: "night" },
      { time: "9 PM", temp: 14, icon: "night" },
      { time: "10 PM", temp: 13, icon: "night" },
      { time: "11 PM", temp: 13, icon: "night" },
    ],
  },
  "Dubai": {
    city: "Dubai",
    country: "UAE",
    temp: 8,
    feelsLike: 5,
    high: 10,
    low: 3,
    condition: "Clear Night",
    conditionIcon: "night",
    rainChance: 0,
    windSpeed: 6,
    humidity: 30,
    uvIndex: 0,
    visibility: 20,
    pressure: 1020,
    aqi: 72,
    aqiStatus: "Moderate",
    isNight: true,
    hourly: [
      { time: "Now", temp: 8, icon: "night" },
      { time: "11 PM", temp: 7, icon: "night" },
      { time: "12 AM", temp: 6, icon: "night" },
      { time: "1 AM", temp: 5, icon: "night" },
      { time: "2 AM", temp: 4, icon: "night" },
      { time: "3 AM", temp: 4, icon: "night" },
      { time: "4 AM", temp: 3, icon: "night" },
      { time: "5 AM", temp: 3, icon: "night" },
      { time: "6 AM", temp: 4, icon: "night" },
      { time: "7 AM", temp: 6, icon: "sunny" },
      { time: "8 AM", temp: 8, icon: "sunny" },
      { time: "9 AM", temp: 9, icon: "sunny" },
    ],
  },
};

export type WeatherTheme = "clear" | "cloudy" | "rainy" | "night" | "haze";

export function getTheme(data: CityWeather): WeatherTheme {
  if (data.isNight) return "night";
  const c = data.conditionIcon;
  if (c === "rainy") return "rainy";
  if (c === "cloudy") return "cloudy";
  if (c === "haze") return "haze";
  return "clear";
}

export type AppTheme = "dark" | "light";

// Dark mode gradients (default)
export const themeGradients: Record<WeatherTheme, string> = {
  clear: "from-sky-400 via-blue-400 to-blue-500",
  cloudy: "from-slate-400 via-gray-400 to-slate-500",
  rainy: "from-slate-600 via-slate-700 to-gray-800",
  night: "from-indigo-900 via-slate-900 to-gray-950",
  haze: "from-amber-300 via-orange-300 to-yellow-400",
};

// Light mode gradients
export const themeGradientsLight: Record<WeatherTheme, string> = {
  clear: "from-sky-100 via-blue-50 to-white",
  cloudy: "from-slate-200 via-gray-100 to-white",
  rainy: "from-slate-300 via-gray-200 to-slate-100",
  night: "from-indigo-200 via-slate-200 to-gray-100",
  haze: "from-amber-100 via-orange-50 to-yellow-50",
};

export function getGradient(weatherTheme: WeatherTheme, appTheme: AppTheme): string {
  return appTheme === "light" ? themeGradientsLight[weatherTheme] : themeGradients[weatherTheme];
}

// Dark mode text colors
export const themeTextColors: Record<WeatherTheme, { primary: string; secondary: string; muted: string }> = {
  clear: { primary: "text-white", secondary: "text-white/80", muted: "text-white/60" },
  cloudy: { primary: "text-white", secondary: "text-white/80", muted: "text-white/60" },
  rainy: { primary: "text-white", secondary: "text-white/75", muted: "text-white/55" },
  night: { primary: "text-white", secondary: "text-white/75", muted: "text-white/55" },
  haze: { primary: "text-gray-900", secondary: "text-gray-800/80", muted: "text-gray-700/60" },
};

// Light mode text colors
export const themeTextColorsLight: Record<WeatherTheme, { primary: string; secondary: string; muted: string }> = {
  clear: { primary: "text-gray-900", secondary: "text-gray-700", muted: "text-gray-500" },
  cloudy: { primary: "text-gray-900", secondary: "text-gray-700", muted: "text-gray-500" },
  rainy: { primary: "text-slate-900", secondary: "text-slate-700", muted: "text-slate-500" },
  night: { primary: "text-indigo-950", secondary: "text-indigo-800", muted: "text-indigo-600/70" },
  haze: { primary: "text-amber-950", secondary: "text-amber-800", muted: "text-amber-700/70" },
};

export function getTextColors(weatherTheme: WeatherTheme, appTheme: AppTheme) {
  return appTheme === "light" ? themeTextColorsLight[weatherTheme] : themeTextColors[weatherTheme];
}

// Dark mode card backgrounds
export const themeCardBg: Record<WeatherTheme, string> = {
  clear: "bg-white/15 backdrop-blur-md",
  cloudy: "bg-white/15 backdrop-blur-md",
  rainy: "bg-white/10 backdrop-blur-md",
  night: "bg-white/10 backdrop-blur-md",
  haze: "bg-white/30 backdrop-blur-md",
};

// Light mode card backgrounds
export const themeCardBgLight: Record<WeatherTheme, string> = {
  clear: "bg-white/60 backdrop-blur-md shadow-sm shadow-black/5",
  cloudy: "bg-white/60 backdrop-blur-md shadow-sm shadow-black/5",
  rainy: "bg-white/50 backdrop-blur-md shadow-sm shadow-black/5",
  night: "bg-white/60 backdrop-blur-md shadow-sm shadow-black/5",
  haze: "bg-white/60 backdrop-blur-md shadow-sm shadow-black/5",
};

export function getCardBg(weatherTheme: WeatherTheme, appTheme: AppTheme): string {
  return appTheme === "light" ? themeCardBgLight[weatherTheme] : themeCardBg[weatherTheme];
}

// Wind unit types and conversion
export type WindUnit = "kmh" | "ms";

export function convertWind(kmh: number, windUnit: WindUnit): number {
  if (windUnit === "ms") return Math.round((kmh / 3.6) * 10) / 10;
  return kmh;
}

export function windUnitLabel(windUnit: WindUnit): string {
  return windUnit === "ms" ? "m/s" : "km/h";
}
