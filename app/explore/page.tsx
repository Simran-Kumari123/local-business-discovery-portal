"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  Navigation,
  Star,
  Loader2,
  Phone,
  Clock,
  ExternalLink,
  X,
  Locate,
  Globe,
  Map as MapIcon,
  List,
  Sparkles,
  Route,
  Eye,
} from "lucide-react";
import { Suspense } from "react";

/* ═══════════════════════════════════════════════════════
   TYPES
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
  icon: string;
  businessStatus: string;
}

interface PlaceDetails {
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

/* ═══════════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════════ */
const quickSearches = [
  { label: "🍕 Restaurants", query: "restaurants" },
  { label: "☕ Cafés", query: "cafes" },
  { label: "🏋️ Gyms", query: "gym fitness" },
  { label: "💇 Salons", query: "salon spa" },
  { label: "🏥 Hospitals", query: "hospitals" },
  { label: "🏦 Banks", query: "banks atm" },
  { label: "⛽ Petrol Pumps", query: "petrol pump gas station" },
  { label: "🛒 Supermarkets", query: "supermarket grocery" },
];

const GOOGLE_MAPS_SCRIPT_ID = "google-maps-script";

/* ═══════════════════════════════════════════════════════
   HELPER — Load Google Maps Script
═══════════════════════════════════════════════════════ */
function loadGoogleMapsScript(apiKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject("No window");
    if (
      (window as unknown as Record<string, unknown>).google &&
      (window as unknown as Record<string, Record<string, unknown>>).google.maps
    ) {
      resolve();
      return;
    }
    if (document.getElementById(GOOGLE_MAPS_SCRIPT_ID)) {
      // Script already added, just wait for it
      const existingScript = document.getElementById(
        GOOGLE_MAPS_SCRIPT_ID,
      ) as HTMLScriptElement;
      existingScript.addEventListener("load", () => resolve());
      existingScript.addEventListener("error", () =>
        reject("Failed to load Google Maps"),
      );
      return;
    }
    const script = document.createElement("script");
    script.id = GOOGLE_MAPS_SCRIPT_ID;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,marker&v=weekly`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject("Failed to load Google Maps SDK");
    document.head.appendChild(script);
  });
}

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════ */
function ExploreContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // State
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [locationQuery, setLocationQuery] = useState(
    searchParams.get("location") || "",
  );
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [locating, setLocating] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<PlaceDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"split" | "list" | "map">("split");
  const [mapLoaded, setMapLoaded] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [tileUrl, setTileUrl] = useState("");
  const [tileAttribution, setTileAttribution] = useState("");
  const [provider, setProvider] = useState<"google" | "osm" | "">("");
  const [hasSearched, setHasSearched] = useState(false);

  // Refs
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<any>(null);
  const leafletMapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const userMarkerRef = useRef<any>(null);
  const infoWindowRef = useRef<any>(null);

  // Get the map config on mount (Google API key or OSM tile URL)
  useEffect(() => {
    fetch("/api/places/config")
      .then((res) => res.json())
      .then((data) => {
        if (data.apiKey) setApiKey(data.apiKey);
        if (data.tileUrl) setTileUrl(data.tileUrl);
        if (data.tileAttribution) setTileAttribution(data.tileAttribution);
        if (data.provider) setProvider(data.provider);
      })
      .catch(() => console.error("Failed to load maps config"));
  }, []);

  // Load the appropriate map SDK depending on provider
  useEffect(() => {
    if (provider === "google" && apiKey) {
      loadGoogleMapsScript(apiKey)
        .then(() => setMapLoaded(true))
        .catch((err) => console.error("Maps load error:", err));
    } else if (provider === "osm") {
      // load Leaflet css and mark map as ready
      // add Leaflet CSS
      if (
        typeof document !== "undefined" &&
        !document.getElementById("leaflet-css")
      ) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }
      setMapLoaded(true);
    }
  }, [provider, apiKey]);

  // Initialize map (Google Maps or Leaflet depending on provider)
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    const defaultCenter = { lat: 23.0225, lng: 72.5714 }; // Ahmedabad default

    if (provider === "google") {
      if (googleMapRef.current) return;
      const map = new (window as any).google.maps.Map(mapRef.current, {
        center: userLocation || defaultCenter,
        zoom: 13,
        mapId: "explore_map",
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: true,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
      });

      googleMapRef.current = map;
      infoWindowRef.current = new (window as any).google.maps.InfoWindow();

      if (userLocation) {
        addUserLocationMarker(map, userLocation);
      }
    } else if (provider === "osm") {
      if (leafletMapRef.current) return; // Dynamically load Leaflet
      (async () => {
        try {
          const mod = (globalThis as any).L || (await import("leaflet"));
          const L = (mod && (mod as any).default) || mod;

          const map = L.map(mapRef.current).setView(
            [
              userLocation?.lat || defaultCenter.lat,
              userLocation?.lng || defaultCenter.lng,
            ],
            13,
          );
          L.tileLayer(
            tileUrl || "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
              attribution: tileAttribution || "© OpenStreetMap contributors",
            },
          ).addTo(map);

          leafletMapRef.current = map;

          if (userLocation) addUserLocationMarker(map, userLocation);
        } catch (e) {
          console.error("Failed to load Leaflet:", e);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapLoaded, provider]);

  // Update markers when places change
  useEffect(() => {
    if (!mapLoaded) return;
    if (provider === "google" && googleMapRef.current) updateMapMarkers(places);
    if (provider === "osm" && leafletMapRef.current) updateMapMarkers(places);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [places, mapLoaded, provider]);

  // Auto-search on page load if we have a query
  useEffect(() => {
    const q = searchParams.get("q");
    const loc = searchParams.get("location");
    if (q) {
      setQuery(q);
      if (loc) setLocationQuery(loc);
      searchPlaces(q, loc || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ═══ Add user location marker (Google) ═══ */
  const addUserLocationMarker = (
    map: any,
    loc: { lat: number; lng: number },
  ) => {
    if (userMarkerRef.current) {
      try {
        userMarkerRef.current.map = null;
      } catch {}
    }

    if (provider === "google" && (window as any).google) {
      const pin = document.createElement("div");
      pin.innerHTML = `
                <div style="position:relative;width:24px;height:24px;">
                    <div style="width:24px;height:24px;background:#4285F4;border:3px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>
                    <div style="position:absolute;top:-2px;left:-2px;width:28px;height:28px;border:2px solid rgba(66,133,244,0.3);border-radius:50%;animation:pulse 2s infinite;"></div>
                </div>
            `;

      const marker = new (
        window as any
      ).google.maps.marker.AdvancedMarkerElement({
        map,
        position: loc,
        content: pin,
        title: "Your Location",
      });

      userMarkerRef.current = marker;
      return;
    }

    // Leaflet fallback
    if (provider === "osm" && leafletMapRef.current) {
      (async () => {
        try {
          const mod = (globalThis as any).L || (await import("leaflet"));
          const L = (mod && (mod as any).default) || mod;
          if (userMarkerRef.current) {
            try {
              leafletMapRef.current.removeLayer(userMarkerRef.current);
            } catch {}
          }
          const marker = L.circleMarker([loc.lat, loc.lng], {
            radius: 8,
            color: "#4285F4",
            fillColor: "#4285F4",
            fillOpacity: 1,
          }).addTo(leafletMapRef.current);
          userMarkerRef.current = marker;
        } catch (e) {
          console.error("Failed to create Leaflet user marker:", e);
        }
      })();
    }
  };

  /* ═══ Update map markers (handles Google + Leaflet) ═══ */
  const updateMapMarkers = (placesToShow: Place[]) => {
    if (provider === "google") {
      const map = googleMapRef.current;
      if (!map) return;

      // Clear old markers
      markersRef.current.forEach((m: any) => {
        try {
          m.map = null;
        } catch {}
      });
      markersRef.current = [];

      if (placesToShow.length === 0) return;

      const bounds = new (window as any).google.maps.LatLngBounds();

      placesToShow.forEach((place, index) => {
        if (!place.location?.lat || !place.location?.lng) return;

        const pin = document.createElement("div");
        pin.innerHTML = `
                    <div style="background:white;border-radius:8px;padding:4px 8px;box-shadow:0 2px 8px rgba(0,0,0,0.15);border:2px solid ${place.openNow === false ? "#EF4444" : "#10B981"};cursor:pointer;white-space:nowrap;font-size:12px;font-weight:600;display:flex;align-items:center;gap:4px;transition:transform 0.15s;">
                        <span style="font-size:14px;">${index + 1}</span>
                        <span style="max-width:120px;overflow:hidden;text-overflow:ellipsis;">${place.name}</span>
                        ${place.rating ? `<span style="color:#F59E0B;">★${place.rating}</span>` : ""}
                    </div>
                `;

        const marker = new (
          window as any
        ).google.maps.marker.AdvancedMarkerElement({
          map,
          position: place.location,
          content: pin,
          title: place.name,
        });

        marker.addListener("click", () => {
          fetchPlaceDetails(place.placeId);
          map.panTo(place.location);
        });

        markersRef.current.push(marker);
        bounds.extend(place.location);
      });

      if (userLocation) bounds.extend(userLocation);
      map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
      return;
    }

    // Leaflet path
    if (provider === "osm" && leafletMapRef.current) {
      (async () => {
        try {
          const mod = (globalThis as any).L || (await import("leaflet"));
          const L = (mod && (mod as any).default) || mod;
          const map = leafletMapRef.current;

          // Remove old markers
          markersRef.current.forEach((m: any) => {
            try {
              map.removeLayer(m);
            } catch {}
          });
          markersRef.current = [];

          if (placesToShow.length === 0) return;

          const group: any[] = [];
          placesToShow.forEach((place, index) => {
            if (!place.location?.lat || !place.location?.lng) return;
            const m = L.marker([place.location.lat, place.location.lng]).addTo(
              map,
            );
            m.bindTooltip(`${index + 1}. ${place.name}`, { direction: "top" });
            m.on("click", () => {
              fetchPlaceDetails(place.placeId);
              map.panTo([place.location.lat, place.location.lng]);
            });
            markersRef.current.push(m);
            group.push([place.location.lat, place.location.lng]);
          });

          if (userLocation) group.push([userLocation.lat, userLocation.lng]);
          if (group.length > 0) {
            try {
              map.fitBounds(group as any, { padding: [50, 50] });
            } catch {}
          }
        } catch (e) {
          console.error("Failed to update Leaflet markers:", e);
        }
      })();
    }
  };

  /* ═══ Get user's current location ═══ */
  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(loc);
        setLocating(false);
        setLocationQuery("📍 Current Location");

        if (provider === "google" && googleMapRef.current) {
          googleMapRef.current.panTo(loc);
          googleMapRef.current.setZoom(14);
          addUserLocationMarker(googleMapRef.current, loc);
        } else if (provider === "osm" && leafletMapRef.current) {
          try {
            leafletMapRef.current.panTo([loc.lat, loc.lng]);
            leafletMapRef.current.setZoom(14);
          } catch {}
          addUserLocationMarker(leafletMapRef.current, loc);
        }
      },
      (error) => {
        setLocating(false);
        console.error("Geolocation error:", error);
        alert("Unable to get your location. Please enter a location manually.");
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ═══ Search places ═══ */
  const searchPlaces = async (searchQuery?: string, location?: string) => {
    const q = searchQuery ?? query;
    const loc = location ?? locationQuery;

    if (!q.trim()) return;

    setLoading(true);
    setSelectedPlace(null);
    setHasSearched(true);

    try {
      const params = new URLSearchParams();

      // Build a combined search query
      let fullQuery = q;
      if (loc && loc !== "📍 Current Location") {
        fullQuery = `${q} in ${loc}`;
      } else if (loc === "📍 Current Location" || !loc) {
        fullQuery = `${q} near me`;
      }
      params.set("q", fullQuery);

      // Add coordinates if available
      if (userLocation) {
        params.set("lat", userLocation.lat.toString());
        params.set("lng", userLocation.lng.toString());
      }

      const response = await fetch(`/api/places/search?${params.toString()}`);
      const data = await response.json();

      if (data.error) {
        console.error("Search error:", data.error);
        setPlaces([]);
      } else {
        setPlaces(data.places || []);
      }

      // Update URL
      const urlParams = new URLSearchParams();
      urlParams.set("q", q);
      if (loc) urlParams.set("location", loc);
      router.replace(`/explore?${urlParams.toString()}`, { scroll: false });
    } catch (err) {
      console.error("Search failed:", err);
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  };

  /* ═══ Fetch place details ═══ */
  const fetchPlaceDetails = async (placeId: string) => {
    setDetailsLoading(true);
    try {
      const response = await fetch(`/api/places/details?placeId=${placeId}`);
      const data = await response.json();
      if (!data.error) {
        setSelectedPlace(data);
      }
    } catch (err) {
      console.error("Failed to fetch details:", err);
    } finally {
      setDetailsLoading(false);
    }
  };

  /* ═══ Get directions ═══ */
  const getDirections = (
    destination: { lat: number; lng: number },
    destName: string,
  ) => {
    let url = `https://www.google.com/maps/dir/?api=1&destination=${destination.lat},${destination.lng}&destination_place_id=${destName}`;
    if (userLocation) {
      url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${destination.lat},${destination.lng}`;
    }
    window.open(url, "_blank");
  };

  /* ═══ Handle search form submit ═══ */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchPlaces();
  };

  /* ═══ Quick search ═══ */
  const handleQuickSearch = (q: string) => {
    setQuery(q);
    searchPlaces(q);
  };

  /* ═══ Price level display ═══ */
  const priceDisplay = (level?: number) => {
    if (level === undefined || level === null) return null;
    return "₹".repeat(level + 1);
  };

  /* ══════════════════════════════
        RENDER
    ══════════════════════════════ */
  return (
    <div className="min-h-screen bg-secondary/30">
      {/* ═══════════════════════════════════════
                SEARCH HEADER
            ═══════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-linear-to-br from-emerald-700 via-emerald-600 to-teal-500 dark:from-emerald-950 dark:via-emerald-900 dark:to-teal-900">
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.12] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute -top-48 -left-48 w-[420px] h-[420px] bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <div className="text-center text-white mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>
                {provider === "google"
                  ? "Powered by Google Maps"
                  : provider === "osm"
                    ? "Powered by OpenStreetMap"
                    : "Map Provider"}
              </span>
            </div>
            <h1
              className="font-extrabold text-3xl md:text-4xl lg:text-5xl tracking-tight mb-3"
              style={{ fontFamily: "var(--font-sora), sans-serif" }}
            >
              Explore Real Businesses Near You
            </h1>
            <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
              Search any business type + location — see real results on the map
              with directions.
            </p>
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
            <div className="bg-card rounded-2xl p-1.5 shadow-2xl shadow-emerald-900/40">
              <div className="flex flex-col sm:flex-row items-stretch gap-2">
                {/* What */}
                <div className="flex-1 flex items-center gap-3 px-4 border-b sm:border-b-0 sm:border-r border-border pb-2 sm:pb-0">
                  <Search className="text-muted-foreground w-5 h-5 shrink-0" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="What are you looking for? (restaurants, gyms...)"
                    className="w-full py-3 bg-transparent text-foreground placeholder-muted-foreground focus:outline-none text-base"
                    id="explore-search-input"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Where */}
                <div className="flex-1 flex items-center gap-3 px-4">
                  <MapPin className="text-muted-foreground w-5 h-5 shrink-0" />
                  <input
                    type="text"
                    value={locationQuery}
                    onChange={(e) => {
                      setLocationQuery(e.target.value);
                      if (e.target.value !== "📍 Current Location") {
                        setUserLocation(null);
                      }
                    }}
                    placeholder="City or area (e.g., Ahmedabad)"
                    className="w-full py-3 bg-transparent text-foreground placeholder-muted-foreground focus:outline-none text-base"
                    id="explore-location-input"
                  />
                  <button
                    type="button"
                    onClick={getUserLocation}
                    disabled={locating}
                    className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 whitespace-nowrap transition-colors disabled:opacity-50"
                    title="Use my current location"
                  >
                    {locating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Locate className="w-4 h-4" />
                    )}
                    <span className="hidden sm:inline">Near Me</span>
                  </button>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-[1.03] whitespace-nowrap shadow-md disabled:opacity-70"
                  id="explore-search-submit"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Search className="w-5 h-5" />
                  )}
                  Search
                </button>
              </div>
            </div>
          </form>

          {/* Quick search tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
            <span className="text-emerald-200 text-xs font-medium">
              Quick search:
            </span>
            {quickSearches.map((qs) => (
              <button
                key={qs.query}
                onClick={() => handleQuickSearch(qs.query)}
                className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-150 ${
                  query === qs.query
                    ? "bg-white text-emerald-700"
                    : "bg-white/15 hover:bg-white/25 border border-white/25 text-white"
                }`}
              >
                {qs.label}
              </button>
            ))}
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            className="w-full"
          >
            <path
              d="M0 50V25C360 0 720 30 1080 15C1260 7 1380 5 1440 0V50H0Z"
              className="fill-secondary/30"
            />
          </svg>
        </div>
      </section>

      {/* ═══════════════════════════════════════
                RESULTS + MAP
            ═══════════════════════════════════════ */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">
              {loading ? (
                "Searching..."
              ) : hasSearched ? (
                <>
                  <span className="font-bold text-foreground">
                    {places.length}
                  </span>{" "}
                  place{places.length !== 1 && "s"} found
                  {query && (
                    <>
                      {" "}
                      for &ldquo;<span className="font-semibold">{query}</span>
                      &rdquo;
                    </>
                  )}
                </>
              ) : (
                "Search for businesses to see results"
              )}
            </p>
          </div>

          {/* View mode toggle */}
          <div className="hidden md:flex items-center gap-1 bg-card border border-border rounded-xl p-1">
            <button
              onClick={() => setViewMode("split")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                viewMode === "split"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Eye className="w-3.5 h-3.5" /> Split
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                viewMode === "list"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <List className="w-3.5 h-3.5" /> List
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                viewMode === "map"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" /> Map
            </button>
          </div>
        </div>

        <div className={`flex gap-6 ${viewMode === "map" ? "flex-col" : ""}`}>
          {/* ── RESULTS LIST ── */}
          {viewMode !== "map" && (
            <div
              className={`${viewMode === "split" ? "w-1/2" : "flex-1"} space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto pr-2`}
            >
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="w-10 h-10 animate-spin text-emerald-500 mb-4" />
                  <p className="text-muted-foreground font-medium">
                    Searching real businesses...
                  </p>
                </div>
              ) : places.length > 0 ? (
                places.map((place, index) => (
                  <div
                    key={place.placeId}
                    onClick={() => fetchPlaceDetails(place.placeId)}
                    className={`bg-card border rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group ${
                      selectedPlace?.placeId === place.placeId
                        ? "border-emerald-500 shadow-emerald-100/50 dark:shadow-emerald-900/30 ring-2 ring-emerald-500/20"
                        : "border-border"
                    }`}
                    id={`place-card-${place.placeId}`}
                  >
                    <div className="flex">
                      {/* Image */}
                      <div className="w-32 sm:w-40 h-32 sm:h-36 shrink-0 relative overflow-hidden bg-secondary/50">
                        {place.photo ? (
                          <img
                            src={place.photo}
                            alt={place.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20">
                            <MapPin className="w-10 h-10 text-emerald-300 dark:text-emerald-700" />
                          </div>
                        )}
                        <span className="absolute top-2 left-2 w-7 h-7 bg-emerald-600 text-white text-xs font-bold rounded-lg flex items-center justify-center shadow-md">
                          {index + 1}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-4 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3
                            className="font-bold text-base text-foreground line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors"
                            style={{
                              fontFamily: "var(--font-sora), sans-serif",
                            }}
                          >
                            {place.name}
                          </h3>
                          {place.openNow !== null && (
                            <span
                              className={`shrink-0 px-2 py-0.5 text-[10px] font-bold rounded-full ${
                                place.openNow
                                  ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                                  : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                              }`}
                            >
                              {place.openNow ? "Open" : "Closed"}
                            </span>
                          )}
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-2">
                          {place.rating > 0 && (
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
                          )}
                          {priceDisplay(place.priceLevel) && (
                            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                              {priceDisplay(place.priceLevel)}
                            </span>
                          )}
                        </div>

                        {/* Address */}
                        <p className="text-xs text-muted-foreground line-clamp-1 mb-3">
                          <MapPin className="w-3 h-3 inline mr-1 text-emerald-500" />
                          {place.address}
                        </p>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              getDirections(place.location, place.placeId);
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
                          >
                            <Navigation className="w-3 h-3" /> Directions
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              fetchPlaceDetails(place.placeId);
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-accent transition-colors"
                          >
                            <Eye className="w-3 h-3" /> Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : hasSearched ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto bg-emerald-50 dark:bg-emerald-900/30 rounded-3xl flex items-center justify-center mb-6">
                    <Search className="w-10 h-10 text-emerald-400" />
                  </div>
                  <h2
                    className="text-xl font-bold text-foreground mb-2"
                    style={{ fontFamily: "var(--font-sora), sans-serif" }}
                  >
                    No places found
                  </h2>
                  <p className="text-muted-foreground text-sm max-w-md mx-auto">
                    Try searching with different keywords or adding a location
                    like &quot;Ahmedabad&quot;.
                  </p>
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto bg-emerald-50 dark:bg-emerald-900/30 rounded-3xl flex items-center justify-center mb-6">
                    <MapIcon className="w-10 h-10 text-emerald-400" />
                  </div>
                  <h2
                    className="text-xl font-bold text-foreground mb-2"
                    style={{ fontFamily: "var(--font-sora), sans-serif" }}
                  >
                    Search for businesses
                  </h2>
                  <p className="text-muted-foreground text-sm max-w-md mx-auto mb-4">
                    Try searching &quot;restaurants near me&quot; or &quot;gyms
                    in Ahmedabad&quot;
                  </p>
                  <button
                    onClick={getUserLocation}
                    disabled={locating}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-all duration-200 hover:scale-[1.03] shadow-md"
                  >
                    {locating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Locate className="w-4 h-4" />
                    )}
                    Use My Location
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── MAP ── */}
          {viewMode !== "list" && (
            <div
              className={`${viewMode === "split" ? "w-1/2" : "flex-1"} sticky top-24`}
            >
              <div
                className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm"
                style={{
                  height:
                    viewMode === "map"
                      ? "calc(100vh - 250px)"
                      : "calc(100vh - 200px)",
                }}
              >
                {provider === "osm" || (provider === "google" && apiKey) ? (
                  <div
                    ref={mapRef}
                    className="w-full h-full"
                    id="explore-google-map"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-secondary/50">
                    <div className="text-center p-8">
                      <MapIcon className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                      <p className="text-muted-foreground font-medium mb-2">
                        Map provider not configured
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Configure `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` or
                        `NEXT_PUBLIC_OSM_TILE_URL` in your .env
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── PLACE DETAILS PANEL (slide-up) ── */}
        {(selectedPlace || detailsLoading) && (
          <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={() => setSelectedPlace(null)}
          >
            <div
              className="bg-card w-full sm:max-w-2xl max-h-[85vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl animate-in slide-in-from-bottom-4 duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              {detailsLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                </div>
              ) : (
                selectedPlace && (
                  <>
                    {/* Header image carousel */}
                    {selectedPlace.photos.length > 0 && (
                      <div className="relative h-52 sm:h-64 overflow-hidden rounded-t-3xl sm:rounded-t-3xl">
                        <img
                          src={selectedPlace.photos[0]}
                          alt={selectedPlace.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-5 right-5 text-white">
                          <h2
                            className="text-2xl font-bold mb-1"
                            style={{
                              fontFamily: "var(--font-sora), sans-serif",
                            }}
                          >
                            {selectedPlace.name}
                          </h2>
                          <div className="flex items-center gap-3 text-sm">
                            {selectedPlace.rating > 0 && (
                              <span className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                <strong>
                                  {selectedPlace.rating.toFixed(1)}
                                </strong>
                                <span className="text-white/80">
                                  ({selectedPlace.totalRatings})
                                </span>
                              </span>
                            )}
                            {selectedPlace.openNow !== null && (
                              <span
                                className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                                  selectedPlace.openNow
                                    ? "bg-emerald-500/80 text-white"
                                    : "bg-red-500/80 text-white"
                                }`}
                              >
                                {selectedPlace.openNow
                                  ? "● Open Now"
                                  : "● Closed"}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {!selectedPlace.photos.length && (
                      <div className="pt-6 px-6 pb-2">
                        <h2
                          className="text-2xl font-bold text-foreground"
                          style={{ fontFamily: "var(--font-sora), sans-serif" }}
                        >
                          {selectedPlace.name}
                        </h2>
                      </div>
                    )}

                    {/* Close button */}
                    <button
                      onClick={() => setSelectedPlace(null)}
                      className="absolute top-4 right-4 w-8 h-8 bg-black/50 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div className="p-6 space-y-5">
                      {/* Action buttons */}
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() =>
                            getDirections(
                              selectedPlace.location,
                              selectedPlace.placeId,
                            )
                          }
                          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-[1.03] shadow-md"
                        >
                          <Route className="w-4 h-4" /> Get Directions
                        </button>
                        {selectedPlace.phone && (
                          <a
                            href={`tel:${selectedPlace.phone}`}
                            className="flex items-center gap-2 px-4 py-2.5 border-2 border-border text-foreground font-semibold rounded-xl hover:bg-accent transition-colors"
                          >
                            <Phone className="w-4 h-4 text-blue-500" />{" "}
                            {selectedPlace.phone}
                          </a>
                        )}
                        {selectedPlace.website && (
                          <a
                            href={selectedPlace.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2.5 border-2 border-border text-foreground font-semibold rounded-xl hover:bg-accent transition-colors"
                          >
                            <Globe className="w-4 h-4 text-purple-500" />{" "}
                            Website
                          </a>
                        )}
                        {selectedPlace.googleMapsUrl && (
                          <a
                            href={selectedPlace.googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2.5 border-2 border-border text-foreground font-semibold rounded-xl hover:bg-accent transition-colors"
                          >
                            <ExternalLink className="w-4 h-4 text-emerald-500" />{" "}
                            Google Maps
                          </a>
                        )}
                      </div>

                      {/* Address */}
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        <p className="text-sm text-foreground">
                          {selectedPlace.address}
                        </p>
                      </div>

                      {/* Opening hours */}
                      {selectedPlace.openingHours.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-4 h-4 text-orange-500" />
                            <span className="text-sm font-semibold text-foreground">
                              Opening Hours
                            </span>
                          </div>
                          <div className="grid grid-cols-1 gap-1 pl-6">
                            {selectedPlace.openingHours.map((hour, i) => (
                              <p
                                key={i}
                                className="text-xs text-muted-foreground"
                              >
                                {hour}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Photos */}
                      {selectedPlace.photos.length > 1 && (
                        <div>
                          <h4 className="text-sm font-semibold text-foreground mb-2">
                            Photos
                          </h4>
                          <div className="flex gap-2 overflow-x-auto pb-2">
                            {selectedPlace.photos.slice(1).map((photo, i) => (
                              <img
                                key={i}
                                src={photo}
                                alt={`${selectedPlace.name} photo ${i + 2}`}
                                className="w-28 h-28 object-cover rounded-xl shrink-0"
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Google Reviews */}
                      {selectedPlace.reviews.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-foreground mb-3">
                            Reviews from Google
                          </h4>
                          <div className="space-y-3">
                            {selectedPlace.reviews.map((review, i) => (
                              <div
                                key={i}
                                className="bg-secondary/50 rounded-xl p-4"
                              >
                                <div className="flex items-center gap-3 mb-2">
                                  {review.profilePhoto && (
                                    <img
                                      src={review.profilePhoto}
                                      alt={review.author}
                                      className="w-8 h-8 rounded-full"
                                    />
                                  )}
                                  <div>
                                    <p className="text-sm font-semibold text-foreground">
                                      {review.author}
                                    </p>
                                    <div className="flex items-center gap-1">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                          key={star}
                                          className={`w-3 h-3 ${
                                            star <= review.rating
                                              ? "fill-amber-400 text-amber-400"
                                              : "fill-none text-gray-300"
                                          }`}
                                        />
                                      ))}
                                      <span className="text-[10px] text-muted-foreground ml-1">
                                        {review.time}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                  {review.text}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )
              )}
            </div>
          </div>
        )}
      </section>

      {/* Mobile: Map / List toggle (floating) */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1 bg-card border border-border rounded-full p-1 shadow-xl">
        <button
          onClick={() => setViewMode(viewMode === "map" ? "list" : "map")}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-emerald-600 text-white rounded-full transition-all"
        >
          {viewMode === "map" ? (
            <>
              <List className="w-4 h-4" /> List
            </>
          ) : (
            <>
              <MapIcon className="w-4 h-4" /> Map
            </>
          )}
        </button>
      </div>

      {/* CSS for pulse animation */}
      <style jsx global>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.5;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   PAGE EXPORT
═══════════════════════════════════════════════════════ */
export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}
