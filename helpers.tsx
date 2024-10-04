import { CrimeData, GeoDataItem } from "./zustandStore";

export const fetchCrimeData = async (
  cuadrante: string
): Promise<CrimeData[]> => {
  const json = require("./assets/crimeData.json");
  return json.filter((crime: CrimeData) => crime.cuadrante === cuadrante);
};

export const fetchCrimeCounts = async (
  crimeType: string,
  geoData: GeoDataItem[],
  setCrimeCounts: React.Dispatch<React.SetStateAction<any>>
) => {
  const crimeCountsArray = [];
  let totalCount = 0;
  let validCountEntries = 0;

  for (const item of geoData) {
    const cuadrante = item.properties.cuadrante;
    const crimes = await fetchCrimeData(cuadrante);
    const homicideCrime = crimes.find((crime) => crime.crime === crimeType)!;

    totalCount += homicideCrime.count;
    validCountEntries++;

    crimeCountsArray.push({ [cuadrante]: homicideCrime.count });
  }
  // console.log(totalCount / validCountEntries);

  setCrimeCounts(crimeCountsArray);
};

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
