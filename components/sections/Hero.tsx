"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ArrowRight,
  MapPin,
  Star,
  TrendingUp,
  Sparkles,
  UtensilsCrossed,
  Dumbbell,
  Scissors,
  ShoppingBag,
  GraduationCap,
  HeartPulse,
  ChevronRight,
  BadgeCheck,
  Building2,
  Loader2,
} from "lucide-react";

const tags = ["Restaurant", "Gyms", "Salons", "Clinics", "Schools"];

const heroCategories = [
  {
    Icon: UtensilsCrossed,
    label: "Restaurant",
    color: "text-orange-500",
    bg: "bg-orange-50 dark:bg-orange-900/20",
    border: "border-orange-200 dark:border-orange-800",
  },
  {
    Icon: Dumbbell,
    label: "Gyms",
    color: "text-red-500",
    bg: "bg-red-50 dark:bg-red-900/20",
    border: "border-red-200 dark:border-red-800",
  },
  {
    Icon: Scissors,
    label: "Salons",
    color: "text-pink-500",
    bg: "bg-pink-50 dark:bg-pink-900/20",
    border: "border-pink-200 dark:border-pink-800",
  },
  {
    Icon: ShoppingBag,
    label: "Shopping",
    color: "text-violet-500",
    bg: "bg-violet-50 dark:bg-violet-900/20",
    border: "border-violet-200 dark:border-violet-800",
  },
  {
    Icon: GraduationCap,
    label: "Education",
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-900/30",
    border: "border-blue-200 dark:border-blue-800",
  },
  {
    Icon: HeartPulse,
    label: "Healthcare",
    color: "text-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    border: "border-emerald-200 dark:border-emerald-800",
  },
];

const trustStats = [
  { value: "50K+", label: "Businesses", icon: Building2 },
  { value: "2M+", label: "Happy Users", icon: Sparkles },
  { value: "500K+", label: "Reviews", icon: Star },
  { value: "200+", label: "Cities", icon: MapPin },
];

interface FeaturedBusiness {
  _id: string;
  businessName: string;
  category: string;
  description: string;
  averageRating: number;
  totalReviews: number;
  images: string[];
  city: string;
  area: string;
  openingHours: string;
}

// Category emoji map for business cards
const categoryEmoji: Record<string, string> = {
  Restaurant: "🍛",
  "Gym & Fitness": "🏋️",
  "Salon & Spa": "💅",
  Healthcare: "🏥",
  Education: "📚",
  Shopping: "🛍️",
  Technology: "💻",
  "Auto Services": "🔧",
  "Home Services": "🏠",
  Other: "🏢",
};

const categoryBg: Record<string, string> = {
  Restaurant: "bg-orange-50 dark:bg-orange-900/20",
  "Gym & Fitness": "bg-blue-50 dark:bg-blue-900/20",
  "Salon & Spa": "bg-pink-50 dark:bg-pink-900/20",
  Healthcare: "bg-emerald-50 dark:bg-emerald-900/20",
  Education: "bg-violet-50 dark:bg-violet-900/20",
  Shopping: "bg-amber-50 dark:bg-amber-900/20",
  Technology: "bg-sky-50 dark:bg-sky-900/20",
  "Auto Services": "bg-cyan-50 dark:bg-cyan-900/20",
  Other: "bg-gray-50 dark:bg-gray-900/20",
};

export default function Hero() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const [featuredBusinesses, setFeaturedBusinesses] = useState<FeaturedBusiness[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch("/api/business/featured");
        const data = await res.json();
        setFeaturedBusinesses(data.businesses || []);
      } catch {
        console.error("Failed to fetch featured businesses");
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (query.trim()) {
      router.push(`/businesses?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/businesses');
    }
  };

  const handleTagSearch = (tag: string) => {
    setQuery(tag);
    router.push(`/businesses?q=${encodeURIComponent(tag)}`);
  };

  return (
    <>
      {/* ════════════════════════════════════════════
          1. HERO SECTION — gradient, two-column
      ════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-linear-to-br from-blue-700 via-blue-600 to-sky-500 dark:from-blue-950 dark:via-blue-900 dark:to-sky-900">
        {/* Dot grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.12] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Glow blobs */}
        <div className="absolute -top-48 -left-48 w-[520px] h-[520px] bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-20 w-[400px] h-[400px] bg-sky-300/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-0">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* ── LEFT: Headline + Search ── */}
            <div className="text-white pb-20 lg:pb-28">
              {/* Trust badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full text-sm font-medium mb-5">
                <BadgeCheck className="w-4 h-4 text-yellow-300 shrink-0" />
                <span>India&apos;s #1 Local Business Directory</span>
              </div>

              {/* Main headline */}
              <h1
                className="font-extrabold text-[2.6rem] sm:text-5xl lg:text-[3.4rem] leading-[1.1] tracking-tight mb-5"
                style={{ fontFamily: "var(--font-sora), sans-serif" }}
              >
                Discover the
                <br />
                <span className="text-yellow-300 drop-shadow">Best Local</span>
                <br />
                Businesses
                <br />
                <span className="text-white/80">Near You</span>
              </h1>

              <p className="text-blue-100 text-lg leading-relaxed mb-7 max-w-md">
                Find trusted restaurants, gyms, salons, healthcare providers,
                and more — reviewed by real people in your community.
              </p>

              {/* Search bar */}
              <div className="bg-card rounded-2xl p-1.5 shadow-2xl shadow-blue-900/40 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center gap-3 px-4">
                    <Search className="text-muted-foreground w-5 h-5 shrink-0" />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      placeholder="Search restaurants, gyms, salons..."
                      className="w-full py-3 bg-transparent text-foreground placeholder-muted-foreground focus:outline-none text-base"
                    />
                  </div>
                  <button
                    onClick={handleSearch}
                    className="flex items-center gap-2 px-5 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all duration-200 hover:scale-[1.03] whitespace-nowrap shadow-md"
                  >
                    Search <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Quick-tag pills */}
              <div className="flex flex-wrap items-center gap-2 mb-8">
                <span className="text-blue-200 text-xs font-medium">
                  Popular:
                </span>
                {tags.map((t) => (
                  <button
                    key={t}
                    onClick={() => handleTagSearch(t)}
                    className="px-3 py-1 text-xs font-semibold bg-white/15 hover:bg-white/25 border border-white/25 rounded-full text-white transition-all duration-150"
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/businesses"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-blue-700 font-bold rounded-xl shadow-xl shadow-blue-900/20 hover:bg-blue-50 hover:scale-[1.03] transition-all duration-200"
                >
                  Explore Businesses <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border-2 border-white/50 hover:border-white text-white font-bold rounded-xl hover:bg-white/10 hover:scale-[1.03] transition-all duration-200"
                >
                  Add Your Business
                </Link>
              </div>
            </div>

            {/* ── RIGHT: Live Business Panel (top 3 from DB) ── */}
            <div className="hidden lg:block relative pb-12">
              {/* Floating badge top */}
              <div className="absolute -top-5 -right-2 z-10 flex items-center gap-2 bg-yellow-400 text-yellow-900 font-bold text-sm px-4 py-2 rounded-2xl shadow-lg">
                <TrendingUp className="w-4 h-4" /> New This Week
              </div>

              {/* Glass panel */}
              <div className="bg-white/12 backdrop-blur-xl border border-white/20 rounded-3xl p-5 shadow-2xl">
                {/* Panel header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-white text-sm font-semibold">
                      Recently Added
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-blue-200 text-xs font-medium">
                    <Star className="w-3 h-3" /> Top Rated
                  </span>
                </div>

                {/* Cards — show first 3 real businesses */}
                <div className="flex flex-col gap-3">
                  {loading ? (
                    <div className="flex items-center justify-center py-10">
                      <Loader2 className="w-6 h-6 animate-spin text-white/60" />
                    </div>
                  ) : featuredBusinesses.length > 0 ? (
                    featuredBusinesses.slice(0, 3).map((biz) => (
                      <Link
                        key={biz._id}
                        href={`/business/${biz._id}`}
                        className="bg-card rounded-2xl p-4 flex items-center gap-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-250 cursor-pointer group"
                      >
                        <div
                          className={`w-12 h-12 rounded-xl ${categoryBg[biz.category] || "bg-gray-50 dark:bg-gray-900/20"} flex items-center justify-center text-2xl shrink-0`}
                        >
                          {biz.images && biz.images.length > 0 ? (
                            <img src={biz.images[0]} alt="" className="w-full h-full object-cover rounded-xl" />
                          ) : (
                            categoryEmoji[biz.category] || "🏢"
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className="font-bold text-card-foreground text-sm truncate"
                            style={{
                              fontFamily: "var(--font-sora), sans-serif",
                            }}
                          >
                            {biz.businessName}
                          </p>
                          <p className="text-xs text-muted-foreground mb-1">
                            {biz.category}
                          </p>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs font-bold text-card-foreground">
                                {(biz.averageRating || 0) > 0 ? biz.averageRating.toFixed(1) : "New"}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                ({biz.totalReviews || 0})
                              </span>
                            </div>
                            <span className="text-muted-foreground text-xs">·</span>
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="w-3 h-3" />
                              {biz.area}, {biz.city}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                      </Link>
                    ))
                  ) : (
                    <div className="text-center py-6 text-white/50 text-sm">
                      No businesses registered yet
                    </div>
                  )}
                </div>

                <Link href="/businesses" className="block w-full mt-3 py-2.5 text-sm text-center font-semibold text-white/70 hover:text-white border border-white/20 hover:border-white/40 rounded-xl hover:bg-white/10 transition-all duration-200">
                  View all businesses →
                </Link>
              </div>

              {/* Floating badge bottom */}
              <div className="absolute -bottom-3 -left-4 flex items-center gap-2 bg-card rounded-2xl px-4 py-2.5 shadow-xl border border-border">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-card-foreground text-xs font-bold">
                  Real Business Listings
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Wave transition to white */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 72"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            className="w-full"
          >
            <path
              d="M0 72V36C240 0 480 24 720 36C960 48 1200 12 1440 0V72H0Z"
              className="fill-background"
            />
          </svg>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          2. TRUST STATS BAR
      ════════════════════════════════════════════ */}
      <section className="bg-background border-b border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x md:divide-gray-100 dark:divide-gray-800">
            {trustStats.map(({ value, label, icon: Icon }) => (
              <div
                key={label}
                className="flex flex-col items-center justify-center py-3 gap-1"
              >
                <Icon className="w-5 h-5 text-blue-400 dark:text-blue-500 mb-1" />
                <p
                  className="text-3xl font-extrabold text-blue-600 dark:text-blue-400"
                  style={{ fontFamily: "var(--font-sora), sans-serif" }}
                >
                  {value}
                </p>
                <p className="text-sm text-muted-foreground font-medium">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          3. QUICK CATEGORY GRID
      ════════════════════════════════════════════ */}
      <section className="bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2
                className="text-2xl font-bold text-foreground"
                style={{ fontFamily: "var(--font-sora), sans-serif" }}
              >
                Browse by Category
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Tap any category to explore listings
              </p>
            </div>
            <Link
              href="/businesses"
              className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {heroCategories.map(({ Icon, label, color, bg, border }) => (
              <Link
                key={label}
                href={`/businesses?category=${encodeURIComponent(label)}`}
                className={`flex flex-col items-center gap-2.5 p-4 rounded-2xl border-2 ${border} ${bg} hover:-translate-y-1 hover:shadow-md transition-all duration-200 cursor-pointer group`}
              >
                <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-blue-600 to-sky-500 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-200">
                  <Icon className={`w-5 h-5 ${color}`} strokeWidth={1.75} />
                </div>
                <span className="text-xs font-semibold text-muted-foreground text-center leading-tight">
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          4. TOP BUSINESSES THIS WEEK — REAL DATA
      ════════════════════════════════════════════ */}
      <section className="bg-secondary/50 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="inline-block px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-full border border-blue-100 dark:border-blue-800 mb-2">
                Newly Registered
              </span>
              <h2
                className="text-2xl font-bold text-foreground"
                style={{ fontFamily: "var(--font-sora), sans-serif" }}
              >
                Top Businesses This Week
              </h2>
            </div>
            <Link
              href="/businesses"
              className="hidden sm:flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : featuredBusinesses.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredBusinesses.map((biz) => (
                <Link
                  key={biz._id}
                  href={`/business/${biz._id}`}
                  className="bg-card border border-border rounded-2xl p-5 hover:shadow-xl hover:shadow-blue-100/50 dark:hover:shadow-blue-900/30 hover:-translate-y-1 transition-all duration-300 group block"
                >
                  <div className="flex items-start gap-4 mb-3">
                    <div
                      className={`w-14 h-14 rounded-xl ${categoryBg[biz.category] || "bg-gray-50 dark:bg-gray-900/20"} flex items-center justify-center text-3xl shrink-0 overflow-hidden`}
                    >
                      {biz.images && biz.images.length > 0 ? (
                        <img src={biz.images[0]} alt="" className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        categoryEmoji[biz.category] || "🏢"
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className="font-bold text-card-foreground text-base truncate"
                        style={{ fontFamily: "var(--font-sora), sans-serif" }}
                      >
                        {biz.businessName}
                      </h3>
                      <p className="text-xs text-muted-foreground mb-1">
                        {biz.category}
                      </p>
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-bold text-card-foreground">
                          {(biz.averageRating || 0) > 0 ? biz.averageRating.toFixed(1) : "New"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({biz.totalReviews || 0} {(biz.totalReviews || 0) === 1 ? 'review' : 'reviews'})
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                    {biz.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {biz.area}, {biz.city}
                    </span>
                    <div className="flex items-center gap-3">
                      {biz.openingHours && (
                        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          {biz.openingHours}
                        </span>
                      )}
                      <span className="text-xs font-bold text-primary group-hover:underline">
                        View →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-card border border-border rounded-2xl">
              <Building2 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">No businesses registered yet. Be the first!</p>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all duration-200"
              >
                Register Your Business <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {/* Mobile view all */}
          <div className="sm:hidden mt-6 text-center">
            <Link
              href="/businesses"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all duration-200"
            >
              View All Businesses <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
