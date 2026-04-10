import { NextRequest, NextResponse } from "next/server";

// GET /api/places/autocomplete?q=...
// Returns search suggestions combining:
// 1. Curated popular categories
// 2. Nominatim location suggestions for the typed text

const POPULAR_CATEGORIES = [
  "restaurants",
  "cafes",
  "gyms",
  "hotels",
  "hospitals",
  "banks",
  "supermarkets",
  "pharmacies",
  "schools",
  "cinemas",
  "bakeries",
  "petrol pumps",
  "salons",
  "bars",
  "parks",
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() || "";

  if (q.length < 2) {
    // Return popular categories when query is empty/short
    return NextResponse.json({
      suggestions: POPULAR_CATEGORIES.slice(0, 8).map((label) => ({
        type: "category",
        label,
        query: label,
      })),
    });
  }

  const qLower = q.toLowerCase();

  // Match categories
  const categorySuggestions = POPULAR_CATEGORIES.filter((c) =>
    c.startsWith(qLower),
  )
    .slice(0, 4)
    .map((label) => ({ type: "category", label, query: label }));

  // Fetch Nominatim location suggestions
  let locationSuggestions: { type: string; label: string; query: string }[] =
    [];
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=5&addressdetails=0&q=${encodeURIComponent(q)}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "local-business-discovery-portal/1.0 (student demo)",
      },
      // Cache for 60 seconds to reduce API load
      next: { revalidate: 60 },
    });
    const data = await res.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    locationSuggestions = (data || []).slice(0, 4).map((p: any) => ({
      type: "location",
      label: p.display_name.split(",").slice(0, 2).join(","),
      query: p.display_name.split(",")[0],
    }));
  } catch {
    // silently ignore
  }

  return NextResponse.json({
    suggestions: [
      ...categorySuggestions,
      ...locationSuggestions,
    ].slice(0, 8),
  });
}
