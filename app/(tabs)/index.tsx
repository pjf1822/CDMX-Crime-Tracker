import { Image, StyleSheet, Platform, View } from "react-native";

import Mapbox from "@rnmapbox/maps";
import { MAPBOX_ACCESS_TOKEN } from "@env";
import { useRef } from "react";
import useStore, { CustomFeatureCollection } from "../../zustandStore";

export default function HomeScreen() {
  const { geoData, crimeCounts } = useStore();

  Mapbox.setAccessToken(MAPBOX_ACCESS_TOKEN);
  const mapRef = useRef(null);

  const geojson: CustomFeatureCollection = {
    type: "FeatureCollection",
    features: geoData.map((item) => ({
      type: "Feature",
      geometry: item.geometry,
      properties: {
        cuadrante: item.properties.cuadrante,
        sector: item.properties.sector,
        crimeCount: crimeCounts[item.properties.cuadrante] || 0,
      },
    })),
  };

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

          <Mapbox.ShapeSource id="areaSource" shape={geojson}>
            {/* FillLayer to display polygons */}
            <Mapbox.FillLayer
              id="areaFill"
              style={{
                fillColor: [
                  "case",
                  ["<", ["get", "crimeCount"], 10],
                  "rgba(255, 0, 0, 0.2)", // Low count
                  ["<", ["get", "crimeCount"], 30],
                  "rgba(255, 0, 0, 0.5)", // Medium count
                  ["<", ["get", "crimeCount"], 50],
                  "rgba(255, 0, 0, 0.7)", // High count
                  "rgba(255, 0, 0, 1)", // Very high count
                ],
                fillOpacity: 1,
              }}
            />
            <Mapbox.LineLayer
              id="areaOutline"
              style={{
                lineColor: "black",
                lineWidth: 3,
                lineOpacity: 1,
              }}
            />
          </Mapbox.ShapeSource>
        </Mapbox.MapView>
      )}
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
