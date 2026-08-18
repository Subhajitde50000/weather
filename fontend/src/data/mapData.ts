export type MapLayerType = "rain" | "temp" | "wind" | "aqi" | "clouds";

export interface DataPoint {
  lat: number;
  lng: number;
  value: number;
  direction?: number;
}

export interface RainCell {
  lat: number;
  lng: number;
  intensity: number;
  radius: number;
  dx: number;
  dy: number;
}

export const cityCoordinates: Record<string, [number, number]> = {
  Kolkata: [22.5726, 88.3639],
  Delhi: [28.6139, 77.209],
  Kharagpur: [22.346, 87.2319],
};

function hash(x: number, y: number, seed: number): number {
  const n = Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453;
  return n - Math.floor(n);
}

export const layerConfigs: Record<MapLayerType, {
  name: string;
  icon: string;
  unit: string;
  animated: boolean;
  legend: { color: string; label: string }[];
  getStatus: (value: number) => string;
}> = {
  rain: {
    name: "Rain",
    icon: "🌧️",
    unit: "mm/h",
    animated: true,
    legend: [
      { color: "#4ade80", label: "Light" },
      { color: "#facc15", label: "Moderate" },
      { color: "#f97316", label: "Heavy" },
      { color: "#ef4444", label: "Extreme" },
    ],
    getStatus: (v) => (v < 2 ? "Light" : v < 7 ? "Moderate" : v < 15 ? "Heavy" : "Extreme"),
  },
  temp: {
    name: "Temperature",
    icon: "🌡️",
    unit: "°",
    animated: false,
    legend: [
      { color: "#3b82f6", label: "Cold" },
      { color: "#22d3ee", label: "Cool" },
      { color: "#4ade80", label: "Mild" },
      { color: "#facc15", label: "Warm" },
      { color: "#f97316", label: "Hot" },
      { color: "#ef4444", label: "V.Hot" },
    ],
    getStatus: (v) =>
      v < 5 ? "Cold" : v < 15 ? "Cool" : v < 22 ? "Mild" : v < 32 ? "Warm" : v < 40 ? "Hot" : "Very Hot",
  },
  wind: {
    name: "Wind",
    icon: "🌬️",
    unit: "km/h",
    animated: true,
    legend: [
      { color: "#94a3b8", label: "Calm" },
      { color: "#60a5fa", label: "Light" },
      { color: "#3b82f6", label: "Mod" },
      { color: "#8b5cf6", label: "Strong" },
      { color: "#ec4899", label: "Storm" },
    ],
    getStatus: (v) => (v < 5 ? "Calm" : v < 15 ? "Light" : v < 30 ? "Moderate" : v < 50 ? "Strong" : "Storm"),
  },
  aqi: {
    name: "Air Quality",
    icon: "🌫️",
    unit: "AQI",
    animated: false,
    legend: [
      { color: "#22c55e", label: "Good" },
      { color: "#eab308", label: "Mod" },
      { color: "#f97316", label: "USG" },
      { color: "#ef4444", label: "Bad" },
      { color: "#8b5cf6", label: "V.Bad" },
      { color: "#991b1b", label: "Haz" },
    ],
    getStatus: (v) =>
      v <= 50
        ? "Good"
        : v <= 100
          ? "Moderate"
          : v <= 150
            ? "Unhealthy (SG)"
            : v <= 200
              ? "Unhealthy"
              : v <= 300
                ? "Very Unhealthy"
                : "Hazardous",
  },
  clouds: {
    name: "Clouds",
    icon: "☁️",
    unit: "%",
    animated: true,
    legend: [
      { color: "rgba(255,255,255,0.15)", label: "Clear" },
      { color: "rgba(255,255,255,0.35)", label: "Partial" },
      { color: "rgba(255,255,255,0.55)", label: "Mostly" },
      { color: "rgba(255,255,255,0.75)", label: "Overcast" },
    ],
    getStatus: (v) => (v < 20 ? "Clear" : v < 50 ? "Partial" : v < 80 ? "Mostly Cloudy" : "Overcast"),
  },
};

const cityWeatherSeeds: Record<string, {
  tempBase: number;
  rainFactor: number;
  windBase: number;
  windDir: number;
  aqiBase: number;
  cloudBase: number;
  seed: number;
}> = {
  Kolkata: { tempBase: 29, rainFactor: 0.82, windBase: 18, windDir: 140, aqiBase: 98, cloudBase: 84, seed: 11 },
  Delhi: { tempBase: 33, rainFactor: 0.32, windBase: 12, windDir: 280, aqiBase: 128, cloudBase: 46, seed: 22 },
  Kharagpur: { tempBase: 28, rainFactor: 0.7, windBase: 14, windDir: 160, aqiBase: 64, cloudBase: 74, seed: 33 },
};

export function getRainCells(city: string): RainCell[] {
  const center = cityCoordinates[city] || cityCoordinates.Kolkata;
  const config = cityWeatherSeeds[city] || cityWeatherSeeds.Kolkata;
  const cells: RainCell[] = [];
  const count = Math.floor(2 + config.rainFactor * 6);

  for (let i = 0; i < count; i++) {
    const h1 = hash(i, config.seed, 42);
    const h2 = hash(i + 100, config.seed, 42);
    cells.push({
      lat: center[0] + (h1 - 0.5) * 2,
      lng: center[1] + (h2 - 0.5) * 2,
      intensity: 0.2 + h1 * config.rainFactor,
      radius: 0.15 + h2 * 0.4,
      dx: (hash(i, 0, config.seed) - 0.5) * 0.15,
      dy: (hash(0, i, config.seed) - 0.5) * 0.12,
    });
  }
  return cells;
}

export function generateLayerData(city: string, layer: MapLayerType, timeOffset: number = 0): DataPoint[] {
  const center = cityCoordinates[city] || cityCoordinates.Kolkata;
  const config = cityWeatherSeeds[city] || cityWeatherSeeds.Kolkata;
  const points: DataPoint[] = [];
  const gridSize = 20;
  const spread = 1.5;

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const lat = center[0] - spread + (i / (gridSize - 1)) * spread * 2;
      const lng = center[1] - spread + (j / (gridSize - 1)) * spread * 2;
      const dist = Math.sqrt((lat - center[0]) ** 2 + (lng - center[1]) ** 2);
      const h = hash(
        lat * 10,
        lng * 10,
        config.seed + (layer === "rain" ? 1 : layer === "temp" ? 2 : layer === "wind" ? 3 : layer === "aqi" ? 4 : 5),
      );

      let value = 0;
      let direction: number | undefined;

      switch (layer) {
        case "rain": {
          const cells = getRainCells(city);
          cells.forEach((cell) => {
            const cellLat = cell.lat + cell.dx * timeOffset;
            const cellLng = cell.lng + cell.dy * timeOffset;
            const d = Math.sqrt((lat - cellLat) ** 2 + (lng - cellLng) ** 2);
            if (d < cell.radius) {
              value += cell.intensity * (1 - d / cell.radius) * 20;
            }
          });
          value = Math.max(0, value + (h - 0.5) * 2);
          break;
        }
        case "temp": {
          value = config.tempBase + (h - 0.5) * 10 - (lat - center[0]) * 1.5;
          break;
        }
        case "wind": {
          value = config.windBase + (h - 0.5) * 15 + Math.sin(lat * 5 + lng * 3) * 4;
          direction = config.windDir + (h - 0.5) * 40;
          value = Math.max(0, value);
          break;
        }
        case "aqi": {
          const urbanFactor = Math.max(0, 1 - dist / 0.8);
          value = config.aqiBase * (0.4 + urbanFactor * 0.6) + (h - 0.5) * 50;
          value = Math.max(10, Math.min(500, value));
          break;
        }
        case "clouds": {
          value = config.cloudBase + (h - 0.5) * 50 + Math.sin((lat + timeOffset * 0.04) * 3) * 20;
          value = Math.max(0, Math.min(100, value));
          break;
        }
      }

      points.push({ lat, lng, value: Math.max(0, value), direction });
    }
  }

  return points;
}

export function getLayerColor(layer: MapLayerType, value: number, alpha: number = 0.6): string {
  switch (layer) {
    case "rain": {
      if (value < 1) return `rgba(74, 222, 128, ${alpha * 0.2})`;
      if (value < 4) return `rgba(74, 222, 128, ${alpha})`;
      if (value < 8) return `rgba(250, 204, 21, ${alpha})`;
      if (value < 15) return `rgba(249, 115, 22, ${alpha})`;
      return `rgba(239, 68, 68, ${alpha})`;
    }
    case "temp": {
      if (value < 0) return `rgba(59, 130, 246, ${alpha})`;
      if (value < 10) return `rgba(34, 211, 238, ${alpha})`;
      if (value < 20) return `rgba(74, 222, 128, ${alpha})`;
      if (value < 30) return `rgba(250, 204, 21, ${alpha})`;
      if (value < 38) return `rgba(249, 115, 22, ${alpha})`;
      return `rgba(239, 68, 68, ${alpha})`;
    }
    case "wind": {
      if (value < 5) return `rgba(148, 163, 184, ${alpha})`;
      if (value < 15) return `rgba(96, 165, 250, ${alpha})`;
      if (value < 30) return `rgba(59, 130, 246, ${alpha})`;
      if (value < 50) return `rgba(139, 92, 246, ${alpha})`;
      return `rgba(236, 72, 153, ${alpha})`;
    }
    case "aqi": {
      if (value <= 50) return `rgba(34, 197, 94, ${alpha})`;
      if (value <= 100) return `rgba(234, 179, 8, ${alpha})`;
      if (value <= 150) return `rgba(249, 115, 22, ${alpha})`;
      if (value <= 200) return `rgba(239, 68, 68, ${alpha})`;
      if (value <= 300) return `rgba(139, 92, 246, ${alpha})`;
      return `rgba(127, 29, 29, ${alpha})`;
    }
    case "clouds": {
      const a = (value / 100) * alpha;
      return `rgba(220, 225, 245, ${a})`;
    }
    default:
      return `rgba(255, 255, 255, ${alpha})`;
  }
}

export function findNearestPoint(points: DataPoint[], lat: number, lng: number): DataPoint | null {
  if (!points.length) return null;
  let nearest = points[0];
  let minDist = Infinity;

  for (const p of points) {
    const d = (p.lat - lat) ** 2 + (p.lng - lng) ** 2;
    if (d < minDist) {
      minDist = d;
      nearest = p;
    }
  }

  return nearest;
}
