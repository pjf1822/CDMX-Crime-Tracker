import { Image, StyleSheet, Platform, View } from "react-native";
import * as Location from "expo-location";
import Mapbox from "@rnmapbox/maps";
import { MAPBOX_ACCESS_TOKEN } from "@env";
import { useEffect, useRef, useState } from "react";
import useStore, { CustomFeatureCollection } from "../../zustandStore";
import CrimePicker from "@/CrimePicker";
import CrimeStatsBox from "@/components/CrimeStatsBox";

export default function HomeScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const { geoData, crimeCounts, setSelectedCuadrante, selectedCuadrante } =
    useStore();

  Mapbox.setAccessToken(MAPBOX_ACCESS_TOKEN);
  const mapRef = useRef(null);

  const crimeCountsLookup = crimeCounts.reduce((acc, curr) => {
    const cuadranteKey = Object.keys(curr)[0]; // Get the key (cuadrante)
    acc[cuadranteKey] = curr[cuadranteKey]; // Map cuadrante to its count
    return acc;
  }, {} as Record<string, number>);

  const geojson: CustomFeatureCollection = {
    type: "FeatureCollection",
    features: geoData.map((item) => ({
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: item.geometry.coordinates,
      },
      properties: {
        cuadrante: item.properties.cuadrante,
        sector: item.properties.sector,
        crimeCount: crimeCountsLookup[item.properties.cuadrante] || 0,
        alcaldia: item.properties.alcaldia,
      },
    })),
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  return (
    <View style={styles.container}>
      {geoData.length > 0 && (
        <Mapbox.MapView
          projection="globe"
          styleURL="mapbox://styles/pjf1822/cm1aovsic00vq01pcbyo39gsz"
          style={styles.map}
          ref={mapRef}
        >
          <Mapbox.Camera
            centerCoordinate={[-99.1332, 19.4326]}
            zoomLevel={12}
          />

          {location && (
            <Mapbox.PointAnnotation
              key="userLocation"
              id="userLocation"
              coordinate={[
                location?.coords?.longitude,
                location?.coords?.latitude,
              ]}
            >
              {/* <Mapbox.Callout title="You are here!" /> */}
              <View
                style={{ height: 200, width: 200, backgroundColor: "blue" }}
              ></View>
            </Mapbox.PointAnnotation>
          )}
          <Mapbox.ShapeSource
            id="areaSource"
            shape={geojson}
            onPress={(event) =>
              setSelectedCuadrante(event?.features[0]?.properties?.cuadrante)
            }
          >
            <Mapbox.FillLayer
              id="areaFill"
              style={{
                fillColor: [
                  "case",
                  ["<", ["get", "crimeCount"], 0],
                  "rgba(214, 228, 179, 0.2)", // Low count
                  ["<", ["get", "crimeCount"], 1],
                  "rgba(191, 206, 142, 0.5)", // Medium count
                  ["<", ["get", "crimeCount"], 2],
                  "rgba(159, 172, 114, 1)", // High count
                  "rgba(255, 0, 0, 1)", // Very high count
                ],
                fillOpacity: 1,
              }}
            />
            <Mapbox.LineLayer
              id="areaOutline"
              style={{
                lineColor: [
                  "case",
                  ["==", ["get", "cuadrante"], selectedCuadrante],
                  "green", // Outline color for selected cuadrante
                  "black", // Default outline color
                ],
                lineWidth: [
                  "case",
                  ["==", ["get", "cuadrante"], selectedCuadrante],
                  5,
                  2,
                ],
                lineOpacity: 1,
              }}
            />
          </Mapbox.ShapeSource>
        </Mapbox.MapView>
      )}
      <CrimeStatsBox />
      <CrimePicker />
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
