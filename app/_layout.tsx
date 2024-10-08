import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import useStore from "../zustandStore";
import cuadrantesData from "../assets/GeoJSONData.json";
import { fetchCrimeCounts } from "@/helpers";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { setGeoData, setCrimeCounts } = useStore();

  const [loaded] = useFonts({
    OverPassBlack: require("../assets/fonts/Overpass-Black.ttf"),
    OverPassBold: require("../assets/fonts/Overpass-Bold.ttf"),
    OverPassRegular: require("../assets/fonts/Overpass-Regular.ttf"),
    OverPassMedium: require("../assets/fonts/Overpass-Medium.ttf"),
    OverPassThin: require("../assets/fonts/Overpass-Thin.ttf"),
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
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
