"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Loader2,
  Map as MapIcon,
  List,
  Eye,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Globe,
} from "lucide-react";
import { Suspense } from "react";

// Components
import { SmartSearchBar } from "@/components/explore/SmartSearchBar";
import { PlaceCard, type Place } from "@/components/explore/PlaceCard";
import { PlaceDetailsPanel, type PlaceDetails } from "@/components/explore/PlaceDetailsPanel";
import { SearchFilters, type Filters } from "@/components/explore/SearchFilters";

/* ═══════════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════════ */
const QUICK_SEARCHES = [
  { label: "🍕 Restaurants", query: "restaurants" },
  { label: "☕ Cafés", query: "cafes" },
  { label: "🏋️ Gyms", query: "gyms" },
  { label: "💇 Salons", query: "salons" },
  { label: "🏥 Hospitals", query: "hospitals" },
  { label: "🏦 Banks", query: "banks" },
  { label: "⛽ Petrol", query: "petrol pumps" },
  { label: "🛒 Grocery", query: "supermarkets" },
];

const TRENDING = [
  { label: "Cafes near me", q: "cafes", loc: "" },
  { label: "Hospitals Ahmedabad", q: "hospitals", loc: "Ahmedabad" },
  { label: "Gyms in Surat", q: "gyms", loc: "Surat" },
  { label: "Hotels Jaipur", q: "hotels", loc: "Jaipur" },
];

const GOOGLE_MAPS_SCRIPT_ID = "google-maps-script";

function loadGoogleMapsScript(apiKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject("No window");
    if ((window as any).google?.maps) { resolve(); return; }
    if (document.getElementById(GOOGLE_MAPS_SCRIPT_ID)) {
      (document.getElementById(GOOGLE_MAPS_SCRIPT_ID) as HTMLScriptElement)
        .addEventListener("load", () => resolve());
      return;
    }
    const script = document.createElement("script");
    script.id = GOOGLE_MAPS_SCRIPT_ID;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,marker&v=weekly`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject("Failed to load Google Maps");
    document.head.appendChild(script);
  });
}

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════ */
function ExploreContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Search state
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [locationQuery, setLocationQuery] = useState(searchParams.get("location") || "");
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const PAGE_SIZE = 12;

  // Filters
  const [filters, setFilters] = useState<Filters>({
    minRating: 0,
    maxDistance: 0,
    category: "",
    openNow: false,
  });

  // User location
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);

  // Selected place detail
  const [selectedPlace, setSelectedPlace] = useState<PlaceDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // View mode
  const [viewMode, setViewMode] = useState<"split" | "list" | "map">("split");

  // Map state
  const [mapLoaded, setMapLoaded] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [tileUrl, setTileUrl] = useState("");
  const [tileAttribution, setTileAttribution] = useState("");
  const [provider, setProvider] = useState<"google" | "osm" | "">("");
  const [mapType, setMapType] = useState<"standard" | "satellite">("standard");

  // Map refs
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<any>(null);
  const leafletMapRef = useRef<any>(null);
  const leafletTileLayerRef = useRef<any>(null);
  const leafletLabelLayerRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const userMarkerRef = useRef<any>(null);

  /* ── Load map config ─ */
  useEffect(() => {
    fetch("/api/places/config")
      .then((r) => r.json())
      .then((d) => {
        if (d.apiKey) setApiKey(d.apiKey);
        if (d.tileUrl) setTileUrl(d.tileUrl);
        if (d.tileAttribution) setTileAttribution(d.tileAttribution);
        if (d.provider) setProvider(d.provider);
      })
      .catch(() => {});
  }, []);

  /* ── Load map SDK ─ */
  useEffect(() => {
    if (provider === "google" && apiKey) {
      loadGoogleMapsScript(apiKey)
        .then(() => setMapLoaded(true))
        .catch(console.error);
    } else if (provider === "osm") {
      if (typeof document !== "undefined" && !document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }
      setMapLoaded(true);
    }
  }, [provider, apiKey]);

  /* ── Init map ─ */
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    const center = userLocation || { lat: 23.0225, lng: 72.5714 };

    if (provider === "google") {
      if (googleMapRef.current) return;
      const map = new (window as any).google.maps.Map(mapRef.current, {
        center,
        zoom: 13,
        mapId: "explore_map",
        mapTypeId: mapType === "satellite" ? "hybrid" : "roadmap",
        streetViewControl: false,
        mapTypeControl: false,
      });
      googleMapRef.current = map;
      if (userLocation) addUserMarker(map, userLocation);
    } else if (provider === "osm") {
      if (leafletMapRef.current) return;
      (async () => {
        try {
          const mod = (globalThis as any).L || (await import("leaflet"));
          const L = (mod && (mod as any).default) || mod;
          const map = L.map(mapRef.current).setView([center.lat, center.lng], 13);
          
          const layerUrl = mapType === "satellite" 
            ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            : (tileUrl || "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png");
          
          const attribution = mapType === "satellite"
            ? "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EBP, and the GIS User Community"
            : (tileAttribution || '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>');

          const layer = L.tileLayer(layerUrl, {
            attribution,
            subdomains: "abcd",
            maxZoom: 20,
          }).addTo(map);
          
          leafletTileLayerRef.current = layer;

          if (mapType === "satellite") {
            leafletLabelLayerRef.current = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}", {
              maxZoom: 20,
            }).addTo(map);
          }

          leafletMapRef.current = map;
          if (userLocation) addUserMarker(map, userLocation);
        } catch (e) { console.error(e); }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapLoaded, provider]);

  /* ── Handle map type change ─ */
  useEffect(() => {
    if (!mapLoaded) return;
    if (provider === "google" && googleMapRef.current) {
      googleMapRef.current.setMapTypeId(mapType === "satellite" ? "hybrid" : "roadmap");
    } else if (provider === "osm" && leafletMapRef.current) {
      (async () => {
        const mod = (globalThis as any).L || (await import("leaflet"));
        const L = (mod && (mod as any).default) || mod;
        
        if (leafletTileLayerRef.current) {
          leafletMapRef.current.removeLayer(leafletTileLayerRef.current);
        }
        if (leafletLabelLayerRef.current) {
          leafletMapRef.current.removeLayer(leafletLabelLayerRef.current);
        }

        const layerUrl = mapType === "satellite" 
          ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          : (tileUrl || "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png");
        
        const attribution = mapType === "satellite"
          ? "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EBP, and the GIS User Community"
          : (tileAttribution || '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>');

        leafletTileLayerRef.current = L.tileLayer(layerUrl, {
          attribution,
          subdomains: "abcd",
          maxZoom: 20,
        }).addTo(leafletMapRef.current);

        if (mapType === "satellite") {
          leafletLabelLayerRef.current = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}", {
            maxZoom: 20,
          }).addTo(leafletMapRef.current);
        }
      })();
    }
  }, [mapType, mapLoaded, provider, tileUrl, tileAttribution]);

  /* ── Update markers when places change ─ */
  useEffect(() => {
    if (!mapLoaded) return;
    if (provider === "google" && googleMapRef.current) updateMarkers(places);
    if (provider === "osm" && leafletMapRef.current) updateMarkers(places);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [places, mapLoaded, provider]);

  /* ── Auto-search on load ─ */
  useEffect(() => {
    const q = searchParams.get("q");
    const loc = searchParams.get("location");
    if (q) {
      setQuery(q);
      if (loc) setLocationQuery(loc);
      performSearch(q, loc || "", {}, 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ════════════════════════════════════════
     MAP HELPERS
  ════════════════════════════════════════ */
  const addUserMarker = (map: any, loc: { lat: number; lng: number }) => {
    try { userMarkerRef.current?.map && (userMarkerRef.current.map = null); } catch {}
    if (provider === "google" && (window as any).google) {
      const el = document.createElement("div");
      el.innerHTML = `<div style="width:20px;height:20px;background:#4285F4;border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,.3)"></div>`;
      userMarkerRef.current = new (window as any).google.maps.marker.AdvancedMarkerElement({
        map, position: loc, content: el, title: "Your Location",
      });
    }
  };

  const updateMarkers = (ps: Place[]) => {
    if (provider === "google" && googleMapRef.current) {
      markersRef.current.forEach((m) => { try { m.map = null; } catch {} });
      markersRef.current = [];
      if (!ps.length) return;
      const bounds = new (window as any).google.maps.LatLngBounds();
      ps.forEach((p, i) => {
        if (!p.location?.lat) return;
        const el = document.createElement("div");
        el.innerHTML = `<div style="background:white;border-radius:8px;padding:3px 8px;box-shadow:0 2px 8px rgba(0,0,0,.15);border:2px solid ${p.openNow === false ? "#EF4444" : "#10B981"};cursor:pointer;font-size:11px;font-weight:700;display:flex;align-items:center;gap:3px;white-space:nowrap;"><span>${i + 1}</span><span style="max-width:100px;overflow:hidden;text-overflow:ellipsis">${p.name}</span>${p.rating ? `<span style="color:#F59E0B">★${p.rating}</span>` : ""}</div>`;
        const marker = new (window as any).google.maps.marker.AdvancedMarkerElement({ map: googleMapRef.current, position: p.location, content: el, title: p.name });
        marker.addListener("click", () => { fetchPlaceDetails(p.placeId); googleMapRef.current.panTo(p.location); });
        markersRef.current.push(marker);
        bounds.extend(p.location);
      });
      if (userLocation) bounds.extend(userLocation);
      googleMapRef.current.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
    } else if (provider === "osm" && leafletMapRef.current) {
      (async () => {
        try {
          const mod = (globalThis as any).L || (await import("leaflet"));
          const L = (mod && (mod as any).default) || mod;
          markersRef.current.forEach((m) => { try { leafletMapRef.current.removeLayer(m); } catch {} });
          markersRef.current = [];
          if (!ps.length) return;
          const group: any[] = [];
          ps.forEach((p, i) => {
            if (!p.location?.lat) return;
            const m = L.marker([p.location.lat, p.location.lng]).addTo(leafletMapRef.current);
            m.bindTooltip(`${i + 1}. ${p.name}`, { direction: "top" });
            m.on("click", () => { fetchPlaceDetails(p.placeId); leafletMapRef.current.panTo([p.location.lat, p.location.lng]); });
            markersRef.current.push(m);
            group.push([p.location.lat, p.location.lng]);
          });
          if (userLocation) group.push([userLocation.lat, userLocation.lng]);
          if (group.length > 0) { try { leafletMapRef.current.fitBounds(group, { padding: [50, 50] }); } catch {} }
        } catch (e) { console.error(e); }
      })();
    }
  };

  /* ════════════════════════════════════════
     SEARCH
  ════════════════════════════════════════ */
  const performSearch = async (
    q: string,
    loc: string,
    activeFilters: Partial<Filters> = {},
    page = 1,
  ) => {
    if (!q.trim()) return;
    setLoading(true);
    setSelectedPlace(null);
    setHasSearched(true);
    setCurrentPage(page);

    const merged = { ...filters, ...activeFilters };

    try {
      const params = new URLSearchParams();
      // If loc is provided as a separate field, use smart combined mode
      let fullQuery = q;
      if (loc && loc !== "📍 Current Location" && !q.toLowerCase().includes(loc.toLowerCase())) {
        fullQuery = `${q} in ${loc}`;
      } else if (loc === "📍 Current Location") {
        fullQuery = `${q} near me`;
      }
      params.set("q", fullQuery);
      if (userLocation) {
        params.set("lat", userLocation.lat.toString());
        params.set("lng", userLocation.lng.toString());
      }
      if (merged.minRating > 0) params.set("minRating", merged.minRating.toString());
      if (merged.category) params.set("category", merged.category);
      params.set("page", page.toString());
      params.set("limit", PAGE_SIZE.toString());
      if (merged.maxDistance > 0) params.set("radius", (merged.maxDistance * 1000).toString());

      const res = await fetch(`/api/places/search?${params}`);
      const data = await res.json();

      if (data.error) {
        setPlaces([]);
      } else {
        let results: Place[] = data.places || [];
        // Client-side open-now filter
        if (merged.openNow) {
          results = results.filter((p) => p.openNow === true);
        }
        setPlaces(results);
        setTotal(data.total || results.length);
        setTotalPages(data.totalPages || Math.ceil((data.total || results.length) / PAGE_SIZE));
      }

      // Update URL
      const urlP = new URLSearchParams();
      urlP.set("q", q);
      if (loc) urlP.set("location", loc);
      router.replace(`/explore?${urlP}`, { scroll: false });
    } catch (err) {
      console.error(err);
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (q: string, loc: string) => {
    setQuery(q);
    setLocationQuery(loc);
    performSearch(q, loc, {}, 1);
  };

  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters);
    if (hasSearched && query) {
      performSearch(query, locationQuery, newFilters, 1);
    }
  };

  /* ════════════════════════════════════════
     GEOLOCATION
  ════════════════════════════════════════ */
  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported by your browser");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(loc);
        setLocating(false);
        setLocationQuery("📍 Current Location");
        if (provider === "google" && googleMapRef.current) {
          googleMapRef.current.panTo(loc);
          googleMapRef.current.setZoom(14);
          addUserMarker(googleMapRef.current, loc);
        } else if (provider === "osm" && leafletMapRef.current) {
          try { leafletMapRef.current.panTo([loc.lat, loc.lng]); leafletMapRef.current.setZoom(14); } catch {}
        }
      },
      () => {
        setLocating(false);
        alert("Unable to get location. Please enter one manually.");
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider]);

  /* ════════════════════════════════════════
     PLACE DETAILS
  ════════════════════════════════════════ */
  const [detailsError, setDetailsError] = useState<string | null>(null);

  const fetchPlaceDetails = async (placeId: string) => {
    // 1. Clear error
    setDetailsError(null);
    
    // 2. See if we already have basic info for this place in our search results
    const existing = places.find(p => p.placeId === placeId);
    if (existing) {
      // Show what we have immediately
      setSelectedPlace({
        placeId: existing.placeId,
        name: existing.name,
        address: existing.address,
        location: existing.location,
        rating: existing.rating,
        totalRatings: existing.totalRatings,
        priceLevel: existing.priceLevel,
        types: existing.types,
        openNow: existing.openNow,
        phone: "",
        website: "",
        openingHours: [],
        photos: existing.photo ? [existing.photo] : [],
        reviews: [],
        googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${existing.location.lat},${existing.location.lng}`,
        businessStatus: existing.businessStatus,
      });
    } else {
      setSelectedPlace(null);
    }

    setDetailsLoading(true);
    
    try {
      const res = await fetch(`/api/places/details?placeId=${placeId}`);
      if (!res.ok) throw new Error("Failed to fetch place details");
      
      const data = await res.json();
      if (data.error) {
        setDetailsError(data.error);
      } else {
        setSelectedPlace(data);
      }
    } catch (e) {
      console.error(e);
      setDetailsError("Unable to load place details. Please try again.");
    } finally {
      setDetailsLoading(false);
    }
  };

  /* ════════════════════════════════════════
     DIRECTIONS
  ════════════════════════════════════════ */
  const getDirections = (dest: { lat: number; lng: number }, destId: string) => {
    let url = `https://www.google.com/maps/dir/?api=1&destination=${dest.lat},${dest.lng}`;
    if (userLocation) url += `&origin=${userLocation.lat},${userLocation.lng}`;
    window.open(url, "_blank");
  };

  /* ════════════════════════════════════════
     RENDER
  ════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-secondary/30">
      {/* ── HERO HEADER ─ */}
      <section className="relative overflow-hidden bg-linear-to-br from-emerald-700 via-emerald-600 to-teal-500 dark:from-emerald-950 dark:via-emerald-900 dark:to-teal-900">
        {/* Dot grid background */}
        <div
          className="absolute inset-0 opacity-[0.12] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute -top-48 -left-48 w-[420px] h-[420px] bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-[320px] h-[320px] bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          {/* Badge */}
          <div className="text-center text-white mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>
                {provider === "google"
                  ? "Powered by Google Maps"
                  : provider === "osm"
                    ? "Powered by OpenStreetMap"
                    : "Real Business Discovery"}
              </span>
            </div>
            <h1
              className="font-extrabold text-3xl md:text-4xl lg:text-5xl tracking-tight mb-3"
              style={{ fontFamily: "var(--font-sora), sans-serif" }}
            >
              Explore Businesses Near You
            </h1>
            <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
              Search by city, area, or type — "cafes in Ahmedabad", "gyms near me"
            </p>
          </div>

          {/* Smart Search Bar */}
          <SmartSearchBar
            initialQuery={query}
            initialLocation={locationQuery}
            loading={loading}
            locating={locating}
            onSearch={handleSearch}
            onLocate={getUserLocation}
          />

          {/* Quick search tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
            <span className="text-emerald-200 text-xs font-medium">Quick search:</span>
            {QUICK_SEARCHES.map((qs) => (
              <button
                key={qs.query}
                onClick={() => handleSearch(qs.query, locationQuery)}
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
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <svg viewBox="0 0 1440 50" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full">
            <path d="M0 50V25C360 0 720 30 1080 15C1260 7 1380 5 1440 0V50H0Z" className="fill-secondary/30" />
          </svg>
        </div>
      </section>

      {/* ── RESULTS SECTION ─ */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 mb-5">
          {/* Filters row */}
          <SearchFilters
            filters={filters}
            totalResults={total}
            onChange={handleFiltersChange}
          />

          {/* View mode */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {loading
                ? "Searching…"
                : hasSearched
                  ? query && (
                      <>
                        Results for{" "}
                        <strong className="text-foreground">"{query}"</strong>
                        {locationQuery && locationQuery !== "📍 Current Location" && (
                          <> in <strong className="text-foreground">{locationQuery}</strong></>
                        )}
                      </>
                    )
                  : "Search for businesses above"}
            </div>

            <div className="hidden md:flex items-center gap-1 bg-card border border-border rounded-xl p-1">
              {(["split", "list", "map"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all capitalize ${
                    viewMode === mode
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {mode === "split" ? <Eye className="w-3.5 h-3.5" /> : mode === "list" ? <List className="w-3.5 h-3.5" /> : <MapIcon className="w-3.5 h-3.5" />}
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main content grid */}
        <div className={`flex gap-6 ${viewMode === "map" ? "flex-col" : ""}`}>
          {/* ── RESULTS LIST ─ */}
          {viewMode !== "map" && (
            <div className={`${viewMode === "split" ? "w-full md:w-1/2" : "flex-1"} space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto pr-1`}>
              {loading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-foreground">Searching real businesses...</p>
                    <p className="text-sm text-muted-foreground mt-1">Fetching live data from OpenStreetMap</p>
                  </div>
                </div>
              ) : places.length > 0 ? (
                <>
                  {places.map((place, idx) => (
                    <PlaceCard
                      key={place.placeId}
                      place={place}
                      index={(currentPage - 1) * PAGE_SIZE + idx}
                      isSelected={selectedPlace?.placeId === place.placeId}
                      onSelect={fetchPlaceDetails}
                      onDirections={getDirections}
                    />
                  ))}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-4 pb-2">
                      <button
                        onClick={() => performSearch(query, locationQuery, {}, currentPage - 1)}
                        disabled={currentPage === 1}
                        className="flex items-center gap-1 px-4 py-2 text-sm font-semibold border border-border rounded-xl hover:border-emerald-400 hover:text-emerald-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-4 h-4" /> Prev
                      </button>
                      <span className="text-sm text-muted-foreground font-medium px-2">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => performSearch(query, locationQuery, {}, currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-1 px-4 py-2 text-sm font-semibold border border-border rounded-xl hover:border-emerald-400 hover:text-emerald-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Next <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </>
              ) : hasSearched ? (
                /* No results */
                <div className="text-center py-16 px-6">
                  <div className="w-20 h-20 mx-auto bg-emerald-50 dark:bg-emerald-900/30 rounded-3xl flex items-center justify-center mb-6">
                    <MapIcon className="w-10 h-10 text-emerald-400" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground mb-2" style={{ fontFamily: "var(--font-sora), sans-serif" }}>
                    No places found
                  </h2>
                  <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">
                    Try a different keyword or add a city name like "Ahmedabad" or "Mumbai".
                  </p>
                  {/* Suggest trending */}
                  <div className="flex flex-wrap justify-center gap-2">
                    {TRENDING.map((t) => (
                      <button
                        key={t.label}
                        onClick={() => handleSearch(t.q, t.loc)}
                        className="px-4 py-2 text-xs font-semibold rounded-full bg-card border border-border text-muted-foreground hover:border-emerald-400 hover:text-emerald-600 transition-all"
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* Initial state */
                <div className="text-center py-16 px-6">
                  <div className="w-20 h-20 mx-auto bg-emerald-50 dark:bg-emerald-900/30 rounded-3xl flex items-center justify-center mb-6">
                    <TrendingUp className="w-10 h-10 text-emerald-400" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground mb-2" style={{ fontFamily: "var(--font-sora), sans-serif" }}>
                    Discover what's around you
                  </h2>
                  <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">
                    Try "restaurants near me" or "cafes in Ahmedabad"
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {TRENDING.map((t) => (
                      <button
                        key={t.label}
                        onClick={() => handleSearch(t.q, t.loc)}
                        className="px-4 py-2 text-xs font-semibold rounded-full bg-card border border-border text-muted-foreground hover:border-emerald-400 hover:text-emerald-600 transition-all"
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── MAP ─ */}
          {viewMode !== "list" && (
            <div className={`${viewMode === "split" ? "hidden md:block md:w-1/2" : "flex-1"} sticky top-24`}>
              <div
                className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm"
                style={{ height: viewMode === "map" ? "calc(100vh - 250px)" : "calc(100vh - 200px)" }}
              >
                {provider === "osm" || (provider === "google" && apiKey) ? (
                  <div className="relative w-full h-full">
                    <div ref={mapRef} className="w-full h-full" id="explore-google-map" />
                    
                    {/* Satellite Toggle */}
                    <div className="absolute bottom-6 right-6 z-[1000]">
                      <button
                        onClick={() => setMapType(m => m === "standard" ? "satellite" : "standard")}
                        className={`group flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border shadow-xl transition-all duration-300 active:scale-95 ${
                          mapType === "satellite"
                            ? "bg-emerald-600 border-emerald-500 text-white"
                            : "bg-white/95 dark:bg-slate-900/95 border-border text-foreground hover:shadow-2xl hover:border-emerald-200"
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg transition-transform duration-500 group-hover:rotate-12 ${
                          mapType === "satellite" ? "bg-white/20" : "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600"
                        }`}>
                          <Globe className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col items-start leading-none">
                          <span className="text-[10px] font-medium opacity-70 uppercase tracking-wider mb-0.5">Map View</span>
                          <span className="text-xs font-extra-bold">
                            {mapType === "satellite" ? "Standard" : "Satellite"}
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-secondary/50">
                    <div className="text-center p-8">
                      <MapIcon className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                      <p className="text-muted-foreground font-medium mb-1">Map loading...</p>
                      <p className="text-xs text-muted-foreground">
                        Configure a map provider in your .env
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── PLACE DETAILS PANEL ─ */}
      {(selectedPlace || detailsLoading || detailsError) && (
        <PlaceDetailsPanel
          place={selectedPlace}
          loading={detailsLoading}
          error={detailsError}
          onClose={() => {
            setSelectedPlace(null);
            setDetailsError(null);
          }}
          onDirections={getDirections}
        />
      )}

      {/* ── MOBILE: Map / List toggle ─ */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1 bg-card border border-border rounded-full p-1 shadow-xl">
        <button
          onClick={() => setViewMode(viewMode === "map" ? "list" : "map")}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-emerald-600 text-white rounded-full transition-all"
        >
          {viewMode === "map" ? (
            <><List className="w-4 h-4" /> List</>
          ) : (
            <><MapIcon className="w-4 h-4" /> Map</>
          )}
        </button>
      </div>

      <style jsx global>{`
        @keyframes pulse-loc {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: .5; }
          100% { transform: scale(2); opacity: 0; }
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
