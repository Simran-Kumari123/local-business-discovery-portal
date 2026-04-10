"use client";

import { SlidersHorizontal, Star, X } from "lucide-react";
import { useState } from "react";

export interface Filters {
  minRating: number;
  maxDistance: number; // km, 0 = any
  category: string;
  openNow: boolean;
}

const defaultFilters: Filters = {
  minRating: 0,
  maxDistance: 0,
  category: "",
  openNow: false,
};

interface SearchFiltersProps {
  filters: Filters;
  totalResults: number;
  onChange: (filters: Filters) => void;
}

const CATEGORIES = [
  { value: "", label: "All Categories" },
  { value: "restaurant", label: "🍕 Restaurants" },
  { value: "cafe", label: "☕ Cafés" },
  { value: "gym", label: "🏋️ Gyms" },
  { value: "hotel", label: "🏨 Hotels" },
  { value: "hospital", label: "🏥 Hospitals" },
  { value: "bank", label: "🏦 Banks" },
  { value: "supermarket", label: "🛒 Supermarkets" },
  { value: "pharmacy", label: "💊 Pharmacies" },
  { value: "salon", label: "💇 Salons" },
  { value: "petrol", label: "⛽ Petrol" },
];

const DISTANCE_OPTIONS = [
  { value: 0, label: "Any distance" },
  { value: 1, label: "Within 1 km" },
  { value: 3, label: "Within 3 km" },
  { value: 5, label: "Within 5 km" },
  { value: 10, label: "Within 10 km" },
];

const RATING_OPTIONS = [
  { value: 0, label: "Any rating" },
  { value: 3, label: "3+ ⭐" },
  { value: 4, label: "4+ ⭐" },
  { value: 4.5, label: "4.5+ ⭐" },
];

function isActiveFilters(f: Filters) {
  return f.minRating > 0 || f.maxDistance > 0 || f.category !== "" || f.openNow;
}

export function SearchFilters({ filters, totalResults, onChange }: SearchFiltersProps) {
  const [open, setOpen] = useState(false);
  const active = isActiveFilters(filters);

  const reset = () => onChange(defaultFilters);

  return (
    <div className="relative">
      <div className="flex items-center gap-2 flex-wrap">
        {/* Filter toggle */}
        <button
          onClick={() => setOpen(!open)}
          className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl border transition-all ${
            open || active
              ? "bg-emerald-600 text-white border-emerald-600"
              : "bg-card text-foreground border-border hover:bg-accent"
          }`}
          id="explore-filters-btn"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filters
          {active && (
            <span className="w-4 h-4 bg-white text-emerald-700 rounded-full text-[9px] font-black flex items-center justify-center">
              !
            </span>
          )}
        </button>

        {/* Quick filter pills */}
        {["restaurant", "cafe", "gym", "hospital"].map((cat) => (
          <button
            key={cat}
            onClick={() =>
              onChange({ ...filters, category: filters.category === cat ? "" : cat })
            }
            className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all ${
              filters.category === cat
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-card text-muted-foreground border-border hover:border-emerald-400 hover:text-emerald-600"
            }`}
          >
            {CATEGORIES.find((c) => c.value === cat)?.label || cat}
          </button>
        ))}

        {active && (
          <button
            onClick={reset}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-red-500 transition-colors"
          >
            <X className="w-3 h-3" /> Clear
          </button>
        )}

        <span className="ml-auto text-sm text-muted-foreground">
          <strong className="text-foreground">{totalResults}</strong>{" "}
          {totalResults === 1 ? "result" : "results"}
        </span>
      </div>

      {/* Expanded filter panel */}
      {open && (
        <div className="absolute left-0 top-full mt-2 z-40 bg-card border border-border rounded-2xl shadow-xl p-5 w-full sm:w-96">
          <div className="grid grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => onChange({ ...filters, category: e.target.value })}
                className="w-full text-sm border border-border rounded-xl px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Distance */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-2">
                Distance
              </label>
              <select
                value={filters.maxDistance}
                onChange={(e) =>
                  onChange({ ...filters, maxDistance: parseFloat(e.target.value) })
                }
                className="w-full text-sm border border-border rounded-xl px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {DISTANCE_OPTIONS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Min Rating */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-2">
                Minimum Rating
              </label>
              <div className="flex gap-1.5 flex-wrap">
                {RATING_OPTIONS.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => onChange({ ...filters, minRating: r.value })}
                    className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                      filters.minRating === r.value
                        ? "bg-amber-500 text-white border-amber-500"
                        : "bg-card text-muted-foreground border-border hover:border-amber-400"
                    }`}
                  >
                    {r.value > 0 && <Star className="w-3 h-3" />}
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Open now */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-2">
                Availability
              </label>
              <button
                onClick={() => onChange({ ...filters, openNow: !filters.openNow })}
                className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl border transition-all ${
                  filters.openNow
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-card text-muted-foreground border-border hover:border-emerald-400"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                    filters.openNow
                      ? "border-white bg-white"
                      : "border-muted-foreground"
                  }`}
                >
                  {filters.openNow && (
                    <div className="w-2 h-2 rounded-full bg-emerald-600" />
                  )}
                </div>
                Open Now
              </button>
            </div>
          </div>

          {active && (
            <button
              onClick={() => { reset(); setOpen(false); }}
              className="w-full mt-4 text-xs text-red-500 hover:text-red-700 font-semibold transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
