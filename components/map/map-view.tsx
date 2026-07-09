"use client";

import dynamic from "next/dynamic";
import type { SafeSpace } from "@/lib/types";

export interface RouteLayer {
  id: string;
  geometry: GeoJSON.LineString;
  color: string;
  width?: number;
  opacity?: number;
}

interface MapViewProps {
  center?: [number, number];
  routeGeometry?: GeoJSON.LineString | null;
  routes?: RouteLayer[];
  highlightedRouteId?: string | null;
  safeSpaces?: SafeSpace[];
  showUserLocation?: boolean;
  demoLocation?: { lat: number; lng: number } | null;
  onLocationUpdate?: (lat: number, lng: number) => void;
  className?: string;
}

const LeafletMap = dynamic(
  () => import("./leaflet-map").then((mod) => mod.LeafletMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center bg-cream text-navy/50">
        Loading map...
      </div>
    ),
  }
);

export function MapView({
  routeGeometry,
  routes = [],
  ...props
}: MapViewProps) {
  const activeRoutes =
    routes.length > 0
      ? routes
      : routeGeometry
        ? [{ id: "route", geometry: routeGeometry, color: "#8BA888", width: 5, opacity: 0.85 }]
        : [];

  return <LeafletMap routes={activeRoutes} {...props} />;
}
