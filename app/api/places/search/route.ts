import { NextRequest, NextResponse } from "next/server";

// Search using OpenStreetMap / Nominatim
// Nominatim is a free geocoding/search service for OpenStreetMap.
// This endpoint maps Nominatim results into the app's place shape.
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim() || "";
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");

    const radius = parseInt(searchParams.get("radius") || "5000", 10);

    if (!query) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 },
      );
    }

    // If we have coordinates and the query looks like a POI category
    // prefer Overpass (amenity/tag search) for nearby business results.
    const qLower = query.toLowerCase();
    const poiKeywords: Record<string, string[]> = {
      restaurant: ["restaurant", "restaurants"],
      cafe: ["cafe", "cafes", "coffee"],
      hotel: ["hotel", "hotels"],
      gym: ["gym", "gyms", "fitness"],
      salon: ["salon", "spa", "hair"],
      bank: ["bank", "atm"],
      supermarket: ["supermarket", "grocery"],
      petrol: ["petrol", "gas", "fuel"],
      pharmacy: ["pharmacy", "chemist"],
      bar: ["bar", "pub"],
    };

    const matchedTypes: string[] = [];
    Object.entries(poiKeywords).forEach(([tag, words]) => {
      words.forEach((w) => {
        if (qLower.includes(w)) matchedTypes.push(tag);
      });
    });

    // Helper to map our simple tag to Overpass filters
    const tagFor = (t: string) => {
      switch (t) {
        case "restaurant":
          return "amenity=restaurant";
        case "cafe":
          return "amenity=cafe";
        case "hotel":
          return "tourism=hotel";
        case "gym":
          return "leisure=fitness_centre";
        case "salon":
          return "shop=beauty";
        case "bank":
          return "amenity=bank";
        case "supermarket":
          return "shop=supermarket";
        case "petrol":
          return "amenity=fuel";
        case "pharmacy":
          return "amenity=pharmacy";
        case "bar":
          return "amenity=bar";
        default:
          return "";
      }
    };

    if (lat && lng && matchedTypes.length > 0) {
      // Build Overpass Q to find nodes/ways/relations within radius
      const filters = matchedTypes.map((t) => tagFor(t)).filter(Boolean);
      let overpassQ =
        "[out:json][timeout:25];(" +
        filters
          .map(
            (f) =>
              `node["${f.split("=")[0]}"="${f.split("=")[1]}"](around:${radius},${lat},${lng});way["${f.split("=")[0]}"="${f.split("=")[1]}"](around:${radius},${lat},${lng});relation["${f.split("=")[0]}"="${f.split("=")[1]}"](around:${radius},${lat},${lng});`,
          )
          .join("") +
        ");out center 50;";

      try {
        const resp = await fetch("https://overpass-api.de/api/interpreter", {
          method: "POST",
          headers: {
            "Content-Type": "text/plain",
            "User-Agent": "local-business-discovery-portal/1.0 (student demo)",
          },
          body: overpassQ,
        });
        const ov = await resp.json();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const places = (ov.elements || []).map((el: any) => {
          const latEl = el.lat ?? el.center?.lat;
          const lonEl = el.lon ?? el.center?.lon;
          const name =
            (el.tags && (el.tags.name || el.tags["name:en"])) ||
            el.tags?.operator ||
            el.tags?.brand ||
            "";
          return {
            placeId: `${el.type}/${el.id}`,
            name: name || (el.tags && Object.values(el.tags)[0]) || "Unknown",
            address:
              (el.tags &&
                [el.tags["addr:street"], el.tags["addr:city"]]
                  .filter(Boolean)
                  .join(", ")) ||
              "",
            location: { lat: parseFloat(latEl), lng: parseFloat(lonEl) },
            rating: 0,
            totalRatings: 0,
            priceLevel: undefined,
            types: el.tags ? Object.keys(el.tags) : [],
            openNow: null,
            photo: null,
            icon: null,
            businessStatus: "",
            _raw: el,
          };
        });

        return NextResponse.json({ places, total: places.length, query });
      } catch (e) {
        console.error("Overpass error:", e);
        // fall through to Nominatim below
      }
    }

    // Build Nominatim search URL (fallback)
    let url = `https://nominatim.openstreetmap.org/search?format=json&limit=20&addressdetails=1&extratags=1&namedetails=1&q=${encodeURIComponent(query)}`;

    // If we have user coordinates, bias results by adding lat/lon (Nominatim will bias results)
    if (lat && lng) {
      url += `&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}`;
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent": "local-business-discovery-portal/1.0 (student demo)",
      },
    });
    const data = await response.json();

    // Transform Nominatim results into a simplified place structure
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const places = (data || []).map((p: any, index: number) => ({
      placeId: String(p.place_id),
      name:
        (p.namedetails && (p.namedetails.name || p.namedetails["name:en"])) ||
        p.display_name.split(",")[0],
      address: p.display_name || "",
      location: {
        lat: parseFloat(p.lat),
        lng: parseFloat(p.lon),
      },
      rating: 0,
      totalRatings: 0,
      priceLevel: undefined,
      types: p.class
        ? [p.class, p.type].filter(Boolean)
        : [p.type].filter(Boolean),
      openNow: null,
      photo: null,
      icon: null,
      businessStatus: "",
      _raw: p,
    }));

    return NextResponse.json({
      places,
      total: places.length,
      query,
    });
  } catch (err: unknown) {
    console.error("Places search error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
