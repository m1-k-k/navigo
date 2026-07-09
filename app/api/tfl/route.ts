import { NextRequest, NextResponse } from "next/server";
import { getStationCrowding } from "@/lib/tfl/client";

export async function GET() {
  const crowding = await getStationCrowding();
  return NextResponse.json({ crowding });
}
