import { create } from "zustand";
import {
  FeatureCollection,
  Feature,
  Geometry,
  GeoJsonProperties,
} from "geojson";

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

interface Properties {
  alcaldia: string;
  cuadrante: string;
  sector: string;
}

export interface GeoDataItem {
  type: string;
  geometry: { type: string; coordinates: number[][][] };
  properties: Properties;
}

export interface CrimeData {
  cuadrante: string; // The cuadrante identifier
  crime: string; // Description of the crime
  count: number; // Number of occurrences
}

export enum CrimeTypes {
  HOMICIDIO_DOLOSO = "HOMICIDIO DOLOSO",
  LESIONES_POR_ARMA_DE_FUEGO = "LESIONES POR ARMA DE FUEGO",
  ROBO_A_BORDO_DE_METRO_CV = "ROBO A BORDO DE METRO C.V.",
  ROBO_A_BORDO_DE_METRO_SV = "ROBO A BORDO DE METRO S.V.",
  ROBO_A_BORDO_DE_MICROBUS_CV = "ROBO A BORDO DE MICROBUS C.V.",
  ROBO_A_BORDO_DE_MICROBUS_SV = "ROBO A BORDO DE MICROBUS S.V.",
  ROBO_A_BORDO_DE_TAXI_CV = "ROBO A BORDO DE TAXI C.V.",
  ROBO_A_CASA_HABITACION_CV = "ROBO A CASA HABITACION C.V.",
  ROBO_A_CUENTAHABIENTE_CV = "ROBO A CUENTAHABIENTE C.V.",
  ROBO_A_NEGOCIO_CV = "ROBO A NEGOCIO C.V.",
  ROBO_A_REPARTIDOR_CV = "ROBO A REPARTIDOR C.V.",
  ROBO_A_REPARTIDOR_SV = "ROBO A REPARTIDOR S.V.",
  ROBO_A_TRANSEUNTE_CV = "ROBO A TRANSEUNTE C.V.",
  ROBO_A_TRANSEUNTE_SV = "ROBO A TRANSEUNTE S.V.",
  ROBO_A_TRANSPORTISTA_CV = "ROBO A TRANSPORTISTA C.V.",
  ROBO_A_TRANSPORTISTA_SV = "ROBO A TRANSPORTISTA S.V.",
  ROBO_DE_VEHICULO_AUTOMOTOR_CV = "ROBO DE VEHICULO AUTOMOTOR C.V.",
  ROBO_DE_VEHICULO_AUTOMOTOR_SV = "ROBO DE VEHICULO AUTOMOTOR S.V.",
  SECUESTRO = "SECUESTRO",
  VIOLACION = "VIOLACION",
}

export interface CustomFeature extends Feature<Geometry, GeoJsonProperties> {
  type: "Feature";
  geometry: {
    type: "Polygon"; // Specify the geometry type as Polygon
    coordinates: number[][][]; // For a Polygon, coordinates are an array of arrays of arrays of numbers
  };
  properties: {
    cuadrante: string;
    sector: string;
    crimeCount: number;
  };
}

export interface CustomFeatureCollection
  extends FeatureCollection<Geometry, GeoJsonProperties> {
  features: CustomFeature[];
}

interface StoreState {
  geoData: GeoJSONFeature[];
  setGeoData: (data: GeoJSONFeature[]) => void;
  crimeCounts: Array<Record<string, number>>; // Array of objects with cuadrante and count
  setCrimeCounts: (counts: Array<Record<string, number>>) => void;
  selectedCrime: CrimeTypes; // Use CrimeTypes
  setSelectedCrime: (crime: CrimeTypes) => void;
}

const useStore = create<StoreState>((set) => ({
  geoData: [],
  setGeoData: (data) => set({ geoData: data }),
  crimeCounts: [],
  setCrimeCounts: (counts) => set({ crimeCounts: counts }),
  selectedCrime: CrimeTypes.HOMICIDIO_DOLOSO, // Initialize with a default enum value
  setSelectedCrime: (crime) => set({ selectedCrime: crime }),
}));
export default useStore;
