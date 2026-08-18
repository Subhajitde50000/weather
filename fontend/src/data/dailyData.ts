export interface DailyEntry {
  day: string;
  date: string;
  shortDate: string;
  icon: string;
  condition: string;
  high: number;
  low: number;
  rainPercent: number;
  wind: number;
  humidity: number;
  sunrise: string;
  sunset: string;
  isToday: boolean;
}

interface CityDaily {
  sunrise: string;
  sunset: string;
  days: Array<{
    day: string;
    date: string;
    shortDate: string;
    icon: string;
    condition: string;
    high: number;
    low: number;
    rain: number;
    wind: number;
    humidity: number;
  }>;
}

const cityDays: Record<string, CityDaily> = {
  Kolkata: {
    sunrise: "5:22 AM",
    sunset: "6:04 PM",
    days: [
      { day: "Today", date: "Aug 18, 2026", shortDate: "Aug 18", icon: "🌧️", condition: "Monsoon showers", high: 31, low: 26, rain: 78, wind: 18, humidity: 86 },
      { day: "Wed", date: "Aug 19, 2026", shortDate: "Aug 19", icon: "⛈️", condition: "Thunderstorm", high: 30, low: 26, rain: 88, wind: 24, humidity: 90 },
      { day: "Thu", date: "Aug 20, 2026", shortDate: "Aug 20", icon: "🌧️", condition: "Heavy rain", high: 29, low: 25, rain: 92, wind: 22, humidity: 91 },
      { day: "Fri", date: "Aug 21, 2026", shortDate: "Aug 21", icon: "🌥️", condition: "Overcast", high: 30, low: 26, rain: 54, wind: 16, humidity: 84 },
      { day: "Sat", date: "Aug 22, 2026", shortDate: "Aug 22", icon: "🌦️", condition: "Light showers", high: 31, low: 26, rain: 61, wind: 14, humidity: 82 },
      { day: "Sun", date: "Aug 23, 2026", shortDate: "Aug 23", icon: "⛅", condition: "Partly cloudy", high: 32, low: 27, rain: 38, wind: 12, humidity: 76 },
      { day: "Mon", date: "Aug 24, 2026", shortDate: "Aug 24", icon: "🌧️", condition: "Rain", high: 30, low: 26, rain: 70, wind: 17, humidity: 85 },
      { day: "Tue", date: "Aug 25, 2026", shortDate: "Aug 25", icon: "🌥️", condition: "Cloudy", high: 31, low: 26, rain: 45, wind: 13, humidity: 80 },
      { day: "Wed", date: "Aug 26, 2026", shortDate: "Aug 26", icon: "🌤️", condition: "Hazy sun", high: 33, low: 27, rain: 22, wind: 11, humidity: 72 },
      { day: "Thu", date: "Aug 27, 2026", shortDate: "Aug 27", icon: "🌧️", condition: "Showers return", high: 31, low: 26, rain: 66, wind: 15, humidity: 83 },
    ],
  },
  Delhi: {
    sunrise: "5:51 AM",
    sunset: "6:55 PM",
    days: [
      { day: "Today", date: "Aug 18, 2026", shortDate: "Aug 18", icon: "🌤️", condition: "Humid haze", high: 36, low: 27, rain: 34, wind: 12, humidity: 72 },
      { day: "Wed", date: "Aug 19, 2026", shortDate: "Aug 19", icon: "☀️", condition: "Hot & humid", high: 37, low: 28, rain: 18, wind: 10, humidity: 68 },
      { day: "Thu", date: "Aug 20, 2026", shortDate: "Aug 20", icon: "🌦️", condition: "Evening shower", high: 35, low: 27, rain: 52, wind: 16, humidity: 74 },
      { day: "Fri", date: "Aug 21, 2026", shortDate: "Aug 21", icon: "🌧️", condition: "Monsoon pulse", high: 33, low: 26, rain: 71, wind: 19, humidity: 80 },
      { day: "Sat", date: "Aug 22, 2026", shortDate: "Aug 22", icon: "🌥️", condition: "Cloudy", high: 34, low: 27, rain: 40, wind: 14, humidity: 73 },
      { day: "Sun", date: "Aug 23, 2026", shortDate: "Aug 23", icon: "☀️", condition: "Clearing", high: 36, low: 27, rain: 16, wind: 11, humidity: 64 },
      { day: "Mon", date: "Aug 24, 2026", shortDate: "Aug 24", icon: "🌤️", condition: "Hazy sun", high: 37, low: 28, rain: 20, wind: 13, humidity: 66 },
      { day: "Tue", date: "Aug 25, 2026", shortDate: "Aug 25", icon: "🌦️", condition: "Scattered rain", high: 34, low: 27, rain: 48, wind: 15, humidity: 75 },
      { day: "Wed", date: "Aug 26, 2026", shortDate: "Aug 26", icon: "☀️", condition: "Mostly sunny", high: 36, low: 27, rain: 12, wind: 10, humidity: 62 },
      { day: "Thu", date: "Aug 27, 2026", shortDate: "Aug 27", icon: "🌤️", condition: "Warm haze", high: 37, low: 28, rain: 22, wind: 12, humidity: 67 },
    ],
  },
  Kharagpur: {
    sunrise: "5:24 AM",
    sunset: "6:07 PM",
    days: [
      { day: "Today", date: "Aug 18, 2026", shortDate: "Aug 18", icon: "🌥️", condition: "Cloudy with rain", high: 30, low: 25, rain: 62, wind: 14, humidity: 88 },
      { day: "Wed", date: "Aug 19, 2026", shortDate: "Aug 19", icon: "🌧️", condition: "Steady rain", high: 29, low: 25, rain: 80, wind: 18, humidity: 90 },
      { day: "Thu", date: "Aug 20, 2026", shortDate: "Aug 20", icon: "⛈️", condition: "Thunderstorm", high: 28, low: 24, rain: 86, wind: 21, humidity: 92 },
      { day: "Fri", date: "Aug 21, 2026", shortDate: "Aug 21", icon: "🌧️", condition: "Showers", high: 29, low: 25, rain: 68, wind: 15, humidity: 87 },
      { day: "Sat", date: "Aug 22, 2026", shortDate: "Aug 22", icon: "⛅", condition: "Breaks of sun", high: 31, low: 25, rain: 36, wind: 11, humidity: 78 },
      { day: "Sun", date: "Aug 23, 2026", shortDate: "Aug 23", icon: "🌤️", condition: "Mostly fair", high: 32, low: 26, rain: 24, wind: 10, humidity: 74 },
      { day: "Mon", date: "Aug 24, 2026", shortDate: "Aug 24", icon: "🌧️", condition: "Rain returns", high: 29, low: 25, rain: 72, wind: 16, humidity: 86 },
      { day: "Tue", date: "Aug 25, 2026", shortDate: "Aug 25", icon: "🌥️", condition: "Overcast", high: 30, low: 25, rain: 48, wind: 13, humidity: 82 },
      { day: "Wed", date: "Aug 26, 2026", shortDate: "Aug 26", icon: "🌦️", condition: "Light rain", high: 30, low: 25, rain: 55, wind: 12, humidity: 81 },
      { day: "Thu", date: "Aug 27, 2026", shortDate: "Aug 27", icon: "⛅", condition: "Partly cloudy", high: 31, low: 26, rain: 33, wind: 11, humidity: 76 },
    ],
  },
};

export function getDailyForecast(cityName: string, unit: "C" | "F"): DailyEntry[] {
  const pack = cityDays[cityName] || cityDays.Kolkata;

  return pack.days.map((d, i) => ({
    day: d.day,
    date: d.date,
    shortDate: d.shortDate,
    icon: d.icon,
    condition: d.condition,
    high: unit === "F" ? Math.round((d.high * 9) / 5 + 32) : d.high,
    low: unit === "F" ? Math.round((d.low * 9) / 5 + 32) : d.low,
    rainPercent: d.rain,
    wind: d.wind,
    humidity: d.humidity,
    sunrise: pack.sunrise,
    sunset: pack.sunset,
    isToday: i === 0,
  }));
}

export function getDailyStats(days: DailyEntry[]): {
  avgHigh: number;
  avgLow: number;
  rainyDays: number;
} {
  const avgHigh = Math.round(days.reduce((s, d) => s + d.high, 0) / days.length);
  const avgLow = Math.round(days.reduce((s, d) => s + d.low, 0) / days.length);
  const rainyDays = days.filter((d) => d.rainPercent >= 40).length;
  return { avgHigh, avgLow, rainyDays };
}
