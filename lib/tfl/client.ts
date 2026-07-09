import type { CrowdingInfo, SafeSpace } from "@/lib/types";
import { haversineDistance } from "@/lib/utils";

const TFL_BASE = "https://api.tfl.gov.uk";

function tflUrl(path: string): string {
  const appId = process.env.TFL_APP_ID;
  const appKey = process.env.TFL_APP_KEY;
  const params = new URLSearchParams();
  if (appId) params.set("app_id", appId);
  if (appKey) params.set("app_key", appKey);
  const qs = params.toString();
  return `${TFL_BASE}${path}${qs ? `?${qs}` : ""}`;
}

export async function getNearbyStations(
  lat: number,
  lng: number,
  radius = 1000
): Promise<SafeSpace[]> {
  try {
    const res = await fetch(
      tflUrl(`/StopPoint?lat=${lat}&lon=${lng}&radius=${radius}&modes=tube,dlr,overground,national-rail`),
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return getFallbackStations(lat, lng);

    const data = await res.json();
    const stops = data.stopPoints || [];

    return stops.slice(0, 8).map(
      (stop: {
        id: string;
        commonName: string;
        lat: number;
        lon: number;
      }) => ({
        id: stop.id,
        name: stop.commonName,
        type: "tfl_station" as const,
        lat: stop.lat,
        lng: stop.lon,
        staffed: true,
        distance: haversineDistance(lat, lng, stop.lat, stop.lon),
      })
    );
  } catch {
    return getFallbackStations(lat, lng);
  }
}

function getFallbackStations(lat: number, lng: number): SafeSpace[] {
  const londonStations = [
    { id: "king's-cross", name: "King's Cross St. Pancras", lat: 51.5308, lng: -0.1238 },
    { id: "waterloo", name: "Waterloo", lat: 51.5033, lng: -0.1145 },
    { id: "liverpool-street", name: "Liverpool Street", lat: 51.5178, lng: -0.0814 },
    { id: "victoria", name: "Victoria", lat: 51.4963, lng: -0.1436 },
    { id: "paddington", name: "Paddington", lat: 51.5154, lng: -0.1755 },
  ];

  return londonStations
    .map((s) => ({
      ...s,
      type: "tfl_station" as const,
      staffed: true,
      distance: haversineDistance(lat, lng, s.lat, s.lng),
    }))
    .sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0))
    .slice(0, 5);
}

export async function getStationCrowding(): Promise<CrowdingInfo[]> {
  try {
    const res = await fetch(tflUrl("/Crowding/"), { next: { revalidate: 120 } });
    if (!res.ok) return [];

    const data = await res.json();
    return (data.trainCrowding || []).slice(0, 20).map(
      (item: {
        line: string;
        direction: string;
        crowdingLevel: string;
      }) => ({
        stationId: `${item.line}-${item.direction}`,
        stationName: `${item.line} — ${item.direction}`,
        lat: 51.5074,
        lng: -0.1278,
        crowding: item.crowdingLevel || "Unknown",
      })
    );
  } catch {
    return [];
  }
}
