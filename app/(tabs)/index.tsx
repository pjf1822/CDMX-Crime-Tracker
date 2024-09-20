import { Image, StyleSheet, Platform, View } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Mapbox from "@rnmapbox/maps";

import { MAPBOX_ACCESS_TOKEN } from "@env";
import { useRef } from "react";

export default function HomeScreen() {
  Mapbox.setAccessToken(MAPBOX_ACCESS_TOKEN);
  const mapRef = useRef(null);

  return (
    <View style={styles.container}>
      <Mapbox.MapView
        projection="globe"
        styleURL="mapbox://styles/pjf1822/clekajgr3000001l8y22r3psx"
        style={styles.map}
        ref={mapRef}
      ></Mapbox.MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  container: {
    height: "100%",
    width: "100%",
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  map: {
    flex: 1,
  },
});
