"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapView } from "@/components/map/map-view";
import type { SafeSpace } from "@/lib/types";
import { Shield, Train, BookOpen, Navigation } from "lucide-react";

export default function SOSPage() {
  const [spaces, setSpaces] = useState<SafeSpace[]>([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState({ lat: 51.5074, lng: -0.1278 });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {}
    );
  }, []);

  useEffect(() => {
    async function fetchSpaces() {
      setLoading(true);
      const res = await fetch(
        `/api/safe-spaces?lat=${location.lat}&lng=${location.lng}`
      );
      const data = await res.json();
      setSpaces(data.spaces || []);
      setLoading(false);
    }
    fetchSpaces();
  }, [location]);

  function formatDistance(meters?: number) {
    if (!meters) return "";
    if (meters < 1000) return `${Math.round(meters)}m away`;
    return `${(meters / 1000).toFixed(1)}km away`;
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
            <p className="text-sm text-navy/60">Nearest staffed stations & libraries</p>
          </div>
        </div>

        {loading ? (
          <p className="text-navy/50">Finding safe spaces near you...</p>
        ) : (
          <div className="space-y-3">
            {spaces.map((space) => (
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
                  <p className="font-semibold text-navy">{space.name}</p>
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
            ))}
          </div>
        )}

        <div className="mt-6">
          <Button variant="danger" className="w-full" size="lg">
            <Shield className="mr-2 h-5 w-5" />
            Emergency — Call 999
          </Button>
          <p className="mt-2 text-center text-xs text-navy/40">
            In an emergency, always call 999 first
          </p>
        </div>
      </div>
    </div>
  );
}
