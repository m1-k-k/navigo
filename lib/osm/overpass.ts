import type { SafeSpace } from "@/lib/types";
import { haversineDistance } from "@/lib/utils";

const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

export async function getNearbyLibraries(
  lat: number,
  lng: number,
  radius = 1500
): Promise<SafeSpace[]> {
  const query = `
    [out:json][timeout:10];
    (
      node["amenity"="library"](around:${radius},${lat},${lng});
      way["amenity"="library"](around:${radius},${lat},${lng});
    );
    out center 10;
  `;

  try {
    const res = await fetch(OVERPASS_URL, {
      method: "POST",
      body: query,
      headers: { "Content-Type": "text/plain" },
      next: { revalidate: 3600 },
    });

    if (!res.ok) return getFallbackLibraries(lat, lng);

    const data = await res.json();
    return (data.elements || []).map(
      (el: {
        id: number;
        tags?: { name?: string };
        lat?: number;
        lon?: number;
        center?: { lat: number; lon: number };
      }) => {
        const elLat = el.lat ?? el.center?.lat ?? lat;
        const elLng = el.lon ?? el.center?.lon ?? lng;
        return {
          id: `library-${el.id}`,
          name: el.tags?.name || "Public Library",
          type: "library" as const,
          lat: elLat,
          lng: elLng,
          distance: haversineDistance(lat, lng, elLat, elLng),
        };
      }
    );
  } catch {
    return getFallbackLibraries(lat, lng);
  }
}

function getFallbackLibraries(lat: number, lng: number): SafeSpace[] {
  const libraries = [
    { id: "bl", name: "British Library", lat: 51.5299, lng: -0.1276 },
    { id: "wl", name: "Westminster Reference Library", lat: 51.5074, lng: -0.1278 },
    { id: "cl", name: "City of London Library", lat: 51.5155, lng: -0.0922 },
  ];

  return libraries
    .map((l) => ({
      ...l,
      type: "library" as const,
      distance: haversineDistance(lat, lng, l.lat, l.lng),
    }))
    .sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));
}
