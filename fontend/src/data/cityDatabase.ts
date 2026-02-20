export interface CityEntry {
  city: string;
  state: string;
  country: string;
  pincode?: string;
  airportCode?: string;
}

export const cityDatabase: CityEntry[] = [
  // India
  { city: "New Delhi", state: "Delhi", country: "India", pincode: "110001", airportCode: "DEL" },
  { city: "Mumbai", state: "Maharashtra", country: "India", pincode: "400001", airportCode: "BOM" },
  { city: "Bangalore", state: "Karnataka", country: "India", pincode: "560001", airportCode: "BLR" },
  { city: "Chennai", state: "Tamil Nadu", country: "India", pincode: "600001", airportCode: "MAA" },
  { city: "Kolkata", state: "West Bengal", country: "India", pincode: "700001", airportCode: "CCU" },
  { city: "Hyderabad", state: "Telangana", country: "India", pincode: "500001", airportCode: "HYD" },
  { city: "Pune", state: "Maharashtra", country: "India", pincode: "411001", airportCode: "PNQ" },
  { city: "Ahmedabad", state: "Gujarat", country: "India", pincode: "380001", airportCode: "AMD" },
  { city: "Jaipur", state: "Rajasthan", country: "India", pincode: "302001", airportCode: "JAI" },
  { city: "Lucknow", state: "Uttar Pradesh", country: "India", pincode: "226001", airportCode: "LKO" },
  { city: "Chandigarh", state: "Chandigarh", country: "India", pincode: "160001", airportCode: "IXC" },
  { city: "Goa", state: "Goa", country: "India", pincode: "403001", airportCode: "GOI" },
  { city: "Kochi", state: "Kerala", country: "India", pincode: "682001", airportCode: "COK" },
  { city: "Varanasi", state: "Uttar Pradesh", country: "India", pincode: "221001", airportCode: "VNS" },
  { city: "Indore", state: "Madhya Pradesh", country: "India", pincode: "452001", airportCode: "IDR" },
  { city: "Bhopal", state: "Madhya Pradesh", country: "India", pincode: "462001", airportCode: "BHO" },
  { city: "Patna", state: "Bihar", country: "India", pincode: "800001", airportCode: "PAT" },
  { city: "Nagpur", state: "Maharashtra", country: "India", pincode: "440001", airportCode: "NAG" },
  { city: "Surat", state: "Gujarat", country: "India", pincode: "395001" },
  { city: "Visakhapatnam", state: "Andhra Pradesh", country: "India", pincode: "530001", airportCode: "VTZ" },

  // United States
  { city: "New York", state: "New York", country: "United States", pincode: "10001", airportCode: "JFK" },
  { city: "Los Angeles", state: "California", country: "United States", pincode: "90001", airportCode: "LAX" },
  { city: "Chicago", state: "Illinois", country: "United States", pincode: "60601", airportCode: "ORD" },
  { city: "Houston", state: "Texas", country: "United States", pincode: "77001", airportCode: "IAH" },
  { city: "San Francisco", state: "California", country: "United States", pincode: "94101", airportCode: "SFO" },
  { city: "Miami", state: "Florida", country: "United States", pincode: "33101", airportCode: "MIA" },
  { city: "Seattle", state: "Washington", country: "United States", pincode: "98101", airportCode: "SEA" },
  { city: "Boston", state: "Massachusetts", country: "United States", pincode: "02101", airportCode: "BOS" },
  { city: "Denver", state: "Colorado", country: "United States", pincode: "80201", airportCode: "DEN" },
  { city: "Atlanta", state: "Georgia", country: "United States", pincode: "30301", airportCode: "ATL" },
  { city: "Las Vegas", state: "Nevada", country: "United States", pincode: "89101", airportCode: "LAS" },
  { city: "Dallas", state: "Texas", country: "United States", pincode: "75201", airportCode: "DFW" },
  { city: "Washington D.C.", state: "District of Columbia", country: "United States", pincode: "20001", airportCode: "DCA" },
  { city: "Phoenix", state: "Arizona", country: "United States", pincode: "85001", airportCode: "PHX" },
  { city: "Portland", state: "Oregon", country: "United States", pincode: "97201", airportCode: "PDX" },

  // United Kingdom
  { city: "London", state: "England", country: "United Kingdom", pincode: "EC1A", airportCode: "LHR" },
  { city: "Manchester", state: "England", country: "United Kingdom", pincode: "M1", airportCode: "MAN" },
  { city: "Birmingham", state: "England", country: "United Kingdom", pincode: "B1", airportCode: "BHX" },
  { city: "Edinburgh", state: "Scotland", country: "United Kingdom", pincode: "EH1", airportCode: "EDI" },
  { city: "Glasgow", state: "Scotland", country: "United Kingdom", pincode: "G1", airportCode: "GLA" },
  { city: "Liverpool", state: "England", country: "United Kingdom", pincode: "L1", airportCode: "LPL" },
  { city: "Bristol", state: "England", country: "United Kingdom", pincode: "BS1", airportCode: "BRS" },

  // Asia
  { city: "Tokyo", state: "Kantō", country: "Japan", pincode: "100-0001", airportCode: "NRT" },
  { city: "Osaka", state: "Kansai", country: "Japan", pincode: "530-0001", airportCode: "KIX" },
  { city: "Seoul", state: "Gyeonggi", country: "South Korea", pincode: "04524", airportCode: "ICN" },
  { city: "Beijing", state: "Beijing", country: "China", pincode: "100000", airportCode: "PEK" },
  { city: "Shanghai", state: "Shanghai", country: "China", pincode: "200000", airportCode: "PVG" },
  { city: "Singapore", state: "Singapore", country: "Singapore", pincode: "048583", airportCode: "SIN" },
  { city: "Bangkok", state: "Bangkok", country: "Thailand", pincode: "10100", airportCode: "BKK" },
  { city: "Hong Kong", state: "Hong Kong", country: "China", pincode: "999077", airportCode: "HKG" },
  { city: "Taipei", state: "Taiwan", country: "Taiwan", pincode: "100", airportCode: "TPE" },
  { city: "Kuala Lumpur", state: "Federal Territory", country: "Malaysia", pincode: "50000", airportCode: "KUL" },
  { city: "Jakarta", state: "Jakarta", country: "Indonesia", pincode: "10110", airportCode: "CGK" },
  { city: "Manila", state: "Metro Manila", country: "Philippines", pincode: "1000", airportCode: "MNL" },

  // Middle East
  { city: "Dubai", state: "Dubai", country: "UAE", pincode: "00000", airportCode: "DXB" },
  { city: "Abu Dhabi", state: "Abu Dhabi", country: "UAE", pincode: "00000", airportCode: "AUH" },
  { city: "Doha", state: "Doha", country: "Qatar", pincode: "00000", airportCode: "DOH" },
  { city: "Riyadh", state: "Riyadh", country: "Saudi Arabia", pincode: "11564", airportCode: "RUH" },
  { city: "Istanbul", state: "Istanbul", country: "Turkey", pincode: "34000", airportCode: "IST" },
  { city: "Tel Aviv", state: "Tel Aviv", country: "Israel", pincode: "61000", airportCode: "TLV" },

  // Europe
  { city: "Paris", state: "Île-de-France", country: "France", pincode: "75001", airportCode: "CDG" },
  { city: "Berlin", state: "Berlin", country: "Germany", pincode: "10115", airportCode: "BER" },
  { city: "Rome", state: "Lazio", country: "Italy", pincode: "00100", airportCode: "FCO" },
  { city: "Madrid", state: "Madrid", country: "Spain", pincode: "28001", airportCode: "MAD" },
  { city: "Barcelona", state: "Catalonia", country: "Spain", pincode: "08001", airportCode: "BCN" },
  { city: "Amsterdam", state: "North Holland", country: "Netherlands", pincode: "1011", airportCode: "AMS" },
  { city: "Vienna", state: "Vienna", country: "Austria", pincode: "1010", airportCode: "VIE" },
  { city: "Zurich", state: "Zurich", country: "Switzerland", pincode: "8001", airportCode: "ZRH" },
  { city: "Munich", state: "Bavaria", country: "Germany", pincode: "80331", airportCode: "MUC" },
  { city: "Prague", state: "Prague", country: "Czech Republic", pincode: "11000", airportCode: "PRG" },
  { city: "Lisbon", state: "Lisbon", country: "Portugal", pincode: "1100", airportCode: "LIS" },
  { city: "Stockholm", state: "Stockholm", country: "Sweden", pincode: "11120", airportCode: "ARN" },
  { city: "Oslo", state: "Oslo", country: "Norway", pincode: "0150", airportCode: "OSL" },
  { city: "Copenhagen", state: "Copenhagen", country: "Denmark", pincode: "1050", airportCode: "CPH" },
  { city: "Helsinki", state: "Uusimaa", country: "Finland", pincode: "00100", airportCode: "HEL" },
  { city: "Athens", state: "Attica", country: "Greece", pincode: "10431", airportCode: "ATH" },
  { city: "Dublin", state: "Leinster", country: "Ireland", pincode: "D01", airportCode: "DUB" },
  { city: "Warsaw", state: "Masovia", country: "Poland", pincode: "00-001", airportCode: "WAW" },
  { city: "Budapest", state: "Budapest", country: "Hungary", pincode: "1011", airportCode: "BUD" },

  // Australia & Oceania
  { city: "Sydney", state: "New South Wales", country: "Australia", pincode: "2000", airportCode: "SYD" },
  { city: "Melbourne", state: "Victoria", country: "Australia", pincode: "3000", airportCode: "MEL" },
  { city: "Brisbane", state: "Queensland", country: "Australia", pincode: "4000", airportCode: "BNE" },
  { city: "Perth", state: "Western Australia", country: "Australia", pincode: "6000", airportCode: "PER" },
  { city: "Auckland", state: "Auckland", country: "New Zealand", pincode: "1010", airportCode: "AKL" },

  // Africa
  { city: "Cairo", state: "Cairo", country: "Egypt", pincode: "11511", airportCode: "CAI" },
  { city: "Cape Town", state: "Western Cape", country: "South Africa", pincode: "8001", airportCode: "CPT" },
  { city: "Nairobi", state: "Nairobi", country: "Kenya", pincode: "00100", airportCode: "NBO" },
  { city: "Lagos", state: "Lagos", country: "Nigeria", pincode: "100001", airportCode: "LOS" },
  { city: "Casablanca", state: "Casablanca-Settat", country: "Morocco", pincode: "20000", airportCode: "CMN" },

  // South America
  { city: "São Paulo", state: "São Paulo", country: "Brazil", pincode: "01000", airportCode: "GRU" },
  { city: "Rio de Janeiro", state: "Rio de Janeiro", country: "Brazil", pincode: "20000", airportCode: "GIG" },
  { city: "Buenos Aires", state: "Buenos Aires", country: "Argentina", pincode: "C1000", airportCode: "EZE" },
  { city: "Lima", state: "Lima", country: "Peru", pincode: "15001", airportCode: "LIM" },
  { city: "Bogotá", state: "Bogotá", country: "Colombia", pincode: "110111", airportCode: "BOG" },
  { city: "Santiago", state: "Santiago", country: "Chile", pincode: "8320000", airportCode: "SCL" },
  { city: "Mexico City", state: "CDMX", country: "Mexico", pincode: "06000", airportCode: "MEX" },

  // Canada
  { city: "Toronto", state: "Ontario", country: "Canada", pincode: "M5H", airportCode: "YYZ" },
  { city: "Vancouver", state: "British Columbia", country: "Canada", pincode: "V6B", airportCode: "YVR" },
  { city: "Montreal", state: "Quebec", country: "Canada", pincode: "H2X", airportCode: "YUL" },
  { city: "Calgary", state: "Alberta", country: "Canada", pincode: "T2P", airportCode: "YYC" },
];

export function searchCities(query: string): CityEntry[] {
  if (!query.trim()) return [];

  const q = query.toLowerCase().trim();

  return cityDatabase
    .filter((entry) => {
      return (
        entry.city.toLowerCase().includes(q) ||
        entry.state.toLowerCase().includes(q) ||
        entry.country.toLowerCase().includes(q) ||
        (entry.pincode && entry.pincode.toLowerCase().startsWith(q)) ||
        (entry.airportCode && entry.airportCode.toLowerCase() === q)
      );
    })
    .slice(0, 8);
}
