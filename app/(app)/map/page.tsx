"use client";

import { useEffect, useState, useCallback } from "react";
import { MapView } from "@/components/map/map-view";
import { Card } from "@/components/ui/card";
import { formatDuration, haversineDistance } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";

interface StoredRoute {
  route: {
    duration: number;
    distance: number;
    geometry: GeoJSON.LineString;
    safetyScore: number;
    litStreetPercent: number;
    label: string;
  };
  mode: string;
}

export default function MapPage() {
  const [routeData, setRouteData] = useState<StoredRoute | null>(null);
  const [offPath, setOffPath] = useState(false);
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("navigo-route");
    if (stored) setRouteData(JSON.parse(stored));
  }, []);

  const handleLocationUpdate = useCallback(
    (lat: number, lng: number) => {
      setUserPos({ lat, lng });

      if (!routeData?.route.geometry) return;

      const coords = routeData.route.geometry.coordinates as [number, number][];
      let minDist = Infinity;

      for (const [lngCoord, latCoord] of coords) {
        const dist = haversineDistance(lat, lng, latCoord, lngCoord);
        if (dist < minDist) minDist = dist;
      }

      setOffPath(minDist > 50);
    },
    [routeData]
  );

  return (
    <div className="relative h-[calc(100vh-5rem)] md:h-screen">
      <MapView
        className="h-full w-full"
        routeGeometry={routeData?.route.geometry ?? null}
        showUserLocation={!!routeData}
        onLocationUpdate={handleLocationUpdate}
      />

      {offPath && (
        <div className="absolute left-4 right-4 top-4 z-10">
          <Card className="flex items-center gap-3 border-transit-red/30 bg-transit-red/10">
            <AlertTriangle className="h-5 w-5 shrink-0 text-transit-red" />
            <div>
              <p className="font-semibold text-transit-red">You&apos;ve left your route</p>
              <p className="text-sm text-navy/70">
                Consider re-routing or heading back to a safe path
              </p>
            </div>
          </Card>
        </div>
      )}

      {routeData ? (
        <div className="absolute bottom-24 left-4 right-4 z-10 md:bottom-6 md:left-6 md:right-auto md:w-80">
          <Card>
            <p className="font-semibold text-navy">{routeData.route.label}</p>
            <div className="mt-2 flex flex-wrap gap-3 text-sm text-navy/70">
              <span>{formatDuration(routeData.route.duration)}</span>
              <span>Safety {routeData.route.safetyScore}%</span>
              <span>Lit {routeData.route.litStreetPercent}%</span>
            </div>
            {userPos && (
              <p className="mt-2 text-xs text-sage">Live location active</p>
            )}
          </Card>
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <Card className="text-center">
            <p className="font-medium text-navy">No route planned yet</p>
            <a href="/navigate" className="mt-2 inline-block text-sm text-coral hover:underline">
              Plan a route →
            </a>
          </Card>
        </div>
      )}
    </div>
  );
}
