"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { SafeSpace } from "@/lib/types";

export interface RouteLayer {
  id: string;
  geometry: GeoJSON.LineString;
  color: string;
  width?: number;
  opacity?: number;
}

interface LeafletMapProps {
  center?: [number, number];
  routes?: RouteLayer[];
  highlightedRouteId?: string | null;
  safeSpaces?: SafeSpace[];
  showUserLocation?: boolean;
  demoLocation?: { lat: number; lng: number } | null;
  onLocationUpdate?: (lat: number, lng: number) => void;
  className?: string;
}

function geoJsonToLatLngs(geometry: GeoJSON.LineString): L.LatLngExpression[] {
  return geometry.coordinates.map(([lng, lat]) => [lat, lng] as [number, number]);
}

export function LeafletMap({
  center = [-0.1278, 51.5074],
  routes = [],
  highlightedRouteId = null,
  safeSpaces = [],
  showUserLocation = false,
  demoLocation = null,
  onLocationUpdate,
  className,
}: LeafletMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layersRef = useRef<{
    routes: L.Polyline[];
    markers: L.Marker[];
    user: L.CircleMarker | null;
  }>({ routes: [], markers: [], user: null });

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, { zoomControl: true }).setView(
      [center[1], center[0]],
      13
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [center]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    layersRef.current.routes.forEach((line) => line.remove());
    layersRef.current.routes = [];

    const bounds: L.LatLngExpression[] = [];

    routes.forEach((route) => {
      const latlngs = geoJsonToLatLngs(route.geometry);
      const isHighlighted = !highlightedRouteId || highlightedRouteId === route.id;
      const line = L.polyline(latlngs, {
        color: route.color,
        weight: isHighlighted ? (route.width ?? 6) : 4,
        opacity: isHighlighted ? (route.opacity ?? 0.9) : 0.35,
      }).addTo(map);

      layersRef.current.routes.push(line);
      bounds.push(...latlngs);
    });

    if (bounds.length > 1) {
      map.fitBounds(L.latLngBounds(bounds), { padding: [60, 60] });
    }
  }, [routes, highlightedRouteId]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    layersRef.current.markers.forEach((m) => m.remove());
    layersRef.current.markers = [];

    safeSpaces.forEach((space) => {
      const icon = L.divIcon({
        className: "",
        html: `<div style="display:flex;height:32px;width:32px;align-items:center;justify-content:center;border-radius:9999px;background:#8BA888;color:white;font-size:11px;font-weight:bold;box-shadow:0 2px 8px rgba(0,0,0,0.25)">${space.type === "tfl_station" ? "T" : "L"}</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([space.lat, space.lng], { icon })
        .bindPopup(
          `<strong>${space.name}</strong><br/><span style="color:#666">${space.type === "tfl_station" ? "TfL Station" : "Library"}</span>`
        )
        .addTo(map);

      layersRef.current.markers.push(marker);
    });
  }, [safeSpaces]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !showUserLocation) return;

    function setUserPosition(lat: number, lng: number) {
      onLocationUpdate?.(lat, lng);
      const currentMap = mapRef.current;
      if (!currentMap) return;

      if (layersRef.current.user) {
        layersRef.current.user.setLatLng([lat, lng]);
      } else {
        layersRef.current.user = L.circleMarker([lat, lng], {
          radius: 8,
          color: "#fff",
          weight: 2,
          fillColor: "#4A90D9",
          fillOpacity: 1,
        }).addTo(currentMap);
      }
    }

    if (demoLocation) {
      setUserPosition(demoLocation.lat, demoLocation.lng);
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => setUserPosition(pos.coords.latitude, pos.coords.longitude),
      () => {},
      { enableHighAccuracy: true, maximumAge: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [showUserLocation, demoLocation, onLocationUpdate]);

  return <div ref={containerRef} className={className} />;
}
