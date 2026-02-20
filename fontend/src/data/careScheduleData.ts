// ========== Care Schedule Data Layer ==========
import { type MyPlant, type PlantTask, generateTasks } from "./myPlantsData";
import { type EnvironmentConditions } from "./plantData";

// ========== Types ==========
export interface WeekDay {
  dayName: string;      // "Mon", "Tue", etc.
  dayShort: string;     // "M", "T", etc.
  date: number;         // day of month
  fullDate: string;     // "Feb 6"
  isToday: boolean;
  isPast: boolean;
  tasks: PlantTask[];
  taskIcons: string[];  // unique icons for compact view
}

export interface PlantSchedule {
  plantId: string;
  plantName: string;
  plantImage: string;
  nickname?: string;
  nextWaterLabel: string;
  nextWaterDays: number;
  lightCheckLabel: string;
  fertilizerLabel: string;
  healthBadge: "stable" | "attention" | "risk";
  healthColor: string;
}

export interface CareHistoryEntry {
  id: string;
  icon: string;
  action: string;
  plantName: string;
  date: string;         // "Feb 4"
  daysAgo: number;
  status: "done" | "missed";
}

export interface SeasonalNotice {
  title: string;
  message: string;
  icon: string;
  show: boolean;
}

export interface MissedCareInfo {
  plantName: string;
  plantImage: string;
  action: string;
  overdueDays: number;
  risk: string;
}

// ========== Get Current Week Days ==========
export function getWeekDays(
  myPlants: MyPlant[],
  env: EnvironmentConditions
): WeekDay[] {
  const today = new Date();
  const currentDay = today.getDay(); // 0=Sun, 1=Mon...
  const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
  
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dayShorts = ["M", "T", "W", "T", "F", "S", "S"];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  const week: WeekDay[] = [];
  const todayStr = today.toDateString();
  
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + mondayOffset + i);
    
    const isToday = d.toDateString() === todayStr;
    const isPast = d < today && !isToday;
    
    // Generate tasks for each day
    // For today, use actual tasks. For other days, simulate based on watering intervals
    const dayTasks: PlantTask[] = [];
    
    if (isToday) {
      dayTasks.push(...generateTasks(myPlants, env));
    } else {
      // Predictive tasks based on watering schedule
      myPlants.forEach((mp) => {
        const waterText = mp.plant.care.water;
        const interval = parseWaterInterval(waterText);
        const daysSinceWatered = Math.floor(
          (d.getTime() - new Date(mp.lastWatered).getTime()) / (1000 * 60 * 60 * 24)
        );
        
        // Check if this day falls on a watering day
        if (daysSinceWatered >= 0 && daysSinceWatered % interval < 1 && daysSinceWatered >= interval - 1) {
          dayTasks.push({
            id: `water-${mp.plantId}-${i}`,
            plantId: mp.plantId,
            plantName: mp.plant.name,
            plantImage: mp.plant.image,
            type: "water",
            icon: "💧",
            title: `Water ${mp.nickname || mp.plant.name}`,
            reason: "Scheduled watering",
            priority: "medium",
            done: isPast,
          });
        }
        
        // Rotation check (every 14 days)
        const daysSinceRotated = Math.floor(
          (d.getTime() - new Date(mp.lastRotated).getTime()) / (1000 * 60 * 60 * 24)
        );
        if (daysSinceRotated > 0 && daysSinceRotated % 14 === 0) {
          dayTasks.push({
            id: `rotate-${mp.plantId}-${i}`,
            plantId: mp.plantId,
            plantName: mp.plant.name,
            plantImage: mp.plant.image,
            type: "rotate",
            icon: "🔄",
            title: `Rotate ${mp.nickname || mp.plant.name}`,
            reason: "Even growth",
            priority: "low",
            done: isPast,
          });
        }
      });
    }
    
    // Get unique icons
    const taskIcons = [...new Set(dayTasks.map((t) => t.icon))];
    
    week.push({
      dayName: dayNames[i],
      dayShort: dayShorts[i],
      date: d.getDate(),
      fullDate: `${monthNames[d.getMonth()]} ${d.getDate()}`,
      isToday,
      isPast,
      tasks: dayTasks,
      taskIcons,
    });
  }
  
  return week;
}

// ========== Plant-Wise Care Breakdown ==========
export function getPlantSchedules(
  myPlants: MyPlant[],
  env: EnvironmentConditions
): PlantSchedule[] {
  return myPlants.map((mp) => {
    const plant = mp.plant;
    const waterInterval = parseWaterInterval(plant.care.water);
    const daysSinceWatered = Math.floor(
      (Date.now() - new Date(mp.lastWatered).getTime()) / (1000 * 60 * 60 * 24)
    );
    const nextWaterDays = Math.max(0, waterInterval - daysSinceWatered);
    
    let nextWaterLabel: string;
    if (nextWaterDays === 0) nextWaterLabel = "Today";
    else if (nextWaterDays === 1) nextWaterLabel = "Tomorrow";
    else nextWaterLabel = `In ${nextWaterDays} days`;
    
    // Determine health
    let healthBadge: PlantSchedule["healthBadge"] = "stable";
    let healthColor = "#22C55E";
    let stressCount = 0;
    
    if (daysSinceWatered > waterInterval * 1.5) stressCount += 3;
    else if (daysSinceWatered > waterInterval) stressCount += 1;
    if (env.temperature > 35 && plant.heatTolerance < 5) stressCount += 1;
    if (env.aqi > 150 && plant.dustTolerance < 5) stressCount += 1;
    
    if (stressCount >= 3) {
      healthBadge = "risk";
      healthColor = "#EF4444";
    } else if (stressCount >= 1) {
      healthBadge = "attention";
      healthColor = "#EAB308";
    }
    
    // Seasonal fertilizer advice
    const month = new Date().getMonth();
    const isGrowingSeason = month >= 3 && month <= 8; // Apr-Aug
    const fertilizerLabel = isGrowingSeason
      ? "Monthly during growing season"
      : "Not needed this season";
    
    return {
      plantId: mp.plantId,
      plantName: mp.nickname || plant.name,
      plantImage: plant.image,
      nickname: mp.nickname,
      nextWaterLabel,
      nextWaterDays,
      lightCheckLabel: "Weekly",
      fertilizerLabel,
      healthBadge,
      healthColor,
    };
  });
}

// ========== Care History ==========
export function getCareHistory(myPlants: MyPlant[]): CareHistoryEntry[] {
  const history: CareHistoryEntry[] = [];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  myPlants.forEach((mp) => {
    // Watered history
    const wateredDate = new Date(mp.lastWatered);
    const waterDaysAgo = Math.floor(
      (Date.now() - wateredDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    history.push({
      id: `watered-${mp.plantId}`,
      icon: "💧",
      action: "Watered",
      plantName: mp.nickname || mp.plant.name,
      date: `${monthNames[wateredDate.getMonth()]} ${wateredDate.getDate()}`,
      daysAgo: waterDaysAgo,
      status: "done",
    });
    
    // Rotated history
    const rotatedDate = new Date(mp.lastRotated);
    const rotateDaysAgo = Math.floor(
      (Date.now() - rotatedDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    history.push({
      id: `rotated-${mp.plantId}`,
      icon: "🔄",
      action: "Rotated",
      plantName: mp.nickname || mp.plant.name,
      date: `${monthNames[rotatedDate.getMonth()]} ${rotatedDate.getDate()}`,
      daysAgo: rotateDaysAgo,
      status: "done",
    });
    
    // Add simulated missed care entries for demo
    const waterInterval = parseWaterInterval(mp.plant.care.water);
    if (waterDaysAgo > waterInterval) {
      // There was likely a missed watering cycle
      const missedDate = new Date(wateredDate);
      missedDate.setDate(missedDate.getDate() + waterInterval);
      const missedDaysAgo = Math.floor(
        (Date.now() - missedDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (missedDaysAgo > 0 && missedDaysAgo < waterDaysAgo) {
        history.push({
          id: `missed-water-${mp.plantId}`,
          icon: "💧",
          action: "Missed watering",
          plantName: mp.nickname || mp.plant.name,
          date: `${monthNames[missedDate.getMonth()]} ${missedDate.getDate()}`,
          daysAgo: missedDaysAgo,
          status: "missed",
        });
      }
    }
  });
  
  // Sort by most recent
  history.sort((a, b) => a.daysAgo - b.daysAgo);
  
  return history.slice(0, 10);
}

// ========== Missed Care Detection ==========
export function getMissedCare(
  myPlants: MyPlant[]
): MissedCareInfo[] {
  const missed: MissedCareInfo[] = [];
  
  myPlants.forEach((mp) => {
    const waterInterval = parseWaterInterval(mp.plant.care.water);
    const daysSinceWatered = Math.floor(
      (Date.now() - new Date(mp.lastWatered).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysSinceWatered > waterInterval) {
      const overdueDays = daysSinceWatered - waterInterval;
      let risk: string;
      if (overdueDays > waterInterval) {
        risk = "Wilting, possible leaf loss";
      } else if (overdueDays > 3) {
        risk = "Wilting, leaf yellowing";
      } else {
        risk = "Slight stress, recoverable";
      }
      
      missed.push({
        plantName: mp.nickname || mp.plant.name,
        plantImage: mp.plant.image,
        action: `Watering overdue by ${overdueDays} day${overdueDays > 1 ? "s" : ""}`,
        overdueDays,
        risk,
      });
    }
  });
  
  // Sort by most overdue first
  missed.sort((a, b) => b.overdueDays - a.overdueDays);
  
  return missed;
}

// ========== Seasonal Adjustment Notice ==========
export function getSeasonalNotice(): SeasonalNotice {
  const month = new Date().getMonth();
  
  // Winter (Dec, Jan, Feb)
  if (month === 11 || month === 0 || month === 1) {
    return {
      title: "Winter Adjustment",
      message: "Growth slows in winter. Reduce watering by ~30% and avoid cold drafts near windows.",
      icon: "❄️",
      show: true,
    };
  }
  
  // Summer (Jun, Jul, Aug)
  if (month >= 5 && month <= 7) {
    return {
      title: "Summer Care",
      message: "Heat increases water needs. Check soil moisture more frequently and mist humidity-loving plants.",
      icon: "☀️",
      show: true,
    };
  }
  
  // Monsoon / Rainy (Jul, Aug, Sep in tropical regions)
  if (month >= 6 && month <= 8) {
    return {
      title: "Monsoon Season",
      message: "High humidity may increase mold risk. Ensure good drainage and reduce watering for succulents.",
      icon: "🌧️",
      show: true,
    };
  }
  
  // Spring (Mar, Apr, May)
  if (month >= 2 && month <= 4) {
    return {
      title: "Spring Growth",
      message: "Plants are entering their growth phase. Resume regular fertilizing and increase watering gradually.",
      icon: "🌱",
      show: true,
    };
  }
  
  // Autumn
  return {
    title: "Autumn Transition",
    message: "Growth is slowing. Gradually reduce watering and stop fertilizing for most plants.",
    icon: "🍂",
    show: true,
  };
}

// ========== Reminder Settings Defaults ==========
export interface ReminderSettings {
  enabled: boolean;
  preferredTime: string; // "8:00 AM"
  frequencyType: "fixed" | "weather-adaptive";
}

export function getDefaultReminderSettings(): ReminderSettings {
  return {
    enabled: true,
    preferredTime: "8:00 AM",
    frequencyType: "weather-adaptive",
  };
}

// ========== Helper ==========
function parseWaterInterval(waterText: string): number {
  const match = waterText.match(/(\d+)[\s–-]+(\d+)/);
  if (match) return parseInt(match[2], 10);
  const single = waterText.match(/(\d+)\s*day/);
  if (single) return parseInt(single[1], 10);
  return 7;
}

// ========== Get Today Context String ==========
export function getTodayContext(): {
  dayOfWeek: string;
  dateStr: string;
  fullDate: string;
} {
  const now = new Date();
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  return {
    dayOfWeek: days[now.getDay()],
    dateStr: `${months[now.getMonth()]} ${now.getDate()}`,
    fullDate: `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]}`,
  };
}
