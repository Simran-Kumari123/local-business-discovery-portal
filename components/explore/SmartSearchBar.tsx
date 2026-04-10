"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, MapPin, X, Loader2, Locate, Clock, TrendingUp } from "lucide-react";

interface Suggestion {
  type: "category" | "location" | "recent";
  label: string;
  query: string;
}

interface SmartSearchBarProps {
  initialQuery?: string;
  initialLocation?: string;
  loading?: boolean;
  locating?: boolean;
  onSearch: (query: string, location: string) => void;
  onLocate: () => void;
}

const RECENT_KEY = "explore_recent_searches";
const MAX_RECENT = 5;

function getRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveRecentSearch(q: string) {
  if (!q.trim()) return;
  const recent = getRecentSearches().filter((r) => r !== q);
  recent.unshift(q);
  localStorage.setItem(RECENT_KEY, JSON.stringify(recent.slice(0, MAX_RECENT)));
}

export function SmartSearchBar({
  initialQuery = "",
  initialLocation = "",
  loading = false,
  locating = false,
  onSearch,
  onLocate,
}: SmartSearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [locationQuery, setLocationQuery] = useState(initialLocation);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(`/api/places/autocomplete?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setSuggestions(data.suggestions || []);
    } catch {
      setSuggestions([]);
    }
  }, []);

  const handleQueryChange = (val: string) => {
    setQuery(val);
    setActiveSuggestion(-1);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    saveRecentSearch(query.trim());
    setRecentSearches(getRecentSearches());
    setShowSuggestions(false);
    onSearch(query.trim(), locationQuery.trim());
  };

  const handleSuggestionClick = (s: Suggestion) => {
    setQuery(s.query);
    setShowSuggestions(false);
    saveRecentSearch(s.query);
    setRecentSearches(getRecentSearches());
    onSearch(s.query, locationQuery.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const total =
      suggestions.length ||
      (query.length === 0 && recentSearches.length > 0
        ? recentSearches.length
        : 0);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestion((prev) => Math.min(prev + 1, total - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestion((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    } else if (e.key === "Enter" && activeSuggestion >= 0 && suggestions[activeSuggestion]) {
      e.preventDefault();
      handleSuggestionClick(suggestions[activeSuggestion]);
    }
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const displayList: Suggestion[] =
    suggestions.length > 0
      ? suggestions
      : query.length === 0
        ? recentSearches.map((r) => ({ type: "recent", label: r, query: r }))
        : [];

  const trendingItems = [
    "🍕 Restaurants",
    "☕ Cafés",
    "🏋️ Gyms",
    "🏥 Hospitals",
  ];

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto" id="explore-search-form">
      <div className="bg-card rounded-2xl p-1.5 shadow-2xl shadow-emerald-900/40 relative">
        <div className="flex flex-col sm:flex-row items-stretch gap-2">
          {/* What input */}
          <div className="flex-1 relative">
            <div className="flex items-center gap-3 px-4 border-b sm:border-b-0 sm:border-r border-border pb-2 sm:pb-0">
              <Search className="text-muted-foreground w-5 h-5 shrink-0" />
              <input
                ref={inputRef}
                id="explore-search-input"
                type="text"
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={handleKeyDown}
                placeholder="cafes in Ahmedabad, gyms near me..."
                className="w-full py-3 bg-transparent text-foreground placeholder-muted-foreground focus:outline-none text-base"
                autoComplete="off"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => { setQuery(""); setSuggestions([]); inputRef.current?.focus(); }}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Autocomplete dropdown */}
            {showSuggestions && displayList.length > 0 && (
              <div
                ref={suggestionsRef}
                className="absolute left-0 right-0 top-full mt-1 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden"
              >
                {/* Group headers */}
                {query.length === 0 && recentSearches.length > 0 && (
                  <div className="px-3 py-2 text-xs font-semibold text-muted-foreground flex items-center gap-1.5 border-b border-border">
                    <Clock className="w-3.5 h-3.5" /> Recent Searches
                  </div>
                )}
                {query.length > 0 && suggestions.some(s => s.type === "category") && (
                  <div className="px-3 py-2 text-xs font-semibold text-muted-foreground flex items-center gap-1.5 border-b border-border">
                    <TrendingUp className="w-3.5 h-3.5" /> Suggestions
                  </div>
                )}

                {displayList.map((s, i) => (
                  <button
                    key={`${s.type}-${s.label}-${i}`}
                    type="button"
                    onClick={() => handleSuggestionClick(s)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors ${
                      i === activeSuggestion
                        ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                        : "hover:bg-accent text-foreground"
                    }`}
                  >
                    {s.type === "recent" ? (
                      <Clock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    ) : s.type === "location" ? (
                      <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    ) : (
                      <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    )}
                    <span className="truncate">{s.label}</span>
                    {s.type === "location" && (
                      <span className="ml-auto text-[10px] text-muted-foreground font-medium bg-secondary px-1.5 py-0.5 rounded-full">
                        Place
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Trending when empty and no recent */}
            {showSuggestions && query.length === 0 && recentSearches.length === 0 && (
              <div
                ref={suggestionsRef}
                className="absolute left-0 right-0 top-full mt-1 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden"
              >
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground flex items-center gap-1.5 border-b border-border">
                  <TrendingUp className="w-3.5 h-3.5" /> Trending
                </div>
                {trendingItems.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleSuggestionClick({ type: "category", label: item.split(" ").slice(1).join(" ").toLowerCase(), query: item.split(" ").slice(1).join(" ").toLowerCase() })}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-accent transition-colors text-left"
                  >
                    <span>{item}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Where input */}
          <div className="flex-1 flex items-center gap-3 px-4">
            <MapPin className="text-muted-foreground w-5 h-5 shrink-0" />
            <input
              id="explore-location-input"
              type="text"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              placeholder="City or area (e.g., Ahmedabad)"
              className="w-full py-3 bg-transparent text-foreground placeholder-muted-foreground focus:outline-none text-base"
            />
            <button
              type="button"
              onClick={onLocate}
              disabled={locating}
              className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 whitespace-nowrap transition-colors disabled:opacity-50"
              title="Use my current location"
              id="explore-locate-btn"
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
            id="explore-search-submit"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-[1.03] whitespace-nowrap shadow-md disabled:opacity-70"
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
  );
}
