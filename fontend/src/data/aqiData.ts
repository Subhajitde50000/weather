export interface Pollutant {
  name: string;
  formula: string;
  value: number;
  unit: string;
  status: "Good" | "Moderate" | "Unhealthy (Sensitive)" | "Unhealthy" | "Very Unhealthy" | "Hazardous";
  color: string;
  percent: number; // 0-100 bar fill
}

export interface AqiDetail {
  aqi: number;
  status: string;
  color: string;
  healthMessage: string;
  targetGroup: string;
  pollutants: Pollutant[];
  trend: "Improving" | "Worsening" | "Stable";
  trendArrow: string;
  lastUpdated: string;
  source: string;
}

function getPollutantStatus(name: string, value: number): { status: Pollutant["status"]; color: string; percent: number } {
  // Simplified breakpoints based on US EPA standards
  const breakpoints: Record<string, number[]> = {
    "PM2.5": [12, 35.4, 55.4, 150.4, 250.4, 500],
    "PM10": [54, 154, 254, 354, 424, 604],
    "NO₂": [53, 100, 360, 649, 1249, 2049],
    "O₃": [54, 70, 85, 105, 200, 400],
    "CO": [4.4, 9.4, 12.4, 15.4, 30.4, 50.4],
    "SO₂": [35, 75, 185, 304, 604, 1004],
  };

  const bp = breakpoints[name] || [50, 100, 150, 200, 300, 500];
  
  if (value <= bp[0]) return { status: "Good", color: "#22C55E", percent: Math.min((value / bp[0]) * 16.7, 16.7) };
  if (value <= bp[1]) return { status: "Moderate", color: "#EAB308", percent: 16.7 + ((value - bp[0]) / (bp[1] - bp[0])) * 16.7 };
  if (value <= bp[2]) return { status: "Unhealthy (Sensitive)", color: "#F97316", percent: 33.4 + ((value - bp[1]) / (bp[2] - bp[1])) * 16.7 };
  if (value <= bp[3]) return { status: "Unhealthy", color: "#EF4444", percent: 50 + ((value - bp[2]) / (bp[3] - bp[2])) * 16.7 };
  if (value <= bp[4]) return { status: "Very Unhealthy", color: "#A855F7", percent: 66.7 + ((value - bp[3]) / (bp[4] - bp[3])) * 16.7 };
  return { status: "Hazardous", color: "#991B1B", percent: Math.min(83.4 + ((value - bp[4]) / (bp[5] - bp[4])) * 16.6, 100) };
}

function getAqiColor(aqi: number): string {
  if (aqi <= 50) return "#22C55E";
  if (aqi <= 100) return "#EAB308";
  if (aqi <= 150) return "#F97316";
  if (aqi <= 200) return "#EF4444";
  if (aqi <= 300) return "#A855F7";
  return "#991B1B";
}

function getAqiStatus(aqi: number): string {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy for Sensitive Groups";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";
  return "Hazardous";
}

function getHealthMessage(aqi: number): { message: string; targetGroup: string } {
  if (aqi <= 50) return {
    message: "Air quality is satisfactory. Enjoy outdoor activities.",
    targetGroup: "Everyone"
  };
  if (aqi <= 100) return {
    message: "Unusually sensitive people should consider limiting prolonged outdoor exertion.",
    targetGroup: "Sensitive individuals"
  };
  if (aqi <= 150) return {
    message: "Sensitive groups should reduce prolonged or heavy outdoor exertion.",
    targetGroup: "Children, elderly, and people with respiratory conditions"
  };
  if (aqi <= 200) return {
    message: "Everyone should reduce prolonged outdoor exertion. Sensitive groups should avoid outdoor activity.",
    targetGroup: "Everyone, especially sensitive groups"
  };
  if (aqi <= 300) return {
    message: "Health alert: everyone may experience serious health effects. Avoid outdoor activity.",
    targetGroup: "Everyone"
  };
  return {
    message: "Health emergency: entire population is at risk. Stay indoors and use air purifiers.",
    targetGroup: "Entire population"
  };
}

interface CityAqiConfig {
  aqi: number;
  pm25: number;
  pm10: number;
  no2: number;
  o3: number;
  co: number;
  so2: number;
  trend: "Improving" | "Worsening" | "Stable";
  source: string;
}

const cityConfigs: Record<string, CityAqiConfig> = {
  "New Delhi": {
    aqi: 156,
    pm25: 68.4,
    pm10: 198,
    no2: 42,
    o3: 28,
    co: 2.1,
    so2: 18,
    trend: "Worsening",
    source: "CPCB India",
  },
  "London": {
    aqi: 42,
    pm25: 8.2,
    pm10: 22,
    no2: 38,
    o3: 42,
    co: 0.8,
    so2: 5,
    trend: "Stable",
    source: "DEFRA UK",
  },
  "Tokyo": {
    aqi: 58,
    pm25: 15.8,
    pm10: 34,
    no2: 28,
    o3: 55,
    co: 1.2,
    so2: 8,
    trend: "Improving",
    source: "MOE Japan",
  },
  "New York": {
    aqi: 35,
    pm25: 6.8,
    pm10: 18,
    no2: 32,
    o3: 38,
    co: 0.6,
    so2: 4,
    trend: "Stable",
    source: "US EPA",
  },
  "Sydney": {
    aqi: 25,
    pm25: 4.2,
    pm10: 12,
    no2: 15,
    o3: 32,
    co: 0.4,
    so2: 2,
    trend: "Improving",
    source: "NSW EPA",
  },
  "Dubai": {
    aqi: 72,
    pm25: 22.5,
    pm10: 85,
    no2: 45,
    o3: 48,
    co: 1.5,
    so2: 12,
    trend: "Worsening",
    source: "Dubai Municipality",
  },
};

export function getAqiDetails(cityName: string): AqiDetail {
  const config = cityConfigs[cityName] || cityConfigs["New York"];
  const color = getAqiColor(config.aqi);
  const status = getAqiStatus(config.aqi);
  const health = getHealthMessage(config.aqi);

  // Build pollutants, sorted by severity (worst first)
  const rawPollutants: { name: string; formula: string; value: number; unit: string }[] = [
    { name: "PM2.5", formula: "PM₂.₅", value: config.pm25, unit: "µg/m³" },
    { name: "PM10", formula: "PM₁₀", value: config.pm10, unit: "µg/m³" },
    { name: "NO₂", formula: "NO₂", value: config.no2, unit: "ppb" },
    { name: "O₃", formula: "O₃", value: config.o3, unit: "ppb" },
    { name: "CO", formula: "CO", value: config.co, unit: "ppm" },
    { name: "SO₂", formula: "SO₂", value: config.so2, unit: "ppb" },
  ];

  const pollutants: Pollutant[] = rawPollutants
    .map((p) => {
      const s = getPollutantStatus(p.name, p.value);
      return {
        name: p.name,
        formula: p.formula,
        value: p.value,
        unit: p.unit,
        status: s.status,
        color: s.color,
        percent: s.percent,
      };
    })
    .sort((a, b) => b.percent - a.percent); // Worst first

  const trendArrow = config.trend === "Improving" ? "↓" : config.trend === "Worsening" ? "↑" : "→";

  // Generate realistic "last updated" time
  const mins = Math.floor(Math.random() * 40) + 5;

  return {
    aqi: config.aqi,
    status,
    color,
    healthMessage: health.message,
    targetGroup: health.targetGroup,
    pollutants,
    trend: config.trend,
    trendArrow,
    lastUpdated: `${mins} min ago`,
    source: config.source,
  };
}
