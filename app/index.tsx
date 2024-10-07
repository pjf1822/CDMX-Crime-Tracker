import { Image, Platform, StyleSheet, View } from "react-native";
import * as Location from "expo-location";
import Mapbox from "@rnmapbox/maps";
import { MAPBOX_ACCESS_TOKEN } from "@env";
import { useEffect, useRef, useState } from "react";
import useStore, { CustomFeatureCollection } from "../zustandStore";
import CrimePicker from "@/CrimePicker";
import CrimeStatsBox from "@/components/CrimeStatsBox";
import { myColors } from "@/theme";
import { crimeThresholds } from "@/constants";

export default function HomeScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const {
    geoData,
    crimeCounts,
    setSelectedCuadrante,
    selectedCuadrante,
    selectedCrime,
  } = useStore();

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
          projection="mercator"
          styleURL="mapbox://styles/pjf1822/cm1aovsic00vq01pcbyo39gsz"
          style={styles.map}
          ref={mapRef}
          scaleBarEnabled={false}
        >
          <Mapbox.Camera
            centerCoordinate={[-99.1332, 19.4326]}
            zoomLevel={12}
            maxBounds={{
              ne: [-98.9, 19.7],
              sw: [-99.6, 18.8],
            }}
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
                style={{ height: 20, width: 20, backgroundColor: "blue" }}
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
                  [
                    "<",
                    ["get", "crimeCount"],
                    crimeThresholds[selectedCrime]?.low || 2,
                  ],
                  "rgba(178,34,34 , 0.0)", // Low count color (light red)
                  [
                    "<",
                    ["get", "crimeCount"],
                    crimeThresholds[selectedCrime]?.medium || 5,
                  ],
                  "rgba(178,34,34 , 0.3)", // Medium count color (medium red)
                  [
                    "<",
                    ["get", "crimeCount"],
                    crimeThresholds[selectedCrime]?.high || 8,
                  ],
                  "rgba(178,34,34 , 0.6)", // High count color (dark red)
                  "rgba(178,34,34 , 0.8)", // Very high count color (full red)
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
                  myColors.beige, // Outline color for selected cuadrante
                  "transparent", // Default outline color
                ],
                lineWidth: [
                  "case",
                  ["==", ["get", "cuadrante"], selectedCuadrante],
                  5,
                  0,
                ],
                lineOpacity: 1,
              }}
            />
          </Mapbox.ShapeSource>
        </Mapbox.MapView>
      )}
      <CrimeStatsBox />
      <Image
        source={require("../assets/logo2.png")}
        style={{
          height: Platform.isPad ? 200 : 100,
          width: Platform.isPad ? 200 : 100,
          position: "absolute",
          top: Platform.isPad ? 0 : 20,
          left: 10,
          zIndex: 999,
          backgroundColor: Platform.isPad ? "transparent" : myColors.beige,
          borderRadius: 20,
        }}
      />
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
