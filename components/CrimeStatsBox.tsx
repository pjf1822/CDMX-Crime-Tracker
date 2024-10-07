import { View, Text, StyleSheet, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import useStore from "../zustandStore";
import crimeData from "../assets/crimeData.json"; // Adjust the import path
import { myColors } from "../theme";
import { crimeDataStart } from "@/constants";
const CrimeStatsBox = () => {
  const { selectedCuadrante } = useStore();
  const [filteredCrimeData, setFilteredCrimeData] = useState(crimeDataStart);

  useEffect(() => {
    const matchedCrimes = crimeData.filter(
      (crime) => crime.cuadrante === selectedCuadrante
    );

    const stats = matchedCrimes?.reduce((acc, crime) => {
      acc[crime.crime] = crime.count;
      return acc;
    }, {});

    setFilteredCrimeData(stats);
  }, [selectedCuadrante]);

  return (
    <View style={styles.container}>
      <Text style={styles.cuadranteText}>{selectedCuadrante}</Text>
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
    padding: 10,
    marginTop: 50,
    justifyContent: "center",
    // alignItems: "flex-end",
    borderRadius: 10,
  },
  cuadranteText: {
    fontSize: Platform.isPad ? 18 : 14,
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
    fontWeight: "600",
    color: "#fff",
  },
  valueText: {
    fontSize: 16,
    fontWeight: "400",
    color: "#D6ED31", // You can customize the color
  },
});

export default CrimeStatsBox;
