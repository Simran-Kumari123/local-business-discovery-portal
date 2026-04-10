import { NextRequest, NextResponse } from "next/server";

// GET /api/places/photo?name=Rajvadu+Restaurant&category=restaurant&lat=23.02&lng=72.57
// Returns a photo URL by searching:
// 1. Wikimedia Commons API (best - real photos of named places)
// 2. Wikipedia page image
// 3. Loremflickr category image (free, no key, relevant)
// 4. Unsplash category fallback

const CATEGORY_UNSPLASH: Record<string, string> = {
  restaurant: "restaurant,food,dining",
  cafe: "cafe,coffee,coffeeshop",
  hotel: "hotel,resort,lobby",
  gym: "gym,fitness,workout",
  salon: "salon,beauty,hairdresser",
  bank: "bank,finance,building",
  supermarket: "supermarket,grocery,market",
  petrol: "petrol,gas-station,fuel",
  pharmacy: "pharmacy,medicine,drugstore",
  hospital: "hospital,medical,clinic",
  school: "school,education,classroom",
  park: "park,garden,nature",
  cinema: "cinema,movie,theater",
  bakery: "bakery,bread,pastry",
  bar: "bar,pub,nightlife",
  food: "food,restaurant,meal",
  amenity: "building,city,urban",
  place: "city,urban,building",
};

async function getWikimediaImage(name: string): Promise<string | null> {
  try {
    // Search for the place on Wikipedia
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(name)}&srlimit=1&format=json&origin=*`;
    const searchRes = await fetch(searchUrl, {
      headers: { "User-Agent": "local-business-discovery-portal/1.0" },
      signal: AbortSignal.timeout(2000),
    });
    const searchData = await searchRes.json();
    const pageId = searchData?.query?.search?.[0]?.pageid;
    if (!pageId) return null;

    // Get the page image
    const imgUrl = `https://en.wikipedia.org/w/api.php?action=query&pageids=${pageId}&prop=pageimages&pithumbsize=600&format=json&origin=*`;
    const imgRes = await fetch(imgUrl, {
      headers: { "User-Agent": "local-business-discovery-portal/1.0" },
      signal: AbortSignal.timeout(2000),
    });
    const imgData = await imgRes.json();
    const page = imgData?.query?.pages?.[pageId];
    return page?.thumbnail?.source || null;
  } catch {
    return null;
  }
}

function getCategoryPhoto(category: string, seed?: string): string {
  const terms = CATEGORY_UNSPLASH[category?.toLowerCase()] || CATEGORY_UNSPLASH.amenity;
  const firstTerm = terms.split(",")[0];
  // loremflickr — free, no key, returns relevant category images
  const seedNum = seed
    ? Math.abs(seed.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) % 1000
    : Math.floor(Math.random() * 1000);
  return `https://loremflickr.com/640/400/${encodeURIComponent(firstTerm)}?lock=${seedNum}`;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name") || "";
  const category = searchParams.get("category") || "amenity";

  // For well-known places — try Wikipedia first
  // Only do this for places with meaningful proper names (not "Unknown Place")
  if (name && name.length > 3 && name !== "Unknown Place" && name !== "Unknown") {
    const wikiPhoto = await getWikimediaImage(name);
    if (wikiPhoto) {
      return NextResponse.json({ url: wikiPhoto, source: "wikipedia" });
    }
  }

  // Fallback: category-based image from Loremflickr
  const url = getCategoryPhoto(category, name);
  return NextResponse.json({ url, source: "loremflickr" });
}
