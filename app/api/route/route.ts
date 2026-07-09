import { NextRequest, NextResponse } from "next/server";
import { effectiveIsNightTime } from "@/lib/demo";
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

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "Mapbox token not configured" },
      { status: 503 }
    );
  }

  const night = effectiveIsNightTime(isNightTime(), demo);
  const effectiveMode = night ? "safe" : mode;

  const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${origin};${destination}?alternatives=true&geometries=geojson&overview=full&steps=true&access_token=${token}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data.routes?.length) {
      return NextResponse.json({ error: "No route found" }, { status: 404 });
    }

    const fastRoute = pickBestRoute(data.routes, "fast", night);
    const safeRoute = pickBestRoute(data.routes, "safe", night);
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
  } catch {
    return NextResponse.json({ error: "Routing failed" }, { status: 500 });
  }
}
