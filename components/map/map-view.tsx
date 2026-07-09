"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
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

export function MapView({
  center = [-0.1278, 51.5074],
  routeGeometry,
  routes = [],
  highlightedRouteId = null,
  safeSpaces = [],
  showUserLocation = false,
  demoLocation = null,
  onLocationUpdate,
  className,
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [error, setError] = useState<string | null>(null);

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  const activeRoutes: RouteLayer[] =
    routes.length > 0
      ? routes
      : routeGeometry
        ? [{ id: "route", geometry: routeGeometry, color: "#8BA888", width: 5, opacity: 0.85 }]
        : [];

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    if (!token) {
      setError("Add NEXT_PUBLIC_MAPBOX_TOKEN to enable maps");
      return;
    }

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center,
      zoom: 13,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [token, center]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || activeRoutes.length === 0) return;

    const addRoutes = () => {
      const allCoords: [number, number][] = [];

      activeRoutes.forEach((route) => {
        const sourceId = `route-${route.id}`;
        const layerId = `route-layer-${route.id}`;
        const isHighlighted = !highlightedRouteId || highlightedRouteId === route.id;
        const opacity = isHighlighted ? (route.opacity ?? 0.9) : 0.35;
        const width = isHighlighted ? (route.width ?? 6) : 4;

        const feature = {
          type: "Feature" as const,
          properties: {},
          geometry: route.geometry,
        };

        if (map.getSource(sourceId)) {
          (map.getSource(sourceId) as mapboxgl.GeoJSONSource).setData(feature);
        } else {
          map.addSource(sourceId, { type: "geojson", data: feature });
          map.addLayer({
            id: layerId,
            type: "line",
            source: sourceId,
            layout: { "line-join": "round", "line-cap": "round" },
            paint: {
              "line-color": route.color,
              "line-width": width,
              "line-opacity": opacity,
            },
          });
        }

        if (map.getLayer(layerId)) {
          map.setPaintProperty(layerId, "line-opacity", opacity);
          map.setPaintProperty(layerId, "line-width", width);
        }

        allCoords.push(...(route.geometry.coordinates as [number, number][]));
      });

      if (allCoords.length > 1) {
        const bounds = allCoords.reduce(
          (b, coord) => b.extend(coord),
          new mapboxgl.LngLatBounds(allCoords[0], allCoords[0])
        );
        map.fitBounds(bounds, { padding: 80 });
      }
    };

    if (map.isStyleLoaded()) addRoutes();
    else map.on("load", addRoutes);
  }, [activeRoutes, highlightedRouteId]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const markers: mapboxgl.Marker[] = [];

    safeSpaces.forEach((space) => {
      const el = document.createElement("div");
      el.className =
        "flex h-8 w-8 items-center justify-center rounded-full bg-sage text-xs font-bold text-white shadow-lg";
      el.textContent = space.type === "tfl_station" ? "T" : "L";

      const marker = new mapboxgl.Marker(el)
        .setLngLat([space.lng, space.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<strong>${space.name}</strong><br/><span style="color:#666">${space.type === "tfl_station" ? "TfL Station" : "Library"}</span>`
          )
        )
        .addTo(map);

      markers.push(marker);
    });

    return () => markers.forEach((m) => m.remove());
  }, [safeSpaces]);

  useEffect(() => {
    if (!showUserLocation || !onLocationUpdate) return;

    function updateUserMarker(lat: number, lng: number) {
      onLocationUpdate?.(lat, lng);
      const map = mapRef.current;
      if (!map) return;

      const data = {
        type: "Feature" as const,
        properties: {},
        geometry: { type: "Point" as const, coordinates: [lng, lat] },
      };

      if (!map.getSource("user")) {
        map.addSource("user", { type: "geojson", data });
        map.addLayer({
          id: "user",
          type: "circle",
          source: "user",
          paint: {
            "circle-radius": 8,
            "circle-color": "#4A90D9",
            "circle-stroke-width": 2,
            "circle-stroke-color": "#fff",
          },
        });
      } else {
        (map.getSource("user") as mapboxgl.GeoJSONSource).setData(data);
      }
    }

    if (demoLocation) {
      updateUserMarker(demoLocation.lat, demoLocation.lng);
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => updateUserMarker(pos.coords.latitude, pos.coords.longitude),
      () => {},
      { enableHighAccuracy: true, maximumAge: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [showUserLocation, onLocationUpdate, demoLocation]);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-cream ${className}`}>
        <div className="p-8 text-center">
          <p className="font-medium text-navy">{error}</p>
          <p className="mt-2 text-sm text-navy/60">See .env.local.example for setup</p>
        </div>
      </div>
    );
  }

  return <div ref={mapContainer} className={className} />;
}
