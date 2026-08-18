export interface Pollutant {
  name: string;
  formula: string;
  value: number;
  unit: string;
  status: "Good" | "Moderate" | "Unhealthy (Sensitive)" | "Unhealthy" | "Very Unhealthy" | "Hazardous";
  color: string;
  percent: number;
}

export interface GasShare {
  key: "o2" | "co2" | "n2";
  label: string;
  formula: string;
  value: number;
  unit: string;
  note: string;
  color: string;
}

export interface AqiDetail {
  aqi: number;
  status: string;
  color: string;
  healthMessage: string;
  targetGroup: string;
  pollutants: Pollutant[];
  gases: GasShare[];
  trend: "Improving" | "Worsening" | "Stable";
  trendArrow: string;
  lastUpdated: string;
  source: string;
}

function getPollutantStatus(name: string, value: number): { status: Pollutant["status"]; color: string; percent: number } {
  const breakpoints: Record<string, number[]> = {
    "PM2.5": [12, 35.4, 55.4, 150.4, 250.4, 500],
    "PM10": [54, 154, 254, 354, 424, 604],
    "NO₂": [53, 100, 360, 649, 1249, 2049],
    "O₃": [54, 70, 85, 105, 200, 400],
    "CO": [4.4, 9.4, 12.4, 15.4, 30.4, 50.4],
    "SO₂": [35, 75, 185, 304, 604, 1004],
  };

  const bp = breakpoints[name] || [50, 100, 150, 200, 300, 500];

  if (value <= bp[0]) return { status: "Good", color: "#3dd68c", percent: Math.min((value / bp[0]) * 16.7, 16.7) };
  if (value <= bp[1]) return { status: "Moderate", color: "#e3c15a", percent: 16.7 + ((value - bp[0]) / (bp[1] - bp[0])) * 16.7 };
  if (value <= bp[2]) return { status: "Unhealthy (Sensitive)", color: "#e08a3a", percent: 33.4 + ((value - bp[1]) / (bp[2] - bp[1])) * 16.7 };
  if (value <= bp[3]) return { status: "Unhealthy", color: "#e25b5b", percent: 50 + ((value - bp[2]) / (bp[3] - bp[2])) * 16.7 };
  if (value <= bp[4]) return { status: "Very Unhealthy", color: "#b06ad4", percent: 66.7 + ((value - bp[3]) / (bp[4] - bp[3])) * 16.7 };
  return { status: "Hazardous", color: "#9b2c2c", percent: Math.min(83.4 + ((value - bp[4]) / (bp[5] - bp[4])) * 16.6, 100) };
}

function getAqiColor(aqi: number): string {
  if (aqi <= 50) return "#3dd68c";
  if (aqi <= 100) return "#e3c15a";
  if (aqi <= 150) return "#e08a3a";
  if (aqi <= 200) return "#e25b5b";
  if (aqi <= 300) return "#b06ad4";
  return "#9b2c2c";
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
    message: "Air quality is satisfactory. Outdoor walks and balcony plants are fine.",
    targetGroup: "Everyone",
  };
  if (aqi <= 100) return {
    message: "Acceptable air. Sensitive people should ease long outdoor exertion.",
    targetGroup: "Sensitive individuals",
  };
  if (aqi <= 150) return {
    message: "Sensitive groups should cut heavy outdoor work. Keep indoor plants dusted.",
    targetGroup: "Children, elderly, and people with respiratory conditions",
  };
  if (aqi <= 200) return {
    message: "Everyone should reduce outdoor exertion. Move balcony plants inside if leaves look dusty.",
    targetGroup: "Everyone, especially sensitive groups",
  };
  if (aqi <= 300) return {
    message: "Health alert: stay indoors and close windows during peak hours.",
    targetGroup: "Everyone",
  };
  return {
    message: "Emergency conditions. Stay indoors and use filtration if available.",
    targetGroup: "Entire population",
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
  o2: number;
  co2: number;
  n2: number;
  trend: "Improving" | "Worsening" | "Stable";
  source: string;
  lastUpdated: string;
}

const cityConfigs: Record<string, CityAqiConfig> = {
  Kolkata: {
    aqi: 98,
    pm25: 34.6,
    pm10: 92,
    no2: 28,
    o3: 36,
    co: 1.1,
    so2: 9,
    o2: 20.78,
    co2: 0.046,
    n2: 78.09,
    trend: "Improving",
    source: "WBPCB · Victoria Memorial station",
    lastUpdated: "8 min ago",
  },
  Delhi: {
    aqi: 128,
    pm25: 52.8,
    pm10: 148,
    no2: 41,
    o3: 44,
    co: 1.8,
    so2: 14,
    o2: 20.61,
    co2: 0.054,
    n2: 78.02,
    trend: "Worsening",
    source: "CPCB · RK Puram station",
    lastUpdated: "11 min ago",
  },
  Kharagpur: {
    aqi: 64,
    pm25: 19.4,
    pm10: 48,
    no2: 16,
    o3: 31,
    co: 0.6,
    so2: 5,
    o2: 20.89,
    co2: 0.041,
    n2: 78.1,
    trend: "Stable",
    source: "WBPCB · IIT Kharagpur campus",
    lastUpdated: "6 min ago",
  },
};

export function getAqiDetails(cityName: string): AqiDetail {
  const config = cityConfigs[cityName] || cityConfigs.Kolkata;
  const color = getAqiColor(config.aqi);
  const status = getAqiStatus(config.aqi);
  const health = getHealthMessage(config.aqi);

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
    .sort((a, b) => b.percent - a.percent);

  const gases: GasShare[] = [
    {
      key: "n2",
      label: "Nitrogen",
      formula: "N₂",
      value: config.n2,
      unit: "%",
      note: "Bulk of ambient air. Stable across cities.",
      color: "#6eb5ff",
    },
    {
      key: "o2",
      label: "Oxygen",
      formula: "O₂",
      value: config.o2,
      unit: "%",
      note: "Slightly lower in dense traffic corridors.",
      color: "#3dd68c",
    },
    {
      key: "co2",
      label: "Carbon dioxide",
      formula: "CO₂",
      value: config.co2,
      unit: "%",
      note: "Elevated near traffic and industry.",
      color: "#e08a3a",
    },
  ];

  const trendArrow = config.trend === "Improving" ? "↓" : config.trend === "Worsening" ? "↑" : "→";

  return {
    aqi: config.aqi,
    status,
    color,
    healthMessage: health.message,
    targetGroup: health.targetGroup,
    pollutants,
    gases,
    trend: config.trend,
    trendArrow,
    lastUpdated: config.lastUpdated,
    source: config.source,
  };
}
