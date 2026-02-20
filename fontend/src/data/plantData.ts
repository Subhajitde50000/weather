// ========== Plant Database & Recommendation Engine ==========

export type SpaceType = "indoor" | "balcony";

export interface PlantBenefit {
  vocAbsorption: boolean;
  dustControl: boolean;
  co2Absorption: "Low" | "Moderate" | "High";
  oxygenRelease: "Daytime" | "Nighttime" | "Both";
  psychologicalBenefit: "Low" | "Moderate" | "High";
  humidityBalance: boolean;
}

export interface PlantCare {
  water: string;
  light: string;
  potSize: string;
  soil: string;
  difficulty: number; // 1-5 (1 = easiest)
  difficultyLabel: string;
}

export interface PlantSafety {
  petSafe: boolean;
  allergyRisk: "None" | "Low" | "Moderate" | "High";
  moldRisk: "None" | "Low" | "Moderate";
}

export interface PlantPlacement {
  distanceFromWindow: string;
  avoidDirectAC: boolean;
  idealSpot: string;
  notes: string;
}

export interface Plant {
  id: string;
  name: string;
  scientificName: string;
  image: string; // emoji representation
  spaceType: SpaceType[];
  benefits: PlantBenefit;
  care: PlantCare;
  safety: PlantSafety;
  placement: PlantPlacement;
  tags: string[];
  // Scoring factors for recommendation engine
  dustTolerance: number;    // 0-10
  heatTolerance: number;    // 0-10
  humidityLove: number;     // 0-10 (how much it likes humidity)
  lowLightOk: number;       // 0-10
  airPurifying: number;     // 0-10
  droughtTolerant: number;  // 0-10
}

// ========== Full Plant Database ==========
export const plantDatabase: Plant[] = [
  {
    id: "snake-plant",
    name: "Snake Plant",
    scientificName: "Sansevieria trifasciata",
    image: "🌿",
    spaceType: ["indoor", "balcony"],
    benefits: {
      vocAbsorption: true,
      dustControl: true,
      co2Absorption: "Moderate",
      oxygenRelease: "Nighttime",
      psychologicalBenefit: "High",
      humidityBalance: false,
    },
    care: {
      water: "Every 10–14 days",
      light: "Low to bright indirect",
      potSize: "Medium (6–8 inch)",
      soil: "Well-draining, cactus mix",
      difficulty: 1,
      difficultyLabel: "Very Easy",
    },
    safety: {
      petSafe: false,
      allergyRisk: "Low",
      moldRisk: "Low",
    },
    placement: {
      distanceFromWindow: "1–3 m from window",
      avoidDirectAC: true,
      idealSpot: "Bedroom corner or near window",
      notes: "One of the best nighttime oxygen producers",
    },
    tags: ["air-purifier", "low-light", "beginner", "dust-trap"],
    dustTolerance: 9,
    heatTolerance: 8,
    humidityLove: 3,
    lowLightOk: 9,
    airPurifying: 9,
    droughtTolerant: 9,
  },
  {
    id: "peace-lily",
    name: "Peace Lily",
    scientificName: "Spathiphyllum wallisii",
    image: "🌸",
    spaceType: ["indoor"],
    benefits: {
      vocAbsorption: true,
      dustControl: true,
      co2Absorption: "High",
      oxygenRelease: "Daytime",
      psychologicalBenefit: "High",
      humidityBalance: true,
    },
    care: {
      water: "Every 5–7 days",
      light: "Low to medium indirect",
      potSize: "Medium (6–10 inch)",
      soil: "Rich, well-draining potting mix",
      difficulty: 2,
      difficultyLabel: "Easy",
    },
    safety: {
      petSafe: false,
      allergyRisk: "Low",
      moldRisk: "Low",
    },
    placement: {
      distanceFromWindow: "1–2 m from window",
      avoidDirectAC: true,
      idealSpot: "Living room or bathroom",
      notes: "Droops when thirsty — very communicative",
    },
    tags: ["air-purifier", "flowering", "humidity", "nasa-approved"],
    dustTolerance: 7,
    heatTolerance: 5,
    humidityLove: 8,
    lowLightOk: 8,
    airPurifying: 10,
    droughtTolerant: 3,
  },
  {
    id: "spider-plant",
    name: "Spider Plant",
    scientificName: "Chlorophytum comosum",
    image: "🌱",
    spaceType: ["indoor", "balcony"],
    benefits: {
      vocAbsorption: true,
      dustControl: false,
      co2Absorption: "Moderate",
      oxygenRelease: "Daytime",
      psychologicalBenefit: "Moderate",
      humidityBalance: true,
    },
    care: {
      water: "Every 7–10 days",
      light: "Bright indirect to partial shade",
      potSize: "Medium (6–8 inch)",
      soil: "General purpose potting mix",
      difficulty: 1,
      difficultyLabel: "Very Easy",
    },
    safety: {
      petSafe: true,
      allergyRisk: "None",
      moldRisk: "Low",
    },
    placement: {
      distanceFromWindow: "1–2 m, near a window",
      avoidDirectAC: false,
      idealSpot: "Hanging basket or shelf",
      notes: "Great for hanging — produces baby spider plants",
    },
    tags: ["pet-safe", "beginner", "hanging", "air-purifier"],
    dustTolerance: 6,
    heatTolerance: 6,
    humidityLove: 5,
    lowLightOk: 6,
    airPurifying: 8,
    droughtTolerant: 5,
  },
  {
    id: "aloe-vera",
    name: "Aloe Vera",
    scientificName: "Aloe barbadensis miller",
    image: "🪴",
    spaceType: ["indoor", "balcony"],
    benefits: {
      vocAbsorption: true,
      dustControl: false,
      co2Absorption: "Low",
      oxygenRelease: "Nighttime",
      psychologicalBenefit: "Moderate",
      humidityBalance: false,
    },
    care: {
      water: "Every 14–21 days",
      light: "Bright indirect to direct sun",
      potSize: "Small to medium (4–6 inch)",
      soil: "Sandy, well-draining",
      difficulty: 1,
      difficultyLabel: "Very Easy",
    },
    safety: {
      petSafe: false,
      allergyRisk: "Low",
      moldRisk: "None",
    },
    placement: {
      distanceFromWindow: "0–1 m, windowsill ideal",
      avoidDirectAC: false,
      idealSpot: "Kitchen windowsill or balcony",
      notes: "Medicinal gel — useful for burns and skin",
    },
    tags: ["medicinal", "succulent", "low-water", "balcony"],
    dustTolerance: 7,
    heatTolerance: 9,
    humidityLove: 2,
    lowLightOk: 3,
    airPurifying: 6,
    droughtTolerant: 10,
  },
  {
    id: "areca-palm",
    name: "Areca Palm",
    scientificName: "Dypsis lutescens",
    image: "🌴",
    spaceType: ["indoor", "balcony"],
    benefits: {
      vocAbsorption: true,
      dustControl: true,
      co2Absorption: "High",
      oxygenRelease: "Daytime",
      psychologicalBenefit: "High",
      humidityBalance: true,
    },
    care: {
      water: "Every 5–7 days",
      light: "Bright indirect light",
      potSize: "Large (10–14 inch)",
      soil: "Well-draining, peat-based",
      difficulty: 3,
      difficultyLabel: "Moderate",
    },
    safety: {
      petSafe: true,
      allergyRisk: "None",
      moldRisk: "Moderate",
    },
    placement: {
      distanceFromWindow: "1–2 m from bright window",
      avoidDirectAC: true,
      idealSpot: "Living room or large bedroom",
      notes: "Natural humidifier — releases ~1L water vapor/day",
    },
    tags: ["humidifier", "pet-safe", "large", "statement"],
    dustTolerance: 8,
    heatTolerance: 7,
    humidityLove: 7,
    lowLightOk: 4,
    airPurifying: 9,
    droughtTolerant: 3,
  },
  {
    id: "money-plant",
    name: "Money Plant",
    scientificName: "Epipremnum aureum",
    image: "💚",
    spaceType: ["indoor", "balcony"],
    benefits: {
      vocAbsorption: true,
      dustControl: false,
      co2Absorption: "Moderate",
      oxygenRelease: "Daytime",
      psychologicalBenefit: "Moderate",
      humidityBalance: false,
    },
    care: {
      water: "Every 7–10 days",
      light: "Low to bright indirect",
      potSize: "Small to medium (4–8 inch)",
      soil: "Any well-draining mix",
      difficulty: 1,
      difficultyLabel: "Very Easy",
    },
    safety: {
      petSafe: false,
      allergyRisk: "Low",
      moldRisk: "Low",
    },
    placement: {
      distanceFromWindow: "Anywhere — very adaptable",
      avoidDirectAC: false,
      idealSpot: "Shelf, hanging, or climbing pole",
      notes: "Can grow in water — extremely low maintenance",
    },
    tags: ["beginner", "climber", "versatile", "air-purifier"],
    dustTolerance: 6,
    heatTolerance: 7,
    humidityLove: 5,
    lowLightOk: 8,
    airPurifying: 7,
    droughtTolerant: 6,
  },
  {
    id: "rubber-plant",
    name: "Rubber Plant",
    scientificName: "Ficus elastica",
    image: "🍀",
    spaceType: ["indoor"],
    benefits: {
      vocAbsorption: true,
      dustControl: true,
      co2Absorption: "High",
      oxygenRelease: "Daytime",
      psychologicalBenefit: "High",
      humidityBalance: false,
    },
    care: {
      water: "Every 7–14 days",
      light: "Bright indirect",
      potSize: "Medium to large (8–12 inch)",
      soil: "Well-draining potting mix",
      difficulty: 2,
      difficultyLabel: "Easy",
    },
    safety: {
      petSafe: false,
      allergyRisk: "Low",
      moldRisk: "None",
    },
    placement: {
      distanceFromWindow: "1–2 m from bright window",
      avoidDirectAC: true,
      idealSpot: "Living room corner",
      notes: "Large glossy leaves trap dust particles effectively",
    },
    tags: ["dust-trap", "statement", "air-purifier", "bold"],
    dustTolerance: 9,
    heatTolerance: 6,
    humidityLove: 5,
    lowLightOk: 5,
    airPurifying: 8,
    droughtTolerant: 5,
  },
  {
    id: "boston-fern",
    name: "Boston Fern",
    scientificName: "Nephrolepis exaltata",
    image: "🌿",
    spaceType: ["indoor", "balcony"],
    benefits: {
      vocAbsorption: true,
      dustControl: false,
      co2Absorption: "Moderate",
      oxygenRelease: "Daytime",
      psychologicalBenefit: "High",
      humidityBalance: true,
    },
    care: {
      water: "Every 3–5 days",
      light: "Indirect light, no direct sun",
      potSize: "Medium (8–10 inch)",
      soil: "Rich, moisture-retaining mix",
      difficulty: 4,
      difficultyLabel: "Moderate-Hard",
    },
    safety: {
      petSafe: true,
      allergyRisk: "None",
      moldRisk: "Moderate",
    },
    placement: {
      distanceFromWindow: "1–2 m, indirect light",
      avoidDirectAC: true,
      idealSpot: "Bathroom or humid room",
      notes: "Needs consistent moisture — mist regularly",
    },
    tags: ["humidity-lover", "hanging", "pet-safe", "lush"],
    dustTolerance: 4,
    heatTolerance: 4,
    humidityLove: 10,
    lowLightOk: 6,
    airPurifying: 7,
    droughtTolerant: 1,
  },
  {
    id: "zz-plant",
    name: "ZZ Plant",
    scientificName: "Zamioculcas zamiifolia",
    image: "🌲",
    spaceType: ["indoor"],
    benefits: {
      vocAbsorption: true,
      dustControl: true,
      co2Absorption: "Low",
      oxygenRelease: "Daytime",
      psychologicalBenefit: "Moderate",
      humidityBalance: false,
    },
    care: {
      water: "Every 14–21 days",
      light: "Low to medium indirect",
      potSize: "Medium (6–8 inch)",
      soil: "Well-draining, cactus mix works",
      difficulty: 1,
      difficultyLabel: "Very Easy",
    },
    safety: {
      petSafe: false,
      allergyRisk: "Low",
      moldRisk: "None",
    },
    placement: {
      distanceFromWindow: "2–4 m, anywhere works",
      avoidDirectAC: false,
      idealSpot: "Office desk, bedroom, any dark corner",
      notes: "Thrives on neglect — perfect for busy people",
    },
    tags: ["low-light", "beginner", "drought-tolerant", "office"],
    dustTolerance: 8,
    heatTolerance: 7,
    humidityLove: 2,
    lowLightOk: 10,
    airPurifying: 7,
    droughtTolerant: 9,
  },
  {
    id: "jade-plant",
    name: "Jade Plant",
    scientificName: "Crassula ovata",
    image: "🪴",
    spaceType: ["indoor", "balcony"],
    benefits: {
      vocAbsorption: false,
      dustControl: false,
      co2Absorption: "Low",
      oxygenRelease: "Nighttime",
      psychologicalBenefit: "Moderate",
      humidityBalance: false,
    },
    care: {
      water: "Every 14–21 days",
      light: "Bright indirect to direct sun",
      potSize: "Small to medium (4–6 inch)",
      soil: "Sandy, succulent mix",
      difficulty: 2,
      difficultyLabel: "Easy",
    },
    safety: {
      petSafe: false,
      allergyRisk: "None",
      moldRisk: "None",
    },
    placement: {
      distanceFromWindow: "0–1 m, on windowsill",
      avoidDirectAC: false,
      idealSpot: "Sunny windowsill or balcony",
      notes: "Long-lived — can grow for decades",
    },
    tags: ["succulent", "balcony", "long-lived", "compact"],
    dustTolerance: 7,
    heatTolerance: 9,
    humidityLove: 1,
    lowLightOk: 2,
    airPurifying: 4,
    droughtTolerant: 10,
  },
  {
    id: "english-ivy",
    name: "English Ivy",
    scientificName: "Hedera helix",
    image: "🍃",
    spaceType: ["indoor", "balcony"],
    benefits: {
      vocAbsorption: true,
      dustControl: true,
      co2Absorption: "Moderate",
      oxygenRelease: "Daytime",
      psychologicalBenefit: "High",
      humidityBalance: true,
    },
    care: {
      water: "Every 5–7 days",
      light: "Bright indirect to partial shade",
      potSize: "Medium (6–8 inch)",
      soil: "Rich, well-draining mix",
      difficulty: 3,
      difficultyLabel: "Moderate",
    },
    safety: {
      petSafe: false,
      allergyRisk: "Moderate",
      moldRisk: "Low",
    },
    placement: {
      distanceFromWindow: "Near window, trailing down",
      avoidDirectAC: true,
      idealSpot: "Hanging basket near window",
      notes: "Excellent for removing mold particles from air",
    },
    tags: ["trailing", "air-purifier", "dust-trap", "mold-fighter"],
    dustTolerance: 8,
    heatTolerance: 5,
    humidityLove: 6,
    lowLightOk: 5,
    airPurifying: 9,
    droughtTolerant: 3,
  },
  {
    id: "tulsi",
    name: "Tulsi (Holy Basil)",
    scientificName: "Ocimum tenuiflorum",
    image: "🌿",
    spaceType: ["balcony"],
    benefits: {
      vocAbsorption: false,
      dustControl: false,
      co2Absorption: "Moderate",
      oxygenRelease: "Both",
      psychologicalBenefit: "High",
      humidityBalance: false,
    },
    care: {
      water: "Every 2–3 days",
      light: "Full sun (6+ hours)",
      potSize: "Medium (6–8 inch)",
      soil: "Well-draining, rich compost",
      difficulty: 2,
      difficultyLabel: "Easy",
    },
    safety: {
      petSafe: true,
      allergyRisk: "None",
      moldRisk: "Low",
    },
    placement: {
      distanceFromWindow: "Direct sunlight essential",
      avoidDirectAC: true,
      idealSpot: "Balcony railing or terrace",
      notes: "Releases oxygen 20 hours/day — sacred in India",
    },
    tags: ["medicinal", "outdoor", "aromatic", "indian"],
    dustTolerance: 5,
    heatTolerance: 9,
    humidityLove: 5,
    lowLightOk: 1,
    airPurifying: 7,
    droughtTolerant: 3,
  },
];

// ========== Recommendation Engine ==========

export interface EnvironmentConditions {
  aqi: number;
  pm25Status: "Low" | "Moderate" | "High" | "Very High";
  temperature: number;
  humidity: number;
  isNight: boolean;
}

export interface PlantRecommendation {
  plant: Plant;
  score: number;
  reason: string;
  suitability: "Excellent" | "Good" | "Fair";
  matchFactors: string[];
}

function getPm25Status(aqi: number): EnvironmentConditions["pm25Status"] {
  if (aqi <= 50) return "Low";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 200) return "High";
  return "Very High";
}

export function getEnvironment(cityData: {
  temp: number;
  humidity: number;
  aqi: number;
  isNight: boolean;
}): EnvironmentConditions {
  return {
    aqi: cityData.aqi,
    pm25Status: getPm25Status(cityData.aqi),
    temperature: cityData.temp,
    humidity: cityData.humidity,
    isNight: cityData.isNight,
  };
}

export function getRecommendations(
  env: EnvironmentConditions,
  spaceType: SpaceType,
  maxResults: number = 5
): PlantRecommendation[] {
  const eligible = plantDatabase.filter((p) =>
    p.spaceType.includes(spaceType)
  );

  const scored = eligible.map((plant) => {
    let score = 0;
    const matchFactors: string[] = [];

    // AQI scoring — higher AQI means we need better air purifiers
    if (env.aqi > 100) {
      score += plant.airPurifying * 2.5;
      if (plant.airPurifying >= 7) matchFactors.push("Strong air purification");
    } else {
      score += plant.airPurifying * 1.0;
    }

    // Dust tolerance matters more in high AQI
    if (env.pm25Status === "High" || env.pm25Status === "Very High") {
      score += plant.dustTolerance * 2.0;
      if (plant.dustTolerance >= 7) matchFactors.push("High dust tolerance");
      if (plant.benefits.dustControl) {
        score += 10;
        matchFactors.push("Traps dust particles");
      }
    }

    // VOC absorption is always good
    if (plant.benefits.vocAbsorption) {
      score += 8;
      matchFactors.push("VOC absorption");
    }

    // Temperature matching
    if (env.temperature > 35) {
      score += plant.heatTolerance * 1.5;
      if (plant.heatTolerance >= 8) matchFactors.push("Heat tolerant");
    } else if (env.temperature < 15) {
      // Cold — prefer indoor hardy plants
      score += (10 - plant.heatTolerance) * 0.5;
    } else {
      score += 5; // moderate temp is fine for most
    }

    // Humidity matching
    if (env.humidity > 70) {
      score += plant.humidityLove * 1.0;
      if (plant.humidityLove >= 7) matchFactors.push("Loves humidity");
    } else if (env.humidity < 40) {
      score += (10 - plant.humidityLove) * 0.8;
      if (plant.droughtTolerant >= 7) matchFactors.push("Drought resistant");
    }

    // Indoor bonus for low light tolerance
    if (spaceType === "indoor") {
      score += plant.lowLightOk * 1.2;
      if (plant.lowLightOk >= 7) matchFactors.push("Thrives in low light");
    }

    // Nighttime oxygen bonus
    if (env.isNight && (plant.benefits.oxygenRelease === "Nighttime" || plant.benefits.oxygenRelease === "Both")) {
      score += 8;
      matchFactors.push("Releases oxygen at night");
    }

    // Beginner-friendly bonus
    if (plant.care.difficulty <= 2) {
      score += 5;
      matchFactors.push("Easy to maintain");
    }

    // Psychological benefit bonus
    if (plant.benefits.psychologicalBenefit === "High") {
      score += 4;
    }

    // Determine suitability
    let suitability: PlantRecommendation["suitability"] = "Fair";
    if (score >= 50) suitability = "Excellent";
    else if (score >= 35) suitability = "Good";

    // Generate reason
    const reason = generateReason(plant, env, spaceType);

    return { plant, score, reason, suitability, matchFactors };
  });

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, maxResults);
}

function generateReason(
  plant: Plant,
  env: EnvironmentConditions,
  spaceType: SpaceType
): string {
  const parts: string[] = [];

  if (env.aqi > 100) {
    parts.push(`Your ${spaceType} has high PM2.5 levels (AQI ${env.aqi})`);
  } else {
    parts.push(`Your air quality is ${env.pm25Status.toLowerCase()}`);
  }

  if (env.temperature > 35) {
    parts.push("and it's hot outside");
  } else if (env.temperature < 15) {
    parts.push("and temperatures are cool");
  }

  const plantStrength: string[] = [];
  if (plant.airPurifying >= 8) plantStrength.push("actively purifies indoor air");
  if (plant.dustTolerance >= 8) plantStrength.push("traps dust on its leaves");
  if (plant.lowLightOk >= 8 && spaceType === "indoor") plantStrength.push("thrives even in dim corners");
  if (plant.droughtTolerant >= 8) plantStrength.push("barely needs watering");

  if (plantStrength.length > 0) {
    return `${parts.join(", ")}. ${plant.name} ${plantStrength.join(" and ")}.`;
  }

  return `${parts.join(", ")}. ${plant.name} is well-suited for these conditions with minimal care needed.`;
}

export function getSystemInsight(
  env: EnvironmentConditions,
  spaceType: SpaceType
): string {
  const parts: string[] = [];

  if (env.aqi > 150) {
    parts.push("high PM2.5");
  } else if (env.aqi > 100) {
    parts.push("elevated PM2.5");
  }

  if (env.humidity > 70) {
    parts.push("high humidity");
  } else if (env.humidity < 40) {
    parts.push("low humidity");
  }

  if (env.temperature > 35) {
    parts.push("extreme heat");
  }

  if (spaceType === "indoor") {
    parts.push("limited airflow");
  }

  const traits: string[] = [];
  if (env.aqi > 100) {
    traits.push("dust tolerance");
    traits.push("VOC absorption");
  }
  if (env.humidity > 70) {
    traits.push("humidity resilience");
  }
  if (env.temperature > 35) {
    traits.push("heat resistance");
  }

  if (parts.length === 0) {
    return "Based on current conditions, most indoor plants will thrive. We recommend easy-care options.";
  }

  return `Based on ${parts.join(" and ")}, plants with ${traits.slice(0, 2).join(" + ")} are recommended.`;
}

// AQI color helper
export function getAqiColor(aqi: number): string {
  if (aqi <= 50) return "#22C55E";
  if (aqi <= 100) return "#EAB308";
  if (aqi <= 150) return "#F97316";
  if (aqi <= 200) return "#EF4444";
  return "#A855F7";
}

export function getAqiLabel(aqi: number): string {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy (SG)";
  if (aqi <= 200) return "Unhealthy";
  return "Very Unhealthy";
}
