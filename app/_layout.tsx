import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import Papa from "papaparse";

import { useColorScheme } from "@/hooks/useColorScheme";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        // Fetch and parse CSV data
        // const csvData = await fetchCSV(
        //   "https://firms.modaps.eosdis.nasa.gov/usfs/api/area/csv/87970155bbbd5d076513e10493e2f60a/LANDSAT_NRT/world/1/2024-09-19"
        // );
        // console.log(csvData); // Use the CSV data as needed

        const fetchMexicoData = await fetchDataa();
        await SplashScreen.hideAsync();
      } catch (error) {
        console.error("Error fetching CSV:", error);
      }
    }

    loadResourcesAndDataAsync();
  }, [loaded]);

  const fetchDataa = async () => {
    const response = await fetch(
      "https://api.hoyodecrimen.com/api/v1/cuadrantes/geojson"
    );
    const text = await response.json();
    console.log(text.features[0].geometry.coordinates);
  };

  const fetchCSV = async (url) => {
    try {
      const response = await fetch(url);
      let text = await response.text();
      console.log(text.slice(0, 1000));
      return;

      return new Promise((resolve, reject) => {
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true,

          complete: (results) => {
            // Log entire results to check the structure
            // console.log("CSV parsing results:", results);

            // Check if expected fields are present
            const fields = results.meta.fields;
            // console.log("Fields in CSV:", fields);

            // Log first 10 rows for inspection
            console.log("First 10 rows:", results.data.slice(0, 10));

            resolve(results.data);
          },
          error: (error) => {
            console.error("Error parsing CSV:", error);
            reject(error);
          },
        });
      });
    } catch (error) {
      console.error("Error fetching CSV:", error);
      throw error;
    }
  };
  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}
