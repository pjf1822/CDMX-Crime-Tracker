import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import useStore from "../zustandStore";
import crimeData from "../assets/crimeData.json"; // Adjust the import path
import { myColors } from "../theme";
const CrimeStatsBox = () => {
  const { selectedCuadrante } = useStore();
  const [filteredCrimeData, setFilteredCrimeData] = useState({
    "HOMICIDIO DOLOSO": 0,
    "LESIONES POR ARMA DE FUEGO": 0,
    "ROBO A BORDO DE METRO C.V.": 0,
    "ROBO A BORDO DE METRO S.V.": 0,
    "ROBO A BORDO DE MICROBUS C.V.": 0,
    "ROBO A BORDO DE MICROBUS S.V.": 0,
    "ROBO A BORDO DE TAXI C.V.": 0,
    "ROBO A CASA HABITACION C.V.": 0,
    "ROBO A CUENTAHABIENTE C.V.": 0,
    "ROBO A NEGOCIO C.V.": 0,
    "ROBO A REPARTIDOR C.V.": 0,
    "ROBO A REPARTIDOR S.V.": 0,
    "ROBO A TRANSEUNTE C.V.": 0,
    "ROBO A TRANSEUNTE S.V.": 0,
    "ROBO A TRANSPORTISTA C.V.": 0,
    "ROBO A TRANSPORTISTA S.V.": 0,
    "ROBO DE VEHICULO AUTOMOTOR C.V.": 0,
    "ROBO DE VEHICULO AUTOMOTOR S.V.": 0,
    SECUESTRO: 0,
    VIOLACION: 0,
  });

  useEffect(() => {
    const matchedCrimes = crimeData.filter(
      (crime) => crime.cuadrante === selectedCuadrante
    );

    const stats = matchedCrimes?.reduce((acc, crime) => {
      acc[crime.crime] = crime.count; // Set the crime type as key and count as value
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
    justifyContent: "center",
  },
  cuadranteText: {
    fontSize: 18,
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
    fontSize: 16,
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
