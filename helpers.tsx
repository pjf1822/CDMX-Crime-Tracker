import { CrimeData } from "./zustandStore";

export const fetchCrimeData = async (
  cuadrante: string
): Promise<CrimeData[]> => {
  const response = await fetch(
    `https://api.hoyodecrimen.com/api/v1/cuadrantes/${cuadrante}/crimes/all/period`
  );
  const data = await response.json();
  return data.rows;
};

export const fetchCrimeCounts = async (geoData: any) => {
  const counts: Record<string, number> = {};
  for (const item of geoData) {
    const cuadrante = item.properties.cuadrante;
    const crimes = await fetchCrimeData(cuadrante);
    console.log(crimes);
    const totalCount = crimes.reduce((acc, crime) => acc + crime.count, 0);
    counts[cuadrante] = totalCount;
  }
  return counts;
};
