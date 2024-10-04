import { Picker } from "@react-native-picker/picker";
import { View, StyleSheet } from "react-native";
import { CrimeTypes } from "./zustandStore";
import useStore from "./zustandStore";
import { fetchCrimeCounts } from "./helpers";

const crimeLabelMap = {
  [CrimeTypes.HOMICIDIO_DOLOSO]: "Intentional Homicide",
  [CrimeTypes.LESIONES_POR_ARMA_DE_FUEGO]: "Injuries by Firearm",
  [CrimeTypes.ROBO_A_BORDO_DE_METRO_CV]: "Robbery on Metro (CV)",
  [CrimeTypes.ROBO_A_BORDO_DE_METRO_SV]: "Robbery on Metro (SV)",
  [CrimeTypes.ROBO_A_BORDO_DE_MICROBUS_CV]: "Robbery on Microbus (CV)",
  [CrimeTypes.ROBO_A_BORDO_DE_MICROBUS_SV]: "Robbery on Microbus (SV)",
  [CrimeTypes.ROBO_A_BORDO_DE_TAXI_CV]: "Robbery on Taxi (CV)",
  [CrimeTypes.ROBO_A_CASA_HABITACION_CV]: "Robbery in Residence (CV)",
  [CrimeTypes.ROBO_A_CUENTAHABIENTE_CV]: "Robbery at Bank Client (CV)",
  [CrimeTypes.ROBO_A_NEGOCIO_CV]: "Robbery at Business (CV)",
  [CrimeTypes.ROBO_A_REPARTIDOR_CV]: "Robbery on Delivery (CV)",
  [CrimeTypes.ROBO_A_REPARTIDOR_SV]: "Robbery on Delivery (SV)",
  [CrimeTypes.ROBO_A_TRANSEUNTE_CV]: "Robbery on Bystander (CV)",
  [CrimeTypes.ROBO_A_TRANSEUNTE_SV]: "Robbery on Bystander (SV)",
  [CrimeTypes.ROBO_A_TRANSPORTISTA_CV]: "Robbery on Transporter (CV)",
  [CrimeTypes.ROBO_A_TRANSPORTISTA_SV]: "Robbery on Transporter (SV)",
  [CrimeTypes.ROBO_DE_VEHICULO_AUTOMOTOR_CV]: "Robbery of Motor Vehicle (CV)",
  [CrimeTypes.ROBO_DE_VEHICULO_AUTOMOTOR_SV]: "Robbery of Motor Vehicle (SV)",
  [CrimeTypes.SECUESTRO]: "Kidnapping",
  [CrimeTypes.VIOLACION]: "Rape",
};

const CrimePicker = () => {
  const { selectedCrime, setSelectedCrime, setCrimeCounts, geoData } =
    useStore();

  const handleCrimeChange = async (itemValue: string) => {
    const crimeType = itemValue as CrimeTypes; // Ensure correct type

    setSelectedCrime(crimeType);

    await fetchCrimeCounts(crimeType, geoData, setCrimeCounts);
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
        maxHeight: 100,
        maxWidth: 600,
        justifyContent: "center",
      }}
    >
      <Picker
        selectedValue={selectedCrime}
        onValueChange={handleCrimeChange}
        style={styles.picker}
      >
        {Object.values(CrimeTypes).map((crime) => (
          <Picker.Item
            key={crime}
            label={crimeLabelMap[crime]} // Use the mapping for the label
            value={crime}
          />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  picker: {
    height: 150,
    width: 400,
  },
});

export default CrimePicker;
