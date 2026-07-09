import type { RouteMode } from "@/lib/types";

interface MapboxStep {
  name?: string;
  duration: number;
  distance: number;
}

interface MapboxLeg {
  steps: MapboxStep[];
}

export interface MapboxRoute {
  duration: number;
  distance: number;
  geometry: GeoJSON.LineString;
  legs: MapboxLeg[];
}

const QUIET_KEYWORDS = ["lane", "path", "alley", "footway", "cutting", "mews"];
const BUSY_KEYWORDS = ["road", "street", "avenue", "high road", "broadway", "square"];

export function scoreRoute(
  route: MapboxRoute,
  mode: RouteMode,
  isNight: boolean
): { safetyScore: number; litStreetPercent: number } {
  if (mode === "fast") {
    const speedScore = Math.max(0, 100 - route.duration / 60);
    return { safetyScore: Math.round(speedScore), litStreetPercent: 40 };
  }

  let busySteps = 0;
  let quietSteps = 0;
  let totalSteps = 0;

  for (const leg of route.legs) {
    for (const step of leg.steps) {
      totalSteps++;
      const name = (step.name || "").toLowerCase();
      if (BUSY_KEYWORDS.some((k) => name.includes(k))) busySteps++;
      if (QUIET_KEYWORDS.some((k) => name.includes(k))) quietSteps++;
    }
  }

  const busyRatio = totalSteps > 0 ? busySteps / totalSteps : 0.5;
  const quietPenalty = totalSteps > 0 ? quietSteps / totalSteps : 0;
  let safetyScore = Math.round(busyRatio * 70 + (1 - quietPenalty) * 30);
  if (isNight) safetyScore = Math.min(100, safetyScore + 15);

  const litStreetPercent = Math.min(95, Math.round(45 + busyRatio * 50));

  return { safetyScore, litStreetPercent };
}

export function pickBestRoute(
  routes: MapboxRoute[],
  mode: RouteMode,
  isNight: boolean
): MapboxRoute {
  if (routes.length === 0) throw new Error("No routes available");

  if (mode === "fast") {
    return routes.reduce((best, r) => (r.duration < best.duration ? r : best));
  }

  return routes.reduce((best, r) => {
    const bestScore = scoreRoute(best, mode, isNight).safetyScore;
    const routeScore = scoreRoute(r, mode, isNight).safetyScore;
    if (routeScore > bestScore) return r;
    if (routeScore === bestScore && r.duration < best.duration) return r;
    return best;
  });
}
