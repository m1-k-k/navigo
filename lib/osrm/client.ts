import type { MapboxRoute } from "@/lib/routing/safety";

const OSRM_BASE = "https://router.project-osrm.org/route/v1/foot";

interface OsrmStep {
  name?: string;
  duration: number;
  distance: number;
}

interface OsrmLeg {
  steps: OsrmStep[];
}

interface OsrmRoute {
  duration: number;
  distance: number;
  geometry: GeoJSON.LineString;
  legs: OsrmLeg[];
}

function normalizeRoute(route: OsrmRoute): MapboxRoute {
  return {
    duration: route.duration,
    distance: route.distance,
    geometry: route.geometry,
    legs: route.legs.map((leg) => ({
      steps: leg.steps.map((step) => ({
        name: step.name,
        duration: step.duration,
        distance: step.distance,
      })),
    })),
  };
}

export async function fetchWalkingRoutes(
  originLng: number,
  originLat: number,
  destLng: number,
  destLat: number
): Promise<MapboxRoute[]> {
  const coords = `${originLng},${originLat};${destLng},${destLat}`;
  const url = `${OSRM_BASE}/${coords}?alternatives=true&overview=full&geometries=geojson&steps=true`;

  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    throw new Error(`OSRM routing failed: ${res.status}`);
  }

  const data = await res.json();

  if (data.code !== "Ok" || !data.routes?.length) {
    throw new Error("No route found");
  }

  return (data.routes as OsrmRoute[]).map(normalizeRoute);
}
