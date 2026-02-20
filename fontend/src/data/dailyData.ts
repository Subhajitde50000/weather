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

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface CityDailyPattern {
  baseHigh: number;
  baseLow: number;
  patterns: Array<{
    icon: string;
    condition: string;
    highDelta: number;
    lowDelta: number;
    rain: number;
    wind: number;
    humidity: number;
  }>;
  sunrise: string;
  sunset: string;
}

const cityPatterns: Record<string, CityDailyPattern> = {
  'New Delhi': {
    baseHigh: 32,
    baseLow: 22,
    sunrise: '6:18 AM',
    sunset: '6:02 PM',
    patterns: [
      { icon: '☀️', condition: 'Sunny', highDelta: 0, lowDelta: 0, rain: 5, wind: 10, humidity: 45 },
      { icon: '☀️', condition: 'Clear', highDelta: 1, lowDelta: 1, rain: 0, wind: 8, humidity: 40 },
      { icon: '🌤️', condition: 'Partly Cloudy', highDelta: -1, lowDelta: 0, rain: 10, wind: 12, humidity: 50 },
      { icon: '⛅', condition: 'Mostly Cloudy', highDelta: -2, lowDelta: 1, rain: 30, wind: 15, humidity: 60 },
      { icon: '🌧️', condition: 'Rain', highDelta: -4, lowDelta: 2, rain: 70, wind: 20, humidity: 80 },
      { icon: '⛈️', condition: 'Thunderstorm', highDelta: -5, lowDelta: 2, rain: 85, wind: 25, humidity: 85 },
      { icon: '🌤️', condition: 'Partly Cloudy', highDelta: -1, lowDelta: 0, rain: 15, wind: 14, humidity: 55 },
      { icon: '☀️', condition: 'Sunny', highDelta: 1, lowDelta: -1, rain: 5, wind: 9, humidity: 42 },
      { icon: '☀️', condition: 'Clear', highDelta: 2, lowDelta: -1, rain: 0, wind: 7, humidity: 38 },
      { icon: '🌤️', condition: 'Hazy Sun', highDelta: 0, lowDelta: 0, rain: 5, wind: 11, humidity: 48 },
    ],
  },
  'London': {
    baseHigh: 12,
    baseLow: 5,
    sunrise: '7:42 AM',
    sunset: '4:38 PM',
    patterns: [
      { icon: '🌥️', condition: 'Overcast', highDelta: 0, lowDelta: 0, rain: 40, wind: 18, humidity: 78 },
      { icon: '🌧️', condition: 'Light Rain', highDelta: -1, lowDelta: 1, rain: 65, wind: 22, humidity: 85 },
      { icon: '🌧️', condition: 'Rain', highDelta: -2, lowDelta: 1, rain: 80, wind: 25, humidity: 88 },
      { icon: '🌥️', condition: 'Cloudy', highDelta: 0, lowDelta: 0, rain: 35, wind: 16, humidity: 75 },
      { icon: '⛅', condition: 'Partly Cloudy', highDelta: 1, lowDelta: -1, rain: 20, wind: 14, humidity: 68 },
      { icon: '🌤️', condition: 'Mostly Sunny', highDelta: 2, lowDelta: -1, rain: 10, wind: 12, humidity: 60 },
      { icon: '🌥️', condition: 'Overcast', highDelta: -1, lowDelta: 0, rain: 45, wind: 20, humidity: 80 },
      { icon: '🌧️', condition: 'Drizzle', highDelta: -1, lowDelta: 1, rain: 55, wind: 18, humidity: 82 },
      { icon: '⛅', condition: 'Cloudy Spells', highDelta: 0, lowDelta: 0, rain: 30, wind: 15, humidity: 72 },
      { icon: '🌤️', condition: 'Partly Sunny', highDelta: 1, lowDelta: -1, rain: 15, wind: 13, humidity: 65 },
    ],
  },
  'Tokyo': {
    baseHigh: 15,
    baseLow: 6,
    sunrise: '6:35 AM',
    sunset: '5:15 PM',
    patterns: [
      { icon: '☀️', condition: 'Clear', highDelta: 0, lowDelta: 0, rain: 5, wind: 10, humidity: 50 },
      { icon: '🌤️', condition: 'Partly Cloudy', highDelta: -1, lowDelta: 1, rain: 15, wind: 12, humidity: 55 },
      { icon: '🌥️', condition: 'Cloudy', highDelta: -2, lowDelta: 1, rain: 30, wind: 14, humidity: 62 },
      { icon: '🌧️', condition: 'Rain', highDelta: -3, lowDelta: 2, rain: 70, wind: 18, humidity: 80 },
      { icon: '🌧️', condition: 'Light Rain', highDelta: -2, lowDelta: 1, rain: 55, wind: 16, humidity: 75 },
      { icon: '⛅', condition: 'Clearing', highDelta: 0, lowDelta: 0, rain: 20, wind: 11, humidity: 58 },
      { icon: '☀️', condition: 'Sunny', highDelta: 1, lowDelta: -1, rain: 5, wind: 9, humidity: 48 },
      { icon: '☀️', condition: 'Clear', highDelta: 2, lowDelta: -1, rain: 0, wind: 8, humidity: 45 },
      { icon: '🌤️', condition: 'Fair', highDelta: 0, lowDelta: 0, rain: 10, wind: 10, humidity: 52 },
      { icon: '🌥️', condition: 'Cloudy', highDelta: -1, lowDelta: 1, rain: 35, wind: 13, humidity: 65 },
    ],
  },
  'New York': {
    baseHigh: 8,
    baseLow: -1,
    sunrise: '7:05 AM',
    sunset: '5:10 PM',
    patterns: [
      { icon: '☀️', condition: 'Sunny', highDelta: 0, lowDelta: 0, rain: 5, wind: 15, humidity: 42 },
      { icon: '🌤️', condition: 'Mostly Sunny', highDelta: 1, lowDelta: 0, rain: 10, wind: 12, humidity: 45 },
      { icon: '🌥️', condition: 'Cloudy', highDelta: -2, lowDelta: 2, rain: 40, wind: 20, humidity: 65 },
      { icon: '🌨️', condition: 'Snow Showers', highDelta: -4, lowDelta: 0, rain: 60, wind: 25, humidity: 75 },
      { icon: '🌥️', condition: 'Overcast', highDelta: -3, lowDelta: 1, rain: 35, wind: 18, humidity: 68 },
      { icon: '⛅', condition: 'Partly Cloudy', highDelta: -1, lowDelta: 0, rain: 15, wind: 14, humidity: 50 },
      { icon: '☀️', condition: 'Clear', highDelta: 2, lowDelta: -1, rain: 0, wind: 10, humidity: 38 },
      { icon: '☀️', condition: 'Sunny', highDelta: 3, lowDelta: -1, rain: 5, wind: 11, humidity: 40 },
      { icon: '🌤️', condition: 'Fair', highDelta: 1, lowDelta: 0, rain: 10, wind: 13, humidity: 48 },
      { icon: '🌥️', condition: 'Cloudy', highDelta: -2, lowDelta: 1, rain: 45, wind: 22, humidity: 70 },
    ],
  },
  'Sydney': {
    baseHigh: 26,
    baseLow: 19,
    sunrise: '6:50 AM',
    sunset: '7:45 PM',
    patterns: [
      { icon: '🌤️', condition: 'Partly Cloudy', highDelta: 0, lowDelta: 0, rain: 15, wind: 14, humidity: 60 },
      { icon: '🌧️', condition: 'Showers', highDelta: -2, lowDelta: 1, rain: 60, wind: 18, humidity: 78 },
      { icon: '⛈️', condition: 'Thunderstorm', highDelta: -3, lowDelta: 2, rain: 80, wind: 28, humidity: 85 },
      { icon: '🌥️', condition: 'Cloudy', highDelta: -1, lowDelta: 1, rain: 30, wind: 15, humidity: 65 },
      { icon: '☀️', condition: 'Sunny', highDelta: 2, lowDelta: -1, rain: 5, wind: 10, humidity: 50 },
      { icon: '☀️', condition: 'Clear', highDelta: 3, lowDelta: -1, rain: 0, wind: 8, humidity: 45 },
      { icon: '🌤️', condition: 'Mostly Sunny', highDelta: 1, lowDelta: 0, rain: 10, wind: 12, humidity: 55 },
      { icon: '🌧️', condition: 'Light Rain', highDelta: -2, lowDelta: 1, rain: 50, wind: 16, humidity: 72 },
      { icon: '⛅', condition: 'Clearing', highDelta: 0, lowDelta: 0, rain: 20, wind: 13, humidity: 58 },
      { icon: '☀️', condition: 'Sunny', highDelta: 2, lowDelta: -1, rain: 5, wind: 9, humidity: 48 },
    ],
  },
  'Dubai': {
    baseHigh: 30,
    baseLow: 20,
    sunrise: '6:45 AM',
    sunset: '5:55 PM',
    patterns: [
      { icon: '☀️', condition: 'Sunny', highDelta: 0, lowDelta: 0, rain: 0, wind: 12, humidity: 40 },
      { icon: '☀️', condition: 'Clear', highDelta: 1, lowDelta: 0, rain: 0, wind: 10, humidity: 38 },
      { icon: '☀️', condition: 'Hot & Sunny', highDelta: 2, lowDelta: 1, rain: 0, wind: 8, humidity: 35 },
      { icon: '🌤️', condition: 'Hazy', highDelta: 0, lowDelta: 0, rain: 5, wind: 15, humidity: 45 },
      { icon: '☀️', condition: 'Sunny', highDelta: 1, lowDelta: -1, rain: 0, wind: 11, humidity: 38 },
      { icon: '☀️', condition: 'Clear', highDelta: 2, lowDelta: -1, rain: 0, wind: 9, humidity: 35 },
      { icon: '🌤️', condition: 'Partly Cloudy', highDelta: -1, lowDelta: 1, rain: 10, wind: 14, humidity: 50 },
      { icon: '☀️', condition: 'Sunny', highDelta: 1, lowDelta: 0, rain: 0, wind: 10, humidity: 40 },
      { icon: '☀️', condition: 'Clear', highDelta: 2, lowDelta: -1, rain: 0, wind: 8, humidity: 36 },
      { icon: '🌤️', condition: 'Hazy Sun', highDelta: 0, lowDelta: 0, rain: 5, wind: 13, humidity: 42 },
    ],
  },
};

export function getDailyForecast(cityName: string, unit: 'C' | 'F'): DailyEntry[] {
  const pattern = cityPatterns[cityName] || cityPatterns['New Delhi'];
  const today = new Date();
  const days: DailyEntry[] = [];

  for (let i = 0; i < 10; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    const p = pattern.patterns[i];
    const highC = pattern.baseHigh + p.highDelta;
    const lowC = pattern.baseLow + p.lowDelta;

    const high = unit === 'F' ? Math.round(highC * 9 / 5 + 32) : highC;
    const low = unit === 'F' ? Math.round(lowC * 9 / 5 + 32) : lowC;

    days.push({
      day: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : dayNames[date.getDay()],
      date: `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`,
      shortDate: `${monthNames[date.getMonth()]} ${date.getDate()}`,
      icon: p.icon,
      condition: p.condition,
      high,
      low,
      rainPercent: p.rain,
      wind: p.wind,
      humidity: p.humidity,
      sunrise: pattern.sunrise,
      sunset: pattern.sunset,
      isToday: i === 0,
    });
  }

  return days;
}

export function getDailyStats(days: DailyEntry[]): {
  avgHigh: number;
  avgLow: number;
  rainyDays: number;
} {
  const avgHigh = Math.round(days.reduce((s, d) => s + d.high, 0) / days.length);
  const avgLow = Math.round(days.reduce((s, d) => s + d.low, 0) / days.length);
  const rainyDays = days.filter(d => d.rainPercent >= 40).length;
  return { avgHigh, avgLow, rainyDays };
}
