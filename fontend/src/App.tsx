import { useState, useCallback } from "react";
import {
  citiesWeather,
  getTheme,
  getGradient,
  type AppTheme,
  type WindUnit,
} from "@/data/weatherData";
import { plantDatabase } from "@/data/plantData";
import { getDefaultMyPlants, type MyPlant } from "@/data/myPlantsData";
import { Header } from "@/components/Header";
import { HeroTemperature } from "@/components/HeroTemperature";
import { InfoStrip } from "@/components/InfoStrip";
import { HourlyForecast } from "@/components/HourlyForecast";
import { DetailCards } from "@/components/DetailCards";
import { AirQuality } from "@/components/AirQuality";
import { DailyPreview } from "@/components/DailyPreview";
import { PlantPreview } from "@/components/PlantPreview";
import { CitySearchPage } from "@/components/CitySearchPage";
import { SettingsPage } from "@/components/SettingsPage";
import { HourlyForecastPage } from "@/components/HourlyForecastPage";
import { AirQualityPage } from "@/components/AirQualityPage";
import { PlantRecommendationPage } from "@/components/PlantRecommendationPage";
import { MyPlantsDashboard } from "@/components/MyPlantsDashboard";
import { CareSchedulePage } from "@/components/CareSchedulePage";
import DailyForecastPage from "@/components/DailyForecastPage";
import WeatherMapPage from "@/components/WeatherMapPage";

function toF(c: number): number {
  return Math.round((c * 9) / 5 + 32);
}

// Cities that have weather data (our supported cities)
const SUPPORTED_CITIES = Object.keys(citiesWeather);

// Find the closest supported city for display
function findSupportedCity(cityName: string): string {
  // Exact match
  if (citiesWeather[cityName]) return cityName;
  // Case-insensitive match
  const lower = cityName.toLowerCase();
  const found = SUPPORTED_CITIES.find((c) => c.toLowerCase() === lower);
  if (found) return found;
  // Default
  return "New York";
}

export function App() {
  const [currentCity, setCurrentCity] = useState("New York");
  const [unit, setUnit] = useState<"C" | "F">("C");
  const [windUnit, setWindUnit] = useState<WindUnit>("kmh");
  const [appTheme, setAppTheme] = useState<AppTheme>("dark");
  const [searchOpen, setSearchOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [hourlyOpen, setHourlyOpen] = useState(false);
  const [dailyOpen, setDailyOpen] = useState(false);
  const [aqiOpen, setAqiOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [plantOpen, setPlantOpen] = useState(false);
  const [myPlantsOpen, setMyPlantsOpen] = useState(false);
  const [careScheduleOpen, setCareScheduleOpen] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const [recentCities, setRecentCities] = useState<string[]>([
    "London",
    "Tokyo",
    "Dubai",
  ]);
  const [savedCities, setSavedCities] = useState<string[]>([
    "New York",
    "New Delhi",
    "Sydney",
  ]);

  // My Plants state
  const [myPlants, setMyPlants] = useState<MyPlant[]>(getDefaultMyPlants);

  const supportedCity = findSupportedCity(currentCity);
  const data = citiesWeather[supportedCity];
  const weatherTheme = getTheme(data);
  const gradient = getGradient(weatherTheme, appTheme);

  const t = useCallback(
    (celsius: number) => (unit === "F" ? toF(celsius) : celsius),
    [unit]
  );

  const handleCitySelect = useCallback((city: string) => {
    const resolved = findSupportedCity(city);
    setCurrentCity(resolved);
    setSearchOpen(false);
    setAnimKey((k) => k + 1);

    // Add to recent (at front, deduplicated, max 5)
    setRecentCities((prev) => {
      const filtered = prev.filter((c) => c !== resolved);
      return [resolved, ...filtered].slice(0, 5);
    });
  }, []);

  const handleToggleSave = useCallback((city: string) => {
    setSavedCities((prev) => {
      if (prev.includes(city)) {
        return prev.filter((c) => c !== city);
      }
      return [...prev, city];
    });
  }, []);

  const handleRemoveRecent = useCallback((city: string) => {
    setRecentCities((prev) => prev.filter((c) => c !== city));
  }, []);

  // ========== My Plants Handlers ==========
  const handleAddPlant = useCallback(() => {
    // Add a random plant from the database that isn't already in myPlants
    setMyPlants((prev) => {
      const existingIds = new Set(prev.map((p) => p.plantId));
      const available = plantDatabase.filter((p) => !existingIds.has(p.id));
      if (available.length === 0) return prev;

      const randomPlant = available[Math.floor(Math.random() * available.length)];
      const now = new Date();
      const daysAgo = (d: number) => {
        const date = new Date(now);
        date.setDate(date.getDate() - d);
        return date.toISOString();
      };

      const newMyPlant: MyPlant = {
        plantId: randomPlant.id,
        plant: randomPlant,
        addedDate: now.toISOString(),
        lastWatered: daysAgo(Math.floor(Math.random() * 5)),
        lastRotated: daysAgo(Math.floor(Math.random() * 10)),
        location: randomPlant.spaceType.includes("indoor") ? "indoor" : "balcony",
      };

      return [...prev, newMyPlant];
    });
  }, []);

  const handleRemovePlant = useCallback((plantId: string) => {
    setMyPlants((prev) => prev.filter((p) => p.plantId !== plantId));
  }, []);

  const handleWaterPlant = useCallback((plantId: string) => {
    setMyPlants((prev) =>
      prev.map((p) =>
        p.plantId === plantId
          ? { ...p, lastWatered: new Date().toISOString() }
          : p
      )
    );
  }, []);

  const handleRotatePlant = useCallback((plantId: string) => {
    setMyPlants((prev) =>
      prev.map((p) =>
        p.plantId === plantId
          ? { ...p, lastRotated: new Date().toISOString() }
          : p
      )
    );
  }, []);

  return (
    <div
      className={`min-h-screen bg-gradient-to-b ${gradient} transition-all duration-700 ease-in-out`}
    >
      <div className="max-w-lg mx-auto pb-12">
        <Header
          city={data.city}
          country={data.country}
          theme={weatherTheme}
          appTheme={appTheme}
          onCityClick={() => setSearchOpen(true)}
          onMapClick={() => setMapOpen(true)}
          onSettingsClick={() => setSettingsOpen(true)}
        />

        <div key={animKey}>
          <div className="weather-section">
            <HeroTemperature
              temp={t(data.temp)}
              feelsLike={t(data.feelsLike)}
              condition={data.condition}
              conditionIcon={data.conditionIcon}
              theme={weatherTheme}
              appTheme={appTheme}
            />
          </div>

          <div className="weather-section">
            <InfoStrip
              high={t(data.high)}
              low={t(data.low)}
              rainChance={data.rainChance}
              windSpeed={data.windSpeed}
              windUnit={windUnit}
              theme={weatherTheme}
              appTheme={appTheme}
            />
          </div>

          <div className="weather-section">
            <HourlyForecast
              hourly={data.hourly.map((h) => ({
                ...h,
                temp: t(h.temp),
              }))}
              theme={weatherTheme}
              appTheme={appTheme}
              onTap={() => setHourlyOpen(true)}
            />
          </div>

          <div className="weather-section">
            <DailyPreview
              cityName={supportedCity}
              unit={unit}
              theme={weatherTheme}
              appTheme={appTheme}
              onTap={() => setDailyOpen(true)}
            />
          </div>

          <div className="weather-section">
            <DetailCards
              humidity={data.humidity}
              uvIndex={data.uvIndex}
              visibility={data.visibility}
              pressure={data.pressure}
              theme={weatherTheme}
              appTheme={appTheme}
            />
          </div>

          <div className="weather-section">
            <AirQuality
              aqi={data.aqi}
              status={data.aqiStatus}
              theme={weatherTheme}
              appTheme={appTheme}
              onTap={() => setAqiOpen(true)}
            />
          </div>

          <div className="weather-section">
            <PlantPreview
              city={supportedCity}
              theme={weatherTheme}
              appTheme={appTheme}
              onTap={() => setPlantOpen(true)}
            />
          </div>

          {/* My Plants Preview Card */}
          <div className="weather-section">
            <div className="px-4 py-3">
              <button
                onClick={() => setMyPlantsOpen(true)}
                className={`w-full text-left ${appTheme === "light" ? "bg-white/60 backdrop-blur-md shadow-sm shadow-black/5" : "bg-white/15 backdrop-blur-md"} rounded-2xl p-4 cursor-pointer active:scale-[0.99] transition-transform`}
              >
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🪴</span>
                    <span className={`text-xs font-light ${appTheme === "light" ? "text-gray-500" : "text-white/60"} uppercase tracking-widest`}>
                      My Plants
                    </span>
                  </div>
                  <span className={`text-xs font-light ${appTheme === "light" ? "text-gray-500" : "text-white/60"} flex items-center gap-1`}>
                    {myPlants.length} plant{myPlants.length !== 1 ? "s" : ""}
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </span>
                </div>

                {myPlants.length > 0 ? (
                  <div className="flex items-center gap-3">
                    {myPlants.slice(0, 4).map((mp) => (
                      <div
                        key={mp.plantId}
                        className={`flex flex-col items-center gap-1.5 py-2.5 px-3 rounded-xl flex-1 ${
                          appTheme === "light" ? "bg-black/3" : "bg-white/5"
                        }`}
                      >
                        <span className="text-2xl">{mp.plant.image}</span>
                        <span className={`text-[10px] font-light ${appTheme === "light" ? "text-gray-700" : "text-white"} text-center leading-tight truncate w-full`}>
                          {mp.nickname || mp.plant.name}
                        </span>
                      </div>
                    ))}
                    {myPlants.length > 4 && (
                      <div className={`flex flex-col items-center gap-1.5 py-2.5 px-3 rounded-xl ${
                        appTheme === "light" ? "bg-black/3" : "bg-white/5"
                      }`}>
                        <span className={`text-lg ${appTheme === "light" ? "text-gray-400" : "text-white/40"}`}>
                          +{myPlants.length - 4}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-4">
                    <span className={`text-xs font-light ${appTheme === "light" ? "text-gray-400" : "text-white/40"}`}>
                      Tap to add your first plant
                    </span>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* City Search Page - full page overlay */}
      <CitySearchPage
        theme={weatherTheme}
        currentCity={supportedCity}
        recentCities={recentCities}
        savedCities={savedCities}
        isOpen={searchOpen}
        onSelect={handleCitySelect}
        onClose={() => setSearchOpen(false)}
        onToggleSave={handleToggleSave}
        onRemoveRecent={handleRemoveRecent}
      />

      {/* Hourly Forecast Page - full page overlay */}
      <HourlyForecastPage
        theme={weatherTheme}
        city={supportedCity}
        unit={unit}
        isOpen={hourlyOpen}
        onClose={() => setHourlyOpen(false)}
      />

      {/* Daily Forecast Page - full page overlay */}
      {dailyOpen && (
        <DailyForecastPage
          cityName={supportedCity}
          unit={unit}
          theme={weatherTheme}
          onClose={() => setDailyOpen(false)}
        />
      )}

      {/* Air Quality Page - full page overlay */}
      <AirQualityPage
        theme={weatherTheme}
        city={supportedCity}
        isOpen={aqiOpen}
        onClose={() => setAqiOpen(false)}
      />

      {/* Plant Recommendation Page - full page overlay */}
      <PlantRecommendationPage
        theme={weatherTheme}
        city={supportedCity}
        isOpen={plantOpen}
        onClose={() => setPlantOpen(false)}
      />

      {/* My Plants Dashboard - full page overlay */}
      <MyPlantsDashboard
        theme={weatherTheme}
        city={supportedCity}
        myPlants={myPlants}
        isOpen={myPlantsOpen}
        onClose={() => setMyPlantsOpen(false)}
        onNavigateRecommendations={() => {
          setMyPlantsOpen(false);
          setTimeout(() => setPlantOpen(true), 250);
        }}
        onNavigateCareSchedule={() => {
          setMyPlantsOpen(false);
          setTimeout(() => setCareScheduleOpen(true), 250);
        }}
        onAddPlant={handleAddPlant}
        onRemovePlant={handleRemovePlant}
        onWaterPlant={handleWaterPlant}
        onRotatePlant={handleRotatePlant}
      />

      {/* Care Schedule Page - full page overlay */}
      <CareSchedulePage
        theme={weatherTheme}
        city={supportedCity}
        myPlants={myPlants}
        isOpen={careScheduleOpen}
        onClose={() => setCareScheduleOpen(false)}
        onWaterPlant={handleWaterPlant}
        onRotatePlant={handleRotatePlant}
      />

      {/* Weather Map Page - full page overlay */}
      {mapOpen && (
        <WeatherMapPage
          city={supportedCity}
          onBack={() => setMapOpen(false)}
        />
      )}

      {/* Settings Page - full page overlay */}
      <SettingsPage
        weatherTheme={weatherTheme}
        appTheme={appTheme}
        unit={unit}
        windUnit={windUnit}
        isOpen={settingsOpen}
        onUnitChange={setUnit}
        onWindUnitChange={setWindUnit}
        onThemeChange={setAppTheme}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}
