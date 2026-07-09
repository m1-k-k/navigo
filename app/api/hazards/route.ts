import { NextRequest, NextResponse } from "next/server";

const STORAGE_KEY = "navigo-hazard-reports";

export async function GET() {
  return NextResponse.json({ reports: [] });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { lat, lng, description, category } = body;

  if (!lat || !lng || !description) {
    return NextResponse.json(
      { error: "lat, lng, and description required" },
      { status: 400 }
    );
  }

  const report = {
    id: crypto.randomUUID(),
    lat,
    lng,
    description,
    category: category || "other",
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  return NextResponse.json({
    success: true,
    report,
    storageKey: STORAGE_KEY,
  });
}
