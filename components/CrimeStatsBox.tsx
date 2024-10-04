import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import useStore from "../zustandStore";
import crimeData from "../assets/crimeData.json"; // Adjust the import path

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
    <View
      style={{
        zIndex: 999,
        position: "absolute",
        backgroundColor: "white",
        right: 0,
        top: 0,
        flex: 1,
        padding: 30,
        justifyContent: "center",
      }}
    >
      <Text>{selectedCuadrante}</Text>
      <View style={{ display: "flex", flexDirection: "column" }}>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Text>Homicides: </Text>
          <Text>{filteredCrimeData["HOMICIDIO DOLOSO"]}</Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Text>Firearm Injuries: </Text>
          <Text>{filteredCrimeData["LESIONES POR ARMA DE FUEGO"]}</Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Text>Metro Robbery (C.V.): </Text>
          <Text>{filteredCrimeData["ROBO A BORDO DE METRO C.V."]}</Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Text>Metro Robbery (S.V.): </Text>
          <Text>{filteredCrimeData["ROBO A BORDO DE METRO S.V."]}</Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Text>Microbus Robbery (C.V.): </Text>
          <Text>{filteredCrimeData["ROBO A BORDO DE MICROBUS C.V."]}</Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Text>Microbus Robbery (S.V.): </Text>
          <Text>{filteredCrimeData["ROBO A BORDO DE MICROBUS S.V."]}</Text>
        </View>
        {/* You can add more rows as needed */}
      </View>
    </View>
  );
};

export default CrimeStatsBox;
