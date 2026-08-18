export interface HourlyEntry {
  time: string;
  hour: number;
  temp: number;
  icon: string;
  rainChance: number;
  windSpeed: number;
  marker?: "sunrise" | "sunset" | "now";
}

export interface DayForecast {
  label: string;
  date: string;
  sunrise: string;
  sunset: string;
  hours: HourlyEntry[];
}

function formatHour(h: number): string {
  if (h === 0) return "12 AM";
  if (h === 12) return "12 PM";
  if (h < 12) return `${h} AM`;
  return `${h - 12} PM`;
}

interface CityHourlyConfig {
  sunrise: number;
  sunset: number;
  sunriseLabel: string;
  sunsetLabel: string;
  days: Array<{
    label: string;
    date: string;
    temps: number[];
    rain: number[];
    wind: number[];
    icons: string[];
  }>;
}

const cityHourly: Record<string, CityHourlyConfig> = {
  Kolkata: {
    sunrise: 5,
    sunset: 18,
    sunriseLabel: "5:22 AM",
    sunsetLabel: "6:04 PM",
    days: [
      {
        label: "Today",
        date: "Aug 18",
        temps: [26, 26, 25, 25, 25, 26, 27, 28, 28, 29, 29, 30, 30, 31, 30, 29, 28, 27, 27, 26, 26, 26, 25, 25],
        rain: [55, 50, 48, 46, 44, 42, 48, 58, 64, 70, 74, 78, 80, 72, 78, 76, 62, 54, 58, 64, 60, 52, 48, 46],
        wind: [12, 11, 11, 10, 10, 11, 13, 15, 16, 17, 18, 18, 19, 18, 18, 17, 16, 15, 14, 13, 13, 12, 12, 11],
        icons: [
          "night", "night", "night", "night", "night", "rainy", "cloudy", "rainy",
          "rainy", "rainy", "rainy", "rainy", "cloudy", "rainy", "rainy", "rainy",
          "cloudy", "cloudy", "night", "rainy", "night", "night", "night", "night",
        ],
      },
      {
        label: "Tomorrow",
        date: "Aug 19",
        temps: [25, 25, 25, 24, 24, 25, 26, 27, 28, 29, 29, 30, 30, 30, 29, 28, 27, 27, 26, 26, 26, 25, 25, 25],
        rain: [70, 72, 74, 76, 78, 80, 82, 84, 86, 88, 86, 84, 82, 80, 78, 76, 74, 72, 70, 68, 66, 64, 62, 60],
        wind: [16, 16, 17, 18, 19, 20, 21, 22, 24, 24, 23, 22, 22, 21, 20, 19, 18, 17, 17, 16, 16, 15, 15, 15],
        icons: [
          "night", "rainy", "night", "night", "night", "rainy", "rainy", "rainy",
          "rainy", "rainy", "rainy", "rainy", "rainy", "rainy", "rainy", "cloudy",
          "rainy", "cloudy", "night", "rainy", "night", "night", "night", "night",
        ],
      },
      {
        label: "Thu",
        date: "Aug 20",
        temps: [25, 25, 24, 24, 24, 25, 26, 27, 27, 28, 29, 29, 29, 28, 28, 27, 27, 26, 26, 26, 25, 25, 25, 25],
        rain: [82, 84, 86, 88, 90, 92, 90, 88, 86, 84, 82, 80, 84, 86, 88, 84, 80, 76, 74, 72, 70, 68, 66, 64],
        wind: [18, 18, 19, 20, 21, 22, 22, 22, 21, 21, 20, 20, 19, 19, 18, 18, 17, 16, 16, 15, 15, 14, 14, 14],
        icons: [
          "night", "rainy", "night", "night", "night", "rainy", "rainy", "rainy",
          "rainy", "rainy", "rainy", "rainy", "rainy", "rainy", "rainy", "rainy",
          "cloudy", "rainy", "night", "rainy", "night", "night", "night", "night",
        ],
      },
    ],
  },
  Delhi: {
    sunrise: 6,
    sunset: 19,
    sunriseLabel: "5:51 AM",
    sunsetLabel: "6:55 PM",
    days: [
      {
        label: "Today",
        date: "Aug 18",
        temps: [28, 27, 27, 27, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 35, 34, 32, 31, 30, 29, 29, 28, 28, 28],
        rain: [18, 16, 14, 12, 12, 14, 16, 18, 20, 22, 24, 28, 30, 32, 34, 36, 30, 24, 20, 18, 16, 16, 14, 14],
        wind: [8, 7, 7, 7, 8, 8, 9, 10, 11, 11, 12, 12, 13, 12, 12, 11, 11, 10, 9, 9, 8, 8, 8, 8],
        icons: [
          "night", "night", "night", "night", "night", "haze", "haze", "haze",
          "sunny", "sunny", "haze", "sunny", "sunny", "sunny", "haze", "haze",
          "partly-cloudy", "partly-cloudy", "partly-cloudy", "night", "night", "night", "night", "night",
        ],
      },
      {
        label: "Tomorrow",
        date: "Aug 19",
        temps: [28, 27, 27, 27, 27, 28, 30, 31, 33, 34, 35, 36, 37, 37, 36, 35, 33, 32, 31, 30, 29, 29, 28, 28],
        rain: [12, 10, 10, 8, 8, 10, 12, 14, 14, 16, 16, 18, 18, 20, 18, 16, 14, 12, 12, 10, 10, 10, 10, 10],
        wind: [8, 8, 7, 7, 8, 8, 9, 10, 10, 11, 11, 12, 12, 11, 11, 10, 10, 9, 9, 8, 8, 8, 8, 8],
        icons: [
          "night", "night", "night", "night", "night", "haze", "sunny", "sunny",
          "sunny", "sunny", "sunny", "sunny", "sunny", "sunny", "haze", "haze",
          "partly-cloudy", "haze", "night", "night", "night", "night", "night", "night",
        ],
      },
      {
        label: "Thu",
        date: "Aug 20",
        temps: [28, 27, 27, 26, 26, 27, 29, 30, 32, 33, 34, 35, 35, 34, 33, 32, 31, 30, 29, 29, 28, 28, 27, 27],
        rain: [22, 20, 18, 18, 20, 24, 28, 32, 36, 40, 44, 48, 52, 54, 50, 46, 40, 34, 30, 26, 24, 22, 22, 20],
        wind: [10, 10, 11, 11, 12, 13, 14, 15, 16, 16, 16, 16, 15, 15, 14, 14, 13, 12, 12, 11, 11, 10, 10, 10],
        icons: [
          "night", "night", "night", "night", "night", "cloudy", "cloudy", "partly-cloudy",
          "partly-cloudy", "cloudy", "rainy", "rainy", "rainy", "rainy", "cloudy", "cloudy",
          "partly-cloudy", "cloudy", "night", "night", "night", "night", "night", "night",
        ],
      },
    ],
  },
  Kharagpur: {
    sunrise: 5,
    sunset: 18,
    sunriseLabel: "5:24 AM",
    sunsetLabel: "6:07 PM",
    days: [
      {
        label: "Today",
        date: "Aug 18",
        temps: [25, 25, 25, 24, 24, 25, 26, 27, 27, 28, 28, 29, 29, 29, 28, 28, 27, 26, 26, 26, 25, 25, 25, 25],
        rain: [48, 46, 44, 42, 44, 48, 52, 56, 58, 60, 62, 64, 66, 62, 58, 64, 60, 52, 50, 56, 52, 48, 46, 44],
        wind: [10, 10, 9, 9, 10, 11, 12, 13, 13, 14, 14, 14, 15, 14, 14, 13, 13, 12, 12, 11, 11, 10, 10, 10],
        icons: [
          "night", "night", "night", "night", "night", "cloudy", "cloudy", "cloudy",
          "cloudy", "rainy", "rainy", "rainy", "cloudy", "cloudy", "rainy", "cloudy",
          "cloudy", "cloudy", "night", "rainy", "night", "night", "night", "night",
        ],
      },
      {
        label: "Tomorrow",
        date: "Aug 19",
        temps: [25, 25, 24, 24, 24, 25, 26, 26, 27, 28, 28, 29, 29, 28, 28, 27, 26, 26, 25, 25, 25, 25, 24, 24],
        rain: [68, 70, 72, 74, 76, 78, 80, 80, 78, 76, 74, 72, 70, 68, 70, 72, 68, 64, 62, 60, 58, 56, 54, 52],
        wind: [14, 14, 15, 15, 16, 16, 17, 18, 18, 18, 17, 17, 16, 16, 15, 15, 14, 14, 13, 13, 12, 12, 12, 12],
        icons: [
          "night", "rainy", "night", "night", "night", "rainy", "rainy", "rainy",
          "rainy", "rainy", "rainy", "rainy", "rainy", "cloudy", "rainy", "rainy",
          "cloudy", "rainy", "night", "rainy", "night", "night", "night", "night",
        ],
      },
      {
        label: "Thu",
        date: "Aug 20",
        temps: [24, 24, 24, 23, 23, 24, 25, 26, 27, 27, 28, 28, 28, 27, 27, 26, 26, 25, 25, 25, 24, 24, 24, 24],
        rain: [78, 80, 82, 84, 86, 86, 84, 82, 80, 78, 76, 74, 76, 80, 82, 78, 74, 70, 68, 66, 64, 62, 60, 58],
        wind: [16, 16, 17, 18, 19, 20, 21, 21, 21, 20, 20, 19, 19, 18, 18, 17, 16, 16, 15, 15, 14, 14, 14, 14],
        icons: [
          "night", "rainy", "night", "night", "night", "rainy", "rainy", "rainy",
          "rainy", "rainy", "rainy", "rainy", "rainy", "rainy", "rainy", "cloudy",
          "rainy", "cloudy", "night", "rainy", "night", "night", "night", "night",
        ],
      },
    ],
  },
};

export function getHourlyForecast(city: string): DayForecast[] {
  const config = cityHourly[city] || cityHourly.Kolkata;
  const currentHour = 13;

  return config.days.map((day, dayIndex) => {
    const hours: HourlyEntry[] = day.temps.map((temp, h) => {
      const marker: HourlyEntry["marker"] =
        dayIndex === 0 && h === currentHour
          ? "now"
          : h === config.sunrise
            ? "sunrise"
            : h === config.sunset
              ? "sunset"
              : undefined;

      return {
        time: dayIndex === 0 && h === currentHour ? "Now" : formatHour(h),
        hour: h,
        temp,
        icon: day.icons[h],
        rainChance: day.rain[h],
        windSpeed: day.wind[h],
        marker,
      };
    });

    const sliced = dayIndex === 0 ? hours.slice(currentHour).concat(hours.slice(0, currentHour)) : hours;

    return {
      label: day.label,
      date: day.date,
      sunrise: config.sunriseLabel,
      sunset: config.sunsetLabel,
      hours: sliced,
    };
  });
}
