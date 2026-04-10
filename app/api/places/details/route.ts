import { NextRequest, NextResponse } from "next/server";

// GET /api/places/details?placeId=...
// Handles both OSM place_id (numeric) and OSM element IDs (osm:node/123456)
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

    // ── OSM Element lookup (from Overpass results) ──────────
    // placeId format: "osm:node/123456" or "osm:way/123456"
    if (placeId.startsWith("osm:")) {
      const [, typeAndId] = placeId.split(":");
      const [type, id] = typeAndId.split("/");

      const shortType = type === "node" ? "N" : type === "way" ? "W" : "R";
      const url = `https://nominatim.openstreetmap.org/lookup?format=json&addressdetails=1&extratags=1&namedetails=1&osm_ids=${shortType}${id}`;

      const response = await fetch(url, {
        headers: {
          "User-Agent": "local-business-discovery-portal/1.0 (student demo)",
        },
      });
      if (!response.ok) {
        console.error(`Nominatim lookup failed with status: ${response.status}`);
        throw new Error("Nominatim lookup failed");
      }
      const data = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        // Return a minimal response if lookup fails
        return NextResponse.json({
          placeId,
          name: "Unknown Place",
          address: "",
          phone: "",
          website: "",
          location: { lat: 0, lng: 0 },
          rating: 0,
          totalRatings: 0,
          types: [],
          openNow: null,
          openingHours: [],
          photos: [],
          reviews: [],
          googleMapsUrl: "",
          businessStatus: "",
        });
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const place = data[0] as any;
      const lat = parseFloat(place.lat);
      const lng = parseFloat(place.lon);

      return NextResponse.json({
        placeId,
        name:
          place.namedetails?.name ||
          place.namedetails?.["name:en"] ||
          place.display_name?.split(",")[0] ||
          "Unknown",
        address: place.display_name || "",
        phone: place.extratags?.phone || place.extratags?.["contact:phone"] || "",
        website:
          place.extratags?.website || place.extratags?.["contact:website"] || "",
        location: { lat, lng },
        rating: 0,
        totalRatings: 0,
        priceLevel: undefined,
        types: [place.class, place.type].filter(Boolean),
        openNow: null,
        openingHours: place.extratags?.opening_hours
          ? [place.extratags.opening_hours]
          : [],
        photos: [],
        reviews: [],
        googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
        businessStatus: "OPERATIONAL",
      });
    }

    // ── Nominatim place_id lookup (numeric IDs) ─────────────
    const url = `https://nominatim.openstreetmap.org/lookup?format=json&addressdetails=1&extratags=1&namedetails=1&place_id=${encodeURIComponent(placeId)}`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "local-business-discovery-portal/1.0 (student demo)",
      },
    });
    if (!response.ok) {
      console.error(`Nominatim place_id lookup failed with status: ${response.status}`);
      throw new Error("Nominatim place_id lookup failed");
    }
    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json({ error: "Place not found" }, { status: 404 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const place = data[0] as any;
    const lat = parseFloat(place.lat);
    const lng = parseFloat(place.lon);

    return NextResponse.json({
      placeId: String(place.place_id),
      name:
        place.namedetails?.name ||
        place.namedetails?.["name:en"] ||
        place.display_name?.split(",")[0] ||
        "Unknown",
      address: place.display_name || "",
      phone: place.extratags?.phone || place.extratags?.["contact:phone"] || "",
      website:
        place.extratags?.website || place.extratags?.["contact:website"] || "",
      location: { lat, lng },
      rating: 0,
      totalRatings: 0,
      priceLevel: undefined,
      types: [place.class, place.type].filter(Boolean),
      openNow: null,
      openingHours: place.extratags?.opening_hours
        ? [place.extratags.opening_hours]
        : [],
      photos: [],
      reviews: [],
      googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
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
