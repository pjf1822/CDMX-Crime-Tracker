import { Image, StyleSheet, Platform, View } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Mapbox from "@rnmapbox/maps";

import { MAPBOX_ACCESS_TOKEN } from "@env";
import { useEffect, useRef, useState } from "react";

export default function HomeScreen() {
  Mapbox.setAccessToken(MAPBOX_ACCESS_TOKEN);
  const mapRef = useRef(null);
  const [onePoint, setOnePoint] = useState([]);

  const fetchDataa = async () => {
    const response = await fetch(
      "https://api.hoyodecrimen.com/api/v1/cuadrantes/geojson"
    );
    const text = await response.json();
    return text.features[4].geometry.coordinates;
  };

  useEffect(() => {
    async function shitHole() {
      const fetchMexicoData = await fetchDataa();
      setOnePoint(fetchMexicoData);
    }
    shitHole();
  }, []);

  const geojson = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: onePoint,
        },
        properties: {
          title: "My Area",
        },
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Mapbox.MapView
        projection="globe"
        styleURL="mapbox://styles/pjf1822/cm1aovsic00vq01pcbyo39gsz"
        style={styles.map}
        ref={mapRef}
      >
        <Mapbox.ShapeSource id="areaSource" shape={geojson}>
          <Mapbox.FillLayer
            id="areaFill"
            style={{
              fillColor: "rgba(255, 0, 0, 0.5)", // semi-transparent red
              fillOpacity: 1,
            }}
          />
        </Mapbox.ShapeSource>
      </Mapbox.MapView>
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
