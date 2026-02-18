"use client";

import { useState } from "react";
import Link from "next/link";
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
} from "lucide-react";

const tags = ["Restaurants", "Gyms", "Salons", "Clinics", "Schools"];

const heroCategories = [
  {
    Icon: UtensilsCrossed,
    label: "Restaurants",
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

const panelBusinesses = [
  {
    name: "The Masala House",
    category: "Restaurant",
    rating: 4.9,
    reviews: 312,
    tag: "Top Rated",
    tagColor:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
    distance: "0.4 km",
    img: "🍛",
    imgBg: "bg-orange-100 dark:bg-orange-900/30",
  },
  {
    name: "FitZone Elite",
    category: "Gym & Fitness",
    rating: 4.8,
    reviews: 189,
    tag: "Trending",
    tagColor:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    distance: "1.2 km",
    img: "🏋️",
    imgBg: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    name: "Glow Studio",
    category: "Salon & Beauty",
    rating: 4.7,
    reviews: 98,
    tag: "New",
    tagColor:
      "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
    distance: "0.8 km",
    img: "💅",
    imgBg: "bg-pink-100 dark:bg-pink-900/30",
  },
];

const trustStats = [
  { value: "50K+", label: "Businesses", icon: Building2 },
  { value: "2M+", label: "Happy Users", icon: Sparkles },
  { value: "500K+", label: "Reviews", icon: Star },
  { value: "200+", label: "Cities", icon: MapPin },
];

const featuredListings = [
  {
    name: "The Masala House",
    cat: "Restaurant",
    rating: 4.9,
    reviews: 312,
    img: "🍛",
    open: true,
    bg: "bg-orange-50 dark:bg-orange-900/20",
    tag: "⭐ Top Rated",
    tagClass:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
    desc: "Authentic North Indian cuisine in a cozy family-friendly setting.",
  },
  {
    name: "FitZone Elite",
    cat: "Gym & Fitness",
    rating: 4.8,
    reviews: 189,
    img: "🏋️",
    open: true,
    bg: "bg-blue-50 dark:bg-blue-900/20",
    tag: "🔥 Trending",
    tagClass:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    desc: "Modern equipment, expert trainers, and flexible monthly plans.",
  },
  {
    name: "Glow Studio",
    cat: "Salon & Beauty",
    rating: 4.7,
    reviews: 98,
    img: "💅",
    open: false,
    bg: "bg-pink-50 dark:bg-pink-900/20",
    tag: "✨ New",
    tagClass:
      "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
    desc: "Premium skincare treatments and bridal makeup packages.",
  },
  {
    name: "MedCare Clinic",
    cat: "Healthcare",
    rating: 4.9,
    reviews: 245,
    img: "🏥",
    open: true,
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    tag: "✅ Verified",
    tagClass:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    desc: "General practice & specialist consultations with online booking.",
  },
  {
    name: "BookNest Edu",
    cat: "Education",
    rating: 4.6,
    reviews: 77,
    img: "📚",
    open: true,
    bg: "bg-violet-50 dark:bg-violet-900/20",
    tag: "🎓 Popular",
    tagClass:
      "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
    desc: "Coaching classes for grades 8–12 with weekend batch options.",
  },
  {
    name: "AutoPro Services",
    cat: "Auto Services",
    rating: 4.5,
    reviews: 134,
    img: "🔧",
    open: false,
    bg: "bg-sky-50 dark:bg-sky-900/20",
    tag: "🏆 Award 2024",
    tagClass: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300",
    desc: "Trusted car servicing, denting, painting, and 3M accessories.",
  },
];

export default function Hero() {
  const [query, setQuery] = useState("");

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

              {/* Main headline — ALWAYS VISIBLE, no opacity-0 */}
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
                      placeholder="Search restaurants, gyms, salons..."
                      className="w-full py-3 bg-transparent text-foreground placeholder-muted-foreground focus:outline-none text-base"
                    />
                  </div>
                  <button className="flex items-center gap-2 px-5 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all duration-200 hover:scale-[1.03] whitespace-nowrap shadow-md">
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
                    onClick={() => setQuery(t)}
                    className="px-3 py-1 text-xs font-semibold bg-white/15 hover:bg-white/25 border border-white/25 rounded-full text-white transition-all duration-150"
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="#categories"
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

            {/* ── RIGHT: Live Business Panel ── */}
            <div className="hidden lg:block relative pb-12">
              {/* Floating badge top */}
              <div className="absolute -top-5 -right-2 z-10 flex items-center gap-2 bg-yellow-400 text-yellow-900 font-bold text-sm px-4 py-2 rounded-2xl shadow-lg">
                <TrendingUp className="w-4 h-4" /> +240 added today
              </div>

              {/* Glass panel */}
              <div className="bg-white/12 backdrop-blur-xl border border-white/20 rounded-3xl p-5 shadow-2xl">
                {/* Panel header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-white text-sm font-semibold">
                      Businesses Near You
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-blue-200 text-xs font-medium">
                    <MapPin className="w-3 h-3" /> Ahmedabad
                  </span>
                </div>

                {/* Cards */}
                <div className="flex flex-col gap-3">
                  {panelBusinesses.map((biz) => (
                    <div
                      key={biz.name}
                      className="bg-card rounded-2xl p-4 flex items-center gap-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-250 cursor-pointer group"
                    >
                      <div
                        className={`w-12 h-12 rounded-xl ${biz.imgBg} flex items-center justify-center text-2xl shrink-0`}
                      >
                        {biz.img}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p
                            className="font-bold text-card-foreground text-sm truncate"
                            style={{
                              fontFamily: "var(--font-sora), sans-serif",
                            }}
                          >
                            {biz.name}
                          </p>
                          <span
                            className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${biz.tagColor}`}
                          >
                            {biz.tag}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">
                          {biz.category}
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-bold text-card-foreground">
                              {biz.rating}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              ({biz.reviews})
                            </span>
                          </div>
                          <span className="text-muted-foreground text-xs">
                            ·
                          </span>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            {biz.distance}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                    </div>
                  ))}
                </div>

                <button className="w-full mt-3 py-2.5 text-sm font-semibold text-white/70 hover:text-white border border-white/20 hover:border-white/40 rounded-xl hover:bg-white/10 transition-all duration-200">
                  View all nearby businesses →
                </button>
              </div>

              {/* Floating badge bottom */}
              <div className="absolute -bottom-3 -left-4 flex items-center gap-2 bg-card rounded-2xl px-4 py-2.5 shadow-xl border border-border">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-card-foreground text-xs font-bold">
                  50,000+ Verified Listings
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
              href="#categories"
              className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {heroCategories.map(({ Icon, label, color, bg, border }) => (
              <a
                key={label}
                href="#"
                className={`flex flex-col items-center gap-2.5 p-4 rounded-2xl border-2 ${border} ${bg} hover:-translate-y-1 hover:shadow-md transition-all duration-200 cursor-pointer group`}
              >
                <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-blue-600 to-sky-500 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-200">
                  <Icon className={`w-5 h-5 ${color}`} strokeWidth={1.75} />
                </div>
                <span className="text-xs font-semibold text-muted-foreground text-center leading-tight">
                  {label}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          4. FEATURED LISTINGS GRID
      ════════════════════════════════════════════ */}
      <section className="bg-secondary/50 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="inline-block px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-full border border-blue-100 dark:border-blue-800 mb-2">
                Featured Today
              </span>
              <h2
                className="text-2xl font-bold text-foreground"
                style={{ fontFamily: "var(--font-sora), sans-serif" }}
              >
                Top Businesses This Week
              </h2>
            </div>
            <Link
              href="#"
              className="hidden sm:flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredListings.map((biz) => (
              <a
                key={biz.name}
                href="#"
                className="bg-card border border-border rounded-2xl p-5 hover:shadow-xl hover:shadow-blue-100/50 dark:hover:shadow-blue-900/30 hover:-translate-y-1 transition-all duration-300 group block"
              >
                <div className="flex items-start gap-4 mb-3">
                  <div
                    className={`w-14 h-14 rounded-xl ${biz.bg} flex items-center justify-center text-3xl shrink-0`}
                  >
                    {biz.img}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className="font-bold text-card-foreground text-base truncate"
                      style={{ fontFamily: "var(--font-sora), sans-serif" }}
                    >
                      {biz.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-1">
                      {biz.cat}
                    </p>
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-bold text-card-foreground">
                        {biz.rating}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({biz.reviews} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {biz.desc}
                </p>

                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${biz.tagClass}`}
                  >
                    {biz.tag}
                  </span>
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex items-center gap-1 text-xs font-semibold ${biz.open ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${biz.open ? "bg-emerald-400" : "bg-red-400"}`}
                      />
                      {biz.open ? "Open Now" : "Closed"}
                    </span>
                    <span className="text-xs font-bold text-primary group-hover:underline">
                      View →
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Mobile view all */}
          <div className="sm:hidden mt-6 text-center">
            <Link
              href="#"
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
