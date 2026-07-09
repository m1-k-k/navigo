"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { getTimeOfDayLabel, isNightTime } from "@/lib/routing/time-of-day";
import {
  DEMO_DESTINATION,
  DEMO_ORIGIN,
  effectiveIsNightTime,
  isDemoMode,
} from "@/lib/demo";
import type { RouteMode } from "@/lib/types";
import { formatDuration } from "@/lib/utils";
import { Moon, Sun, Zap, Shield } from "lucide-react";

interface RouteComparison {
  fast: { duration: number; safetyScore: number; litStreetPercent: number };
  safe: { duration: number; safetyScore: number; litStreetPercent: number };
  selectedMode: RouteMode;
}

export default function NavigatePage() {
  return (
    <Suspense fallback={<div className="p-6 text-navy/50">Loading...</div>}>
      <NavigatePageContent />
    </Suspense>
  );
}

function NavigatePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const demo = isDemoMode(searchParams);

  const night = effectiveIsNightTime(isNightTime(), demo);

  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [mode, setMode] = useState<RouteMode>("safe");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [comparison, setComparison] = useState<RouteComparison | null>(null);

  useEffect(() => {
    if (demo) {
      setOrigin(DEMO_ORIGIN);
      setDestination(DEMO_DESTINATION);
    }
  }, [demo]);

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
    setComparison(null);

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
        `/api/route?origin=${originStr}&destination=${destStr}&mode=${mode}${demo ? "&demo=1" : ""}`
      );
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to plan route");
        return;
      }

      const comparisonData: RouteComparison = {
        fast: {
          duration: data.alternatives.fast.duration,
          safetyScore: data.alternatives.fast.safetyScore,
          litStreetPercent: data.alternatives.fast.litStreetPercent,
        },
        safe: {
          duration: data.alternatives.safe.duration,
          safetyScore: data.alternatives.safe.safetyScore,
          litStreetPercent: data.alternatives.safe.litStreetPercent,
        },
        selectedMode: data.mode,
      };
      setComparison(comparisonData);

      sessionStorage.setItem(
        "navigo-route",
        JSON.stringify({
          origin: originCoords,
          destination: destCoords,
          route: data.route,
          alternatives: data.alternatives,
          mode: data.mode,
          demo,
        })
      );

      setTimeout(() => router.push(demo ? "/map?demo=1" : "/map"), 1200);
    } catch {
      setError("Something went wrong. Check your Mapbox token.");
    } finally {
      setLoading(false);
    }
  }

  const safetyGain =
    comparison && comparison.fast.safetyScore > 0
      ? comparison.safe.safetyScore - comparison.fast.safetyScore
      : 0;

  return (
    <div className="mx-auto max-w-lg p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-navy">Plan your route</h1>
          {demo && (
            <span className="rounded-full bg-coral/10 px-3 py-1 text-xs font-semibold text-coral">
              Demo mode
            </span>
          )}
        </div>
        <p className="mt-1 flex items-center gap-2 text-sm text-navy/60">
          {night ? (
            <Moon className="h-4 w-4 text-sage" />
          ) : (
            <Sun className="h-4 w-4 text-coral" />
          )}
          {demo ? "Day — Choose your route (demo)" : getTimeOfDayLabel()}
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
              disabled={night}
              className={`flex items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                mode === "fast"
                  ? "border-coral bg-coral/10"
                  : "border-navy/10 hover:border-navy/20"
              } ${night ? "opacity-50" : ""}`}
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
          {night && !demo && (
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

      {comparison && (
        <Card className="mt-4 border-2 border-sage/20">
          <p className="text-sm font-medium text-navy/60">Route comparison</p>
          <div className="mt-3 grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-coral/10 p-3">
              <p className="text-xs font-semibold uppercase text-coral">Fast</p>
              <p className="mt-1 text-lg font-bold text-navy">
                {formatDuration(comparison.fast.duration)}
              </p>
              <p className="text-xs text-navy/60">
                Safety {comparison.fast.safetyScore}%
              </p>
            </div>
            <div className="rounded-xl bg-sage/10 p-3">
              <p className="text-xs font-semibold uppercase text-sage">Safe</p>
              <p className="mt-1 text-lg font-bold text-navy">
                {formatDuration(comparison.safe.duration)}
              </p>
              <p className="text-xs text-navy/60">
                Safety {comparison.safe.safetyScore}% · Lit {comparison.safe.litStreetPercent}%
              </p>
            </div>
          </div>
          {safetyGain > 0 && (
            <p className="mt-3 text-center text-sm font-medium text-sage">
              Safe route is +{safetyGain}% safer — opening map...
            </p>
          )}
        </Card>
      )}
    </div>
  );
}
