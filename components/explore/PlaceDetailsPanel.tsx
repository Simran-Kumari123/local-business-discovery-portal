"use client";

import {
  X,
  Star,
  MapPin,
  Phone,
  Globe,
  Clock,
  Navigation,
  ExternalLink,
  Loader2,
  Route,
  Camera,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export interface PlaceDetails {
  placeId: string;
  name: string;
  address: string;
  phone: string;
  website: string;
  location: { lat: number; lng: number };
  rating: number;
  totalRatings: number;
  priceLevel?: number;
  types: string[];
  openNow: boolean | null;
  openingHours: string[];
  photos: string[];
  reviews: {
    author: string;
    rating: number;
    text: string;
    time: string;
    profilePhoto: string;
  }[];
  googleMapsUrl: string;
  businessStatus: string;
}

interface PlaceDetailsPanelProps {
  place: PlaceDetails | null;
  loading: boolean;
  onClose: () => void;
  onDirections: (location: { lat: number; lng: number }, placeId: string) => void;
}

/* ── Mini Map (Leaflet) showing exact place location ── */
function MiniMap({ location, name }: { location: { lat: number; lng: number }; name: string }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Ensure Leaflet CSS is loaded
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    (async () => {
      try {
        const mod = (globalThis as any).L || (await import("leaflet"));
        const L = (mod && (mod as any).default) || mod;

        const map = L.map(mapRef.current, {
          center: [location.lat, location.lng],
          zoom: 16,
          zoomControl: true,
          attributionControl: true,
          scrollWheelZoom: false, // don't hijack scroll in panel
        });

        // CartoDB Voyager tiles — premium look
        L.tileLayer(
          "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
          {
            attribution:
              '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: "abcd",
            maxZoom: 20,
          }
        ).addTo(map);

        // Custom coloured marker
        const svgIcon = L.divIcon({
          html: `<div style="
            background: linear-gradient(135deg, #10b981, #059669);
            width: 36px; height: 36px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 3px solid white;
            box-shadow: 0 4px 12px rgba(16,185,129,0.5);
            display:flex;align-items:center;justify-content:center;
          "><div style="transform:rotate(45deg);font-size:14px">📍</div></div>`,
          className: "",
          iconSize: [36, 36],
          iconAnchor: [18, 36],
          popupAnchor: [0, -38],
        });

        const marker = L.marker([location.lat, location.lng], { icon: svgIcon }).addTo(map);
        marker.bindPopup(
          `<strong style="font-family:sans-serif;font-size:13px">${name}</strong>`,
          { maxWidth: 200 }
        ).openPopup();

        mapInstanceRef.current = map;
      } catch (e) {
        console.error("MiniMap error:", e);
      }
    })();

    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch {}
        mapInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.lat, location.lng]);

  return (
    <div className="rounded-2xl overflow-hidden border border-border shadow-sm" style={{ height: "220px" }}>
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}

/* ── Photo with lazy loading & fallback ── */
function HeroImage({ place }: { place: PlaceDetails }) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(
    place.photos.length > 0 ? place.photos[0] : null
  );
  const [photoLoaded, setPhotoLoaded] = useState(false);
  const [photoError, setPhotoError] = useState(false);

  useEffect(() => {
    setPhotoUrl(place.photos.length > 0 ? place.photos[0] : null);
    setPhotoLoaded(false);
    setPhotoError(false);

    if (place.photos.length === 0) {
      const primaryType = place.types[0] || "amenity";
      const params = new URLSearchParams({ name: place.name, category: primaryType });
      fetch(`/api/places/photo?${params}`)
        .then((r) => r.json())
        .then((d) => { if (d.url) setPhotoUrl(d.url); })
        .catch(() => {});
    }
  }, [place.placeId, place.name, place.photos, place.types]);

  if (!photoUrl || photoError) {
    return (
      <div className="h-52 sm:h-64 flex items-center justify-center bg-linear-to-br from-emerald-500 to-teal-600 rounded-t-3xl">
        <div className="text-center text-white">
          <Camera className="w-12 h-12 mx-auto mb-2 opacity-60" />
          <p className="text-sm font-semibold opacity-80">No photo available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-52 sm:h-64 overflow-hidden rounded-t-3xl">
      {!photoLoaded && (
        <div className="absolute inset-0 bg-linear-to-br from-emerald-500 via-teal-600 to-emerald-700 animate-pulse" />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photoUrl}
        alt={place.name}
        className={`w-full h-full object-cover transition-opacity duration-500 ${photoLoaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setPhotoLoaded(true)}
        onError={() => setPhotoError(true)}
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute bottom-4 left-5 right-14 text-white">
        <h2
          className="text-2xl font-bold mb-1.5 leading-tight drop-shadow"
          style={{ fontFamily: "var(--font-sora), sans-serif" }}
        >
          {place.name}
        </h2>
        <div className="flex items-center gap-3 text-sm flex-wrap">
          {place.rating > 0 && (
            <span className="flex items-center gap-1 bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <strong>{place.rating.toFixed(1)}</strong>
              <span className="text-white/80 text-xs">({place.totalRatings})</span>
            </span>
          )}
          {place.openNow !== null && (
            <span
              className={`px-2 py-0.5 text-xs font-bold rounded-full backdrop-blur-sm ${
                place.openNow
                  ? "bg-emerald-500/80 text-white"
                  : "bg-red-500/80 text-white"
              }`}
            >
              {place.openNow ? "● Open Now" : "● Closed"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Additional photos strip ── */
function PhotoStrip({ photos, name }: { photos: string[]; name: string }) {
  const additional = photos.slice(1);
  if (additional.length === 0) return null;

  return (
    <div>
      <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
        <Camera className="w-4 h-4 text-emerald-500" /> Photos
      </h4>
      <div className="flex gap-2.5 overflow-x-auto pb-2">
        {additional.map((photo, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={photo}
            alt={`${name} photo ${i + 2}`}
            loading="lazy"
            className="w-28 h-28 object-cover rounded-xl shrink-0 hover:opacity-90 hover:scale-105 transition-all cursor-pointer shadow-sm"
          />
        ))}
      </div>
    </div>
  );
}

/* ── Main Panel ── */
export function PlaceDetailsPanel({
  place,
  loading,
  onClose,
  onDirections,
}: PlaceDetailsPanelProps) {
  if (!loading && !place) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      id="place-details-backdrop"
    >
      <div
        className="bg-card w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl relative"
        style={{ animation: "panelSlideUp 0.28s cubic-bezier(0.34,1.56,0.64,1)" }}
        onClick={(e) => e.stopPropagation()}
        id="place-details-panel"
      >
        {/* Close button — always visible */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 bg-black/50 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors z-20"
          id="place-details-close"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-28 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
            <p className="text-sm text-muted-foreground font-medium">Loading details…</p>
          </div>
        ) : (
          place && (
            <>
              {/* Hero image */}
              <HeroImage place={place} />

              <div className="p-5 sm:p-6 space-y-5">
                {/* Show title if no hero image */}
                {place.photos.length === 0 && (
                  <div className="pt-2">
                    <h2
                      className="text-2xl font-bold text-foreground"
                      style={{ fontFamily: "var(--font-sora), sans-serif" }}
                    >
                      {place.name}
                    </h2>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      {place.rating > 0 && (
                        <div className="flex items-center gap-1.5">
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-4 h-4 ${s <= Math.round(place.rating) ? "fill-amber-400 text-amber-400" : "fill-none text-gray-300"}`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-bold">{place.rating.toFixed(1)}</span>
                          <span className="text-xs text-muted-foreground">({place.totalRatings})</span>
                        </div>
                      )}
                      {place.openNow !== null && (
                        <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${place.openNow ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700" : "bg-red-100 dark:bg-red-900/30 text-red-600"}`}>
                          {place.openNow ? "Open Now" : "Closed"}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* CTA buttons */}
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => onDirections(place.location, place.placeId)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-[1.02] shadow-md"
                    id="place-details-directions-btn"
                  >
                    <Route className="w-4 h-4" /> Get Directions
                  </button>
                  {place.phone && (
                    <a
                      href={`tel:${place.phone}`}
                      className="flex items-center gap-2 px-4 py-2.5 border-2 border-border text-foreground font-semibold rounded-xl hover:bg-accent transition-colors"
                    >
                      <Phone className="w-4 h-4 text-blue-500" /> {place.phone}
                    </a>
                  )}
                  {place.website && (
                    <a
                      href={place.website.startsWith("http") ? place.website : `https://${place.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2.5 border-2 border-border text-foreground font-semibold rounded-xl hover:bg-accent transition-colors"
                    >
                      <Globe className="w-4 h-4 text-purple-500" /> Website
                    </a>
                  )}
                  {place.googleMapsUrl && (
                    <a
                      href={place.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2.5 border-2 border-border text-foreground font-semibold rounded-xl hover:bg-accent transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 text-emerald-500" /> Google Maps
                    </a>
                  )}
                </div>

                {/* Address */}
                <div className="flex items-start gap-3 p-4 bg-secondary/60 rounded-xl border border-border">
                  <MapPin className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground">{place.address || "Address not available"}</p>
                </div>

                {/* ── Mini Map ── */}
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-500" /> Location on Map
                  </h4>
                  <MiniMap location={place.location} name={place.name} />
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Scroll on the map to zoom. Click marker for name.
                  </p>
                </div>

                {/* Opening hours */}
                {place.openingHours.length > 0 && (
                  <div className="p-4 bg-secondary/60 rounded-xl border border-border">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="w-4 h-4 text-orange-500" />
                      <span className="text-sm font-semibold text-foreground">Opening Hours</span>
                    </div>
                    <div className="space-y-1 pl-6">
                      {place.openingHours.map((hour, i) => (
                        <p key={i} className="text-xs text-muted-foreground">{hour}</p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Photo gallery */}
                <PhotoStrip photos={place.photos} name={place.name} />

                {/* Reviews */}
                {place.reviews.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-4">
                      💬 Reviews
                    </h4>
                    <div className="space-y-4">
                      {place.reviews.map((review, i) => (
                        <div key={i} className="bg-secondary/60 rounded-xl p-4 border border-border">
                          <div className="flex items-center gap-3 mb-2.5">
                            {review.profilePhoto ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={review.profilePhoto} alt={review.author} className="w-9 h-9 rounded-full object-cover" />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-linear-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
                                {review.author.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-semibold text-foreground">{review.author}</p>
                              <div className="flex items-center gap-1.5">
                                <div className="flex gap-0.5">
                                  {[1, 2, 3, 4, 5].map((s) => (
                                    <Star key={s} className={`w-3 h-3 ${s <= review.rating ? "fill-amber-400 text-amber-400" : "fill-none text-gray-300"}`} />
                                  ))}
                                </div>
                                <span className="text-[10px] text-muted-foreground">{review.time}</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">{review.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Directions CTA at bottom */}
                <div className="pt-2 border-t border-border flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    <Navigation className="w-3 h-3 inline mr-1" />
                    Tap directions to navigate via Google Maps
                  </p>
                  <button
                    onClick={() => onDirections(place.location, place.placeId)}
                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 transition-colors"
                  >
                    Open in Maps →
                  </button>
                </div>
              </div>
            </>
          )
        )}
      </div>

      <style jsx global>{`
        @keyframes panelSlideUp {
          from { transform: translateY(32px) scale(0.97); opacity: 0; }
          to   { transform: translateY(0)    scale(1);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}
