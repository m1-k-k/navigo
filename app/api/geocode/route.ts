import { NextRequest, NextResponse } from "next/server";
import { geocodePlace } from "@/lib/nominatim/geocode";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");

  if (!q?.trim()) {
    return NextResponse.json({ error: "q parameter required" }, { status: 400 });
  }

  const coords = await geocodePlace(q);

  if (!coords) {
    return NextResponse.json({ error: "Location not found" }, { status: 404 });
  }

  return NextResponse.json({ lng: coords[0], lat: coords[1] });
}
