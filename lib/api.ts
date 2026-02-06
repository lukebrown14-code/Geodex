const BASE_URL = "https://api.census.gov/data/timeseries/idb/5year";

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export const censusApi = {
  getPopulation: (years: string, countryCode: string) =>
    fetchJson<string[][]>(
      `${BASE_URL}?get=POP&YR=${years}&for=genc+standard+countries+and+areas:${countryCode}`,
    ),
};
