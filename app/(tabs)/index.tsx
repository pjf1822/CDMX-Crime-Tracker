import { Image, StyleSheet, Platform, View } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Mapbox from "@rnmapbox/maps";
import cuadrantesData from "../../GeoJSONData.json";

import { MAPBOX_ACCESS_TOKEN } from "@env";
import { useEffect, useRef, useState } from "react";

interface GeoJSONFeature {
  type: string;
  properties: {
    alcaldia: string;
    sector: string;
    cuadrante: string;
  };
  geometry: {
    type: string;
    coordinates: number[][][];
  };
}
interface CrimeData {
  count: number;
}
export default function HomeScreen() {
  Mapbox.setAccessToken(MAPBOX_ACCESS_TOKEN);
  const mapRef = useRef(null);
  const [onePoint, setOnePoint] = useState([]);
  const [geoData, setGeoData] = useState<GeoJSONFeature[]>([]);
  const [crimeCounts, setCrimeCounts] = useState({});

  const fetchCrimeData = async (cuadrante: string): Promise<CrimeData[]> => {
    const response = await fetch(
      `https://api.hoyodecrimen.com/api/v1/cuadrantes/${cuadrante}/crimes/all/period`
    );
    const data = await response.json();
    return data.rows; // Return the rows containing crime data
  };

  useEffect(() => {
    async function loadGeoData() {
      setGeoData(cuadrantesData.features.slice(0, 10));
      // Fetch crime data for each cuadrante
      const counts: Record<string, number> = {};
      for (const item of cuadrantesData.features) {
        const cuadrante = item.properties.cuadrante;
        const crimes = await fetchCrimeData(cuadrante); // Use the cuadrante variable
        const totalCount = crimes.reduce((acc, crime) => acc + crime.count, 0);
        counts[cuadrante] = totalCount;
      }
      setCrimeCounts(counts);
    }
    loadGeoData();
  }, []);

  const geojson = {
    type: "FeatureCollection",
    features: geoData.map((item) => {
      // console.log("GeoData Item:", item); // Log the item here
      return {
        type: "Feature",
        geometry: item.geometry,
        properties: {
          cuadrante: item.properties.cuadrante, // Access properties correctly
          sector: item.properties.sector,
          crimeCount: crimeCounts[item.properties.cuadrante] || 0, // Use properties
        },
      };
    }),
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
                lineColor: "#FF0000", // red outline
                lineWidth: 2, // outline thickness
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
