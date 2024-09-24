import { Picker } from "@react-native-picker/picker";
import { View, Text, StyleSheet } from "react-native";
import React, { useState } from "react";
import { CrimeTypes } from "./zustandStore";
import useStore from "./zustandStore";
import { fetchCrimeCounts } from "./helpers";

const CrimePicker = () => {
  const { selectedCrime, setSelectedCrime, setCrimeCounts } = useStore();

  const handleCrimeChange = async (itemValue: string) => {
    const crimeType = itemValue as CrimeTypes; // Ensure correct type

    setSelectedCrime(crimeType);

    // Fetch crime counts based on the selected crime type
    const crimeCounts = await fetchCrimeCounts(crimeType);
    setCrimeCounts(crimeCounts);
  };

  return (
    <View
      style={{
        zIndex: 999,
        position: "absolute",
        backgroundColor: "white",
        left: 0,
        bottom: 0,
        flex: 1,
        padding: 30,
        maxHeight: 200,
        maxWidth: 400,
        justifyContent: "center",
      }}
    >
      <Picker
        selectedValue={selectedCrime}
        onValueChange={handleCrimeChange}
        style={styles.picker}
      >
        {Object.values(CrimeTypes).map((crime) => (
          <Picker.Item key={crime} label={crime} value={crime} />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  picker: {
    height: 150,
    width: 300,
    // backgroundColor: "green",
  },
});

export default CrimePicker;
