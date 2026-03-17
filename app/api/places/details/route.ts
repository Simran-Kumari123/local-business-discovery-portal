import { NextRequest, NextResponse } from "next/server";

// GET /api/places/details?placeId=...
// Returns detailed info about a specific place using Nominatim lookup
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const placeId = searchParams.get("placeId");

    if (!placeId) {
      return NextResponse.json(
        { error: "Place ID is required" },
        { status: 400 },
      );
    }

    // Nominatim lookup by place_id
    const url = `https://nominatim.openstreetmap.org/lookup?format=json&addressdetails=1&extratags=1&namedetails=1&place_id=${encodeURIComponent(placeId)}`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "local-business-discovery-portal/1.0 (student demo)",
      },
    });
    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json({ error: "Place not found" }, { status: 404 });
    }

    // Nominatim returns an array for lookup; take first
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const place = data[0] as any;

    const photos: string[] = [];

    return NextResponse.json({
      placeId: String(place.place_id),
      name:
        (place.namedetails &&
          (place.namedetails.name || place.namedetails["name:en"])) ||
        place.display_name.split(",")[0],
      address: place.display_name || "",
      phone: place.extratags?.phone || "",
      website: place.extratags?.website || "",
      location: {
        lat: parseFloat(place.lat),
        lng: parseFloat(place.lon),
      },
      rating: 0,
      totalRatings: 0,
      priceLevel: undefined,
      types: place.class
        ? [place.class, place.type].filter(Boolean)
        : [place.type].filter(Boolean),
      openNow: null,
      openingHours: [],
      photos,
      reviews: [],
      googleMapsUrl: "",
      businessStatus: "",
    });
  } catch (err: unknown) {
    console.error("Place details error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
