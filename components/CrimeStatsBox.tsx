import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import useStore from "../zustandStore";
import crimeData from "../assets/crimeData.json"; // Adjust the import path
import { myColors } from "../theme";
import { crimeDataStart } from "@/constants";
import { features } from "../assets/GeoJSONData.json";
import Ionicons from "@expo/vector-icons/Ionicons";
const CrimeStatsBox = () => {
  const { selectedCuadrante } = useStore();
  const [filteredCrimeData, setFilteredCrimeData] = useState(crimeDataStart);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const matchedCrimes = crimeData.filter(
      (crime) => crime.cuadrante === selectedCuadrante
    );

    const geoFeature = features.find(
      (feature) => feature.properties.cuadrante === selectedCuadrante
    );
    const stats = matchedCrimes?.reduce((acc, crime) => {
      acc[crime.crime] = crime.count;
      return acc;
    }, {});

    if (geoFeature) {
      stats.alcaldia = geoFeature.properties.alcaldia;
      stats.sector = geoFeature.properties.sector;
    }

    setFilteredCrimeData(stats);
  }, [selectedCuadrante]);

  return (
    <View style={styles.container}>
      {!isExpanded ? (
        <View
          style={{
            padding: 4,
            backgroundColor: myColors.darkGreen,
            borderRadius: 10,
          }}
        >
          <TouchableOpacity
            style={{}}
            onPress={() => setIsExpanded(true)} // Toggle state
          >
            <Ionicons name="stats-chart" size={32} color={myColors.yellow} />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ padding: 10 }}>
          <TouchableOpacity
            style={{ position: "absolute", top: 3, right: 0, zIndex: 999 }}
            onPress={() => setIsExpanded(false)}
          >
            <Ionicons name="close" size={32} color={myColors.beige} />
          </TouchableOpacity>
          <Text style={styles.cuadranteText}>{filteredCrimeData.alcaldia}</Text>
          <Text style={styles.cuadranteText}>{filteredCrimeData.sector}</Text>
          <View style={styles.column}>
            <View style={styles.row}>
              <Text style={styles.labelText}>Homicides: </Text>
              <Text style={styles.valueText}>
                {filteredCrimeData["HOMICIDIO DOLOSO"]}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.labelText}>Firearm Injuries: </Text>
              <Text style={styles.valueText}>
                {filteredCrimeData["LESIONES POR ARMA DE FUEGO"]}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.labelText}>Metro Robbery (C.V.): </Text>
              <Text style={styles.valueText}>
                {filteredCrimeData["ROBO A BORDO DE METRO C.V."]}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.labelText}>Metro Robbery (S.V.): </Text>
              <Text style={styles.valueText}>
                {filteredCrimeData["ROBO A BORDO DE METRO S.V."]}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.labelText}>Microbus Robbery (C.V.): </Text>
              <Text style={styles.valueText}>
                {filteredCrimeData["ROBO A BORDO DE MICROBUS C.V."]}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.labelText}>Microbus Robbery (S.V.): </Text>
              <Text style={styles.valueText}>
                {filteredCrimeData["ROBO A BORDO DE MICROBUS S.V."]}
              </Text>
            </View>
          </View>
          <Text style={{ flexWrap: "wrap", fontSize: 10 }}>
            *all data is from the last twelve months
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 999,
    position: "absolute",
    backgroundColor: myColors.darkGreen,
    right: 0,
    top: 0,
    flex: 1,
    marginTop: 50,
    justifyContent: "center",
    // alignItems: "flex-end",
    borderRadius: 10,
  },
  toggleButton: {
    zIndex: 1000,
  },
  cuadranteText: {
    fontSize: Platform.isPad ? 18 : 12,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  column: {
    display: "flex",
    flexDirection: "column",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 5,
  },
  labelText: {
    fontSize: Platform.isPad ? 16 : 12,
    color: "#fff",
  },
  valueText: {
    fontSize: Platform.isPad ? 16 : 12,
    color: "#D6ED31", // You can customize the color
  },
});

export default CrimeStatsBox;
