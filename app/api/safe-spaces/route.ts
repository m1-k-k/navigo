import { NextRequest, NextResponse } from "next/server";
import { getNearbyLibraries } from "@/lib/osm/overpass";
import { getNearbyStations } from "@/lib/tfl/client";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const lat = parseFloat(searchParams.get("lat") || "51.5074");
  const lng = parseFloat(searchParams.get("lng") || "-0.1278");

  const [stations, libraries] = await Promise.all([
    getNearbyStations(lat, lng),
    getNearbyLibraries(lat, lng),
  ]);

  const spaces = [...stations, ...libraries]
    .sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0))
    .slice(0, 10);

  return NextResponse.json({ spaces });
}
