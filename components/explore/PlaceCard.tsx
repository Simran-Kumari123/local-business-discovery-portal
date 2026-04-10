"use client";

import { MapPin, Star, Navigation, Eye, Clock } from "lucide-react";
import { useState, useEffect } from "react";

export interface Place {
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
  distance?: number;
}

interface PlaceCardProps {
  place: Place;
  index: number;
  isSelected: boolean;
  onSelect: (placeId: string) => void;
  onDirections: (location: { lat: number; lng: number }, placeId: string) => void;
}

/* ── Category display helpers ── */
const CATEGORY_META: Record<
  string,
  { label: string; emoji: string; gradient: string; bg: string }
> = {
  restaurant: {
    label: "Restaurant",
    emoji: "🍕",
    gradient: "from-orange-400 to-rose-500",
    bg: "bg-orange-50 dark:bg-orange-900/20",
  },
  cafe: {
    label: "Café",
    emoji: "☕",
    gradient: "from-amber-400 to-orange-500",
    bg: "bg-amber-50 dark:bg-amber-900/20",
  },
  bar: {
    label: "Bar",
    emoji: "🍺",
    gradient: "from-yellow-500 to-amber-600",
    bg: "bg-yellow-50 dark:bg-yellow-900/20",
  },
  fast_food: {
    label: "Fast Food",
    emoji: "🍔",
    gradient: "from-red-400 to-orange-500",
    bg: "bg-red-50 dark:bg-red-900/20",
  },
  hotel: {
    label: "Hotel",
    emoji: "🏨",
    gradient: "from-blue-400 to-indigo-500",
    bg: "bg-blue-50 dark:bg-blue-900/20",
  },
  gym: {
    label: "Gym",
    emoji: "🏋️",
    gradient: "from-violet-500 to-purple-600",
    bg: "bg-violet-50 dark:bg-violet-900/20",
  },
  fitness_centre: {
    label: "Gym",
    emoji: "🏋️",
    gradient: "from-violet-500 to-purple-600",
    bg: "bg-violet-50 dark:bg-violet-900/20",
  },
  beauty: {
    label: "Salon",
    emoji: "💇",
    gradient: "from-pink-400 to-rose-500",
    bg: "bg-pink-50 dark:bg-pink-900/20",
  },
  supermarket: {
    label: "Supermarket",
    emoji: "🛒",
    gradient: "from-emerald-400 to-teal-500",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
  },
  bank: {
    label: "Bank",
    emoji: "🏦",
    gradient: "from-slate-400 to-blue-500",
    bg: "bg-slate-50 dark:bg-slate-900/20",
  },
  fuel: {
    label: "Petrol",
    emoji: "⛽",
    gradient: "from-gray-500 to-slate-600",
    bg: "bg-gray-50 dark:bg-gray-900/20",
  },
  pharmacy: {
    label: "Pharmacy",
    emoji: "💊",
    gradient: "from-green-400 to-emerald-500",
    bg: "bg-green-50 dark:bg-green-900/20",
  },
  hospital: {
    label: "Hospital",
    emoji: "🏥",
    gradient: "from-red-400 to-pink-500",
    bg: "bg-red-50 dark:bg-red-900/20",
  },
  school: {
    label: "School",
    emoji: "🏫",
    gradient: "from-blue-400 to-sky-500",
    bg: "bg-blue-50 dark:bg-blue-900/20",
  },
  cinema: {
    label: "Cinema",
    emoji: "🎬",
    gradient: "from-purple-500 to-indigo-600",
    bg: "bg-purple-50 dark:bg-purple-900/20",
  },
  bakery: {
    label: "Bakery",
    emoji: "🥐",
    gradient: "from-amber-300 to-yellow-500",
    bg: "bg-amber-50 dark:bg-amber-900/20",
  },
  park: {
    label: "Park",
    emoji: "🌳",
    gradient: "from-green-400 to-emerald-600",
    bg: "bg-green-50 dark:bg-green-900/20",
  },
};

function getCategoryMeta(types: string[]) {
  for (const t of types) {
    const key = t.toLowerCase();
    if (CATEGORY_META[key]) return CATEGORY_META[key];
  }
  return {
    label: types[0]
      ? types[0].charAt(0).toUpperCase() + types[0].slice(1)
      : "Place",
    emoji: "📍",
    gradient: "from-emerald-400 to-teal-500",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
  };
}

function priceDisplay(level?: number): string {
  if (level === undefined || level === null) return "";
  return "₹".repeat(level + 1);
}

/* ── Lazy image loader — fetches from /api/places/photo ── */
function PlaceImage({
  place,
  meta,
}: {
  place: Place;
  meta: ReturnType<typeof getCategoryMeta>;
}) {
  const [imgUrl, setImgUrl] = useState<string | null>(place.photo);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (place.photo) {
      setImgUrl(place.photo);
      return;
    }
    // Fetch a photo for this place
    const primaryType = place.types[0] || "amenity";
    const params = new URLSearchParams({
      name: place.name,
      category: primaryType,
    });
    fetch(`/api/places/photo?${params}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.url) setImgUrl(d.url);
      })
      .catch(() => {});
  }, [place.placeId, place.name, place.photo, place.types]);

  if (imgUrl && !imgError) {
    return (
      <>
        {!imgLoaded && (
          <div
            className={`absolute inset-0 bg-linear-to-br ${meta.gradient} animate-pulse`}
          />
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgUrl}
          alt={place.name}
          loading="lazy"
          className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
        />
      </>
    );
  }

  // Gradient fallback
  return (
    <div
      className={`w-full h-full flex flex-col items-center justify-center bg-linear-to-br ${meta.gradient} gap-1`}
    >
      <span className="text-3xl drop-shadow">{meta.emoji}</span>
      <span className="text-[10px] text-white/90 font-semibold px-1 text-center leading-tight">
        {meta.label}
      </span>
    </div>
  );
}

export function PlaceCard({
  place,
  index,
  isSelected,
  onSelect,
  onDirections,
}: PlaceCardProps) {
  const meta = getCategoryMeta(place.types);

  return (
    <div
      id={`place-card-${place.placeId}`}
      onClick={() => onSelect(place.placeId)}
      className={`bg-card border rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group ${
        isSelected
          ? "border-emerald-500 shadow-emerald-100/60 dark:shadow-emerald-900/30 ring-2 ring-emerald-500/20 shadow-lg"
          : "border-border hover:border-emerald-300"
      }`}
    >
      <div className="flex">
        {/* Thumbnail */}
        <div className="w-36 sm:w-44 h-32 sm:h-36 shrink-0 relative overflow-hidden">
          <PlaceImage place={place} meta={meta} />

          {/* Index badge */}
          <span className="absolute top-2 left-2 w-7 h-7 bg-emerald-600 text-white text-xs font-bold rounded-lg flex items-center justify-center shadow-md z-10">
            {index + 1}
          </span>

          {/* Open/Closed badge */}
          {place.openNow !== null && (
            <span
              className={`absolute bottom-2 left-2 z-10 px-2 py-0.5 text-[9px] font-bold rounded-full shadow ${
                place.openNow
                  ? "bg-emerald-500 text-white"
                  : "bg-red-500 text-white"
              }`}
            >
              {place.openNow ? "● Open" : "● Closed"}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 p-4 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3
              className="font-bold text-[15px] text-foreground line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors"
              style={{ fontFamily: "var(--font-sora), sans-serif" }}
            >
              {place.name}
            </h3>
            <span
              className={`shrink-0 px-2 py-0.5 text-[10px] font-semibold rounded-full ${meta.bg} text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800`}
            >
              {meta.emoji} {meta.label}
            </span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-2">
            {place.rating > 0 ? (
              <div className="flex items-center gap-1">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3.5 h-3.5 ${
                        star <= Math.round(place.rating)
                          ? "fill-amber-400 text-amber-400"
                          : "fill-none text-gray-300 dark:text-gray-600"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-foreground">
                  {place.rating.toFixed(1)}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({place.totalRatings})
                </span>
              </div>
            ) : (
              <span className="text-xs text-muted-foreground/70 italic">
                No ratings yet
              </span>
            )}
            {priceDisplay(place.priceLevel) && (
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                {priceDisplay(place.priceLevel)}
              </span>
            )}
          </div>

          {/* Address */}
          <p className="text-xs text-muted-foreground line-clamp-1 mb-1.5 flex items-center gap-1">
            <MapPin className="w-3 h-3 shrink-0 text-emerald-500" />
            {place.address || "Address not available"}
          </p>

          {/* Distance */}
          {place.distance !== undefined && (
            <p className="text-xs text-blue-500 dark:text-blue-400 mb-3 flex items-center gap-1">
              <Clock className="w-3 h-3 shrink-0" />
              {place.distance < 1
                ? `${Math.round(place.distance * 1000)} m away`
                : `${place.distance.toFixed(1)} km away`}
            </p>
          )}
          {place.distance === undefined && <div className="mb-3" />}

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDirections(place.location, place.placeId);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
              id={`place-directions-${place.placeId}`}
            >
              <Navigation className="w-3 h-3" /> Directions
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect(place.placeId);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-accent transition-colors"
              id={`place-details-${place.placeId}`}
            >
              <Eye className="w-3 h-3" /> Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
