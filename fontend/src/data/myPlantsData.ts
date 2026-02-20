// ========== My Plants Data Layer ==========
import { type Plant, plantDatabase, type EnvironmentConditions } from "./plantData";

export interface MyPlant {
  plantId: string;
  plant: Plant;
  addedDate: string;        // ISO date
  lastWatered: string;      // ISO date
  lastRotated: string;      // ISO date
  location: "indoor" | "balcony";
  nickname?: string;
}

export type HealthStatus = "Healthy" | "Needs Attention" | "At Risk";
export type StressLevel = "Low" | "Medium" | "High";

export interface PlantHealthInfo {
  status: HealthStatus;
  statusColor: string;
  lightMatch: "Good" | "Fair" | "Poor";
  aqiTolerance: "High" | "Medium" | "Low";
  nextWaterDays: number;
  stressFactors: string[];
}

export interface PlantTask {
  id: string;
  plantId: string;
  plantName: string;
  plantImage: string;
  type: "water" | "rotate" | "check" | "move";
  icon: string;
  title: string;
  reason: string;
  priority: "high" | "medium" | "low";
  done: boolean;
}

export interface PlantAlert {
  id: string;
  icon: string;
  message: string;
  type: "warning" | "info" | "danger";
  color: string;
  dismissible: boolean;
}

export interface HealthSummary {
  healthy: number;
  needsAttention: number;
  atRisk: number;
}

// ========== Helper: Parse watering frequency from plant care string ==========
function getWaterIntervalDays(waterText: string): number {
  // Extract the max number from strings like "Every 10–14 days", "Every 5–7 days"
  const match = waterText.match(/(\d+)[\s–-]+(\d+)/);
  if (match) return parseInt(match[2], 10);
  const single = waterText.match(/(\d+)\s*day/);
  if (single) return parseInt(single[1], 10);
  return 7; // default
}

// ========== Estimate Plant Health ==========
export function estimateHealth(
  myPlant: MyPlant,
  env: EnvironmentConditions
): PlantHealthInfo {
  const plant = myPlant.plant;
  const stressFactors: string[] = [];
  let stressScore = 0;

  // 1. Watering check
  const waterInterval = getWaterIntervalDays(plant.care.water);
  const daysSinceWatered = Math.floor(
    (Date.now() - new Date(myPlant.lastWatered).getTime()) / (1000 * 60 * 60 * 24)
  );
  const nextWaterDays = Math.max(0, waterInterval - daysSinceWatered);

  if (daysSinceWatered > waterInterval * 1.5) {
    stressScore += 3;
    stressFactors.push("Overdue watering");
  } else if (daysSinceWatered > waterInterval) {
    stressScore += 1;
    stressFactors.push("Watering due soon");
  }

  // 2. Temperature stress
  if (env.temperature > 40 && plant.heatTolerance < 7) {
    stressScore += 2;
    stressFactors.push("Extreme heat");
  } else if (env.temperature > 35 && plant.heatTolerance < 5) {
    stressScore += 1;
    stressFactors.push("High temperature");
  }

  // 3. AQI stress
  if (env.aqi > 200 && plant.dustTolerance < 6) {
    stressScore += 2;
    stressFactors.push("Very poor air quality");
  } else if (env.aqi > 150 && plant.dustTolerance < 5) {
    stressScore += 1;
    stressFactors.push("Poor air quality");
  }

  // 4. Humidity mismatch
  if (env.humidity > 80 && plant.humidityLove < 4) {
    stressScore += 1;
    stressFactors.push("Excess humidity");
  } else if (env.humidity < 30 && plant.humidityLove > 7) {
    stressScore += 1;
    stressFactors.push("Low humidity");
  }

  // 5. Light (indoor plants in low light)
  let lightMatch: PlantHealthInfo["lightMatch"] = "Good";
  if (myPlant.location === "indoor" && plant.lowLightOk < 4) {
    lightMatch = "Poor";
    stressScore += 1;
    stressFactors.push("Needs more light");
  } else if (myPlant.location === "indoor" && plant.lowLightOk < 6) {
    lightMatch = "Fair";
  }

  // AQI tolerance
  let aqiTolerance: PlantHealthInfo["aqiTolerance"] = "High";
  if (plant.dustTolerance < 5) aqiTolerance = "Low";
  else if (plant.dustTolerance < 7) aqiTolerance = "Medium";

  // Determine status
  let status: HealthStatus = "Healthy";
  let statusColor = "#22C55E";
  if (stressScore >= 4) {
    status = "At Risk";
    statusColor = "#EF4444";
  } else if (stressScore >= 2) {
    status = "Needs Attention";
    statusColor = "#EAB308";
  }

  return {
    status,
    statusColor,
    lightMatch,
    aqiTolerance,
    nextWaterDays,
    stressFactors,
  };
}

// ========== Generate Today's Tasks ==========
export function generateTasks(
  myPlants: MyPlant[],
  env: EnvironmentConditions
): PlantTask[] {
  const tasks: PlantTask[] = [];

  myPlants.forEach((myPlant) => {
    const plant = myPlant.plant;
    const waterInterval = getWaterIntervalDays(plant.care.water);
    const daysSinceWatered = Math.floor(
      (Date.now() - new Date(myPlant.lastWatered).getTime()) / (1000 * 60 * 60 * 24)
    );
    const daysSinceRotated = Math.floor(
      (Date.now() - new Date(myPlant.lastRotated).getTime()) / (1000 * 60 * 60 * 24)
    );

    // Watering task
    if (daysSinceWatered >= waterInterval - 1) {
      const overdue = daysSinceWatered > waterInterval;
      const reason = overdue
        ? `Overdue by ${daysSinceWatered - waterInterval} day${daysSinceWatered - waterInterval > 1 ? "s" : ""}`
        : env.temperature > 35
        ? "Soil dry + heatwave"
        : "Regular schedule";

      tasks.push({
        id: `water-${myPlant.plantId}`,
        plantId: myPlant.plantId,
        plantName: plant.name,
        plantImage: plant.image,
        type: "water",
        icon: "💧",
        title: `Water ${plant.name}`,
        reason,
        priority: overdue ? "high" : "medium",
        done: false,
      });
    }

    // Rotation task (every 14 days)
    if (daysSinceRotated >= 14) {
      tasks.push({
        id: `rotate-${myPlant.plantId}`,
        plantId: myPlant.plantId,
        plantName: plant.name,
        plantImage: plant.image,
        type: "rotate",
        icon: "🔄",
        title: `Rotate ${plant.name}`,
        reason: "Uneven light exposure",
        priority: "low",
        done: false,
      });
    }

    // Stress check
    if (env.aqi > 150 && plant.dustTolerance < 6) {
      tasks.push({
        id: `check-${myPlant.plantId}`,
        plantId: myPlant.plantId,
        plantName: plant.name,
        plantImage: plant.image,
        type: "check",
        icon: "⚠️",
        title: `Check ${plant.name}`,
        reason: "High humidity stress risk",
        priority: "high",
        done: false,
      });
    }

    // Move to indoor if balcony + bad AQI
    if (myPlant.location === "balcony" && env.aqi > 200) {
      tasks.push({
        id: `move-${myPlant.plantId}`,
        plantId: myPlant.plantId,
        plantName: plant.name,
        plantImage: plant.image,
        type: "move",
        icon: "🏠",
        title: `Move ${plant.name} indoors`,
        reason: "AQI is hazardous for outdoor plants",
        priority: "high",
        done: false,
      });
    }
  });

  // Sort by priority
  const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
  tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return tasks;
}

// ========== Generate Alerts ==========
export function generateAlerts(
  myPlants: MyPlant[],
  env: EnvironmentConditions
): PlantAlert[] {
  const alerts: PlantAlert[] = [];

  // AQI spike alert
  if (env.aqi > 150) {
    const balconyPlants = myPlants.filter((p) => p.location === "balcony");
    if (balconyPlants.length > 0) {
      alerts.push({
        id: "aqi-spike",
        icon: "⚠️",
        message: `AQI spike detected (${env.aqi}) – consider moving ${balconyPlants.length} balcony plant${balconyPlants.length > 1 ? "s" : ""} inside`,
        type: "warning",
        color: "#F97316",
        dismissible: true,
      });
    }
  }

  // Heatwave
  if (env.temperature > 38) {
    alerts.push({
      id: "heatwave",
      icon: "🔥",
      message: "Heatwave ongoing – reduce watering frequency for succulents",
      type: "warning",
      color: "#EF4444",
      dismissible: true,
    });
  }

  // Humidity warning
  if (env.humidity > 85) {
    const moldRiskPlants = myPlants.filter(
      (p) => p.plant.safety.moldRisk === "Moderate"
    );
    if (moldRiskPlants.length > 0) {
      alerts.push({
        id: "humidity-mold",
        icon: "💧",
        message: `High humidity – watch for mold on ${moldRiskPlants.map((p) => p.plant.name).join(", ")}`,
        type: "info",
        color: "#60A5FA",
        dismissible: true,
      });
    }
  }

  // Pet safety reminder
  const nonPetSafe = myPlants.filter((p) => !p.plant.safety.petSafe);
  if (nonPetSafe.length > 0) {
    alerts.push({
      id: "pet-safety",
      icon: "🐾",
      message: `${nonPetSafe.map((p) => p.plant.name).join(", ")} ${nonPetSafe.length > 1 ? "are" : "is"} not pet-safe – keep away from pets`,
      type: "info",
      color: "#94A3B8",
      dismissible: true,
    });
  }

  return alerts;
}

// ========== Health Summary ==========
export function getHealthSummary(
  myPlants: MyPlant[],
  env: EnvironmentConditions
): HealthSummary {
  let healthy = 0;
  let needsAttention = 0;
  let atRisk = 0;

  myPlants.forEach((mp) => {
    const health = estimateHealth(mp, env);
    if (health.status === "Healthy") healthy++;
    else if (health.status === "Needs Attention") needsAttention++;
    else atRisk++;
  });

  return { healthy, needsAttention, atRisk };
}

// ========== Stress Level from Environment ==========
export function getStressLevel(env: EnvironmentConditions): {
  level: StressLevel;
  color: string;
} {
  let score = 0;
  if (env.aqi > 150) score += 2;
  else if (env.aqi > 100) score += 1;
  if (env.temperature > 38) score += 2;
  else if (env.temperature > 35) score += 1;
  if (env.humidity > 80) score += 1;

  if (score >= 3) return { level: "High", color: "#EF4444" };
  if (score >= 1) return { level: "Medium", color: "#EAB308" };
  return { level: "Low", color: "#22C55E" };
}

// ========== Create default plants for demo ==========
export function getDefaultMyPlants(): MyPlant[] {
  const now = new Date();
  const daysAgo = (d: number) => {
    const date = new Date(now);
    date.setDate(date.getDate() - d);
    return date.toISOString();
  };

  const findPlant = (id: string): Plant =>
    plantDatabase.find((p) => p.id === id) || plantDatabase[0];

  return [
    {
      plantId: "snake-plant",
      plant: findPlant("snake-plant"),
      addedDate: daysAgo(45),
      lastWatered: daysAgo(11),
      lastRotated: daysAgo(10),
      location: "indoor",
      nickname: "Slinky",
    },
    {
      plantId: "peace-lily",
      plant: findPlant("peace-lily"),
      addedDate: daysAgo(30),
      lastWatered: daysAgo(6),
      lastRotated: daysAgo(18),
      location: "indoor",
    },
    {
      plantId: "spider-plant",
      plant: findPlant("spider-plant"),
      addedDate: daysAgo(20),
      lastWatered: daysAgo(8),
      lastRotated: daysAgo(5),
      location: "indoor",
    },
  ];
}
