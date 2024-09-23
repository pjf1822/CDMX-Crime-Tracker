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

export interface CrimeData {
  cuadrante: string; // The cuadrante identifier
  crime: string; // Description of the crime
  count: number; // Number of occurrences
}

interface CustomFeature extends Feature<Geometry, GeoJsonProperties> {
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
}

const useStore = create<StoreState>((set) => ({
  geoData: [],
  setGeoData: (data) => set({ geoData: data }),
  crimeCounts: [], // Now an array
  setCrimeCounts: (counts) => set({ crimeCounts: counts }),
}));
export default useStore;
