"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MapView } from "@/components/map/map-view";
import { Card } from "@/components/ui/card";
import { formatDuration, haversineDistance } from "@/lib/utils";
import { DEMO_LOCATION, isDemoMode } from "@/lib/demo";
import type { RouteMode } from "@/lib/types";
import { AlertTriangle } from "lucide-react";

interface RouteOption {
  duration: number;
  distance: number;
  geometry: GeoJSON.LineString;
  safetyScore: number;
  litStreetPercent: number;
}

interface StoredRoute {
  route: RouteOption & { label: string };
  alternatives: { fast: RouteOption; safe: RouteOption };
  mode: RouteMode;
  demo?: boolean;
}

function MapPageContent() {
  const searchParams = useSearchParams();
  const demo = isDemoMode(searchParams);

  const [routeData, setRouteData] = useState<StoredRoute | null>(null);
  const [highlighted, setHighlighted] = useState<"fast" | "safe">("safe");
  const [offPath, setOffPath] = useState(false);
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("navigo-route");
    if (stored) {
      const data = JSON.parse(stored) as StoredRoute;
      setRouteData(data);
      setHighlighted(data.mode === "fast" ? "fast" : "safe");
    }
  }, []);

  const handleLocationUpdate = useCallback(
    (lat: number, lng: number) => {
      setUserPos({ lat, lng });

      const activeGeometry =
        highlighted === "fast"
          ? routeData?.alternatives.fast.geometry
          : routeData?.alternatives.safe.geometry;

      if (!activeGeometry) return;

      const coords = activeGeometry.coordinates as [number, number][];
      let minDist = Infinity;

      for (const [lngCoord, latCoord] of coords) {
        const dist = haversineDistance(lat, lng, latCoord, lngCoord);
        if (dist < minDist) minDist = dist;
      }

      setOffPath(minDist > 50);
    },
    [routeData, highlighted]
  );

  const routes = routeData
    ? [
        {
          id: "fast",
          geometry: routeData.alternatives.fast.geometry,
          color: "#E8836B",
          width: 6,
          opacity: 0.9,
        },
        {
          id: "safe",
          geometry: routeData.alternatives.safe.geometry,
          color: "#8BA888",
          width: 6,
          opacity: 0.9,
        },
      ]
    : [];

  const fast = routeData?.alternatives.fast;
  const safe = routeData?.alternatives.safe;
  const safetyGain =
    fast && safe ? Math.max(0, safe.safetyScore - fast.safetyScore) : 0;

  return (
    <div className="relative h-[calc(100vh-5rem)] md:h-screen">
      <MapView
        className="h-full w-full"
        routes={routes}
        highlightedRouteId={highlighted}
        showUserLocation={!!routeData}
        demoLocation={demo ? DEMO_LOCATION : null}
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

      {routeData && fast && safe ? (
        <div className="absolute bottom-24 left-4 right-4 z-10 md:bottom-6 md:left-6 md:right-auto md:w-[28rem]">
          <Card className="text-base">
            <p className="text-sm font-medium text-navy/60">Route comparison</p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => setHighlighted("fast")}
                className={`flex-1 rounded-xl border-2 p-3 text-left transition-all ${
                  highlighted === "fast"
                    ? "border-coral bg-coral/10"
                    : "border-navy/10 opacity-70"
                }`}
              >
                <p className="text-xs font-bold uppercase text-coral">Fast</p>
                <p className="text-lg font-bold text-navy">{formatDuration(fast.duration)}</p>
                <p className="text-xs text-navy/60">Safety {fast.safetyScore}%</p>
              </button>
              <button
                type="button"
                onClick={() => setHighlighted("safe")}
                className={`flex-1 rounded-xl border-2 p-3 text-left transition-all ${
                  highlighted === "safe"
                    ? "border-sage bg-sage/10"
                    : "border-navy/10 opacity-70"
                }`}
              >
                <p className="text-xs font-bold uppercase text-sage">Safe</p>
                <p className="text-lg font-bold text-navy">{formatDuration(safe.duration)}</p>
                <p className="text-xs text-navy/60">
                  Safety {safe.safetyScore}% · Lit {safe.litStreetPercent}%
                </p>
              </button>
            </div>
            {safetyGain > 0 && (
              <p className="mt-3 text-center text-sm font-semibold text-sage">
                Safe route: +{safetyGain}% safer streets
              </p>
            )}
            {(userPos || demo) && (
              <p className="mt-2 text-center text-xs text-sage">
                {demo ? "Demo location active" : "Live location active"}
              </p>
            )}
          </Card>
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <Card className="text-center">
            <p className="font-medium text-navy">No route planned yet</p>
            <a
              href="/navigate?demo=1"
              className="mt-2 inline-block text-sm text-coral hover:underline"
            >
              Plan a demo route →
            </a>
          </Card>
        </div>
      )}
    </div>
  );
}

export default function MapPage() {
  return (
    <Suspense fallback={<div className="p-6 text-navy/50">Loading map...</div>}>
      <MapPageContent />
    </Suspense>
  );
}
