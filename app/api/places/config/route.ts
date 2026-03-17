import { NextResponse } from "next/server";

// GET /api/places/config
// Returns map provider configuration. When Google Maps is not configured
// we expose OpenStreetMap tile URL and attribution for client-side Leaflet.
export async function GET() {
  const rawKey =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
    process.env.GOOGLE_MAPS_API_KEY ||
    "";
  // Treat obvious placeholder values as "not configured" so the app falls back to OSM
  const isPlaceholder =
    /your_google|your-google|your_google_maps|YOUR_GOOGLE|replace|change\s*me|xxxx/i.test(
      rawKey,
    );
  const apiKey = rawKey && !isPlaceholder ? rawKey : "";
  const tileUrl =
    process.env.NEXT_PUBLIC_OSM_TILE_URL ||
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const tileAttribution =
    process.env.NEXT_PUBLIC_OSM_TILE_ATTRIBUTION ||
    "© OpenStreetMap contributors";

  return NextResponse.json({
    apiKey,
    tileUrl,
    tileAttribution,
    provider: apiKey ? "google" : "osm",
  });
}
