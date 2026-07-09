const NOMINATIM_BASE = "https://nominatim.openstreetmap.org/search";

export async function geocodePlace(query: string): Promise<[number, number] | null> {
  const params = new URLSearchParams({
    q: query,
    format: "json",
    limit: "1",
    countrycodes: "gb",
  });

  const res = await fetch(`${NOMINATIM_BASE}?${params}`, {
    headers: {
      Accept: "application/json",
      "User-Agent": "NaviGo/1.0 (safety navigation demo; contact@navigo.app)",
    },
    next: { revalidate: 3600 },
  });

  if (!res.ok) return null;

  const data = await res.json();
  if (!data?.[0]) return null;

  const lat = parseFloat(data[0].lat);
  const lng = parseFloat(data[0].lon);

  if (Number.isNaN(lat) || Number.isNaN(lng)) return null;

  return [lng, lat];
}
