import useStore, { CrimeData } from "./zustandStore";
import cuadrantesData from "./GeoJSONData.json";

export const fetchCrimeData = async (
  cuadrante: string
): Promise<CrimeData[]> => {
  const json = require("./assets/crimeData.json"); // Adjust the path as needed
  // Convert the imported JSON to an array
  return json.filter((crime: CrimeData) => crime.cuadrante === cuadrante);
};

export const fetchCrimeCounts = async (crimeType: string) => {
  const { geoData } = useStore();

  const crimeCountsArray = [];
  let totalCount = 0; // Initialize a variable to hold the total count
  let validCountEntries = 0;

  for (const item of geoData) {
    const cuadrante = item.properties.cuadrante;
    const crimes = await fetchCrimeData(cuadrante);
    const homicideCrime = crimes.find((crime) => crime.crime === crimeType)!;

    totalCount += homicideCrime.count;
    validCountEntries++;

    crimeCountsArray.push({ [cuadrante]: homicideCrime.count });
  }
  console.log(totalCount / validCountEntries);

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
