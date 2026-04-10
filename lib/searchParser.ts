/**
 * Smart Search Query Parser
 * Extracts intent, keywords, and location from a natural language query.
 *
 * Examples:
 *   "cafes in Ahmedabad"       → { keyword: "cafes", location: "Ahmedabad", nearMe: false }
 *   "gyms near Navrangpura"    → { keyword: "gyms", location: "Navrangpura", nearMe: false }
 *   "restaurants near me"      → { keyword: "restaurants", location: "", nearMe: true }
 *   "hotels"                   → { keyword: "hotels", location: "", nearMe: false }
 */

export interface ParsedQuery {
  keyword: string;
  location: string;
  nearMe: boolean;
  poiTags: string[];
}

const LOCATION_PREPOSITIONS = /\b(?:in|near|around|at|within|close to)\b/i;
const NEAR_ME_PATTERN = /\bnear\s+me\b/i;

/** OSM amenity/tag mappings for common POI types */
const POI_MAP: Record<string, string[]> = {
  restaurant: ["restaurant", "restaurants", "dining", "food"],
  cafe: ["cafe", "cafes", "coffee", "coffeeshop", "tea"],
  gym: ["gym", "gyms", "fitness", "workout", "exercise"],
  salon: ["salon", "salons", "spa", "beauty", "hair", "parlour", "parlor"],
  hospital: ["hospital", "hospitals", "clinic", "medical", "doctor"],
  bank: ["bank", "banks", "atm"],
  supermarket: ["supermarket", "grocery", "groceries", "market"],
  petrol: ["petrol", "gas", "fuel", "petrol pump", "gas station"],
  pharmacy: ["pharmacy", "chemist", "medicine", "drugstore"],
  bar: ["bar", "pub", "nightclub", "club"],
  hotel: ["hotel", "hotels", "lodge", "stay", "resort", "motel"],
  school: ["school", "schools", "college", "university", "education"],
  park: ["park", "garden", "playground", "recreation"],
  cinema: ["cinema", "movie", "theater", "theatre", "multiplex"],
  bakery: ["bakery", "bakeries", "bread", "pastry"],
};

export function resolvePoiTags(keyword: string): string[] {
  const lower = keyword.toLowerCase();
  const tags: string[] = [];
  for (const [tag, words] of Object.entries(POI_MAP)) {
    if (words.some((w) => lower.includes(w))) {
      tags.push(tag);
    }
  }
  return tags;
}

export function parseSearchQuery(raw: string): ParsedQuery {
  let text = raw.trim();

  // Check "near me"
  const nearMe = NEAR_ME_PATTERN.test(text);
  if (nearMe) {
    text = text.replace(NEAR_ME_PATTERN, "").trim();
  }

  // Split on prepositions: "cafes in Ahmedabad" → ["cafes", "Ahmedabad"]
  const splitMatch = text.split(LOCATION_PREPOSITIONS);
  let keyword = text;
  let location = "";

  if (splitMatch.length >= 2) {
    keyword = splitMatch[0].trim();
    location = splitMatch.slice(1).join(" ").trim();
  }

  const poiTags = resolvePoiTags(keyword || text);

  return { keyword, location, nearMe, poiTags };
}

/** Build a combined query string for Nominatim / display */
export function buildDisplayQuery(parsed: ParsedQuery): string {
  if (parsed.nearMe) return `${parsed.keyword} near me`;
  if (parsed.location) return `${parsed.keyword} in ${parsed.location}`;
  return parsed.keyword;
}
