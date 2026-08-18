export interface CityEntry {
  city: string;
  state: string;
  country: string;
  pincode?: string;
  airportCode?: string;
}

export const cityDatabase: CityEntry[] = [
  { city: "Kolkata", state: "West Bengal", country: "India", pincode: "700001", airportCode: "CCU" },
  { city: "Delhi", state: "Delhi", country: "India", pincode: "110001", airportCode: "DEL" },
  { city: "Kharagpur", state: "West Bengal", country: "India", pincode: "721302", airportCode: "KGP" },
];

export function searchCities(query: string): CityEntry[] {
  if (!query.trim()) return [];

  const q = query.toLowerCase().trim();

  return cityDatabase.filter((entry) => {
    return (
      entry.city.toLowerCase().includes(q) ||
      entry.state.toLowerCase().includes(q) ||
      entry.country.toLowerCase().includes(q) ||
      (entry.pincode && entry.pincode.toLowerCase().startsWith(q)) ||
      (entry.airportCode && entry.airportCode.toLowerCase() === q) ||
      (q === "calcutta" && entry.city === "Kolkata") ||
      (q === "new delhi" && entry.city === "Delhi") ||
      (q === "kgp" && entry.city === "Kharagpur")
    );
  });
}
