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
  count: number;
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
  crimeCounts: Record<string, number>; // Object with cuadrante as the key and crime count as the value
  setCrimeCounts: (counts: Record<string, number>) => void;
}

const useStore = create<StoreState>((set) => ({
  geoData: [],
  setGeoData: (data) => set({ geoData: data }),
  crimeCounts: {},
  setCrimeCounts: (counts) => set({ crimeCounts: counts }),
}));
export default useStore;
