import { NextRequest, NextResponse } from "next/server";
import { effectiveIsNightTime } from "@/lib/demo";
import { fetchWalkingRoutes } from "@/lib/osrm/client";
import { pickBestRoute, scoreRoute } from "@/lib/routing/safety";
import { isNightTime } from "@/lib/routing/time-of-day";
import type { RouteMode } from "@/lib/types";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const origin = searchParams.get("origin");
  const destination = searchParams.get("destination");
  const mode = (searchParams.get("mode") || "safe") as RouteMode;
  const demo = searchParams.get("demo") === "1";

  if (!origin || !destination) {
    return NextResponse.json(
      { error: "origin and destination required (lng,lat format)" },
      { status: 400 }
    );
  }

  const [originLng, originLat] = origin.split(",").map(Number);
  const [destLng, destLat] = destination.split(",").map(Number);

  if ([originLng, originLat, destLng, destLat].some(Number.isNaN)) {
    return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
  }

  const night = effectiveIsNightTime(isNightTime(), demo);
  const effectiveMode = night ? "safe" : mode;

  try {
    const routes = await fetchWalkingRoutes(originLng, originLat, destLng, destLat);

    const fastRoute = pickBestRoute(routes, "fast", night);
    const safeRoute = pickBestRoute(routes, "safe", night);
    const selected = effectiveMode === "fast" ? fastRoute : safeRoute;
    const scores = scoreRoute(selected, effectiveMode, night);

    const fastScores = scoreRoute(fastRoute, "fast", night);
    const safeScores = scoreRoute(safeRoute, "safe", night);

    return NextResponse.json({
      mode: effectiveMode,
      isNight: night,
      route: {
        duration: selected.duration,
        distance: selected.distance,
        geometry: selected.geometry,
        safetyScore: scores.safetyScore,
        litStreetPercent: scores.litStreetPercent,
        label: effectiveMode === "fast" ? "Fastest route" : "Safest route",
      },
      alternatives: {
        fast: {
          duration: fastRoute.duration,
          distance: fastRoute.distance,
          geometry: fastRoute.geometry,
          safetyScore: fastScores.safetyScore,
          litStreetPercent: fastScores.litStreetPercent,
        },
        safe: {
          duration: safeRoute.duration,
          distance: safeRoute.distance,
          geometry: safeRoute.geometry,
          safetyScore: safeScores.safetyScore,
          litStreetPercent: safeScores.litStreetPercent,
        },
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Routing failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
