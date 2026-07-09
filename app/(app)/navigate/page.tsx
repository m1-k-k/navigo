"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { getTimeOfDayLabel, isNightTime } from "@/lib/routing/time-of-day";
import type { RouteMode } from "@/lib/types";
import { formatDuration } from "@/lib/utils";
import { Moon, Sun, Zap, Shield } from "lucide-react";

export default function NavigatePage() {
  const router = useRouter();
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [mode, setMode] = useState<RouteMode>(isNightTime() ? "safe" : "safe");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    duration: number;
    safetyScore: number;
    litStreetPercent: number;
    label: string;
    isNight: boolean;
  } | null>(null);

  async function geocode(query: string): Promise<[number, number] | null> {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) return null;

    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${token}&country=gb&proximity=-0.1278,51.5074&limit=1`
    );
    const data = await res.json();
    if (!data.features?.[0]) return null;
    return data.features[0].center as [number, number];
  }

  async function handlePlanRoute() {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const originCoords = await geocode(origin);
      const destCoords = await geocode(destination);

      if (!originCoords || !destCoords) {
        setError("Could not find one or both locations. Try London postcodes or place names.");
        return;
      }

      const originStr = `${originCoords[0]},${originCoords[1]}`;
      const destStr = `${destCoords[0]},${destCoords[1]}`;

      const res = await fetch(
        `/api/route?origin=${originStr}&destination=${destStr}&mode=${mode}`
      );
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to plan route");
        return;
      }

      setResult({
        duration: data.route.duration,
        safetyScore: data.route.safetyScore,
        litStreetPercent: data.route.litStreetPercent,
        label: data.route.label,
        isNight: data.isNight,
      });

      sessionStorage.setItem(
        "navigo-route",
        JSON.stringify({
          origin: originCoords,
          destination: destCoords,
          route: data.route,
          alternatives: data.alternatives,
          mode: data.mode,
        })
      );

      router.push("/map");
    } catch {
      setError("Something went wrong. Check your Mapbox token.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy">Plan your route</h1>
        <p className="mt-1 flex items-center gap-2 text-sm text-navy/60">
          {isNightTime() ? (
            <Moon className="h-4 w-4 text-sage" />
          ) : (
            <Sun className="h-4 w-4 text-coral" />
          )}
          {getTimeOfDayLabel()}
        </p>
      </div>

      <Card className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-navy">From</label>
          <Input
            placeholder="e.g. King's Cross, London"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-navy">To</label>
          <Input
            placeholder="e.g. Camden Town, London"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-navy">Route mode</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setMode("fast")}
              disabled={isNightTime()}
              className={`flex items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                mode === "fast"
                  ? "border-coral bg-coral/10"
                  : "border-navy/10 hover:border-navy/20"
              } ${isNightTime() ? "opacity-50" : ""}`}
            >
              <Zap className="h-5 w-5 text-coral" />
              <div className="text-left">
                <p className="font-semibold text-navy">Fast</p>
                <p className="text-xs text-navy/50">Shortest time</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setMode("safe")}
              className={`flex items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                mode === "safe"
                  ? "border-sage bg-sage/10"
                  : "border-navy/10 hover:border-navy/20"
              }`}
            >
              <Shield className="h-5 w-5 text-sage" />
              <div className="text-left">
                <p className="font-semibold text-navy">Safe</p>
                <p className="text-xs text-navy/50">Well-lit streets</p>
              </div>
            </button>
          </div>
          {isNightTime() && (
            <p className="mt-2 text-xs text-sage">
              Night mode active — safe routing enforced
            </p>
          )}
        </div>

        {error && (
          <p className="rounded-xl bg-transit-red/10 p-3 text-sm text-transit-red">
            {error}
          </p>
        )}

        <Button
          className="w-full"
          size="lg"
          onClick={handlePlanRoute}
          disabled={loading || !origin || !destination}
        >
          {loading ? "Planning route..." : "Plan route"}
        </Button>
      </Card>

      {result && (
        <Card className="mt-4">
          <p className="font-semibold text-navy">{result.label}</p>
          <div className="mt-2 flex gap-4 text-sm text-navy/70">
            <span>{formatDuration(result.duration)}</span>
            <span>Safety: {result.safetyScore}%</span>
            <span>Lit streets: {result.litStreetPercent}%</span>
          </div>
        </Card>
      )}
    </div>
  );
}
