'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    Search,
    MapPin,
    Building2,
    Filter,
    X,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Phone,
    Mail,
    Clock,
    Sparkles,
    SlidersHorizontal,
    Tag,
    Star,
} from 'lucide-react'

interface Business {
    _id: string
    businessName: string
    category: string
    description: string
    phone: string
    email: string
    website?: string
    address: string
    city: string
    state: string
    pincode: string
    area: string
    openingHours: string
    images: string[]
    averageRating: number
    totalReviews: number
    createdAt: string
    updatedAt: string
}

interface Pagination {
    page: number
    limit: number
    total: number
    totalPages: number
}

interface SearchResult {
    businesses: Business[]
    pagination: Pagination
    filters: {
        categories: string[]
        cities: string[]
    }
    userLocation: { city: string; area: string } | null
}

const quickTags = [
    'Restaurant',
    'Gym & Fitness',
    'Salon & Spa',
    'Healthcare',
    'Education',
    'Retail',
    'Technology',
    'Home Services',
]

function BusinessListingsContent() {
    const searchParams = useSearchParams()
    const router = useRouter()

    const [results, setResults] = useState<SearchResult | null>(null)
    const [loading, setLoading] = useState(true)
    const [showFilters, setShowFilters] = useState(false)

    // Search state
    const [query, setQuery] = useState(searchParams.get('q') || '')
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
    const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || '')
    const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'))

    const fetchResults = useCallback(async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (query) params.set('q', query)
            if (selectedCategory) params.set('category', selectedCategory)
            if (selectedCity) params.set('city', selectedCity)
            params.set('page', currentPage.toString())
            params.set('limit', '12')

            const res = await fetch(`/api/search?${params.toString()}`)
            const data = await res.json()
            setResults(data)
        } catch {
            console.error('Failed to fetch search results')
        } finally {
            setLoading(false)
        }
    }, [query, selectedCategory, selectedCity, currentPage])

    useEffect(() => {
        fetchResults()
    }, [fetchResults])

    // Update URL params when search changes
    useEffect(() => {
        const params = new URLSearchParams()
        if (query) params.set('q', query)
        if (selectedCategory) params.set('category', selectedCategory)
        if (selectedCity) params.set('city', selectedCity)
        if (currentPage > 1) params.set('page', currentPage.toString())

        const newUrl = `/businesses${params.toString() ? `?${params.toString()}` : ''}`
        router.replace(newUrl, { scroll: false })
    }, [query, selectedCategory, selectedCity, currentPage, router])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setCurrentPage(1)
        fetchResults()
    }

    const handleTagClick = (tag: string) => {
        setQuery(tag)
        setSelectedCategory('')
        setCurrentPage(1)
    }

    const handleCategoryFilter = (cat: string) => {
        setSelectedCategory(cat === selectedCategory ? '' : cat)
        setCurrentPage(1)
    }

    const handleCityFilter = (city: string) => {
        setSelectedCity(city === selectedCity ? '' : city)
        setCurrentPage(1)
    }

    const clearAllFilters = () => {
        setQuery('')
        setSelectedCategory('')
        setSelectedCity('')
        setCurrentPage(1)
    }

    const hasActiveFilters = query || selectedCategory || selectedCity

    return (
        <div className="min-h-screen bg-secondary/30">
            {/* ═══════════════════════════════════════
                SEARCH HEADER
            ═══════════════════════════════════════ */}
            <section className="relative overflow-hidden bg-linear-to-br from-blue-700 via-blue-600 to-sky-500 dark:from-blue-950 dark:via-blue-900 dark:to-sky-900">
                {/* Dot grid */}
                <div
                    className="absolute inset-0 opacity-[0.12] pointer-events-none"
                    style={{
                        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)',
                        backgroundSize: '28px 28px',
                    }}
                />
                <div className="absolute -top-48 -left-48 w-[420px] h-[420px] bg-white/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                    <div className="text-center text-white mb-8">
                        <h1
                            className="font-extrabold text-3xl md:text-4xl lg:text-5xl tracking-tight mb-3"
                            style={{ fontFamily: 'var(--font-sora), sans-serif' }}
                        >
                            Explore Local Businesses
                        </h1>
                        <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                            Search by name, category, or location — find the best businesses near you.
                        </p>
                        {results?.userLocation && (
                            <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full text-sm font-medium">
                                <Sparkles className="w-4 h-4 text-yellow-300" />
                                <span>Showing results near <strong>{results.userLocation.area}, {results.userLocation.city}</strong></span>
                            </div>
                        )}
                    </div>

                    {/* Search bar */}
                    <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
                        <div className="bg-card rounded-2xl p-1.5 shadow-2xl shadow-blue-900/40">
                            <div className="flex items-center gap-2">
                                <div className="flex-1 flex items-center gap-3 px-4">
                                    <Search className="text-muted-foreground w-5 h-5 shrink-0" />
                                    <input
                                        type="text"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder="Search by business name, category, area..."
                                        className="w-full py-3 bg-transparent text-foreground placeholder-muted-foreground focus:outline-none text-base"
                                        id="search-input"
                                    />
                                    {query && (
                                        <button
                                            type="button"
                                            onClick={() => { setQuery(''); setCurrentPage(1) }}
                                            className="text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all duration-200 hover:scale-[1.03] whitespace-nowrap shadow-md"
                                    id="search-submit"
                                >
                                    Search
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* Quick tags */}
                    <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
                        <span className="text-blue-200 text-xs font-medium">Quick search:</span>
                        {quickTags.map((tag) => (
                            <button
                                key={tag}
                                onClick={() => handleTagClick(tag)}
                                className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-150 ${query === tag
                                    ? 'bg-white text-blue-700'
                                    : 'bg-white/15 hover:bg-white/25 border border-white/25 text-white'
                                    }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Wave */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 50" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full">
                        <path d="M0 50V25C360 0 720 30 1080 15C1260 7 1380 5 1440 0V50H0Z" className="fill-secondary/30" />
                    </svg>
                </div>
            </section>

            {/* ═══════════════════════════════════════
                RESULTS SECTION
            ═══════════════════════════════════════ */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Top bar: result count + filter toggle */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <p className="text-sm text-muted-foreground">
                            {loading ? (
                                'Searching...'
                            ) : (
                                <>
                                    <span className="font-bold text-foreground">{results?.pagination.total || 0}</span> business{(results?.pagination.total || 0) !== 1 && 'es'} found
                                </>
                            )}
                        </p>
                        {hasActiveFilters && (
                            <button
                                onClick={clearAllFilters}
                                className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-600 transition-colors"
                            >
                                <X className="w-3 h-3" /> Clear all
                            </button>
                        )}
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border-2 transition-all duration-200 ${showFilters
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border text-muted-foreground hover:border-primary hover:text-primary'
                            }`}
                        id="filter-toggle"
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        Filters
                        {(selectedCategory || selectedCity) && (
                            <span className="w-5 h-5 flex items-center justify-center text-xs bg-primary text-primary-foreground rounded-full">
                                {(selectedCategory ? 1 : 0) + (selectedCity ? 1 : 0)}
                            </span>
                        )}
                    </button>
                </div>

                {/* Active filter chips */}
                {hasActiveFilters && (
                    <div className="flex flex-wrap items-center gap-2 mb-6">
                        {query && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-full border border-blue-200 dark:border-blue-800">
                                <Search className="w-3 h-3" />
                                &ldquo;{query}&rdquo;
                                <button onClick={() => { setQuery(''); setCurrentPage(1) }} className="hover:text-blue-900 dark:hover:text-blue-100">
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        {selectedCategory && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-semibold rounded-full border border-purple-200 dark:border-purple-800">
                                <Tag className="w-3 h-3" />
                                {selectedCategory}
                                <button onClick={() => { setSelectedCategory(''); setCurrentPage(1) }} className="hover:text-purple-900 dark:hover:text-purple-100">
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        {selectedCity && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold rounded-full border border-emerald-200 dark:border-emerald-800">
                                <MapPin className="w-3 h-3" />
                                {selectedCity}
                                <button onClick={() => { setSelectedCity(''); setCurrentPage(1) }} className="hover:text-emerald-900 dark:hover:text-emerald-100">
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                    </div>
                )}

                <div className="flex gap-6">
                    {/* ── FILTER SIDEBAR ── */}
                    <aside
                        className={`transition-all duration-300 overflow-hidden ${showFilters ? 'w-72 min-w-[280px] opacity-100' : 'w-0 min-w-0 opacity-0'
                            }`}
                    >
                        <div className="bg-card border border-border rounded-2xl shadow-sm p-5 sticky top-24">
                            <div className="flex items-center justify-between mb-5">
                                <h3
                                    className="font-bold text-foreground flex items-center gap-2"
                                    style={{ fontFamily: 'var(--font-sora), sans-serif' }}
                                >
                                    <Filter className="w-4 h-4 text-primary" />
                                    Filters
                                </h3>
                                <button
                                    onClick={() => setShowFilters(false)}
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Category filter */}
                            <div className="mb-6">
                                <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                                    <Tag className="w-3.5 h-3.5 text-purple-500" />
                                    Business Type
                                </h4>
                                <div className="flex flex-col gap-1.5 max-h-56 overflow-y-auto pr-1">
                                    {results?.filters.categories.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => handleCategoryFilter(cat)}
                                            className={`text-left px-3 py-2 text-sm rounded-lg transition-all duration-150 ${selectedCategory === cat
                                                ? 'bg-primary/10 text-primary font-semibold border border-primary/30'
                                                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                    {(!results?.filters.categories || results.filters.categories.length === 0) && (
                                        <p className="text-xs text-muted-foreground/60 italic px-3">No categories found</p>
                                    )}
                                </div>
                            </div>

                            {/* City filter */}
                            <div>
                                <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                                    <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                                    City / Location
                                </h4>
                                <div className="flex flex-col gap-1.5 max-h-56 overflow-y-auto pr-1">
                                    {results?.filters.cities.map((city) => (
                                        <button
                                            key={city}
                                            onClick={() => handleCityFilter(city)}
                                            className={`text-left px-3 py-2 text-sm rounded-lg transition-all duration-150 ${selectedCity === city
                                                ? 'bg-primary/10 text-primary font-semibold border border-primary/30'
                                                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                                }`}
                                        >
                                            {city}
                                        </button>
                                    ))}
                                    {(!results?.filters.cities || results.filters.cities.length === 0) && (
                                        <p className="text-xs text-muted-foreground/60 italic px-3">No cities found</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* ── RESULTS GRID ── */}
                    <div className="flex-1 min-w-0">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                                <p className="text-muted-foreground font-medium">Searching businesses...</p>
                            </div>
                        ) : results && results.businesses.length > 0 ? (
                            <>
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {results.businesses.map((biz) => (
                                        <Link
                                            key={biz._id}
                                            href={`/business/${biz._id}`}
                                            className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-blue-100/50 dark:hover:shadow-blue-900/30 hover:-translate-y-1 transition-all duration-300 group block"
                                            id={`business-card-${biz._id}`}
                                        >
                                            {/* Image */}
                                            <div className="w-full h-44 bg-secondary/50 relative overflow-hidden">
                                                {biz.images && biz.images.length > 0 ? (
                                                    <img
                                                        src={biz.images[0]}
                                                        alt={biz.businessName}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-blue-50 to-sky-50 dark:from-blue-900/20 dark:to-sky-900/20">
                                                        <Building2 className="w-12 h-12 text-blue-300 dark:text-blue-700" />
                                                    </div>
                                                )}
                                                <span className="absolute top-3 left-3 px-3 py-1 bg-primary/90 text-primary-foreground text-xs font-bold rounded-full backdrop-blur-sm">
                                                    {biz.category}
                                                </span>
                                                {results.userLocation &&
                                                    biz.city.toLowerCase() === results.userLocation.city.toLowerCase() &&
                                                    biz.area.toLowerCase() === results.userLocation.area.toLowerCase() && (
                                                        <span className="absolute top-3 right-3 px-2.5 py-1 bg-emerald-500/90 text-white text-[10px] font-bold rounded-full flex items-center gap-1 backdrop-blur-sm">
                                                            <MapPin className="w-3 h-3" /> Near You
                                                        </span>
                                                    )}
                                            </div>

                                            {/* Content */}
                                            <div className="p-5">
                                                <h3
                                                    className="font-bold text-lg text-foreground mb-1.5 line-clamp-1 group-hover:text-primary transition-colors"
                                                    style={{ fontFamily: 'var(--font-sora), sans-serif' }}
                                                >
                                                    {biz.businessName}
                                                </h3>

                                                {/* ★ Rating row */}
                                                <div className="flex items-center gap-1.5 mb-2">
                                                    <div className="flex items-center gap-0.5">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <Star
                                                                key={star}
                                                                className={`w-3.5 h-3.5 ${star <= Math.round(biz.averageRating || 0)
                                                                        ? 'fill-amber-400 text-amber-400'
                                                                        : 'fill-none text-gray-300 dark:text-gray-600'
                                                                    }`}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="text-xs font-bold text-foreground">
                                                        {(biz.averageRating || 0) > 0 ? (biz.averageRating).toFixed(1) : '—'}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        ({biz.totalReviews || 0} {(biz.totalReviews || 0) === 1 ? 'review' : 'reviews'})
                                                    </span>
                                                </div>

                                                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{biz.description}</p>

                                                {/* Meta info */}
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                                        <span className="truncate">{biz.area}, {biz.city}, {biz.state}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <Phone className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                                        <span>{biz.phone}</span>
                                                    </div>
                                                    {biz.openingHours && (
                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                            <Clock className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                                                            <span>{biz.openingHours}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Bottom bar */}
                                                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                        <Mail className="w-3 h-3" />
                                                        <span className="truncate max-w-[140px]">{biz.email}</span>
                                                    </div>
                                                    <span className="text-xs font-bold text-primary group-hover:underline">
                                                        View Details →
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {results.pagination.totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-2 mt-10">
                                        <button
                                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className="flex items-center gap-1 px-4 py-2.5 text-sm font-semibold rounded-xl border-2 border-border text-muted-foreground hover:border-primary hover:text-primary transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                                        >
                                            <ChevronLeft className="w-4 h-4" /> Prev
                                        </button>

                                        {/* Page numbers */}
                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: Math.min(5, results.pagination.totalPages) }, (_, i) => {
                                                let pageNum: number
                                                const total = results.pagination.totalPages
                                                if (total <= 5) {
                                                    pageNum = i + 1
                                                } else if (currentPage <= 3) {
                                                    pageNum = i + 1
                                                } else if (currentPage >= total - 2) {
                                                    pageNum = total - 4 + i
                                                } else {
                                                    pageNum = currentPage - 2 + i
                                                }
                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => setCurrentPage(pageNum)}
                                                        className={`w-10 h-10 text-sm font-semibold rounded-xl transition-all duration-200 ${currentPage === pageNum
                                                            ? 'bg-primary text-primary-foreground shadow-md'
                                                            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                                            }`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                )
                                            })}
                                        </div>

                                        <button
                                            onClick={() => setCurrentPage((p) => Math.min(results.pagination.totalPages, p + 1))}
                                            disabled={currentPage === results.pagination.totalPages}
                                            className="flex items-center gap-1 px-4 py-2.5 text-sm font-semibold rounded-xl border-2 border-border text-muted-foreground hover:border-primary hover:text-primary transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                                        >
                                            Next <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            /* Empty state */
                            <div className="text-center py-20">
                                <div className="w-20 h-20 mx-auto bg-blue-50 dark:bg-blue-900/30 rounded-3xl flex items-center justify-center mb-6">
                                    <Search className="w-10 h-10 text-blue-400" />
                                </div>
                                <h2
                                    className="text-2xl font-bold text-foreground mb-3"
                                    style={{ fontFamily: 'var(--font-sora), sans-serif' }}
                                >
                                    No businesses found
                                </h2>
                                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                                    {hasActiveFilters
                                        ? 'Try adjusting your search or filters to find what you\'re looking for.'
                                        : 'No businesses have been registered yet. Be the first to add yours!'
                                    }
                                </p>
                                {hasActiveFilters ? (
                                    <button
                                        onClick={clearAllFilters}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-md transition-all duration-200 hover:scale-[1.03]"
                                    >
                                        <X className="w-4 h-4" /> Clear Filters
                                    </button>
                                ) : (
                                    <Link
                                        href="/dashboard/register-business"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-md transition-all duration-200 hover:scale-[1.03]"
                                    >
                                        <Building2 className="w-4 h-4" /> Register a Business
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default function BusinessListingsPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center bg-background">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            }
        >
            <BusinessListingsContent />
        </Suspense>
    )
}
