export interface HourlyEntry {
  time: string;       // e.g. "Now", "1 PM", "2 AM"
  hour: number;       // 0-23
  temp: number;       // Celsius
  icon: string;       // weather icon key
  rainChance: number; // 0-100
  windSpeed: number;  // km/h
  marker?: "sunrise" | "sunset" | "now";
}

export interface DayForecast {
  label: string;       // "Today", "Tomorrow", "Wed"
  date: string;        // "Feb 8", "Feb 9", "Feb 10"
  sunrise: string;     // "6:15 AM"
  sunset: string;      // "6:42 PM"
  hours: HourlyEntry[];
}

function formatHour(h: number): string {
  if (h === 0) return "12 AM";
  if (h === 12) return "12 PM";
  if (h < 12) return `${h} AM`;
  return `${h - 12} PM`;
}

function getDayNames(): [string, string, string] {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();
  const d2 = new Date(today);
  d2.setDate(d2.getDate() + 2);
  return ["Today", "Tomorrow", days[d2.getDay()]];
}

function getDateStrings(): [string, string, string] {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dates: string[] = [];
  for (let i = 0; i < 3; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    dates.push(`${months[d.getMonth()]} ${d.getDate()}`);
  }
  return dates as [string, string, string];
}

// Generate realistic hourly data with patterns
function generateHours(
  baseTemp: number,
  variation: number,
  baseRain: number,
  baseWind: number,
  pattern: "clear" | "cloudy" | "rainy" | "night-clear" | "mixed",
  startHour: number,
  sunriseHour: number,
  sunsetHour: number,
  isToday: boolean,
): HourlyEntry[] {
  const hours: HourlyEntry[] = [];

  for (let i = 0; i < 24; i++) {
    const h = (startHour + i) % 24;

    // Temperature curve: peaks around 2-3 PM, lowest at 5-6 AM
    const peakOffset = Math.abs(h - 14); // distance from 2PM
    const tempCurve = 1 - (peakOffset / 14) * 0.6;
    const temp = Math.round(baseTemp + variation * tempCurve + (Math.random() * 2 - 1));

    // Rain varies through day
    let rain = baseRain;
    if (pattern === "rainy") {
      rain = Math.min(100, Math.round(baseRain + Math.sin((h / 24) * Math.PI * 2) * 25 + Math.random() * 15));
    } else if (pattern === "mixed") {
      rain = Math.round(Math.max(0, baseRain + (h > 12 && h < 18 ? 30 : -10) + Math.random() * 10));
    } else {
      rain = Math.max(0, Math.round(baseRain + (Math.random() * 10 - 5)));
    }

    // Wind varies slightly
    const wind = Math.max(2, Math.round(baseWind + Math.sin((h / 12) * Math.PI) * 5 + Math.random() * 3 - 1.5));

    // Icon based on time and pattern
    let icon: string;
    const isNightHour = h < sunriseHour || h >= sunsetHour;

    if (isNightHour) {
      icon = rain > 50 ? "rainy" : "night";
    } else {
      switch (pattern) {
        case "clear":
        case "night-clear":
          icon = rain > 40 ? "partly-cloudy" : "sunny";
          break;
        case "cloudy":
          icon = rain > 50 ? "rainy" : (h > 10 && h < 16) ? "partly-cloudy" : "cloudy";
          break;
        case "rainy":
          icon = rain > 40 ? "rainy" : "cloudy";
          break;
        case "mixed":
          icon = h < 12 ? "sunny" : h < 15 ? "partly-cloudy" : h < 18 ? "rainy" : "cloudy";
          break;
        default:
          icon = "sunny";
      }
    }

    // Determine marker
    let marker: HourlyEntry["marker"] = undefined;
    if (i === 0 && isToday) marker = "now";

    hours.push({
      time: i === 0 && isToday ? "Now" : formatHour(h),
      hour: h,
      temp,
      icon,
      rainChance: Math.max(0, Math.min(100, rain)),
      windSpeed: wind,
      marker,
    });
  }

  // Insert sunrise/sunset markers
  const sunriseIdx = hours.findIndex(entry => entry.hour === sunriseHour);
  const sunsetIdx = hours.findIndex(entry => entry.hour === sunsetHour);
  if (sunriseIdx >= 0 && !hours[sunriseIdx].marker) hours[sunriseIdx].marker = "sunrise";
  if (sunsetIdx >= 0 && !hours[sunsetIdx].marker) hours[sunsetIdx].marker = "sunset";

  return hours;
}

// Full hourly data for each city, 3 days
export function getHourlyForecast(city: string): DayForecast[] {
  const dayNames = getDayNames();
  const dateStrings = getDateStrings();

  const now = new Date();
  const currentHour = now.getHours();

  const cityConfigs: Record<string, {
    baseTemp: number;
    variation: number;
    baseRain: number;
    baseWind: number;
    patterns: ["clear" | "cloudy" | "rainy" | "night-clear" | "mixed", "clear" | "cloudy" | "rainy" | "night-clear" | "mixed", "clear" | "cloudy" | "rainy" | "night-clear" | "mixed"];
    sunrise: number;
    sunset: number;
  }> = {
    "New Delhi": {
      baseTemp: 35, variation: 8, baseRain: 8, baseWind: 14,
      patterns: ["clear", "clear", "mixed"],
      sunrise: 6, sunset: 18,
    },
    "London": {
      baseTemp: 12, variation: 5, baseRain: 55, baseWind: 22,
      patterns: ["cloudy", "rainy", "cloudy"],
      sunrise: 7, sunset: 17,
    },
    "Tokyo": {
      baseTemp: 24, variation: 5, baseRain: 25, baseWind: 10,
      patterns: ["mixed", "clear", "cloudy"],
      sunrise: 6, sunset: 18,
    },
    "New York": {
      baseTemp: 20, variation: 6, baseRain: 5, baseWind: 8,
      patterns: ["clear", "clear", "mixed"],
      sunrise: 6, sunset: 19,
    },
    "Sydney": {
      baseTemp: 16, variation: 5, baseRain: 70, baseWind: 28,
      patterns: ["rainy", "cloudy", "clear"],
      sunrise: 6, sunset: 17,
    },
    "Dubai": {
      baseTemp: 6, variation: 6, baseRain: 0, baseWind: 6,
      patterns: ["night-clear", "clear", "clear"],
      sunrise: 6, sunset: 18,
    },
  };

  const config = cityConfigs[city] || cityConfigs["New York"];

  const sunriseStr = `${config.sunrise}:${Math.floor(Math.random() * 30 + 10)} AM`;
  const sunsetStr = `${config.sunset - 12}:${Math.floor(Math.random() * 30 + 20)} PM`;

  return dayNames.map((dayLabel, dayIndex) => ({
    label: dayLabel,
    date: dateStrings[dayIndex],
    sunrise: sunriseStr,
    sunset: sunsetStr,
    hours: generateHours(
      config.baseTemp + (dayIndex === 1 ? 1 : dayIndex === 2 ? -1 : 0),
      config.variation,
      config.baseRain + (dayIndex * 5),
      config.baseWind,
      config.patterns[dayIndex],
      dayIndex === 0 ? currentHour : 0,
      config.sunrise,
      config.sunset,
      dayIndex === 0,
    ),
  }));
}
