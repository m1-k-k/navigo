"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { SafeSpace } from "@/lib/types";

interface MapViewProps {
  center?: [number, number];
  routeGeometry?: GeoJSON.LineString | null;
  safeSpaces?: SafeSpace[];
  showUserLocation?: boolean;
  onLocationUpdate?: (lat: number, lng: number) => void;
  className?: string;
}

export function MapView({
  center = [-0.1278, 51.5074],
  routeGeometry,
  safeSpaces = [],
  showUserLocation = false,
  onLocationUpdate,
  className,
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [error, setError] = useState<string | null>(null);

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

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
    if (!map || !routeGeometry) return;

    const addRoute = () => {
      if (map.getSource("route")) {
        (map.getSource("route") as mapboxgl.GeoJSONSource).setData({
          type: "Feature",
          properties: {},
          geometry: routeGeometry,
        });
      } else {
        map.addSource("route", {
          type: "geojson",
          data: { type: "Feature", properties: {}, geometry: routeGeometry },
        });
        map.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: { "line-join": "round", "line-cap": "round" },
          paint: { "line-color": "#8BA888", "line-width": 5, "line-opacity": 0.85 },
        });
      }

      const coords = routeGeometry.coordinates as [number, number][];
      if (coords.length > 1) {
        const bounds = coords.reduce(
          (b, coord) => b.extend(coord),
          new mapboxgl.LngLatBounds(coords[0], coords[0])
        );
        map.fitBounds(bounds, { padding: 60 });
      }
    };

    if (map.isStyleLoaded()) addRoute();
    else map.on("load", addRoute);
  }, [routeGeometry]);

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

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        onLocationUpdate(latitude, longitude);

        const map = mapRef.current;
        if (map) {
          if (!map.getSource("user")) {
            map.addSource("user", {
              type: "geojson",
              data: {
                type: "Feature",
                properties: {},
                geometry: { type: "Point", coordinates: [longitude, latitude] },
              },
            });
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
            (map.getSource("user") as mapboxgl.GeoJSONSource).setData({
              type: "Feature",
              properties: {},
              geometry: { type: "Point", coordinates: [longitude, latitude] },
            });
          }
        }
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [showUserLocation, onLocationUpdate]);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-cream ${className}`}>
        <div className="text-center p-8">
          <p className="text-navy font-medium">{error}</p>
          <p className="text-navy/60 text-sm mt-2">See .env.local.example for setup</p>
        </div>
      </div>
    );
  }

  return <div ref={mapContainer} className={className} />;
}
