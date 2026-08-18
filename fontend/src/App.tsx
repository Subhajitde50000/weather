import { useCallback, useState } from "react";
import {
  CITIES,
  citiesWeather,
  getTheme,
  resolveCity,
  type AppTheme,
  type WindUnit,
} from "@/data/weatherData";
import { plantDatabase, type Plant } from "@/data/plantData";
import { getDefaultMyPlants, type MyPlant } from "@/data/myPlantsData";
import { Atmosphere } from "@/components/Atmosphere";
import { Header } from "@/components/Header";
import { HeroTemperature } from "@/components/HeroTemperature";
import { InfoStrip } from "@/components/InfoStrip";
import { HourlyForecast } from "@/components/HourlyForecast";
import { DetailCards } from "@/components/DetailCards";
import { AirQuality } from "@/components/AirQuality";
import { DailyPreview } from "@/components/DailyPreview";
import { PlantPreview } from "@/components/PlantPreview";
import { GasMixCard } from "@/components/GasMix";
import { CitySearchPage } from "@/components/CitySearchPage";
import { SettingsPage } from "@/components/SettingsPage";
import { HourlyForecastPage } from "@/components/HourlyForecastPage";
import { AirQualityPage } from "@/components/AirQualityPage";
import { PlantRecommendationPage } from "@/components/PlantRecommendationPage";
import { MyPlantsDashboard } from "@/components/MyPlantsDashboard";
import { CareSchedulePage } from "@/components/CareSchedulePage";
import DailyForecastPage from "@/components/DailyForecastPage";
import WeatherMapPage from "@/components/WeatherMapPage";
import { getUi } from "@/data/weatherData";
import { PlantPhoto } from "@/components/PlantPhoto";

function toF(c: number): number {
  return Math.round((c * 9) / 5 + 32);
}

export function App() {
  const [currentCity, setCurrentCity] = useState("Kolkata");
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
  const [recentCities, setRecentCities] = useState<string[]>(["Delhi", "Kharagpur"]);
  const [savedCities, setSavedCities] = useState<string[]>(["Kolkata", "Delhi"]);
  const [myPlants, setMyPlants] = useState<MyPlant[]>(getDefaultMyPlants);

  const supportedCity = resolveCity(currentCity);
  const data = citiesWeather[supportedCity];
  const weatherTheme = getTheme(data);
  const ui = getUi(appTheme);

  const t = useCallback((celsius: number) => (unit === "F" ? toF(celsius) : celsius), [unit]);

  const handleCitySelect = useCallback((city: string) => {
    const resolved = resolveCity(city);
    setCurrentCity(resolved);
    setSearchOpen(false);
    setAnimKey((k) => k + 1);
    setRecentCities((prev) => {
      const filtered = prev.filter((c) => c !== resolved);
      return [resolved, ...filtered].slice(0, 5);
    });
  }, []);

  const handleToggleSave = useCallback((city: string) => {
    setSavedCities((prev) => (prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]));
  }, []);

  const handleRemoveRecent = useCallback((city: string) => {
    setRecentCities((prev) => prev.filter((c) => c !== city));
  }, []);

  const addSpecificPlant = useCallback((plant: Plant) => {
    setMyPlants((prev) => {
      if (prev.some((p) => p.plantId === plant.id)) return prev;
      const now = new Date();
      const daysAgo = (d: number) => {
        const date = new Date(now);
        date.setDate(date.getDate() - d);
        return date.toISOString();
      };
      const newMyPlant: MyPlant = {
        plantId: plant.id,
        plant,
        addedDate: now.toISOString(),
        lastWatered: daysAgo(1),
        lastRotated: daysAgo(4),
        location: plant.spaceType.includes("indoor") ? "indoor" : "balcony",
      };
      return [...prev, newMyPlant];
    });
  }, []);

  const handleAddPlant = useCallback(() => {
    setMyPlants((prev) => {
      const existingIds = new Set(prev.map((p) => p.plantId));
      const available = plantDatabase.filter((p) => !existingIds.has(p.id));
      if (available.length === 0) return prev;
      const next = available[0];
      const now = new Date();
      const daysAgo = (d: number) => {
        const date = new Date(now);
        date.setDate(date.getDate() - d);
        return date.toISOString();
      };
      return [
        ...prev,
        {
          plantId: next.id,
          plant: next,
          addedDate: now.toISOString(),
          lastWatered: daysAgo(1),
          lastRotated: daysAgo(3),
          location: next.spaceType.includes("indoor") ? "indoor" : "balcony",
        },
      ];
    });
  }, []);

  const handleRemovePlant = useCallback((plantId: string) => {
    setMyPlants((prev) => prev.filter((p) => p.plantId !== plantId));
  }, []);

  const handleWaterPlant = useCallback((plantId: string) => {
    setMyPlants((prev) =>
      prev.map((p) => (p.plantId === plantId ? { ...p, lastWatered: new Date().toISOString() } : p)),
    );
  }, []);

  const handleRotatePlant = useCallback((plantId: string) => {
    setMyPlants((prev) =>
      prev.map((p) => (p.plantId === plantId ? { ...p, lastRotated: new Date().toISOString() } : p)),
    );
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Atmosphere theme={weatherTheme} appTheme={appTheme} />

      <div className="relative z-10">
        <Header
          city={data.city}
          country={data.country}
          theme={weatherTheme}
          appTheme={appTheme}
          onCityClick={() => setSearchOpen(true)}
          onMapClick={() => setMapOpen(true)}
          onSettingsClick={() => setSettingsOpen(true)}
        />

        <div className="mx-auto max-w-[1400px] px-4 pb-16 lg:px-8">
          <div className="mb-6 flex flex-wrap gap-2">
            {CITIES.map((city) => {
              const active = city === supportedCity;
              return (
                <button
                  key={city}
                  onClick={() => handleCitySelect(city)}
                  className={`rounded-full px-4 py-1.5 text-sm transition-all ${
                    active
                      ? "bg-[#3dd68c] text-[#062016] shadow-[0_8px_24px_rgba(61,214,140,0.28)]"
                      : `${ui.card} ${ui.muted} hover:text-inherit`
                  }`}
                >
                  {city}
                </button>
              );
            })}
          </div>

          <div key={animKey} className="grid items-start gap-6 lg:grid-cols-12 lg:gap-10">
            <aside className="weather-section lg:sticky lg:top-24 lg:col-span-5">
              <HeroTemperature
                temp={t(data.temp)}
                feelsLike={t(data.feelsLike)}
                condition={data.condition}
                conditionIcon={data.conditionIcon}
                theme={weatherTheme}
                appTheme={appTheme}
              />
              <p className={`mt-3 text-center text-xs lg:text-left ${ui.muted}`}>
                {data.state}, India · Tue 18 Aug 2026 · 1:10 PM
              </p>
              <InfoStrip
                high={t(data.high)}
                low={t(data.low)}
                rainChance={data.rainChance}
                windSpeed={data.windSpeed}
                windUnit={windUnit}
                theme={weatherTheme}
                appTheme={appTheme}
              />
            </aside>

            <main className="flex flex-col gap-4 lg:col-span-7">
              <div className="weather-section">
                <HourlyForecast
                  hourly={data.hourly.map((h) => ({ ...h, temp: t(h.temp) }))}
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

              <div className="weather-section grid gap-4 md:grid-cols-2">
                <AirQuality
                  aqi={data.aqi}
                  status={data.aqiStatus}
                  theme={weatherTheme}
                  appTheme={appTheme}
                  onTap={() => setAqiOpen(true)}
                />
                <GasMixCard gases={data.gases} appTheme={appTheme} onTap={() => setAqiOpen(true)} />
              </div>

              <div className="weather-section">
                <PlantPreview
                  city={supportedCity}
                  theme={weatherTheme}
                  appTheme={appTheme}
                  onTap={() => setPlantOpen(true)}
                />
              </div>

              <div className="weather-section">
                <button
                  onClick={() => setMyPlantsOpen(true)}
                  className={`w-full text-left ${ui.card} rounded-[1.6rem] p-4 transition-transform active:scale-[0.99]`}
                >
                  <div className="mb-3 flex items-center justify-between px-1">
                    <span className={`text-[11px] uppercase tracking-[0.22em] ${ui.faint}`}>My garden</span>
                    <span className={`flex items-center gap-1 text-xs ${ui.muted}`}>
                      {myPlants.length} plant{myPlants.length !== 1 ? "s" : ""}
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </span>
                  </div>
                  {myPlants.length > 0 ? (
                    <div className="flex items-center gap-3">
                      {myPlants.slice(0, 4).map((mp) => (
                        <div key={mp.plantId} className={`flex flex-1 flex-col items-center gap-1.5 rounded-2xl px-3 py-2.5 ${ui.chip}`}>
                          <PlantPhoto src={mp.plant.image} alt={mp.nickname || mp.plant.name} size="md" />
                          <span className={`w-full truncate text-center text-[10px] ${ui.text}`}>
                            {mp.nickname || mp.plant.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className={`py-4 text-center text-xs ${ui.faint}`}>Tap to add your first plant</p>
                  )}
                </button>
              </div>
            </main>
          </div>
        </div>
      </div>

      <CitySearchPage
        theme={weatherTheme}
        appTheme={appTheme}
        currentCity={supportedCity}
        recentCities={recentCities}
        savedCities={savedCities}
        isOpen={searchOpen}
        onSelect={handleCitySelect}
        onClose={() => setSearchOpen(false)}
        onToggleSave={handleToggleSave}
        onRemoveRecent={handleRemoveRecent}
      />

      <HourlyForecastPage
        theme={weatherTheme}
        appTheme={appTheme}
        city={supportedCity}
        unit={unit}
        isOpen={hourlyOpen}
        onClose={() => setHourlyOpen(false)}
      />

      {dailyOpen && (
        <DailyForecastPage
          cityName={supportedCity}
          unit={unit}
          theme={weatherTheme}
          appTheme={appTheme}
          onClose={() => setDailyOpen(false)}
        />
      )}

      <AirQualityPage
        theme={weatherTheme}
        appTheme={appTheme}
        city={supportedCity}
        isOpen={aqiOpen}
        onClose={() => setAqiOpen(false)}
      />

      <PlantRecommendationPage
        theme={weatherTheme}
        appTheme={appTheme}
        city={supportedCity}
        isOpen={plantOpen}
        onClose={() => setPlantOpen(false)}
        onAddPlant={addSpecificPlant}
      />

      <MyPlantsDashboard
        theme={weatherTheme}
        appTheme={appTheme}
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

      <CareSchedulePage
        theme={weatherTheme}
        appTheme={appTheme}
        city={supportedCity}
        myPlants={myPlants}
        isOpen={careScheduleOpen}
        onClose={() => setCareScheduleOpen(false)}
        onWaterPlant={handleWaterPlant}
        onRotatePlant={handleRotatePlant}
      />

      {mapOpen && <WeatherMapPage city={supportedCity} onBack={() => setMapOpen(false)} />}

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
