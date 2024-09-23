import { CrimeData } from "./zustandStore";
import * as FileSystem from "expo-file-system"; // Import expo-file-system

export const fetchCrimeData = async (
  cuadrante: string
): Promise<CrimeData[]> => {
  const json = require("./assets/crimeData.json"); // Adjust the path as needed
  // Convert the imported JSON to an array
  return json.filter((crime: CrimeData) => crime.cuadrante === cuadrante);
};

export const fetchCrimeCounts = async (geoData: any) => {
  const crimeCountsArray = [];
  for (const item of geoData) {
    const cuadrante = item.properties.cuadrante;
    const crimes = await fetchCrimeData(cuadrante);
    const homicideCrime = crimes.find(
      (crime) => crime.crime === "HOMICIDIO DOLOSO"
    )!;

    crimeCountsArray.push({ [cuadrante]: homicideCrime.count });
  }

  // const filePath = FileSystem.documentDirectory + "crimeData.json";

  // try {
  //   // Write the JSON string to the file
  //   await FileSystem.writeAsStringAsync(
  //     filePath,
  //     JSON.stringify(allCrimes, null, 2)
  //   );
  //   console.log("Crime data saved to", filePath);
  // } catch (err) {
  //   console.error("Error saving crime data:", err);
  // }
  return crimeCountsArray;
};
