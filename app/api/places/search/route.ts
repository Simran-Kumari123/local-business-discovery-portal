import { NextRequest, NextResponse } from "next/server";
import { parseSearchQuery, resolvePoiTags } from "@/lib/searchParser";

/* ═══════════════════════════════════════════════════════
   Types
═══════════════════════════════════════════════════════ */
interface Place {
  placeId: string;
  name: string;
  address: string;
  location: { lat: number; lng: number };
  rating: number;
  totalRatings: number;
  priceLevel?: number;
  types: string[];
  openNow: boolean | null;
  photo: string | null;
  icon: string | null;
  businessStatus: string;
  distance?: number; // km from user
}

/* ═══════════════════════════════════════════════════════
   Overpass tag mapping
═══════════════════════════════════════════════════════ */
function overpassTagFor(t: string): string {
  const map: Record<string, string> = {
    restaurant: "amenity=restaurant",
    cafe: "amenity=cafe",
    hotel: "tourism=hotel",
    gym: "leisure=fitness_centre",
    salon: "shop=beauty",
    bank: "amenity=bank",
    supermarket: "shop=supermarket",
    petrol: "amenity=fuel",
    pharmacy: "amenity=pharmacy",
    bar: "amenity=bar",
    hospital: "amenity=hospital",
    school: "amenity=school",
    park: "leisure=park",
    cinema: "amenity=cinema",
    bakery: "shop=bakery",
  };
  return map[t] || "";
}

/* ═══════════════════════════════════════════════════════
   Haversine distance (km)
═══════════════════════════════════════════════════════ */
function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/* ═══════════════════════════════════════════════════════
   Nominatim geocode: place name → {lat, lng}
═══════════════════════════════════════════════════════ */
async function geocodeLocation(
  location: string,
): Promise<{ lat: number; lng: number } | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(location)}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "local-business-discovery-portal/1.0 (student demo)",
      },
    });
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
  } catch (e) {
    console.error("Geocode error:", e);
  }
  return null;
}

/* ═══════════════════════════════════════════════════════
   Overpass search: POI category near coordinates
═══════════════════════════════════════════════════════ */
async function overpassSearch(
  poiTags: string[],
  lat: number,
  lng: number,
  radius: number,
  userLat?: number,
  userLng?: number,
): Promise<Place[]> {
  const filters = poiTags
    .map(overpassTagFor)
    .filter(Boolean)
    .map((f) => {
      const [k, v] = f.split("=");
      return (
        `node["${k}"="${v}"](around:${radius},${lat},${lng});` +
        `way["${k}"="${v}"](around:${radius},${lat},${lng});` +
        `relation["${k}"="${v}"](around:${radius},${lat},${lng});`
      );
    })
    .join("");

  const query = `[out:json][timeout:25];(${filters});out center 60;`;

  const resp = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
      "User-Agent": "local-business-discovery-portal/1.0 (student demo)",
    },
    body: query,
  });

  const ov = await resp.json();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (ov.elements || [])
    .filter((el: any) => {
      const name =
        el.tags?.name || el.tags?.["name:en"] || el.tags?.operator || "";
      return name.trim().length > 0;
    })
    .map((el: any) => {
      const latEl = el.lat ?? el.center?.lat;
      const lonEl = el.lon ?? el.center?.lon;
      const name =
        el.tags?.name ||
        el.tags?.["name:en"] ||
        el.tags?.operator ||
        el.tags?.brand ||
        "Unknown";
      const address = [
        el.tags?.["addr:housenumber"],
        el.tags?.["addr:street"],
        el.tags?.["addr:city"],
      ]
        .filter(Boolean)
        .join(", ");

      const placeLat = parseFloat(latEl);
      const placeLng = parseFloat(lonEl);
      const distance =
        userLat && userLng
          ? haversineKm(userLat, userLng, placeLat, placeLng)
          : undefined;

      return {
        placeId: `osm:${el.type}/${el.id}`,
        name,
        address: address || el.tags?.["addr:full"] || "",
        location: { lat: placeLat, lng: placeLng },
        rating: 0,
        totalRatings: 0,
        priceLevel: undefined,
        types: el.tags ? Object.keys(el.tags).slice(0, 3) : [],
        openNow: el.tags?.opening_hours ? null : null,
        photo: null,
        icon: null,
        businessStatus: "OPERATIONAL",
        distance,
      } as Place;
    });
}

/* ═══════════════════════════════════════════════════════
   Nominatim fallback search
═══════════════════════════════════════════════════════ */
async function nominatimSearch(
  fullQuery: string,
  userLat?: number,
  userLng?: number,
): Promise<Place[]> {
  let url = `https://nominatim.openstreetmap.org/search?format=json&limit=20&addressdetails=1&extratags=1&namedetails=1&q=${encodeURIComponent(fullQuery)}`;
  if (userLat && userLng) {
    url += `&lat=${userLat}&lon=${userLng}`;
  }

  const res = await fetch(url, {
    headers: {
      "User-Agent": "local-business-discovery-portal/1.0 (student demo)",
    },
  });
  const data = await res.json();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data || []).map((p: any) => {
    const placeLat = parseFloat(p.lat);
    const placeLng = parseFloat(p.lon);
    const distance =
      userLat && userLng
        ? haversineKm(userLat, userLng, placeLat, placeLng)
        : undefined;

    return {
      placeId: String(p.place_id),
      name:
        (p.namedetails?.name || p.namedetails?.["name:en"]) ||
        p.display_name.split(",")[0],
      address: p.display_name || "",
      location: { lat: placeLat, lng: placeLng },
      rating: 0,
      totalRatings: 0,
      priceLevel: undefined,
      types: [p.class, p.type].filter(Boolean),
      openNow: null,
      photo: null,
      icon: null,
      businessStatus: "",
      distance,
    } as Place;
  });
}

/* ═══════════════════════════════════════════════════════
   MAIN HANDLER
   GET /api/places/search?q=&lat=&lng=&radius=&minRating=&category=&page=&limit=
═══════════════════════════════════════════════════════ */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawQuery = searchParams.get("q")?.trim() || "";
    const userLatStr = searchParams.get("lat");
    const userLngStr = searchParams.get("lng");
    const radius = parseInt(searchParams.get("radius") || "5000", 10);
    const minRating = parseFloat(searchParams.get("minRating") || "0");
    const categoryFilter = searchParams.get("category")?.toLowerCase() || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get("limit") || "20", 10)),
    );

    if (!rawQuery) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 },
      );
    }

    const userLat = userLatStr ? parseFloat(userLatStr) : undefined;
    const userLng = userLngStr ? parseFloat(userLngStr) : undefined;

    // ── 1. Parse query into keyword + location ──────────────
    const parsed = parseSearchQuery(rawQuery);

    // ── 2. Resolve coordinates ──────────────────────────────
    let searchLat = userLat;
    let searchLng = userLng;

    // If the query contains a location name, geocode it
    const locationName = parsed.location || "";
    if (locationName && (!userLat || !userLng)) {
      const geo = await geocodeLocation(locationName);
      if (geo) {
        searchLat = geo.lat;
        searchLng = geo.lng;
      }
    } else if (!userLat && !userLng && !locationName) {
      // No location at all — still try Nominatim with just keyword
    }

    // ── 3. Resolve POI tags from keyword ──────────────────
    const poiTags =
      parsed.poiTags.length > 0
        ? parsed.poiTags
        : resolvePoiTags(rawQuery);

    // ── 4. Fetch results ──────────────────────────────────
    let places: Place[] = [];

    if (searchLat && searchLng && poiTags.length > 0) {
      // Best path: Overpass API for nearby POI
      try {
        places = await overpassSearch(
          poiTags,
          searchLat,
          searchLng,
          radius,
          userLat,
          userLng,
        );
      } catch (e) {
        console.error("Overpass error:", e);
      }
    }

    // Fallback to Nominatim if Overpass returned nothing or no coords
    if (places.length === 0) {
      const nominatimQuery = locationName
        ? `${parsed.keyword} in ${locationName}`
        : rawQuery;
      try {
        places = await nominatimSearch(nominatimQuery, userLat, userLng);
      } catch (e) {
        console.error("Nominatim error:", e);
      }
    }

    // ── 5. Apply filters ──────────────────────────────────
    if (minRating > 0) {
      places = places.filter((p) => p.rating >= minRating);
    }
    if (categoryFilter) {
      places = places.filter(
        (p) =>
          p.types.some((t) => t.toLowerCase().includes(categoryFilter)) ||
          p.name.toLowerCase().includes(categoryFilter),
      );
    }

    // ── 6. Sort by distance if available ──────────────────
    if (userLat && userLng) {
      places.sort((a, b) => (a.distance ?? 999) - (b.distance ?? 999));
    }

    // ── 7. Remove duplicates (same name + approximate location) ──
    const seen = new Set<string>();
    places = places.filter((p) => {
      const key = `${p.name.toLowerCase()}:${Math.round(p.location.lat * 1000)}:${Math.round(p.location.lng * 1000)}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // ── 8. Paginate ───────────────────────────────────────
    const total = places.length;
    const paginated = places.slice((page - 1) * limit, page * limit);

    return NextResponse.json({
      places: paginated,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      query: rawQuery,
      parsed: {
        keyword: parsed.keyword,
        location: locationName,
        nearMe: parsed.nearMe,
        resolvedCoords:
          searchLat && searchLng ? { lat: searchLat, lng: searchLng } : null,
      },
    });
  } catch (err: unknown) {
    console.error("Places search error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
