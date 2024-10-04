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
import { useColorScheme } from "@/hooks/useColorScheme";
import useStore from "../zustandStore";
import cuadrantesData from "../GeoJSONData.json";
import { fetchCrimeCounts } from "@/helpers";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { setGeoData, setCrimeCounts } = useStore();
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        await SplashScreen.hideAsync();
        const localGeoData = cuadrantesData?.features;
        setGeoData(localGeoData);
        await fetchCrimeCounts(
          "HOMICIDIO DOLOSO",
          localGeoData,
          setCrimeCounts
        );
      } catch (error) {
        console.error("Error fetching CSV:", error);
      }
    }
    if (loaded) {
      loadResourcesAndDataAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}
