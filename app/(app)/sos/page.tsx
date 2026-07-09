"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapView } from "@/components/map/map-view";
import { DEMO_LOCATION, isDemoMode } from "@/lib/demo";
import type { CrowdingInfo, SafeSpace } from "@/lib/types";
import { Shield, Train, BookOpen, Navigation, Users } from "lucide-react";

function crowdingBadge(level?: string) {
  if (!level) return null;
  const lower = level.toLowerCase();
  if (lower.includes("high") || lower.includes("very")) {
    return { label: "Busy", className: "bg-transit-red/10 text-transit-red" };
  }
  if (lower.includes("moderate") || lower.includes("medium")) {
    return { label: "Moderate", className: "bg-coral/10 text-coral" };
  }
  return { label: "Quiet", className: "bg-sage/10 text-sage" };
}

function SOSPageContent() {
  const searchParams = useSearchParams();
  const demo = isDemoMode(searchParams);

  const [spaces, setSpaces] = useState<SafeSpace[]>([]);
  const [crowding, setCrowding] = useState<CrowdingInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(
    demo ? DEMO_LOCATION : { lat: 51.5074, lng: -0.1278 }
  );

  useEffect(() => {
    if (demo) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {}
    );
  }, [demo]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [spacesRes, crowdingRes] = await Promise.all([
        fetch(`/api/safe-spaces?lat=${location.lat}&lng=${location.lng}`),
        fetch("/api/tfl"),
      ]);
      const spacesData = await spacesRes.json();
      const crowdingData = await crowdingRes.json();
      setSpaces(spacesData.spaces || []);
      setCrowding(crowdingData.crowding || []);
      setLoading(false);
    }
    fetchData();
  }, [location]);

  function formatDistance(meters?: number) {
    if (!meters) return "";
    if (meters < 1000) return `${Math.round(meters)}m away`;
    return `${(meters / 1000).toFixed(1)}km away`;
  }

  function getCrowdingForStation(name: string) {
    const match = crowding.find((c) =>
      name.toLowerCase().includes(c.stationName.split("—")[0]?.trim().toLowerCase() ?? "")
    );
    return match?.crowding;
  }

  return (
    <div className="flex h-[calc(100vh-5rem)] flex-col md:h-screen md:flex-row">
      <div className="flex-1">
        <MapView
          className="h-48 md:h-full"
          center={[location.lng, location.lat]}
          safeSpaces={spaces}
        />
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto p-6 md:max-w-md">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-transit-red shadow-lg">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-navy">SOS Safe Spaces</h1>
            <p className="text-sm text-navy/60">
              Nearest staffed stations & libraries
              {demo && " · Demo mode"}
            </p>
          </div>
        </div>

        {loading ? (
          <p className="text-navy/50">Finding safe spaces near you...</p>
        ) : (
          <div className="space-y-3">
            {spaces.map((space) => {
              const badge =
                space.type === "tfl_station"
                  ? crowdingBadge(space.crowding ?? getCrowdingForStation(space.name))
                  : null;

              return (
                <Card key={space.id} className="flex items-center gap-4">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                      space.type === "tfl_station" ? "bg-sage/20" : "bg-coral/20"
                    }`}
                  >
                    {space.type === "tfl_station" ? (
                      <Train className="h-5 w-5 text-sage" />
                    ) : (
                      <BookOpen className="h-5 w-5 text-coral" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-navy">{space.name}</p>
                      {badge && (
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${badge.className}`}
                        >
                          <Users className="h-3 w-3" />
                          {badge.label}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-navy/50">
                      {space.type === "tfl_station" ? "Staffed TfL station" : "Public library"}
                      {space.distance ? ` · ${formatDistance(space.distance)}` : ""}
                    </p>
                  </div>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${space.lat},${space.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="ghost" size="sm">
                      <Navigation className="h-4 w-4" />
                    </Button>
                  </a>
                </Card>
              );
            })}
          </div>
        )}

        <div className="mt-6">
          <a href="tel:999">
            <Button variant="danger" className="w-full" size="lg">
              <Shield className="mr-2 h-5 w-5" />
              Emergency — Call 999
            </Button>
          </a>
          <p className="mt-2 text-center text-xs text-navy/40">
            In an emergency, always call 999 first
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SOSPage() {
  return (
    <Suspense fallback={<div className="p-6 text-navy/50">Loading SOS...</div>}>
      <SOSPageContent />
    </Suspense>
  );
}
