import { CrimeData } from "./zustandStore";
import fs from "fs";
import path from "path";

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
  const allCrimes = [];
  const counts: Record<string, number> = {};
  for (const item of geoData) {
    const cuadrante = item.properties.cuadrante;
    const crimes = await fetchCrimeData(cuadrante);
    // console.log(crimes);
    // const totalCount = crimes.reduce((acc, crime) => acc + crime.count, 0);
    // counts[cuadrante] = totalCount;
    for (const crime of crimes) {
      // Log the current crime details

      allCrimes.push({
        cuadrante: cuadrante,
        crime: crime.crime,
        count: crime.count,
        end_date: crime.end_date, // Adding end_date
        population: crime.population, // Adding population
        sector: crime.sector, // Adding sector
        start_date: crime.start_date, // Adding start_date
      });
    }
  }
  const filePath = path.join(__dirname, "crimeData.json"); // Adjust path as necessary
  fs.writeFile(filePath, JSON.stringify(allCrimes, null, 2), (err) => {
    if (err) {
      console.error("Error saving crime data:", err);
    } else {
      console.log("Crime data saved to", filePath);
    }
  });

  return counts;
};
