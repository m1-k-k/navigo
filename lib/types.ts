export type RouteMode = "fast" | "safe";

export interface LatLng {
  lat: number;
  lng: number;
}

export interface RouteResult {
  mode: RouteMode;
  duration: number;
  distance: number;
  geometry: GeoJSON.LineString;
  safetyScore: number;
  litStreetPercent: number;
  label: string;
}

export interface SafeSpace {
  id: string;
  name: string;
  type: "tfl_station" | "library";
  lat: number;
  lng: number;
  distance?: number;
  staffed?: boolean;
  crowding?: string;
}

export interface HazardReport {
  lat: number;
  lng: number;
  description: string;
  category: string;
}

export interface CrowdingInfo {
  stationId: string;
  stationName: string;
  lat: number;
  lng: number;
  crowding: string;
}
